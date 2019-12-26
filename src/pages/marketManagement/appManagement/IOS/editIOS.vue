<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form  :model="iosObj" label-width="160px" :rules="rules" ref="iosObj">
        <el-form-item label="当前版本号：" prop="version">
          <el-input v-model="iosObj.version"></el-input>
        </el-form-item>
        <el-form-item label="版本更新内容：" prop="content">
          <el-input
            type="textarea"
            :rows="8"
            placeholder="当前版本描述"
            v-model="iosObj.content">
          </el-input>
        </el-form-item>
        <el-form-item label="是否强制升级：" prop="isUpdate">
          <el-radio class="radio m2" v-model="iosObj.isUpdate" label="true">是</el-radio>
          <el-radio class="radio m2" v-model="iosObj.isUpdate" label="false">否</el-radio>
        </el-form-item>
        <!--<el-form-item label="强制升级版本：" prop="updateVersion">-->
          <!--<el-input v-model="iosObj.updateVersion"></el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item label="最后修改时间：" prop="updateTime">-->
          <!--<el-date-picker-->
            <!--v-model="iosObj.updateTime"-->
            <!--type="datetime"-->
            <!--placeholder="选择日期"-->
          <!--&gt;-->
          <!--</el-date-picker>-->
        <!--</el-form-item>-->

        <div class="btnDiv">
            <el-button type="primary"
                       @click="saveForm('iosObj')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       class="marR10"
            >确认</el-button>
          <el-button type="primary" @click="resetForm('iosObj')":plain="true" >取消</el-button>

        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editIOS.less";
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
//  import fileUpload from '../../../comComponents/file-upload.vue'
  import * as TOOLS from '../../../../assets/js/tools'
  import * as API from '../../../../store/api'
  export default {
    data () {
      var versionRule = (rule, value, callback) => {
        setTimeout(() => {
          if (!TOOLS.checkVersion(value)) {
            callback(new Error('请输入正常的版本号 例：4.4.4'))
          } else {
            callback()
          }
        }, 100)
      }
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        iosObj: {
          version: '', // 当前版本号 ,
          content: '', // 当前版本描述 ,
          isUpdate: 'false', // 是否强制升级true/false ,
        },
        rules: {
          version: [
            { required: true, validator: versionRule, trigger: 'blur' }
          ],
          content: [
            { required: true, min: 0, max: 500, message: '长度必须在500个字符以内', trigger: 'blur' }
          ],
          isUpdate: [
            {required: true}
          ]
        },
      }
    },
    components: {
      breadcrumbNav,
    },

    mounted () {
      this.breadcrumName = '新增'

    },
    methods: {
      // 确认提交
      saveForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            API.$iosAdd(this.iosObj, res => {
              this.savebtnDisabled = false
              this.fullscreenLoading = false
              if (res.success) {
                this.back()
              } else {
                alert(res.resultMsg)
              }
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.back()
      },
      // 返回
      back () {
        this.$router.go(-1)
      }

    }

  }
</script>
