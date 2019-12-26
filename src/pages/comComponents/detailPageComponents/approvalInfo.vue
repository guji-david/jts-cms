<template>
  <el-form :model="formAlignRight" label-width="220px" ref="formAlignRight">
    <el-collapse v-model="activeNames">
      <!--折叠栏1-->
      <el-collapse-item title="审核信息" name="1">
        <el-form-item label="审核结果：">
          {{auditStatus}}
        </el-form-item>
        <el-form-item label="项目风险等级：">
          {{riskRating}}
        </el-form-item>
        <el-form-item label="审核时间：">
          {{auditTime}}
        </el-form-item>
        <el-form-item label="审核人员：">
          {{formAlignRight.auditUser}}
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
        productRiskLevelOptions: TOOL.fetchObj('commonObj').ProductRiskLevel, // 风险等级转义
        auditStatusOptions: TOOL.fetchObj('commonObj').AuditStatus, // 保证金审核结果
        activeNames: ['1']
      }
    },
    computed: {
      auditTime: function () {
        return TOOL.normalTime(this.formAlignRight.auditTime)
      },
      riskRating: function () {
        return this.formAlignRight.riskRating ? TOOL.valueToLabel(this.productRiskLevelOptions, this.formAlignRight.riskRating).substring(2) : ''
      },
      auditStatus: function () {
        return TOOL.valueToLabel(this.auditStatusOptions, this.formAlignRight.auditStatus)
      }
    }
  }
</script>
