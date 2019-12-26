<template>
  <div  class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <div class="pointForm">
      <el-form  :model="pointForm" label-width="160px" :rules="rules" ref="pointForm">
        <el-form-item label="导入用户：" prop="base64">
          <el-col :span="8" >
            <el-input type="text" :disabled="true"placeholder="请上传后缀名为.csv的文件 谢谢!" v-model="filename"></el-input>
          </el-col>
          <el-col :span="3" :push="2">
            <fileUpload :isValid="isValid"@childToFatherTransferEvent="fatherGetFileFromChild"></fileUpload>
          </el-col>
          <el-col :span="3" :push="2" >
            <div class="posBtn1">
              <i class="el-icon-document"></i>
              <span>下载模板</span>
              <div  id="upload1" accept="image" @click="downModel()" alt="" >
              </div>
            </div>
           <!-- <el-button type="default" icon="document" @click="downModel" >下载模板
            </el-button>-->
          </el-col>
        </el-form-item>
        <el-form-item label="发放原因：" prop="sendReason">
          <el-col :span="15">
            <el-input v-model.trim="pointForm.sendReason"></el-input>
          </el-col>


        </el-form-item>
        <div style="padding:20px 0px 50px 0px; text-align:center;">
          <span style="margin-right: 15px">
            <el-button type="primary" @click="savePoint('pointForm')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
            >确认</el-button>
          </span>
          <span style="margin-left: 15px"> <el-button type="primary" @click="resetForm('pointForm')":plain="true" >取消</el-button></span>

        </div>
      </el-form>
    </div>

    <el-dialog title="提示" v-model="errorVisible" size="tiny">
      <span style="color:#ff4949">{{errMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="errorVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import fileUpload from '../../../comComponents/file-upload-simple.vue'

  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        isValid: false,
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        pointId: 0,
        pointForm: {
          base64: '',
          sendReason: ''
        },

        rules: {
          base64: [
            { required: true, message: '导入用户不能为空', trigger: 'blur' }
          ],
          sendReason: [
            { required: true, message: '发放原因不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ]

        },
        filename: '', // 文件内容-filename 相对路径
        errorVisible: false,
        errMsg: '',
        path: '/template/point_template.csv'// 下载模板链接
      }
    },
    components: {
      breadcrumbNav,
      fileUpload
    },
    mounted () {
      this.breadcrumName = '新增'
    },
    methods: {
      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) {
        this.filename = msg[0]
        this.pointForm.base64 = msg[1]
      },
      // 确认提交
      savePoint (formName) {
        this.isValid = false
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            API.$pointSendPointByCsv(this.pointForm.base64, this.pointForm.sendReason, res => {
              this.savebtnDisabled = false
              this.fullscreenLoading = false
              if (res.success) {
                this.back()
              } else {
                this.isValid = true
                this.errorVisible = true
                this.errMsg = res.resultMsg
              }
            })
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
      },
      //      下载模版
      downModel () {
        location.replace(TOOLS.getDomain() + this.path)
      }
    }
  }
</script>
<style scoped lang="less">
  .pointForm{
    margin: 50px;
    .el-select{
      width: 80%;
    }
    .posBtn1{
      background: #fff;
      border: 1px solid #bfcbd9;
      color: #1f2d3d;
      border-radius: 4px;
      text-align: center;
      width: 96px;
      line-height: 30px;
      cursor:pointer ;
      .posBtn1>span{
        position: relative;
        overflow: hidden;
      }
      #upload1{
        position: absolute;
        font-size: 0;
        left: 0;
        top: 0;
        opacity: 0;
        width: 400%;
        height: 400%;
        cursor: pointer;
        border: none;
        transform: scale(.2) translate(-200%, -190%);
      }

    }
    .posBtn1:hover{
      background: #fff;
      border-color: #50bfff;
      color: #50bfff
      /*color: ;*/
    }
  }
</style>
