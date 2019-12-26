<template>
      <el-form :model="formAlignRight" label-width="220px">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="募集信息" name="1">
            <el-form-item label="募集本金(元)：">
              {{tradePrincipral}}
            </el-form-item>
            <el-form-item label="红包金额(元)：">
              {{redPakageMonetary}}
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
        <el-collapse v-model="activeNames">
          <el-collapse-item title="解冻信息" name="2">
            <el-form-item label="解冻金额(元)：">
              {{unfreezeMonetary}}
            </el-form-item>
            <el-form-item label="解冻日期：">
              {{unfreezeTime}}
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
      tradePrincipral: function () { // 募集本金
        return TOOL.fenToYuan(this.formAlignRight.tradePrincipral)
      },
      redPakageMonetary: function () { // 红包金额
        return TOOL.fenToYuan(this.formAlignRight.redPakageMonetary)
      },
      unfreezeMonetary: function () { // 解冻金额
        return TOOL.fenToYuan(this.formAlignRight.unfreezeMonetary)
      },
      unfreezeTime: function () { // 解冻日期
        return TOOL.normalTime(this.formAlignRight.unfreezeTime)
      }
    }
  }
</script>
