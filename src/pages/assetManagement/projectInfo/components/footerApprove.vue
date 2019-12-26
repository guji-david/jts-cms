<template>
  <div>
    <el-form-item label="审核结果：">
      <el-radio class="radio m2" v-model="approvalData.status" label="success">是</el-radio>
      <el-radio class="radio m2" v-model="approvalData.status" label="refuse">否</el-radio>
    </el-form-item>
    <el-form-item label="审核意见：">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="approvalData.processDesc">
      </el-input>
    </el-form-item>
    <el-row :gutter="20">
      <el-form-item label="">
        <el-button type="primary" size="large" class="btn" @click="saveData" :disabled="disabledStatus" v-loading.fullscreen.lock="loadingFull">保存</el-button>
        <el-button :plain="true" type="danger" size="large" @click="backPage" class="btn">取消</el-button>
      </el-form-item>
    </el-row>
  </div>
</template>
<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default{
    props: ['routerId'],
    data () {
      return {
        approvalData: {
          status: 'success',
          processDesc: '',
          id: this.routerId
        },
        disabledStatus: false, // 保存按钮禁用
        loadingFull: false// loading
      }
    },
    methods: {
      saveData () {
        this.disabledStatus = true// 保存按钮禁用
        this.loadingFull = true// 全屏loading
        console.log(this.approvalData)
        API.$Approve(this.approvalData, res => {
          this.disabledStatus = false// 保存按钮禁用
          this.loadingFull = false// 全屏loading
          console.log(res)
          if (res.success) {
            this.$router.go(-1)
          } else {
            TOOL.msgBox(this, res.resultMsg, false, true)
          }
        })
      },
      backPage () {
        this.$router.go(-1)
      }
    }
  }
</script>
