<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form  :model="androidObj" label-width="160px" :rules="rules" ref="androidObj">
        <el-form-item label="当前版本号：" prop="version">
          <el-input v-model="androidObj.version" @blur="versionKeyChange()"></el-input>
        </el-form-item>
        <el-form-item label="版本转换值：">
          <div>{{versionKey}}</div>
        </el-form-item>
        <el-form-item label="md5：" prop="md5">
          <el-input v-model="androidObj.md5"></el-input>
        </el-form-item>
        <el-form-item label="下载保存名称：" prop="downloadName">
          <el-input v-model="androidObj.downloadName"></el-input>
        </el-form-item>

        <el-form-item label="APK资源包：" prop="downloadUrl">
          <fileUpload
            :fileUrl=androidObj.downloadUrl
            :fileName=androidObj.downloadName
            :tips=tips
            @childToFatherTransferEvent="fatherGetFileFromChild"></fileUpload>
        </el-form-item>
        <el-form-item label="文件大小(M)：" prop="fileSize">
          <el-input v-model="androidObj.fileSize"></el-input>
        </el-form-item>



        <el-form-item label="当前版本描述：" prop="content">
          <el-input
            type="textarea"
            :rows="8"
            placeholder="当前版本描述"
            v-model="androidObj.content">
          </el-input>
        </el-form-item>
        <el-form-item label="是否强制升级：" prop="isUpdate">
          <el-radio class="radio m2" v-model="androidObj.isUpdate" label="true">是</el-radio>
          <el-radio class="radio m2" v-model="androidObj.isUpdate" label="false">否</el-radio>
        </el-form-item>


        <div class="btnDiv">

            <el-button type="primary"
                       @click="saveForm('androidObj')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       class="marR10"
            >确认</el-button>
          <el-button type="primary" @click="resetForm('androidObj')":plain="true" >取消</el-button>

        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editAndroid.less";
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import fileUpload from '../../../comComponents/file-upload.vue'
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
      var versionFileSize = (rule, value, callback) => {
        setTimeout(() => {
          if (!TOOLS.checkNumAndDecimal(value)) {
            callback(new Error('请输入合法的数值（包含小数）'))
          } else {
            callback()
          }
        }, 100)
      }
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        tips: '请上传后缀名为.apk的文件,谢谢!',
        breadcrumName: '',
        versionKey:'',
        downloadUrl: '',
//        versionKey: '', // 版本转换值
        androidObj: {
          version: '', // 当前版本号 ,
          downloadUrl: '', // APK资源包 ,
          fileSize: '', // 文件大小(M) ,
          downloadName: '', // 下载保存名称 ,
          md5: '', // md5 ,
          content: '', // 当前版本描述 ,
          isUpdate: 'false', // 是否强制升级true/false ,
        },
        rules: {
          version: [
            { required: true, validator: versionRule, trigger: 'blur' }
          ],
          downloadUrl: [
            { required: true, message: 'APK资源包不能为空', trigger: 'blur,change' }
          ], // APK资源包 ,
          fileSize: [
            { required: true, validator:versionFileSize, trigger: 'blur' }
          ],
          downloadName: [
            { required: true, min: 0, max: 20, message: '长度必须在20个字符以内', trigger: 'blur' }
          ],
          md5: [
            { required: true, message: 'md5值不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, min: 0, max: 500, message: '长度必须在500个字符以内', trigger: 'blur' }
          ],
          isUpdate: [
            {required: true}
          ],


        },
      }
    },
    components: {
      breadcrumbNav,
      fileUpload
    },

    mounted () {
      this.breadcrumName = '新增'
    },
    computed: {
//      versionKey: function () {
//
//        console.log(versionsList)
//        return versionsList[0]*10000+versionsList[1]*100+versionsList[2];
//      }
    },
    methods: {
      versionKeyChange(){
        this.$refs.androidObj.validateField('version', (valid) => {
          if (!valid) {
            let versionsList=this.androidObj.version.split("\.");
            this.versionKey=versionsList[0]*10000+versionsList[1]*100+versionsList[2]*1
          } else {
            this.versionKey='';
            return false
          }
        })

      },
      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) {
        this.androidObj.downloadUrl = msg
        TOOLS.log('msg', msg)
        TOOLS.log('this.androidObj.downloadUrl', this.androidObj.downloadUrl)
      },
      // 确认提交
      saveForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            API.$androidAdd(this.androidObj, res => {
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
