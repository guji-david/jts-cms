<template>
    <!--publishbox-->
      <el-form :model="formAlignRight" label-width="220px">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="发布信息" name="1">
            <el-form-item label="备案时间：">
              {{onRecordTime}}
            </el-form-item>
            <el-form-item label="发布时间：">
              {{publishTime}}
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
        activeNames: ['1']
      }
    },
    computed: {
      onRecordTime: function () {
        return TOOL.normalTime(this.formAlignRight.onRecordTime)
      },
      publishTime: function () {
        return TOOL.normalTime(this.formAlignRight.publishTime)
      }
    }
  }
</script>
