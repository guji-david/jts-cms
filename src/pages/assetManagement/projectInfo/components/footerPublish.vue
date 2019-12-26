<template>
  <div>
    <el-form-item>
    <el-row type="flex" justify="space-around">
      <el-radio class="radio m2" v-model="radio" label="0" @click="disable('true')">立即发布</el-radio>
      <el-radio class="radio m2" v-model="radio" label="1" @click="disable('false')">定时发布</el-radio>
      <el-col :span="12" >
        <div v-if="radio!=0">
          <el-date-picker
            v-model="myPublishTime"
            type="datetime"
            placeholder="选择日期时间"
            align="right"
            :picker-options="pickerOptions">
          </el-date-picker>
        </div>

      </el-col>
    </el-row>
    </el-form-item>
    <el-form-item label="">
      <el-row :gutter="20">
        <el-button type="primary" size="large" class='btn' @click="saveData" :disabled="disabledStatus" v-loading.fullscreen.lock="loadingFull">保存</el-button>
        <el-button :plain="true" type="danger" size="large" @click="backPage" class="btn">取消</el-button>
      </el-row>
    </el-form-item>
  </div>
</template>
<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default{
    props: ['routerId', 'publishTime', 'publishStatus'],
    data () {
      return {
        radio: '0',
        pickerOptions: {},
        myPublishTime: '',
        dis: true,
        id: this.routerId,
        num: 0,
        disabledStatus: false, // 保存按钮禁用
        loadingFull: false// loading
      }
    },

    watch: {
      publishTime (val) {
        this.myPublishTime = val
      },
      publishStatus (val) {
        val === 'Timer' ? this.radio = '1' : this.radio = '0'
      }

    },

    methods: {
      disable (e) {
        this.dis = e
      },
      saveData () {
        let obj = {}
        if (this.radio === '1') {
          obj = {'id': this.id, 'publishTime': this.myPublishTime.getTime()}
        } else {
          obj = {'id': this.id}
        }
        this.disabledStatus = true// 保存按钮禁用
        this.loadingFull = true// 全屏loading
        API.$Publish(obj, res => {
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
