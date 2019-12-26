<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="formAlignRight" label-width="200px" :rules="rules" ref="formAlignRight">
        <el-collapse v-model="activeNames">
          <!--折叠栏1-->
          <el-collapse-item title="借款方信息" name="1">
            <el-form-item label="借方类型：">
              <el-select v-model="formAlignRight.unitType" placeholder="请选择">
                <el-option v-for="item in unitTypeOptions" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="借方名称：" prop="borrowerName">
              <el-input v-model.trim="formAlignRight.borrowerName" disabled></el-input>
              <el-button @click="alertChoice" class="alertBorr" type="text">选择</el-button>

              <div v-if="alertChoiceHide" v-for=" x in alertChioceDialog"  class="alertBorrBox">
                <p @click="chioce(x.borrowerName,x.id)" class="TagPBorder">{{x.borrowerName}}</p>
              </div>
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏1end-->

          <!--折叠栏2-->
          <el-collapse-item title="项目信息" name="2">
            <el-form-item label="项目类型：">
              <el-select v-model="formAlignRight.type" disabled>
                <el-option v-for="x in productTypeLst" :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目名称：" prop="name">
              <el-input v-model.trim="formAlignRight.name" ></el-input>
            </el-form-item>
            <el-form-item label="借款金额(元)：" prop="amount">
              <el-input v-model="formAlignRight.amount"></el-input>
            </el-form-item>
            <el-form-item label="还款方式：" prop="repayType" >
              <el-select v-model="formAlignRight.repayType" @change="nonShow">
                <el-option v-for="item in repayTypeLstOption" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结息日：" v-if="nonSow">
              <el-input v-model.trim="formAlignRight.repayInterestDay"></el-input>
            </el-form-item>
            <el-form-item label="借款利率(%)：" prop="annualRate">
              <el-input v-model.trim="formAlignRight.annualRate"></el-input>
            </el-form-item>
            <!--<el-form-item label="浮动利率(%)：" prop="floatAnnualRate">-->
              <!--<el-input v-model.trim="formAlignRight.floatAnnualRate"></el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="借款期限(天)：" prop="timeLimit" id="spiclSelect">
                <el-input v-model="formAlignRight.timeLimit" placeholder="请选择" @blur="datealert"></el-input>
            </el-form-item>
            <el-form-item label="起息日：" prop="repayStartDate" @change="datealert">
              <el-date-picker
                v-model="formAlignRight.repayStartDate"
                type="date"
                :picker-options="repayStartDatePickerOptions"
                @change="datealert"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="到期日：">
              <el-input v-model="formAlignRight.repayEndDate" disabled></el-input>
            </el-form-item>
            <el-form-item label="项目风险等级：" prop="riskRating">
              <el-select v-model="formAlignRight.riskRating">
                <el-option v-for="item in riskGradeLst" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否支付募集期利息：">
              <el-radio class="radio" v-model="formAlignRight.isTenderingPay" label="true">是</el-radio>
              <el-radio class="radio" v-model="formAlignRight.isTenderingPay" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="是否允许转让：">
              <el-radio class="radio" v-model="formAlignRight.isAssignment" label="true">是</el-radio>
              <el-radio class="radio" v-model="formAlignRight.isAssignment" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="转让规则：" v-if="formAlignRight.isAssignment=='true'">
              <el-row>
                持有
                <input type="text">
                天，
                <input type="text">
                天不允许转让
              </el-row>
            </el-form-item>
            <el-form-item label="是否允许使用红包：">
              <el-radio class="radio" v-model="formAlignRight.isUseRedpacket" label="true">是</el-radio>
              <el-radio class="radio" v-model="formAlignRight.isUseRedpacket" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="是否允许使用加息券：">
              <el-radio class="radio" v-model="formAlignRight.isUseCoupon" label="true">是</el-radio>
              <el-radio class="radio" v-model="formAlignRight.isUseCoupon" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="是否允许提前还款：">
              <el-radio class="radio" v-model="formAlignRight.isAdvanceRepayment" label="true">是</el-radio>
              <el-radio class="radio" v-model="formAlignRight.isAdvanceRepayment" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="最大提前天数：" v-if="formAlignRight.isAdvanceRepayment=='true'" prop="advanceDay" required>
              <el-input v-model="formAlignRight.advanceDay"></el-input>
            </el-form-item>
            <el-form-item label="是否允许逾期还款：" >
              <el-radio class="radio" v-model="formAlignRight.isOverdueRepayment" label="true">是</el-radio>
              <el-radio class="radio" v-model="formAlignRight.isOverdueRepayment" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="最大逾期天数：" v-if="formAlignRight.isOverdueRepayment=='true'" prop="overdueDay" required>
              <el-input v-model="formAlignRight.overdueDay"></el-input>
            </el-form-item>
            <el-form-item label="是否收取融资人费用：">
              <el-radio class="radio" v-model="formAlignRight.isGatherFee" label="true">是</el-radio>
              <el-radio class="radio" v-model="formAlignRight.isGatherFee" label="false">否</el-radio>
            </el-form-item>
            <el-form-item label="收费时点：" v-if="formAlignRight.isGatherFee=='true'">
              <el-radio class="radio" v-model="formAlignRight.gatherFeePoint" label="0">放款</el-radio>
              <el-radio class="radio" v-model="formAlignRight.gatherFeePoint" label="1">还款</el-radio>
            </el-form-item>
            <el-form-item label="收费方式：" v-if="formAlignRight.isGatherFee=='true'">
              <el-radio class="radio" v-model="formAlignRight.gatherFeeType" label="0">单笔金额</el-radio>
              <el-radio class="radio" v-model="formAlignRight.gatherFeeType" label="1">单笔比例</el-radio>
            </el-form-item>
            <el-form-item label="收费内容：" v-if="formAlignRight.isGatherFee=='true'" prop="collectFeesContent" required>
              <el-input v-model="formAlignRight.gatherFeeContent"></el-input>
              <label>
                <span v-show="formAlignRight.gatherFeeType=='0'">元</span>
                <span v-show="formAlignRight.gatherFeeType=='1'">%</span>
              </label>
            </el-form-item>
            <!--<el-form-item label="项目活动：" >-->
              <!--<el-checkbox-group v-model="checkList">-->
                <!--<el-checkbox label="募集期利息"></el-checkbox>-->
                <!--<el-checkbox label="满标有礼"></el-checkbox>-->
                <!--<el-checkbox label=""></el-checkbox>-->
              <!--</el-checkbox-group>-->
            <!--</el-form-item>-->
          </el-collapse-item>
          <!--折叠栏2end-->

          <!--折叠栏3-->
          <el-collapse-item title="合同信息" name="3">
            <el-form-item label="交易合同编号：" prop="tradeContractNO">
              <el-input v-model="formAlignRight.tradeContractNO"></el-input>
            </el-form-item>
            <el-form-item label="交易合同名称：" prop="contractName">
              <el-input v-model="formAlignRight.contractName"></el-input>
            </el-form-item>
            <el-form-item label="交易合同应收账款金额(元)：" prop="contractCollectFeesFinancing">
              <el-input v-model="formAlignRight.contractCollectFeesFinancing"></el-input>
            </el-form-item>
            <el-form-item label="保理合同号：" prop="baoliContractNO">
              <el-input v-model="formAlignRight.baoliContractNO"></el-input>
            </el-form-item>
            <el-form-item label="保理合同名称：" prop="baoliContractName">
              <el-input v-model="formAlignRight.baoliContractName"></el-input>
            </el-form-item>
            <el-form-item label="合同编号：" prop="contractNO">
              <el-input v-model="formAlignRight.contractNO"></el-input>
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏3end-->

          <!--折叠栏4-->
          <el-collapse-item title="项目描述" name="4">
            <el-form-item label="项目简介：" prop="productProfile">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.productProfile">
              </el-input>
            </el-form-item>
            <el-form-item label="项目介绍：" prop="productIntroduction">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.productIntroduction">
              </el-input>
            </el-form-item>
            <el-form-item label="业务介绍：" prop="businessIntroduction">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.businessIntroduction">
              </el-input>
            </el-form-item>
            <el-form-item label="还款来源：" prop="repaySource">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.repaySource">
              </el-input>
            </el-form-item>
            <el-form-item label="风控措施：" prop="riskMethod">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.riskMethod">
              </el-input>
            </el-form-item>
            <el-form-item label="增信措施：">
              <el-radio class="radio" v-model="formAlignRight.trustMethod" label="无">无</el-radio>
              <el-radio class="radio" v-model="formAlignRight.trustMethod" label="有">有</el-radio>
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏4end-->

          <!--折叠栏5-->
          <el-collapse-item title="销售信息" name="5">
            <el-form-item label="募集开始时间：" prop="tenderStartTime">
              <el-date-picker
                v-model="formAlignRight.tenderStartTime"
                type="datetime"
                :picker-options="tenderEndTimePickerOptions1"
                placeholder="选择日期">
                <!--@change="tenderStartTimeFormat"-->
              </el-date-picker>
            </el-form-item>
            <el-form-item label="募集结束时间：" prop="tenderEndTime">
              <el-date-picker
                v-model="formAlignRight.tenderEndTime"
                type="datetime"
                :picker-options="tenderEndTimePickerOptions2"
                placeholder="选择日期">
                <!--@change="tenderEndTimeFormat"-->
              </el-date-picker>
            </el-form-item>
            <el-form-item label="起投金额：" prop="tenderInitAmount">
              <el-input v-model.number="formAlignRight.tenderInitAmount"></el-input>
            </el-form-item>
            <el-form-item label="递增金额：" prop="tenderIncreaseAmount">
              <el-input v-model.number="formAlignRight.tenderIncreaseAmount"></el-input>
            </el-form-item>
            <el-form-item label="累计最大可投金额：" prop="tenderMaxAmount">
              <el-input v-model.number="formAlignRight.tenderMaxAmount"></el-input>
              <span>0代表无投资上限</span>
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏5end-->

          <!--折叠栏6-->
          <el-collapse-item title="附件资料" name="6">
            <el-row class="flexWrap">
              <div  v-for="(x,index) in imgList" >
                <el-col v-if="x.property == 'qualificationCertificate' && index<2">
                  <p class="pLeft20">资质证明</p>
                  <picUpload
                    :index="index"
                    :delshow=false
                    @childToFatherTransferEvent="fatherGetFileFromChild"
                    :filename=x.value></picUpload>
                </el-col>
                <el-col v-if="x.property == 'contractCertificate' && index<2">
                  <p class="pLeft20">合同证明</p>
                  <picUpload
                    :index="index"
                    :delshow=false
                    @childToFatherTransferEvent="fatherGetFileFromChild"
                    :filename=x.value></picUpload>
                </el-col>
                <!--<el-col v-if="x.property == 'qualificationCertificate' && index>=2">这段是原来做判断使用的-->
                <el-col v-if="x.property == 'qualificationCertificate' && index>=2">
                  <p class="pLeft20">资质证明</p>
                  <!--:delshow=true//这个是之前用来判断是否显示-删除类型-按钮的-->
                  <picUpload
                    :index="index"
                    :delshow=true
                    @childToFatherTransferEvent="fatherGetFileFromChild"
                    @delSelf="deleteSelf"
                    :filename=x.value></picUpload>
                </el-col>
                <el-col v-if="x.property == 'contractCertificate' && index>=2">
                  <p class="pLeft20">合同证明</p>
                  <picUpload
                    :index="index"
                    :delshow=true
                    @childToFatherTransferEvent="fatherGetFileFromChild"
                    @delSelf="deleteSelf"
                    :filename=x.value></picUpload>
                </el-col>
              </div>
              <div class="plusDiv">
                <div class="div100px">
                  <el-button  icon="plus" class=""  @click="addpic(qualificationCertificateStr)" type="primary">增加{{formatTitle(qualificationCertificateStr)}}</el-button>
                  <el-button  icon="plus" class=""  @click="addpic(contractCertificateStr)" type="primary">增加{{formatTitle(contractCertificateStr)}}</el-button>
                </div>
              </div>
            </el-row>
          </el-collapse-item>
          <!--折叠栏6end-->
        </el-collapse>
          <el-form-item style="padding:20px 0px 50px 0px; text-align:center">
            <el-button type="primary" @click="submitForm('formAlignRight')" class='btn'>保存数据</el-button>
            <el-button @click="backPage" class='btn'>返回</el-button>
          </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import picUpload from '../../../comComponents/pic-upload.vue'
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      var positiveInteger3bit = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else if (value.length > 3) {
          callback(new Error('3位以内'))
        } else if (!TOOL.positiveInteger(value)) {
          callback(new Error('请输入数字值，第一位不能为零'))
        } else if (value < 0) {
          callback(new Error('仅支持输入正整数'))
        } else {
          callback()
        }
      }
      var positiveInteger5bit = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else if (value.length > 5) {
          callback(new Error('5位以内'))
        } else if (!TOOL.positiveInteger(value)) {
          callback(new Error('请输入数字值，第一位不能为零'))
        } else if (value < 0) {
          callback(new Error('仅支持输入正整数'))
        } else {
          callback()
        }
      }
      var positiveInteger10bit = (rule, value, callback) => {
        if (value.length > 1 || value.length <= 0) {
          callback('请输入1-10位数字')
        } else if (!TOOL.positiveInteger(value)) {
          callback(new Error('请输入数字值，第一位不能为零'))
        } else if (value < 0) {
          callback(new Error('仅支持输入正整数'))
        } else {
          callback()
        }
      }
      var tenderMaxAmountValidator = (rule, value, callback) => {
        if (value.length > 10 || value.length <= 0) {
          callback('请输入1-10位数字')
        } else if (!/^[0-9]+$/.test(value)) {
          callback(new Error('请输入数字值'))
        } else if (value < 0) {
          callback(new Error('仅支持输入正整数'))
        } else {
          callback()
        }
      }
      var positiveIntegerElse10bit = (rule, value, callback) => {
        if (!value) {
          callback('不能为空')
        } else if (value.length > 10) {
          callback('长度在10个数字内，且不能为空')
        } else if (!TOOL.positiveInteger(value) || value <= 0) {
          callback(new Error('仅支持输入正整数，第一位不能为零'))
        } else {
          callback()
        }
      }
      var positiveIntegerElse4bit = (rule, value, callback) => {
        if (!value) {
          callback('不能为空')
        } else if (value.length > 4) {
          callback('长度在10个数字内，且不能为空')
        } else if (!TOOL.positiveInteger(value) || value <= 0) {
          callback(new Error('仅支持输入正整数，第一位不能为零'))
        } else {
          callback()
        }
      }
      var decimal5bit = (rule, value, callback) => {
        setTimeout(() => {
          if (!value) {
            callback(new Error('不能为空'))// | () /^[1-9]\d*$/
          } else if (!TOOL.decimal(value)) {
            callback(new Error('只能为数字，并且小数点后只能有两位小数，第一位不能为零'))
          } else if (value > 100) {
            callback(new Error('请输入100以内的数值'))
          } else if (value.length > 5) {
            callback(new Error('请输入5位以内'))
          } else {
            callback()
          }
        }, 100)
      }
      var decimal20bit = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('不能为空'))
        } else if (value.length > 20 || value.length <= 0) {
          callback('长度在20个字符内且不能为空')
        } else if (!TOOL.decimal(value)) {
          callback(new Error('小数点后只能有两位小数，并且只能为数字，第一位不能为零'))
        } else {
          callback()
        }
      }
      var EnglshDagital50 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('不能为空'))
        } else if (value.length <= 0 || value.length > 50) {
          callback(new Error('只能输入1-50的字'))
        } else if (!TOOL.EnglshDagital(value)) {
          callback(new Error('只能输入英文与数字'))
        } else {
          callback()
        }
      }
      var dateRule = (rule, value, callback) => {
        setTimeout(() => {
          if (!value) {
            callback(new Error('不能为空'))
          } else {
            callback()
          }
        }, 100)
      }
      return {
        activeNames: ['1', '2', '3', '4', '5', '6'],
        unitTypeOptions: TOOL.fetchObj('commonObj').BorrowerType,
        dateUnit: TOOL.fetchObj('commonObj').TimeLimitUnit,
        repayTypeLstOption: TOOL.fetchObj('commonObj').RepayType,
        riskGradeLst: TOOL.fetchObj('commonObj').RiskRating,
        alertChoiceHide: false, // 选择弹出框的
        alertChioceDialog: [], // 选择弹出框的数据
        productTypeLst: TOOL.fetchObj('commonObj').ProductType, // 项目类型的list
        non: '', // 结息日现在没有对应的字段
        checkList: [],
        formAlignRight: {
          isAssignment: 'false',
          repayType: '', // 还款方式
          type: TOOL.getProType(this.$route.params.type) || 'default',
          unitType: 'company',
          borrowerId: '', // 借款人id
          borrowerName: '', // 借款人名称
          name: '',
          amount: '',
          annualRate: '',
          isUseRedpacket: 'true', // 是否让用红包
          isUseCoupon: 'true', // 是否让用加息劵
          floatAnnualRate: '', // 浮动收益
          timeLimit: '',
          repayStartDate: '', // 还款计息开始日期（日期格式）
          riskRating: '', // 风险等级
          isAdvanceRepayment: 'false', // radio1
          advanceDay: '',
          isOverdueRepayment: 'false', // radio2
          overdueDay: '',
          isGatherFee: 'false', // radio3
          gatherFeePoint: '0', // radio4
          gatherFeeType: '0', // radio5
          gatherFeeContent: '',
          repayInterestDay: '1', //
          repayEndDate: '', // 到期日
          tenderStartTime: '', // 募集开始时间（2017-05-23T07:54:17.884Z）
          tenderEndTime: '', // 募集结束时间（2017-05-23T07:54:17.884Z）
          tenderInitAmount: '', // 起投金额（分）
          tenderIncreaseAmount: '', // 递增金额（分）
          tenderMaxAmount: 0, // 累计最大可投金额
          borrower: {}, // 现在是空值
          createTime: null, // 现在是空值
          id: null, // 现在是空值,
          timeLimitUnit: 'day', // 募集时长单位
          qualificationCertificate: [], // 资质证明
          contractCertificate: [], // 合同证明
          tradeContractNO: '', // 交易合同编号
          contractName: '', // 交易合同名称
          contractCollectFeesFinancing: '', // 交易账款应收金额
          baoliContractNO: '', // 保理合同编号
          baoliContractName: '', // 保理合同名称
          contractNO: '', // 合同编号
          productProfile: '', // 项目简介
          productIntroduction: '', // 项目介绍
          businessIntroduction: '', // 业务介绍
          repaySource: '', // 还款来源
          riskMethod: '', // 风控措施
          trustMethod: '无', // radio6//增信措施
          isFinancierFee: 'false', // 是否收取融资人手续费
          isTenderingPay: 'true', // 是否支付募集期利息
          productExtends: []// 扩展项
        },
        productExtends: [
          'tradeContractNO', // 交易合同编号
          'contractName', // 交易合同名称
          'contractCollectFeesFinancing', // 交易账款应收金额
          'baoliContractNO', // 保理合同编号
          'baoliContractName', // 保理合同名称
          'contractNO', // 合同编号
          'productProfile', // 项目简介
          'productIntroduction', // 项目介绍
          'businessIntroduction', // 业务介绍
          'repaySource', // 还款来源
          'riskMethod', // 风控措施
          'trustMethod'// radio6//增信措施
        ], // 扩展项
        repayStartDatePickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        tenderEndTimePickerOptions1: {
          disabledDate (time) {
          //              console.log(formAlignRight.repayStartDate);
          //            return time.getTime() < Date.now() - 8.64e7;
            return (time.getTime() < Date.now() - 8.64e7)
          },
          onPick ({mindata, maxdata}) {
            console.log(mindata, maxdata)
          }
        },
        tenderEndTimePickerOptions2: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          //            return (time.getTime() < Date.now() |  time.getTime() > Date.now() + (8.64e7)*9 );
          }
        },
        rules: {
          borrowerName: [// 借款人名称
            {required: true, message: '不能为空', trigger: 'blur'}
          ],
          /* -------------------------项目信息--------------------------------------- */
          name: [// 项目名称
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 100, message: '长度大于100个字符', trigger: 'blur'}
          ],
          amount: [// 项目规模
            {required: true, validator: positiveIntegerElse10bit, trigger: 'blur'}
          ],
          repayType: [// 收益分配下拉框提交时才有效
            {required: true, message: '请选择一项', trigger: 'change'}
          ],
          annualRate: [// 项目预期年化收益率
            {required: true, validator: decimal5bit, trigger: 'blur'}
          ],
          floatAnnualRate: [// 浮动收益率
            {required: true, validator: decimal5bit, trigger: 'blur'}
          ],
          timeLimit: [// 项目期限
            {required: true, validator: positiveIntegerElse4bit, trigger: 'blur'}
          ],
          repayStartDate: [// 起息日
            {required: true, type: 'date', validator: dateRule, trigger: 'blur,change'}
          ],
          riskRating: [// 项目风险等级
            {required: true, message: '请选择一项', trigger: 'change'}
          ],
          advanceDay: [ // 最大提前还款天数
            { validator: positiveInteger3bit, trigger: 'blur' }
          ],
          overdueDay: [ // 最大逾期天数
            { validator: positiveInteger3bit, trigger: 'blur' }
          ],
          gatherFeeContent: [// 收费内容
            {validator: positiveInteger5bit, trigger: 'blur'}
          ],
          /* -------------------------合同信息--------------------------------------- */
          tradeContractNO: [// 合同编号
            {required: true, validator: EnglshDagital50, trigger: 'blur'}
          ],
          contractName: [// 交易合同名称
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 100, message: '长度大于100个字符', trigger: 'blur'}
          ],
          contractCollectFeesFinancing: [// 交易合同应回款金额
            {required: true, validator: decimal20bit, trigger: 'blur'}
          ],
          baoliContractNO: [// 保理合同号
            {required: true, validator: EnglshDagital50, trigger: 'blur'}
          ],
          baoliContractName: [// 保理合同名称
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 100, message: '长度大于100个字符', trigger: 'blur'}
          ],
          contractNO: [// 合同编号
            {required: true, validator: EnglshDagital50, trigger: 'blur'}
          ],
          /* -------------------------项目描述--------------------------------------- */
          productProfile: [// 项目简介
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 1000, message: '长度大于1000个字符', trigger: 'blur'}
          ],
          productIntroduction: [// 产品介绍
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 1000, message: '长度大于1000个字符', trigger: 'blur'}
          ],
          businessIntroduction: [// 业务介绍
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 1000, message: '长度大于1000个字符', trigger: 'blur'}
          ],
          repaySource: [// 还款来源
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 1000, message: '长度大于1000个字符', trigger: 'blur'}
          ],
          riskMethod: [// 风控措施
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 1000, message: '长度大于1000个字符', trigger: 'blur'}
          ],
          /* -------------------------销售信息--------------------------------------- */
          tenderStartTime: [// 募集开始时间
            {required: true, type: 'date', validator: dateRule, trigger: 'blur,change'}
          ],
          tenderEndTime: [// 募集结束时间
            {required: true, type: 'date', validator: dateRule, trigger: 'blur,change'}
          ],
          tenderInitAmount: [// 起投金额
            { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
            { validator: positiveInteger10bit, trigger: 'blur' }
          ],
          tenderIncreaseAmount: [// 递增金额
            { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
            { validator: positiveInteger10bit, trigger: 'blur' }
          ],
          tenderMaxAmount: [// 累计最大可投金额
            { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
            { validator: tenderMaxAmountValidator, trigger: 'blur' }
          ]
        },
        resData: null,
        nonSow: false,
        qualificationCertificateStr: 'qualificationCertificate',
        contractCertificateStr: 'contractCertificate',
        qualificationCertificateUrl: '',
        contractCertificateUrl: '',
        day: 0,
        breadcrumName: '新增',
        imgList: [// 图片储存数组
          {
            property: 'qualificationCertificate',
            value: ''
          },
          {
            property: 'contractCertificate',
            value: ''
          }
        ],
        domain: TOOL.getDomain(),
        proId: TOOL.getProID(this.$route.params.id)
      }
    },
    watch: {
      repayStartDate (val) {
        console.log(val)
        this.day = val
      }
    },
    components: {
      breadcrumbNav,
      picUpload
    },
    mounted () {
      if (this.proId) {
        this.breadcrumName = '修改'
        API.postRequest('/gateway/product/get', {id: this.proId}, res => {
          console.log(res.data)
          let resData = res.data
          this.arrValue(resData.productExtends, this.imgList)
          TOOL.replaceArrayVal(resData.productExtends, this.formAlignRight)
          //          TOOL.replaceArrayVal(resData.productExtends,this.imgList);
          TOOL.replaceVal(resData, this.formAlignRight)
          this.moneyFormat001()
        })
      }
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      moneyFormat100 () {
        this.formAlignRight.amount = TOOL.yuanToFen(this.formAlignRight.amount)
        this.formAlignRight.contractCollectFeesFinancing = TOOL.yuanToFen(this.formAlignRight.contractCollectFeesFinancing)
        this.formAlignRight.tenderInitAmount = TOOL.yuanToFen(this.formAlignRight.tenderInitAmount)
        this.formAlignRight.tenderIncreaseAmount = TOOL.yuanToFen(this.formAlignRight.tenderIncreaseAmount)
        this.formAlignRight.tenderMaxAmount = TOOL.yuanToFen(this.formAlignRight.tenderMaxAmount)
      },
      moneyFormat001 () {
        this.formAlignRight.amount = TOOL.fenToYuan(this.formAlignRight.amount)
        this.formAlignRight.contractCollectFeesFinancing = TOOL.fenToYuan(this.formAlignRight.contractCollectFeesFinancing)
        this.formAlignRight.tenderInitAmount = TOOL.fenToYuan(this.formAlignRight.tenderInitAmount)
        this.formAlignRight.tenderIncreaseAmount = TOOL.fenToYuan(this.formAlignRight.tenderIncreaseAmount)
        this.formAlignRight.tenderMaxAmount = TOOL.fenToYuan(this.formAlignRight.tenderMaxAmount)
      },
      // 图片标题简单转义
      formatTitle (val) {
        if (val === 'qualificationCertificate') {
          return '资质证明'
        } else if (val === 'contractCertificate') {
          return '合同证明'
        }
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 先给图片赋值
      arrValue (val, localImg) {
        localImg.length = 0
        for (let i = 0; i < val.length; i++) {
          if (val[i]['property'] === 'qualificationCertificate' || val[i]['property'] === 'contractCertificate') {
            localImg.push(val[i])
          }
        }
      },
      // 图片增加
      addpic (name) {
        TOOL.addPicture(name, this.imgList)
      },

      // 图片类删除
      deleteSelf (index) {
        this.imgList.splice(index, 1)
        console.log(this.imgList)
      },

      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) { // msg返回为数组
        console.log(msg)
        for (let i = 0, len = this.imgList.length; i < len; i++) {
          if (msg[0] === i) {
            this.imgList[i].value = msg[1]
          }
        }
      },

      // 计算项目期限，起息日，到期日的日期的
      datealert () {
        this.formAlignRight.repayEndDate = TOOL.timeLimitFormatDay(this.formAlignRight.repayStartDate, this.formAlignRight.timeLimit)
        console.log(this.formAlignRight.repayEndDate + 'time')
      },

      // 收益分配在选中之后显示下面的input
      nonShow () {
        this.nonSow = true
      },

      // 发送提示弹出框--- 2018年6月19日这个是不是可以删掉
      msg (text) {
        TOOL.msgBox(this, text)
        setTimeout(() => {
          this.$router.go(-1)
        }, 500)
      },

      // 处理图片储存格式
      /* imgFormat(val,title){
        let newarr=[];
        for(let i = 0;i<val.length;i++){
            if(val[i].property === title){
              newarr.push(val[i])
            }
        }
        return newarr
      }, */

      // 保存数据
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          this.moneyFormat100()
          this.formAlignRight.productExtends.length = 0
          this.integrationData(this.formAlignRight, this.productExtends, this.formAlignRight.productExtends)
          this.formAlignRight.productExtends = this.formAlignRight.productExtends.concat(this.imgList)
          console.log('即将发送的内容')
          console.log(this.formAlignRight)
          if (valid) {
            if (this.$route.params.id) {
              console.log('已发送修改')
              API.postRequest('/gateway/product/edit', this.formAlignRight, res => {
                console.log(res.resultMsg)
                if (res.success) { // 正确时再跳转上一页
                  console.log(res)
                  this.$router.go(-1)
                } else {
                  this.moneyFormat001()
                  TOOL.msgBox(this, res.resultMsg, false, true, this.submitForm)
                }
              })
            } else {
              console.log('已发送新增')
              console.log(this.formAlignRight)
              API.postRequest('/gateway/product/add', this.formAlignRight, res => {
                console.log(res.resultMsg)
                if (res.success) { // 正确时再跳转上一页
                  console.log(res)
                  this.$router.go(-1)
                } else {
                  this.moneyFormat001()
                  TOOL.msgBox(this, res.resultMsg, false, true, this.submitForm)
                }
              })
            }
          } else {
            TOOL.msgBox(this, '有不符合合法性内容', false, true, this.submitForm)
            this.moneyFormat001()
            return false
          }
        })
      },

      backPage () {
        this.$router.go(-1)
      },

      // 扩展项的赋值
      // fp是formAlignRight下的productExtends
      integrationData (formAlignRight, productExtends, fp) {
      //        for(let x in formAlignRight){
      //          for(let i=0;i<productExtends.length;i++){
      //            if(productExtends[i] === x){
      //              fp[i] = {};
      //              fp[i]['property'] = x;
      //              fp[i]['value'] = formAlignRight[x];
      //            }
      //          }
      //        }
        TOOL.integrationData(formAlignRight, productExtends, fp)
      },

      // 选择按钮
      alertChoice () {
        this.alertChoiceHide = true
        console.log(this.alertChoiceHide)
        API.postRequest('/gateway/borrower/pageQuery', {}, res => {
          console.log('已进入联系人获取')
          this.alertChioceDialog = res.list
        })
      },

      // 选择弹出框
      chioce (name, id) {
        this.alertChoiceHide = false
        this.formAlignRight.borrowerName = name
        this.formAlignRight.borrowerId = id
      }

    }
  }
</script>
<style lang="less" scoped>
  .flexWrap{
    display: flex;
    flex-wrap: wrap;
  }
  .div100px{
    width:100px;
    height:80px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 5px 5px;
  }
  .plusDiv{
    display: flex;
    align-items: center;
  }
  .alertBorrBox{
    width: 70%;
    border: 1px solid lightgray;
    border-bottom: 0;
    &>p{
      border-bottom: 1px solid lightgray;
      text-indent: 2em;
      cursor: pointer;
    }
  }
  .alertBorr:hover{
    background: none;
  }
  .btn{
    margin-right: 15%;
  }
  .pLeft20{
    padding-top: 10px;
    text-align: center;
  }
  #z-edit {
    margin-top: 20px;
  }

  .el-input, .el-textarea {
    width: 80%;
    float: left;
  }

  .z-input-span {
    color: #ff0000;
    padding: 0 20px;
  }

  .alertBorr {
    color: #FF9900;
  }

  .el-collapse-item__wrap {
    background: #fff;
  }

  .el-collapse-item__header__arrow {
    float: right;
  }

  .el-collapse-item__header {
    border: none
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
