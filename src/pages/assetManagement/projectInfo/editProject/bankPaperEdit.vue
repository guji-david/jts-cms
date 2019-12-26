<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="formAlignRight" label-width="220px" :rules="rules" ref="formAlignRight">
        <el-collapse v-model="activeNames">
          <!--折叠栏1-->
          <el-collapse-item title="借款方信息" name="1">
            <el-form-item label="借方类型：">
              <el-select v-model="formAlignRight.unitType" placeholder="请选择">
                <el-option v-for="item in unitTypeOptions" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="借方名称：" prop="borrowerName">
              <!-- <el-input v-model.trim="formAlignRight.borrowerName" disabled></el-input>
               <el-button @click="alertChoice" class="alertBorr" type="text">选择</el-button>

               <div v-if="alertChoiceHide" v-for=" x in alertChoiceDialog"  class="alertBorrBox">
                 <p @click="choice(x.borrowerName,x.id)" class="TagPBorder">{{x.borrowerName}}</p>
               </div>-->
              <el-select v-model="formAlignRight.borrowerName"@change="choice()" placeholder="请选择">
                <el-option
                  v-for="item in alertChoiceDialog"
                  :key="item.id"
                  :label="item.borrowerName"
                  :value="item.borrowerName">
                </el-option>
              </el-select>
              <div style="font-size: 12px;color: #ff4949;line-height: 1;position: absolute;top: 40px;z-index: 10;" v-if="checkAmountVisable">
                {{checkAmountErrorMsg}}
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
            <el-form-item label="项目名称：" prop="name" >
              <el-input v-model.trim="formAlignRight.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="借款金额(元)：" prop="amount">
              <el-input v-model="formAlignRight.amount"
                        @blur="checkAmountIsOverflow(formAlignRight.amount)"
              ></el-input>
              <div style="font-size: 12px;color: #ff4949;line-height: 1;position: absolute;top: 40px;z-index: 10;" v-if="checkMaxTenderAmountVisable">
                {{overflowMaxTenderAmountErrorMsg}}
              </div>
            </el-form-item>
            <el-form-item label="结息日：" v-if="nonSow">
              <el-input v-model.trim="formAlignRight.repayInterestDay"></el-input>
            </el-form-item>
            <el-form-item label="借款利率(%)：" prop="annualRate">
              <el-input v-model.trim="formAlignRight.annualRate"></el-input>
            </el-form-item>
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
            <el-form-item label="还款方式：" prop="repayType" >
              <el-select v-model="formAlignRight.repayType" @change="nonShow">
                <el-option v-for="item in repayTypeLstOption" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目风险等级：" prop="riskRating">
              <el-select v-model="formAlignRight.riskRating">
                <el-option v-for="item in riskGradeLst" :label="item.label.substr(2)" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <!--<el-form-item label="适合出借人类型：" >-->
            <!--{{formAlignRight.suitLenderType}}-->
            <!--</el-form-item>-->
            <el-form-item label="第三方合作机构：" prop="thirdPartyCooperationInstitution">
              <el-input v-model="formAlignRight.thirdPartyCooperationInstitution" ></el-input>
            </el-form-item>
            <el-form-item label="承兑银行：" prop="acceptanceBank">
              <el-input v-model="formAlignRight.acceptanceBank" ></el-input>
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
            <el-form-item label="是否收取出借人手续费：">
              <el-radio class="radio" v-model="formAlignRight.isFinancierFee" label="true">是</el-radio>
              <el-radio class="radio" v-model="formAlignRight.isFinancierFee" label="false">否</el-radio>
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏2end-->

          <!--折叠栏4-->
          <el-collapse-item title="项目描述" name="4">
            <el-form-item label="项目简介：" >
              <!--prop="productProfile"-->
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.productProfile">
              </el-input>
            </el-form-item>
            <el-form-item label="融资用途：" >
              <!--prop="usageOfLoan"-->
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.usageOfLoan">
              </el-input>
            </el-form-item>
            <el-form-item label="还款来源：" >
              <!--prop="repaySource"-->
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.repaySource">
              </el-input>
            </el-form-item>
            <el-form-item label="还款保障措施：" >
              <!--prop="repaymentGuaranteeMeasures"-->
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.repaymentGuaranteeMeasures">
              </el-input>
            </el-form-item>
            <el-form-item label="项目风险提示：">
              <!--prop="projectRiskWarning"-->
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model.trim="formAlignRight.projectRiskWarning">
              </el-input>
            </el-form-item>
            <el-form-item label="风控意见：" >
              <!--prop="riskManagementOpinion"-->
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="请输入内容"
                v-model="formAlignRight.riskManagementOpinion">
              </el-input>
            </el-form-item>
            <el-form-item label="票据展示：">
              <el-row class="flexWrap">
                <div  v-for="(x,index) in imgList" >
                  <el-col v-if="index<1">
                    <picUpload
                      :index="index"
                      :delshow=false
                      @childToFatherTransferEvent="fatherGetFileFromChild"
                      @delSelf="deleteSelf"
                      :filename=x.value></picUpload>
                  </el-col>
                  <el-col v-if=" index>=1">
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
                    <el-button  icon="plus" class=""  @click="addpic(imgList[0].property)" type="primary">增加</el-button>
                  </div>
                </div>
              </el-row>
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
            <el-form-item label="单笔出借限额：" prop="singleMaxAmont">
              <el-input v-model.number="formAlignRight.singleMaxAmont"></el-input>
              <span>0代表无投资上限</span>
            </el-form-item>
            <el-form-item label="单人出借限额：" prop="tenderMaxAmount">
              <el-input v-model.number="formAlignRight.tenderMaxAmount"></el-input>
              <span>0代表无投资上限</span>
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏5end-->

        </el-collapse>
        <el-form-item class="btnDiv">
          <el-row :gutter="20" type="flex" justify="center">
            <el-button type="primary" @click="submitForm('formAlignRight')" class='el-button el-button--primary marR10' :disabled="disabledStatus" v-loading.fullscreen.lock="loadingFull">保存数据</el-button>
            <el-button @click="backPage" class='btn is-plain'>返回</el-button>
          </el-row>
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
      var singleMaxAmontValidator = (rule, value, callback) => {
        if (value.length > 10 || value.length <= 0) { // 单笔出借限额
          callback('请输入1-10位数字')
        } else if (!/^\d+$/.test(value)) {
          callback(new Error('请输入数字值，第一位不能为零'))
        } else if (value < 0) {
          callback(new Error('仅支持输入正整数'))
        } else if (this.formAlignRight.tenderMaxAmount != 0 && value != 0 && value > this.formAlignRight.tenderMaxAmount) {
          callback(new Error('不能大于单人出借限额'))
        } else {
          callback()
        }
      }
      var tenderMaxAmountValidator = (rule, value, callback) => { // 单人出借限额
        if (value.length > 10 || value.length <= 0) {
          callback('请输入1-10位数字')
        } else if (!/^\d+$/.test(value)) {
          callback(new Error('请输入数字值，第一位不能为零'))
        } else if (value < 0) {
          callback(new Error('仅支持输入正整数'))
        } else if (this.formAlignRight.singleMaxAmont != 0 && value != 0 && value < this.formAlignRight.singleMaxAmont) {
          callback(new Error('不能小于单笔出借限额'))
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
      var decimal5bitRate = (rule, value, callback) => {
        setTimeout(() => {
          if (!value) {
            callback(new Error('不能为空'))// | () /^[1-9]\d*$/
          } else if (!TOOL.decimalRate(value)) {
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
        riskGradeLst: TOOL.fetchObj('commonObj').ProductRiskLevel,
        //        alertChoiceHide:false,//选择弹出框的
        alertChoiceDialog: [], // 选择弹出框的数据
        productTypeLst: TOOL.fetchObj('commonObj').ProductType, // 项目类型的list
        non: '', // 结息日现在没有对应的字段
        checkList: [],
        formAlignRight: {
          isAssignment: 'false',
          repayType: '', // 还款方式
          type: TOOL.getProType(this.$route.params.type),
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
          repaySource: '', // 还款来源
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
          tenderMaxAmount: 0, // 单人出借限额
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
          trustMethod: '无', // radio6//增信措施
          suitLenderType: '', // 适合出借人类型
          thirdPartyCooperationInstitution: '', // 第三方合作机构
          acceptanceBank: '', // 承兑银行
          isFeesChargedOnline: 'false', // 是否线上收取融资人费用
          usageOfLoan: '', // 借款用途
          repaymentGuaranteeMeasures: '', // 还款保障措施
          projectRiskWarning: '', // 项目风险提示
          singleMaxAmont: 0, // 单笔最大可投资金额
          isFinancierFee: 'false', // 是否收取融资人手续费
          isTenderingPay: 'true', // 是否支付募集期利息
          riskManagementOpinion: '',
          productExtends: []// 扩展项
        },
        productExtends: [
          'riskManagementOpinion', // 风控意见
          'thirdPartyCooperationInstitution', // 第三方合作机构
          'acceptanceBank', // 承兑银行
          'usageOfLoan', // 借款用途
          'repaymentGuaranteeMeasures', // 还款保障措施
          'projectRiskWarning', // 项目风险提示
          'productProfile', // 项目简介
          'repaySource'// 还款来源
        ], // 扩展项
        repayStartDatePickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        tenderEndTimePickerOptions1: {
          disabledDate (time) {
            return (time.getTime() < Date.now() - 8.64e7)
          },
          onPick ({mindata, maxdata}) {
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
            {required: true, validator: positiveIntegerElse10bit, trigger: 'change'}
          ],
          repayType: [// 收益分配下拉框提交时才有效
            {required: true, message: '请选择一项', trigger: 'change'}
          ],
          annualRate: [// 项目预期年化收益率
            {required: true, validator: decimal5bitRate, trigger: 'blur'}
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
          thirdPartyCooperationInstitution: [
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 50, message: '长度大于50个字符', trigger: 'blur'}
          ],
          acceptanceBank: [
            { required: true, message: '不能为空', trigger: 'blur' },
            {min: 1, max: 50, message: '长度大于50个字符', trigger: 'blur'}
          ],
          advanceDay: [ // 最大提前还款天数
            { validator: positiveInteger3bit, trigger: 'blur' }
          ],
          overdueDay: [ // 最大逾期天数
            { validator: positiveInteger3bit, trigger: 'blur' }
          ],
          gatherFeeContent: [// 收费内容
            { validator: positiveInteger5bit, trigger: 'blur' }
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
          singleMaxAmont: [// 单笔最大投资限额
            { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
            { validator: singleMaxAmontValidator, trigger: 'blur' }
          ],
          tenderMaxAmount: [// 累计最大可投金额
            { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
            { validator: tenderMaxAmountValidator, trigger: 'blur' }
          ]
        },
        resData: null,
        nonSow: false,
        qualificationCertificate: 'qualificationCertificate',
        contractCertificate: 'contractCertificate',
        qualificationCertificateUrl: '',
        contractCertificateUrl: '',
        dateArr: ['', '', ''],
        day: 0,
        breadcrumName: '新增',
        imgList: [// 图片储存数组
          {
            property: 'billShow',
            value: ''
          }
        ],
        proId: TOOL.getProID(this.$route.params.id),
        disabledStatus: false, // 保存按钮禁用
        loadingFull: false, // loading
        checkAmountVisable: false,
        checkAmountErrorMsg: '',
        checkMaxTenderAmountVisable: false,
        overflowMaxTenderAmountErrorMsg: '',
        borrowerMaxTenderAmount: -1, // 借款人最大可借金额
        updateAmount: 0,
        borrowerNameDisabled: false

      }
    },
    watch: {
      repayStartDate (val) {
        this.day = val
      }
    },
    components: {
      breadcrumbNav,
      picUpload
    },
    mounted () {
      this.riskGradeLst[0]['label'] = '全部全部'// 修改风险等级的第一项避免为空
      if (this.proId) {
        this.breadcrumName = '修改'
        this.borrowerNameDisabled = true
        API.postRequest('/gateway/product/get', {id: this.proId}, res => {
          let resData = res.data
          this.arrValue(resData.productExtends, this.imgList)
          TOOL.replaceArrayVal(resData.productExtends, this.formAlignRight)
          TOOL.replaceArrayVal(resData.productExtends, this.imgList)
          TOOL.replaceVal(resData, this.formAlignRight)
          this.moneyFormat001()
        //          this.getBorrowerMaxTenderAmount(this.formAlignRight.borrowerId);
        })
      } else {
        this.borrowerNameDisabled = false
        this.formAlignRight.tenderEndTime = new Date(new Date().setHours(23, 59, 59, 0)) * 1
        API.$getProductName(this.formAlignRight.type, res => {
          this.formAlignRight.name = res.data
        })
      }
      this.alertChoice()
    },
    methods: {
      // 检测可借金额是否超出最高可借金额
      checkAmountIsOverflow (amount) {
        this.checkAmountVisable = false
        this.checkMaxTenderAmountVisable = false
        if (!TOOL.positiveInteger(amount) || amount <= 0) {
          return
        }
        if (this.borrowerMaxTenderAmount === -1) {
          this.checkAmountVisable = true
          this.showFirstModule()
          this.checkAmountErrorMsg = '未选择借方名称,无法获取最高可借金额.请选择借方名称!!!'
          return
        }
        if (amount > this.borrowerMaxTenderAmount) {
          this.checkMaxTenderAmountVisable = true
          this.overflowMaxTenderAmountErrorMsg = `当前最高可借${this.borrowerMaxTenderAmount}元`
        } else {
          this.checkMaxTenderAmountVisable = false
        }
      },

      // 检测第一个模块是否打开(如果未打开,打开第一个模块-借款方信息)
      showFirstModule () {
        if (this.activeNames.indexOf('1') === -1) {
          this.activeNames.unshift('1')
        }
      },

      /* --------------------------------------------格式转换----------------------------------------------------------- */
      moneyFormat100 () {
        this.formAlignRight.amount = TOOL.yuanToFen(this.formAlignRight.amount)
        this.formAlignRight.tenderInitAmount = TOOL.yuanToFen(this.formAlignRight.tenderInitAmount)
        this.formAlignRight.tenderIncreaseAmount = TOOL.yuanToFen(this.formAlignRight.tenderIncreaseAmount)
        this.formAlignRight.singleMaxAmont = TOOL.yuanToFen(this.formAlignRight.singleMaxAmont)
        this.formAlignRight.tenderMaxAmount = TOOL.yuanToFen(this.formAlignRight.tenderMaxAmount)
      },
      moneyFormat001 () {
        this.formAlignRight.amount = TOOL.fenToYuan(this.formAlignRight.amount)
        this.updateAmount = this.formAlignRight.amount
        this.formAlignRight.tenderInitAmount = TOOL.fenToYuan(this.formAlignRight.tenderInitAmount)
        this.formAlignRight.tenderIncreaseAmount = TOOL.fenToYuan(this.formAlignRight.tenderIncreaseAmount)
        this.formAlignRight.singleMaxAmont = TOOL.fenToYuan(this.formAlignRight.singleMaxAmont)
        this.formAlignRight.tenderMaxAmount = TOOL.fenToYuan(this.formAlignRight.tenderMaxAmount)
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 先给图片赋值
      arrValue (val, localImg) {
        localImg.length = 0
        for (let i = 0; i < val.length; i++) {
          if (val[i]['property'] === 'billShow') {
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
      },
      // 图片路径删除
      childToFatherTransferEvent (arr) {
        // 只是打印一下
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
      },

      // 收益分配在选中之后显示下面的input
      nonShow () {
        this.nonSow = true
      },
      // 保存数据
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          this.formAlignRight.productExtends.length = 0
          this.integrationData(this.formAlignRight, this.productExtends, this.formAlignRight.productExtends)
          this.formAlignRight.productExtends = this.formAlignRight.productExtends.concat(this.imgList)
          console.log('即将发送的内容')
          if (valid) {
            this.loadingFull = false
            if (this.formAlignRight.amount - this.formAlignRight.tenderInitAmount < 0) {
              TOOL.msgBox(this, '起投金额不能大于借款金额', false, true, '')
            } else if (this.formAlignRight.amount - this.formAlignRight.tenderIncreaseAmount < 0) {
              TOOL.msgBox(this, '递增金额不能大于借款金额', false, true, '')
            } else if (this.proId) {
              console.log('已发送修改')
              this.moneyFormat100()
              this.disabledStatus = true// 保存按钮禁用
              this.loadingFull = true// 全屏loading
              API.postRequest('/gateway/product/edit', this.formAlignRight, res => {
                this.loadingFull = false// 解除loading
                if (res.success) { // 正确时再跳转上一页
                  this.disabledStatus = false// 接触保存按钮禁用
                  this.$router.go(-1)
                } else {
                  this.moneyFormat001()
                  this.disabledStatus = false// 接触保存按钮禁用
                  TOOL.msgBox(this, res.resultMsg, false, true, '')
                }
              })
            } else {
              console.log('已发送新增')
              this.disabledStatus = true// 保存按钮禁用
              this.moneyFormat100()
              this.loadingFull = true// 全屏loading
              API.postRequest('/gateway/product/add', this.formAlignRight, res => {
                this.loadingFull = false// 解除loading
                if (res.success) { // 正确时再跳转上一页
                  this.disabledStatus = false// 接触保存按钮禁用
                  this.$router.go(-1)
                } else {
                  this.moneyFormat001()
                  this.disabledStatus = false// 接触保存按钮禁用
                  TOOL.msgBox(this, res.resultMsg, false, true, '')
                }
              })
            }
          } else {
            TOOL.msgBox(this, '有未填写或填写错误内容', false, true, '', '', () => {
              this.disabledStatus = false// 接触保存按钮禁用
            })
            return false
          }
        })
      },

      backPage () {
        this.$router.go(-1)
      },

      // 扩展项的赋值
      integrationData (formAlignRight, productExtends, fp) {
        TOOL.integrationData(formAlignRight, productExtends, fp)
      },

      // 选择按钮
      alertChoice () {
        let pageSize = 999
        let borrowerType = 10// 10人工20系统
        API.postRequest('/gateway/borrower/pageQuery', {
          'pageSize': pageSize,
          'borrowerType': borrowerType
        }, res => {
          this.alertChoiceDialog = res.list
        })
      },

      // 选择弹出框
      choice () {
      //        this.alertChoiceHide = false;
      //        this.formAlignRight.borrowerName = name;
      //        this.formAlignRight.borrowerId = id;
        this.checkAmountVisable = false
        this.checkMaxTenderAmountVisable = false
        for (let item of this.alertChoiceDialog) {
          if (item.borrowerName === this.formAlignRight.borrowerName) {
            this.formAlignRight.borrowerId = item.id
            break
          }
        }
        this.getBorrowerMaxTenderAmount(this.formAlignRight.borrowerId)
      },
      // 获取最高剩余可借金额
      getBorrowerMaxTenderAmount (id) {
        API.postRequest('/gateway/product/borrowerMaxTenderAmount', {'id': id}, res => {
          if (this.proId) {
            this.borrowerMaxTenderAmount = TOOL.fenToYuan(res.data) + this.updateAmount
          } else {
            this.borrowerMaxTenderAmount = TOOL.fenToYuan(res.data)
          }
        })
      }
    }

  }
</script>
<style lang="less" scoped>
  .el-select {
    width: 80%;
  }
  /* .el-select-dropdown{
     width: 10%;
   }*/
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
    width: 79.6%;
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
  .btnDiv{
    margin-left: -220px;
    padding-top: 10px;
  }
  .marR10{
    margin-right: 10px;
  }
</style>
