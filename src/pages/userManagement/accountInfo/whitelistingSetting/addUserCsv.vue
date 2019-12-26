<template>
  <div  class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <div class="form">
      <el-form  :model="form" label-width="160px" :rules="rules" ref="form">
        <el-form-item label="文件名：" prop="filename">
          <el-col :span="8" >
            <span class="my-input-span">*</span>
            <el-input type="text"  placeholder="请上传后缀名为.csv的文件 谢谢!" v-model="form.filename" disabled ></el-input>
          </el-col>
          <el-col :span="3" :push="2">

            <fileUpload :isValid="isValid"@childToFatherTransferEvent="fatherGetFileFromChild"></fileUpload>

          </el-col>
          <el-col :span="3" :push="2" >
            <div class="posBtn1">
              <i class="el-icon-document"></i>
              <span>模板下载</span>
              <div  id="upload1" accept="image" @click="downModel()" alt="" >
              </div>
            </div>
            <!-- <el-button type="default" icon="document" @click="downModel" >下载模板
             </el-button>-->
          </el-col>
          <div class="errorMsg" v-if="errorMsgVisable">
            上传文件不能为空
          </div>
        </el-form-item>
        <el-form-item label="状态：" prop="status" >
          <el-radio class="radio m2" v-model="form.status" label="20">启用</el-radio>
          <el-radio class="radio m2" v-model="form.status" label="10">停用</el-radio>
        </el-form-item>
        <div style="padding:20px 0px 50px 0px; text-align:center;">
          <span style="margin-right: 15px">
            <el-button type="primary" @click="saveForm('form')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
            >确认</el-button>
          </span>
          <span > <el-button type="primary" @click="resetForm('form')":plain="true" >取消</el-button></span>

        </div>
      </el-form>
    </div>

    <el-dialog title="提示" v-model="errorVisible" size="tiny">
      <span v-if="isSuccess" class="red">{{errMsg}}</span>
      <span v-if="!isSuccess">{{errMsg}}</span>
      <!--<span slot="footer" class="dialog-footer" v-if="btnVisable">-->
        <!--<el-button type="primary" @click="errorVisible = false">确 定</el-button>-->
      <!--</span>-->
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
        isSuccess: false,
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '投标贷白名单 > 新增',
        pointId: 0,
        form: {
          filename: '',
          base64: '',
          status: '10'
        },
        rules: {
//          filename: [
//            { required: true, message: '文件名不能为空', trigger: 'change' }
//          ]

        },
//        filename: '', // 文件内容-filename 相对路径
        errorVisible: false,
        btnVisable: false,
        errMsg: '',
        errorMsgVisable: false,
        path: '/template/product_list.csv'// 下载模板链接
      }
    },
    components: {
      breadcrumbNav,
      fileUpload
    },
    mounted () {
    },
    methods: {
      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) {
        this.form.filename = msg[0]
        this.form.base64 = msg[1]
        this.errorMsgVisable = this.form.filename === ''
      },
      // 确认提交
      saveForm (formName) {
        this.isValid = false
        this.errorMsgVisable = false
        if (!!this.form.filename) {
          this.savebtnDisabled = true
          this.fullscreenLoading = true
          API.$importByCsv(this.form.base64, this.form.status, res => {
            this.savebtnDisabled = false
            this.fullscreenLoading = false
            this.errorVisible = true
            if (res.success) {
              this.btnVisable = false
              this.isSuccess = false
              this.errMsg = '保存成功!'
            } else {
              this.isSuccess = true
              this.isValid = true
              this.errMsg = res.resultMsg
            }
            setTimeout(() => {
              this.form.filename = ''
              this.isValid = true
              this.errorVisible = false
            }, 1000)
          })
        } else {
          this.errorMsgVisable = true
          return false
        }
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
  .form{
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
  .red{
    color:#ff4949
  }
  .my-input-span{
    position: absolute;
    left: -96px;
    top: 2px;
    color: #ff4949;
  }
  .errorMsg{
    position: absolute;
    top: 40px;
    font-size: 12px;
    color: #ff4949;
    line-height: 1;
    z-index: 10;
  }
</style>
