<template>
      <el-form :model="formAlignRight" label-width="220px">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="销售信息" name="1">
            <el-form-item label="募集本金(元)：">
              {{tenderAmount}}
            </el-form-item>
            <el-form-item label="红包金额(元)：">
              {{redPacketAmount || 0}}
            </el-form-item>
            <el-form-item label="满标时间：">
              {{fullTime}}
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="还款信息" name="2">
            <el-form-item label="预计还款金额(元)：">
              {{`${totalAmountPlan}（本金：${totalPrincipalAmountPlan} ； 利息：${totalInterestAmountPlan} ； 加息：${totalCouponInterestAmountPlan}）`}}
            </el-form-item>
            <el-form-item label="实际还款金额(元)：" v-if="formAlignRight.statusTwo === 2 && proType !== 'unrepay'">
              {{`${totalAmount}（本金：${totalPrincipalAmount} ； 利息：${totalInterestAmount} ；加息：${totalCouponInterestAmount}）`}}
            </el-form-item>
            <el-form-item label="实际还款日：" v-if="proType === 'success' || proType === 'repay'">
              {{actualTime}}
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
</template>

<script>
  import * as TOOL from '../../../assets/js/tools'

  export default {
    props: ['formAlignRight', 'proId', 'proType'],
    data () {
      return {
        activeNames: ['1', '2']
      }
    },
    computed: {
      tenderAmount: function () { // 募集本金
        return TOOL.fenToYuan(this.formAlignRight.tenderAmount)
      },
      redPacketAmount: function () { // 红包金额
        return TOOL.fenToYuan(this.formAlignRight.redPacketAmount)
      },
      fullTime: function () { // 满标时间
        return TOOL.normalTime(this.formAlignRight.fullTime)
      },
      actualTime: function () { // 实际还款日
        return TOOL.normalTimeDay(this.formAlignRight.actualTime)
      },
      totalAmountPlan: function () { // 预计还款金额
        return TOOL.fenToYuan(this.formAlignRight.totalAmountPlan) || 0
      },
      totalAmount: function () { // 实际还款金额
        return TOOL.fenToYuan(this.formAlignRight.totalAmount) || '根据资金实际占用天数计算'
      },
      totalPrincipalAmountPlan: function () { // 预计还款本金
        return TOOL.fenToYuan(this.formAlignRight.totalPrincipalAmountPlan) || 0
      },
      totalInterestAmountPlan: function () { // 预计还款利息
        return TOOL.fenToYuan(this.formAlignRight.totalInterestAmountPlan) || 0
      },
      totalCouponInterestAmountPlan: function () { // 预计还款加息
        return TOOL.fenToYuan(this.formAlignRight.totalCouponInterestAmountPlan) || 0
      },
      totalPrincipalAmount: function () { // 实际还款本金
        return TOOL.fenToYuan(this.formAlignRight.totalPrincipalAmount) || 0
      },
      totalInterestAmount: function () { // 实际还款利息
        return TOOL.fenToYuan(this.formAlignRight.totalInterestAmount) || 0
      },
      totalCouponInterestAmount: function () { // 实际还款加息
        return TOOL.fenToYuan(this.formAlignRight.totalCouponInterestAmount) || 0
      }
    }
  }
</script>
