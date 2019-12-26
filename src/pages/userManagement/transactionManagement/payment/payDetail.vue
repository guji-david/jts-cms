<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 列表开始 -->
    <div id="z-edit">
      <el-form :model="form" label-width="160px">
            <el-form-item label="投资金额：">
              {{form.repayPrincipalAmount}}
            </el-form-item>
            <el-form-item label="年化利率：" >
              {{form.annualRate}}%
            </el-form-item>
            <el-form-item label="起息日：" >
              {{form.repayStartDate}}
            </el-form-item>
            <el-form-item label="到期日：" >
              {{form.repayEndtDate}}
            </el-form-item>
            <el-form-item label="实际回款日：" v-if="form.repayTime">
              {{form.repayTime}}
            </el-form-item>
            <el-form-item label="预计还款金额：" >
              {{`${form.repayPlanAmount}（本金：${form.repayPrincipalAmount}   &emsp;利息：${form.repayInterestPlanAmount}   &emsp;加息：${form.repayCouponInterestPlanamount}）`}}
            </el-form-item>
            <el-form-item label="实际还款金额：" v-if="form.repayTime">
              {{`${form.repayAmount}（本金：${form.repayPrincipalAmount}   &emsp;利息：${form.interestAmount}   &emsp;加息：${form.repayCouponInterestAmount}）`}}
            </el-form-item>
      </el-form>
    </div>
    <!-- 列表结束 -->
    <div class="back-btn text-center">
      <el-button @click="back()">返回</el-button>
    </div>
  </div>
</template>

<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  export default {
    data () {
      return {
        breadcrumName: '详情',
        orderNo: TOOL.getProID(this.$route.params.orderNo),
        form: {
          repayPrincipalAmount: '', // 投资金额
          annualRate: '', // 年化利率
          repayStartDate: '', // 起息日
          repayEndtDate: '', // 到期日
          repayTime: '', // 实际回款日
          repayPlanAmount: '', // 预计还款金额
          repayInterestPlanAmount: '', // 计划还款利息
          repayCouponInterestPlanamount: '', // 计划加息
          repayAmount: '', // 实际还款金额
          interestAmount: '', // 实际还款利息
          repayCouponInterestAmount: ''// 实际加息
        }
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      this.getTablelist()
    },
    methods: {
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 金额转换
      formFenToYuan () {
        this.form.repayPrincipalAmount = TOOL.fenToYuan(this.form.repayPrincipalAmount) || 0 + '.00'// 投资金额
        this.form.repayPlanAmount = TOOL.fenToYuan(this.form.repayPlanAmount) || 0 + '.00'// 计划还款金额
        this.form.repayInterestPlanAmount = TOOL.fenToYuan(this.form.repayInterestPlanAmount) || 0 + '.00'// 计划还款利息
        this.form.repayCouponInterestPlanamount = TOOL.fenToYuan(this.form.repayCouponInterestPlanamount) || 0 + '.00'// 计划加息
        this.form.repayAmount = TOOL.fenToYuan(this.form.repayAmount) || 0 + '.00'// 实际还款金额
        this.form.interestAmount = TOOL.fenToYuan(this.form.interestAmount) || 0 + '.00'// 实际还款利息
        this.form.repayCouponInterestAmount = TOOL.fenToYuan(this.form.repayCouponInterestAmount) || 0 + '.00'// 实际加息
      },
      formdateFormat () {
        this.form.repayStartDate = TOOL.normalTimeDay(this.form.repayStartDate) || ''// 起息日
        this.form.repayEndtDate = TOOL.normalTimeDay(this.form.repayEndtDate) || ''// 到期日
        this.form.repayTime = TOOL.normalTimeDay(this.form.repayTime) || ''// 实际还款日期
      },
      getTablelist () {
        API.$PaymentDetail({id: this.orderNo}, res => {
          this.form = res.data
          this.formFenToYuan()
          this.formdateFormat()
        })
      },

      // 返回
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>
