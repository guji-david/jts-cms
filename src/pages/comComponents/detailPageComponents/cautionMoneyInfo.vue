<template>
  <el-form :model="formAlignRight" label-width="220px" ref="formAlignRight">
    <el-collapse v-model="activeNames">
      <!--折叠栏1-->
      <el-collapse-item title="保证金信息" name="1">
        <el-form-item label="保证金比例：">
          {{proportion?proportion + '%':proportion}}
        </el-form-item>
        <el-form-item label="保证金金额(元)：">
          {{cashDeposit}}
        </el-form-item>
        <el-form-item label="支付时间：">
          {{payTime}}
        </el-form-item>
        <el-form-item label="订单号：">
          {{formAlignRight.orderNo}}
        </el-form-item>
        <el-form-item label="交易流水号：">
          {{formAlignRight.tradeNo}}
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
        activeNames: ['1']
      }
    },
    computed: {
      payTime: function () {
        return TOOL.normalTime(this.formAlignRight.payTime)
      },
      cashDeposit: function () {
        return TOOL.fenToYuan(this.formAlignRight.cashDeposit)
      },
      proportion: function () {
        return TOOL.yuanToFen(this.formAlignRight.proportion)
      }
    }
  }
</script>
