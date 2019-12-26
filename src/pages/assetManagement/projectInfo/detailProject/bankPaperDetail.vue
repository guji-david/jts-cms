<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="formAlignRight" label-width="220px" >
        <el-collapse v-model="activeNames">
          <!--折叠栏1-->
          <el-collapse-item title="借款方信息" name="1">
            <el-form-item label="借方类型：">
              {{formAlignRight.unitType}}
            </el-form-item>
            <el-form-item label="借方名称：" >
              {{formAlignRight.borrowerName}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏1end-->

          <!--折叠栏2-->
          <el-collapse-item title="项目信息" name="2">
            <el-form-item label="项目类型：">
              {{formAlignRight.type}}
            </el-form-item>
            <el-form-item label="项目名称：">
              {{formAlignRight.name}}
            </el-form-item>
            <el-form-item label="项目ID：" >
              {{proId}}
            </el-form-item>
            <el-form-item label="借款金额(元)：" >
              {{formAlignRight.amount}}
            </el-form-item>
            <el-form-item label="结息日：" v-if="nonSow">
              {{formAlignRight.repayInterestDay}}
            </el-form-item>
            <el-form-item label="借款利率(%)：" >
              {{formAlignRight.annualRate}}
            </el-form-item>
            <el-form-item label="借款期限(天)：" >
              {{formAlignRight.timeLimit}}
            </el-form-item>
            <el-form-item label="起息日：" >
              {{formAlignRight.repayStartDate}}
            </el-form-item>
            <el-form-item label="到期日：">
              {{formAlignRight.repayEndDate}}
            </el-form-item>
            <el-form-item label="还款方式：">
              {{formAlignRight.repayType}}
            </el-form-item>
            <el-form-item label="项目风险等级：">
              {{formAlignRight.riskRating}}
            </el-form-item>
            <!--<el-form-item label="适合出借人类型：" >-->
              <!--{{formAlignRight.suitLenderType}}-->
            <!--</el-form-item>-->
            <el-form-item label="第三方合作机构：" >
              {{formAlignRight.thirdPartyCooperationInstitution}}
            </el-form-item>
            <el-form-item label="承兑银行：" >
              {{formAlignRight.acceptanceBank}}
            </el-form-item>
            <el-form-item label="是否支付募集期利息：">
              {{formAlignRight.isTenderingPay}}
            </el-form-item>
            <el-form-item label="是否允许转让：">
              {{formAlignRight.isAssignment}}
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
            <el-form-item label="是否允许提前还款：">
              {{formAlignRight.isAdvanceRepayment}}
            </el-form-item>
            <el-form-item label="最大提前天数：" v-if="formAlignRight.isAdvanceRepayment=='true'" >
              {{formAlignRight.advanceDay}}
            </el-form-item>
            <el-form-item label="是否允许逾期还款：" >
             {{formAlignRight.isOverdueRepayment}}
            </el-form-item>
            <el-form-item label="最大逾期天数：" v-if="formAlignRight.isOverdueRepayment=='true'" >
              {{formAlignRight.overdueDay}}
            </el-form-item>
            <el-form-item label="是否收取融资人费用：">
              {{formAlignRight.isGatherFee}}
            </el-form-item>
            <el-form-item label="收费时点：" v-if="formAlignRight.isGatherFee=='true'">
              <el-radio class="radio" v-model="formAlignRight.gatherFeePoint" label="0">放款</el-radio>
              <el-radio class="radio" v-model="formAlignRight.gatherFeePoint" label="1">还款</el-radio>
            </el-form-item>
            <el-form-item label="收费方式：" v-if="formAlignRight.isGatherFee=='true'">
              <el-radio class="radio" v-model="formAlignRight.gatherFeeType" label="0">单笔金额</el-radio>
              <el-radio class="radio" v-model="formAlignRight.gatherFeeType" label="1">单笔比例</el-radio>
            </el-form-item>
            <el-form-item label="收费内容：" v-if="formAlignRight.isGatherFee=='true'" >
              {{formAlignRight.gatherFeeContent}}
              <label>
                <span v-show="formAlignRight.gatherFeeType=='0'">元</span>
                <span v-show="formAlignRight.gatherFeeType=='1'">%</span>
              </label>
            </el-form-item>
            <el-form-item label="是否收取出借人手续费：">
             {{formAlignRight.isFinancierFee}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏2end-->

          <!--折叠栏4-->
          <el-collapse-item title="项目描述" name="4">
            <el-form-item label="项目简介：" >
              {{formAlignRight.productProfile}}
            </el-form-item>
            <el-form-item label="借款用途：" >
              {{formAlignRight.usageOfLoan}}
            </el-form-item>
            <el-form-item label="还款来源：">
             {{formAlignRight.repaySource}}
            </el-form-item>
            <el-form-item label="还款保障措施：">
                {{formAlignRight.repaymentGuaranteeMeasures}}
            </el-form-item>
            <el-form-item label="项目风险提示：">
              {{formAlignRight.projectRiskWarning}}
            </el-form-item>
            <el-form-item label="风控意见：" prop="riskManagementOpinion">
              {{formAlignRight.riskManagementOpinion}}
            </el-form-item>
            <el-form-item label="票据展示：">
              <el-row class="flexWrap">
                <div v-for="x in imgList">
                  <img :src="[x.value?url+x.value:'']" alt="此处为图片" class="imgShow">
                </div>
              </el-row>
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏4end-->

          <!--折叠栏5-->
          <el-collapse-item title="销售信息" name="5">
            <el-form-item label="募集开始时间：" >
              {{formAlignRight.tenderStartTime}}
            </el-form-item>
            <el-form-item label="募集结束时间：" >
              {{formAlignRight.tenderEndTime}}
            </el-form-item>
            <el-form-item label="起投金额：" >
              {{formAlignRight.tenderInitAmount}}
            </el-form-item>
            <el-form-item label="递增金额：">
              {{formAlignRight.tenderIncreaseAmount}}
            </el-form-item>
            <el-form-item label="单笔出借限额：" >
             {{formAlignRight.singleMaxAmont}}
            </el-form-item>
            <el-form-item label="单人出借限额：">
              {{formAlignRight.tenderMaxAmount}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏5end-->

        </el-collapse>
        <el-form-item v-if="proType == 'default'">
          <el-row :gutter="20" type="flex" justify="center" class="paddT10">
            <!--<el-button type="primary" size="large" class='btn'  @click="backPage">确定</el-button>-->
            <el-button :plain="true" type="danger" @click="backPage" class="btn">返回</el-button>
          </el-row>
        </el-form-item>

        <Afooter :routerId="proId" v-if="proType == 'approval'"></Afooter>
        <Pfooter :routerId="proId" :publishTime="publishTime" :publishStatus="publishStatus" v-if="proType == 'publish'"></Pfooter>
      </el-form>
    </div>
  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import Afooter from '../components/footerApprove.vue'
  import Pfooter from '../components/footerPublish.vue'
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        publishTime: '',
        publishStatus: '',
        activeNames: ['1', '2', '3', '4', '5', '6'],
        productTypeOptions: TOOL.fetchObj('commonObj').ProductType,
        unitTypeOptions: TOOL.fetchObj('commonObj').BorrowerType,
        repayTypeLstOption: TOOL.fetchObj('commonObj').RepayType,
        riskGradeLst: TOOL.fetchObj('commonObj').RiskRating,
        formAlignRight: {
          isAssignment: 'false',
          repayType: '', // 还款方式
          type: 'bankPaper',
          unitType: '',
          borrowerId: '', // 借款人id
          borrowerName: '', // 借款人名称
          name: '',
          amount: '',
          annualRate: '',
          isUseRedpacket: 'false', // 是否让用红包
          isUseCoupon: 'false', // 是否让用加息劵
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
          isTenderingPay: 'false', // 是否支付募集期利息
          riskManagementOpinion: '',
          productExtends: []// 扩展项
        },
        resData: null,
        nonSow: false,
        day: 0,
        breadcrumName: TOOL.getBreadcrumName(this.$route.params.breadcrumName),
        imgList: [// 图片储存数组
          {
            property: 'billShow',
            value: ''
          }
        ],
        url: TOOL.getDomain(),
        proId: TOOL.getProID(this.$route.params.id),
        proType: TOOL.getProType(this.$route.params.type)
      }
    },
    watch: {
      repayStartDate (val) {
        console.log(val)
        this.day = val
      }
    },
    methods: {
      backPage () {
        this.$router.go(-1)
      },
      // 先给图片赋值
      arrValue (val, localImg) {
        localImg.length = 0
        for (let i = 0; i < val.length; i++) {
          if (val[i]['property'] === 'billShow') {
            localImg.push(val[i])
          }
        }
        console.log(11111111, localImg)
      },
      moneyFormat001 () {
        this.formAlignRight.amount = TOOL.fenToYuan(this.formAlignRight.amount)
        this.formAlignRight.tenderInitAmount = TOOL.fenToYuan(this.formAlignRight.tenderInitAmount)
        this.formAlignRight.tenderIncreaseAmount = TOOL.fenToYuan(this.formAlignRight.tenderIncreaseAmount)
        this.formAlignRight.singleMaxAmont = TOOL.fenToYuan(this.formAlignRight.singleMaxAmont)
        this.formAlignRight.tenderMaxAmount = TOOL.fenToYuan(this.formAlignRight.tenderMaxAmount)
      }
    },
    components: {
      breadcrumbNav,
      Afooter,
      Pfooter
    },
    mounted () {
    //      this.formAlignRight.type = this.$route.params.type;//转换产品类型
      console.log(this.$route.params.id)
      console.log(this.$route.params.type)
      API.postRequest('/gateway/product/get', { id: this.proId }, res => {
        this.publishTime = res.data.publishTime
        this.publishStatus = res.data.publishStatus
        let resData = res.data

        TOOL.replaceArrayVal(resData.productExtends, this.formAlignRight)
        TOOL.replaceVal(resData, this.formAlignRight)

        this.arrValue(resData.productExtends, this.imgList)

        this.formAlignRight.repayStartDate = TOOL.normalTimeDay(this.formAlignRight.repayStartDate)

        this.formAlignRight.tenderStartTime = TOOL.normalTime(this.formAlignRight.tenderStartTime)
        this.formAlignRight.tenderEndTime = TOOL.normalTime(this.formAlignRight.tenderEndTime)

        this.formAlignRight.type = TOOL.valueToLabel(this.productTypeOptions, this.formAlignRight.type)
        // 由于没有返回unitType采用的临时方法
        this.formAlignRight.unitType = TOOL.valueToLabelTemporary(this.unitTypeOptions, this.formAlignRight.unitType)
        this.formAlignRight.repayType = TOOL.valueToLabel(this.repayTypeLstOption, this.formAlignRight.repayType)
        this.formAlignRight.riskRating = TOOL.valueToLabel(this.riskGradeLst, this.formAlignRight.riskRating)

        this.formAlignRight.repayEndDate = TOOL.timeLimitFormatDay(this.formAlignRight.repayStartDate, this.formAlignRight.timeLimit)
        this.moneyFormat001()
        TOOL.trueOrFalse(this.formAlignRight)
      })
    }
  }
</script>
<style lang="less" scoped>
  .imgShow{
    width: 100px;
    height: 100px;
    background: lightgray;
  }
  .flexWrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
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
  .paddT10{
    padding-top: 10px;
  }
</style>
