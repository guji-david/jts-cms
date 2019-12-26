<template>
    <el-form :model="formAlignRight" label-width="220px">
        <el-collapse v-model="activeNames">
        <!--折叠栏1-->
        <el-collapse-item title="延期还款信息" name="1">
            <el-form-item label="延期利息还款时间：" v-if="proType==='delayAlreadyRepayInfo' ">
                {{successDate}}
            </el-form-item>
            <el-form-item label="延期天数(天)：">
                {{formAlignRight.overdueDays}}
            </el-form-item>
            <el-form-item label="延期利息还款金额(元)：">
                {{overdueAmount}}
            </el-form-item>
            <el-form-item label="实际延期利息还款金额(元)：" v-if="proType==='delayAlreadyRepayInfo' ">
                {{overdueAmount}}
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
      }
    },
    computed: {
        successDate: function () {
            return TOOL.normalTimeDay(this.formAlignRight.successDate) || ''
        },
        overdueAmount: function () {
            return TOOL.fenToYuan(this.formAlignRight.overdueAmount) || ''
        }
    }
  }
</script>
