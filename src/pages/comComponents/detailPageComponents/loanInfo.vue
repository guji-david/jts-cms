<template>
  <el-form :model="formAlignRight" label-width="220px" ref="formAlignRight">
    <el-collapse v-model="activeNames">
      <!--折叠栏1-->
      <el-collapse-item title="放款信息" name="1">
        <el-form-item label="结标时间：">
          {{loanTime}}
        </el-form-item>
        <el-form-item label="是否已通知放款：">
          {{loanStatus}}
        </el-form-item>
        <el-form-item label="放款账户：">
          {{formAlignRight.accountName }}
        </el-form-item>
        <el-form-item label="放款账号：">
          {{formAlignRight.accountNo}}
        </el-form-item>
        <el-form-item label="放款处理进度：">
          {{notifyLoanStatus}}
        </el-form-item>
        <el-form-item label="是否已划转手续费：">
          {{serviceCharge}}
        </el-form-item>
        <el-form-item label="收取手续费：">
          {{poundage}}
        </el-form-item>
      </el-collapse-item>
      <!--折叠栏1end-->
    </el-collapse>
  </el-form>
</template>

<script>
  import * as TOOL from '../../../assets/js/tools'
  export default {
    props: ['formAlignRight', 'proId', 'proType'],
    data () {
      return {
        activeNames: ['1'],
        notifyLoanStatusOptions: TOOL.fetchObj('commonObj').TradeBankStatus,
        options: [
          {label: '否', value: 'false'},
          {label: '是', value: 'true'}
        ]
      }
    },
    computed: {
      loanTime: function () {
        return TOOL.normalTimeDay(this.formAlignRight.loanTime)
      },
      loanStatus: function () {
        if (this.formAlignRight.loanStatus === 'true') {
          let loanTimeTemp = this.formAlignRight.loanTime ? ('(' + TOOL.normalTime(this.formAlignRight.loanTime) + ')') : ''
          return TOOL.valueToLabel(this.options, this.formAlignRight.loanStatus) + loanTimeTemp
        } else {
          return TOOL.valueToLabel(this.options, this.formAlignRight.loanStatus)
        }
      },
      notifyLoanStatus: function () {
        return TOOL.valueToLabel(this.notifyLoanStatusOptions, this.formAlignRight.notifyLoanStatus)
      },
      serviceCharge: function () {
        if (this.formAlignRight.serviceCharge == 20) { // 20为划转手续费成功状态
          let serviceChargeTimeTemp = this.formAlignRight.serviceChargeTime ? ('(' + TOOL.normalTime(this.formAlignRight.serviceChargeTime) + ')') : ''
          return '是' + serviceChargeTimeTemp
        } else {
          return '否'
        }
      },
      poundage: function () {
        return TOOL.fenToYuan(this.formAlignRight.poundage) + '( ' + '借款金额' + ' * ' + TOOL.yuanToFen(this.formAlignRight.poundageRate) + ' % ' + ' )'
      }
    }
  }
</script>
