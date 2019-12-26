<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <el-tabs v-model="recharge" v-if="proType !== 'approval'" >
      <el-tab-pane
        v-for="x in apiKey[proType].tabs"
        :name=x
        :label=tabsList[x]
      ></el-tab-pane>
    </el-tabs>

    <BaseAndApprovalInfo v-if="recharge === '0'" :formAlignRight="basicInformation" :proId="proId" :proType="proType"></BaseAndApprovalInfo>
    <CautionMoneyInfo v-if="recharge === '1'" :formAlignRight="cashDepositInformation" :proId="proId" :proType="proType"></CautionMoneyInfo>
    <ApprovalInfo v-if="recharge === '2'" :formAlignRight="auditInformation" :proId="proId" :proType="proType"></ApprovalInfo>
    <PublishInfo v-if="recharge === '3'" :formAlignRight="publishInformation" :proId="proId" :proType="proType"></PublishInfo>
    <RepayInfo v-if="recharge === '4'" :formAlignRight="repayInformation" :proId="proId" :proType="proType"></RepayInfo>
    <UnfreezeInfo v-if="recharge === '5'" :formAlignRight="productUnfreezeInformation" :proId="proId" :proType="proType"></UnfreezeInfo>
    <LoanInfo v-if="recharge === '6'" :formAlignRight="repayInformationVO" :proId="proId" :proType="proType"></LoanInfo>
    <DelayRepayInfo v-if="recharge === '7'" :formAlignRight="productOverdueInfoVO" :proId="proId" :proType="proType"></DelayRepayInfo>
    <!--返回按钮-->
    <!--<div class="paddT10">-->
      <!--<el-row :gutter="20" type="flex" justify="center">-->
        <!--<el-button :plain="true" type="primary" size="" @click="backPage" class="btn">返回</el-button>-->
      <!--</el-row>-->
    <!--</div>-->

  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  import BaseAndApprovalInfo from '../baseAndApprovalInfo.vue'
  import CautionMoneyInfo from '../cautionMoneyInfo.vue'
  import ApprovalInfo from '../approvalInfo.vue'
  import PublishInfo from '../publishInfo.vue'
  import RepayInfo from '../repayInfo.vue'
  import UnfreezeInfo from '../unfreezeInfo.vue'
  import LoanInfo from '../loanInfo.vue'
  import DelayRepayInfo from '../delayRepayInfo.vue'
  export default {
    data () {
      return {
        formAlignRight: {
          /* accountName : '',//收款账户 ,
          accountNo : '',//收款账号 ,
          attachments : '',//附件 ,
          borrowerName: '',//借款人名称 ,
          certNo : '',//证件号码 ,
          contactName : '',//联系人姓名 ,
          contactPhone : '',//联系人手机号 ,
          dueBank : '',//收款银行 ,
          foundingTime : '',//成立时间 ,
          legalPerson : '',//法定代表人 ,
          loanAmount :'',// 借款金额 ,
          loanNo : '',//申请ID ,
          loanTime : '',//借款期限 ,
          loanTimeUnit : '',//借款期限单位 10日 20月 30年 默认为日 ,
          loanUsage : '',//借款用途 ,
          name : '',//本地项目名称 ,
          packetNo : '',//项目标包编号 ,
          productId : '',//项目ID ,
          productName : '',//中招项目名称 ,
          productNo : '',//项目编号 ,
          productProfile : '',//项目简介 ,
          rate : '',//借款利率 ,
          rateType : '',//利率类型 10日利率 30年利率 默认为日利率 ,
          regAddress : '',//注册地址 ,
          regCapital : '',//注册资本 ,
          repayType : '',//还款方式 10 一次性还本付息 90其它 */
        },
        auditInformation: {}, // 审核信息
        basicInformation: {}, // 基础信息
        cashDepositInformation: {}, // 保证金
        publishInformation: {}, // 发布信息
        repayInformation: {}, // 还款信息
        productUnfreezeInformation: {}, // 解冻信息
        repayInformationVO: {}, // 放款信息
        productOverdueInfoVO: {}, //延期还款信息
        breadcrumName: '详情', // 面包屑名称不需要再传进来
        proId: TOOL.getProID(this.$route.params.id),
        proType: TOOL.getProType(this.$route.params.type),
        apiKey: {
          'default': {api: '$nopayInfo', tabs: ['0']}, // 基础信息接口

          'approval': {api: '$noauditInfo', tabs: ['0']}, // 审核信息接口--审核页面
          'approvalInfo': {api: '$noauditInfo', tabs: ['0', '1']}, // 审核信息接口--详情页面

          'publish': {api: '$nopublishInfo', tabs: ['0', '1', '2']}, // 发布信息接口

          // 财务管理>投标贷项目信息管理
          'noloan': {api: '$noloanInfo', tabs: ['0', '1', '2', '3']}, // 待结标项目下详情接口
          'noRepayInfo': {api: '$noRepayInfo', tabs: ['0', '1', '2', '3', '6', '4']}, // 待还款项目下详情接口
          'delayNoRepayInfo': {api: '$noRepayInfo', tabs: ['0', '1', '2', '3', '6', '4', '7']}, // 延期还款项目下未还款详情接口 lyx add on2018.8.24
          'delayAlreadyRepayInfo': {api: '$repayDetail', tabs: ['0', '1', '2', '3', '6', '4', '7']}, // 延期还款项目下已还款详情接口 lyx add on2018.8.24

          // 用户管理>出借人交易管理
          'tenderLoan': {api: '$noloanInfo', tabs: ['0', '1', '2', '3', '6']}, // 放款记录--项目详情接口

          // 用户管理>出借人交易管理
          'repay': {api: '$repayDetail', tabs: ['0', '1', '2', '3', '6', '4']}, // 回款记录--项目详情接口
          'unrepay': {api: '$repayDetail', tabs: ['0', '1', '2', '3', '6', '4']}, // 回款记录--项目详情接口

          // 财务管理>投标贷项目信息管理>已完成的项目
          'success': {api: '$repayDetail', tabs: ['0', '1', '2', '3', '6', '4']}, // 已完成的项目下详情接口---满标
          'fail': {api: '$repayDetail', tabs: ['0', '1', '2', '3', '5']}, // 已完成的项目下详情接口---失败

          // 财务管理>投标贷项目信息管理>已关闭的项目
          'closeDetailBase': {api: '$closeDetail', tabs: ['0']}, // 已关闭项目详情接口----支付超时10/取消借款20
          'closeDetailApp': {api: '$closeDetail', tabs: ['0', '1', '2']}, // 已关闭项目详情接口----审核未通过30
          'closeDetailCM': {api: '$closeDetail', tabs: ['0', '1']}, // 已关闭项目详情接口----审核超时32
          'closeDetailPub': {api: '$closeDetail', tabs: ['0', '1', '2', '3']}, // 已关闭项目详情接口----发布失败50
          'closeDetailFail': {api: '$closeDetail', tabs: ['0', '1', '2', '3', '5']}// 已关闭项目详情接口----募集失败60
        },
        tabsList: {'0': '基本信息', '1': '保证金信息', '2': '审核信息', '3': '发布信息', '4': '还款信息', '5': '解冻信息', '6': '放款信息', '7': '延期还款信息'},
        recharge: '0'// tab下标
      }
    },
    methods: {
      backPage () {
        this.$router.go(-1)
      }
    },
    components: {
      breadcrumbNav,
      BaseAndApprovalInfo,
      CautionMoneyInfo,
      ApprovalInfo,
      PublishInfo,
      RepayInfo,
      UnfreezeInfo,
      LoanInfo,
      DelayRepayInfo
    },
    mounted () {
      if (this.proType === 'approval') {
        this.breadcrumName = '审核'
      } else {
        this.breadcrumName = '详情'
      }
      API[this.apiKey[this.proType]['api']]({id: this.proId}, res => {
        this.auditInformation = res.data.auditInformation || {}
        this.basicInformation = res.data.basicInformation || res.data || {}
        this.cashDepositInformation = res.data.cashDepositInformation || {}
        this.publishInformation = res.data.publishInformation || {}
        this.repayInformation = res.data.repayInformation || {}
        this.productUnfreezeInformation = res.data.unfreezeInformation || {}
        this.repayInformationVO = res.data.repayInformationVO || {}
        this.productOverdueInfoVO = res.data.productOverdueInfoVO || {}
      })
    }
  }
</script>
<style lang="less" scoped>
  .imgShow{
    width: 100px;
    height: 100px;
    background: lightgray;
    margin-left: 50%;
    transform: translatex(-50%);
  }
  .paddT10{
    padding-top: 10px;
  }
</style>
