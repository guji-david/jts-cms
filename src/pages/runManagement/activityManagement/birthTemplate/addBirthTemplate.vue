<template>
  <div class="main">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form  :model="birthObj" label-width="160px"  :rules="rules" ref="birth">
        <el-collapse v-model="activeNames" style="width: 90%;">
          <el-collapse-item title="文案素材" name="1" style="margin-bottom: 10px;">
            <el-form-item label="活动标题：" prop="title">
              <el-input v-model="birthObj.title" ></el-input>
            </el-form-item>
            <el-form-item label="活动内容："  prop="content" >
              <el-input
                type="textarea"
                :rows="8"
                placeholder="请输入活动内容"
                v-model="birthObj.content">
              </el-input>
            </el-form-item>
            <el-form-item label="活动规则："  prop="rule" >
              <el-input
                type="textarea"
                :rows="8"
                placeholder="请输入活动规则"
                v-model="birthObj.rule">
              </el-input>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="图片素材" name="2" >
            <el-form-item label="PC背景:" prop="backgroundPc">
              <picUpload  :filename=birthObj.backgroundPc @childToFatherTransferEvent="fatherGetFileFromChildBPc"></picUpload>
            </el-form-item>

            <div style="margin-left: 78px">
              <label >PC奖品背景:</label>
              <el-form-item  label="红包背景:"prop="backgroundPcPrize" >
                <picUpload  :filename=birthObj.backgroundPcPrize @childToFatherTransferEvent="fatherGetFileFromChildBPcP"></picUpload>
              </el-form-item>
              <el-form-item label="加息券背景:"prop="backgroundPcCoupon" >
                <picUpload  :filename=birthObj.backgroundPcCoupon @childToFatherTransferEvent="fatherGetFileFromChildBPcPCoupon"></picUpload>
              </el-form-item>
            </div>

            <el-form-item label="移动端banner:"prop="appBanner" >
              <picUpload  :filename=birthObj.appBanner @childToFatherTransferEvent="fatherGetFileFromChildAppBanner"></picUpload>
            </el-form-item>
            <el-form-item label="移动端背景:" prop="backgroundApp">
              <picUpload  :filename=birthObj.backgroundApp @childToFatherTransferEvent="fatherGetFileFromChildAppB"></picUpload>
            </el-form-item>
            <el-form-item label="移动端按钮:" prop="buttonApp">
              <picUpload  :filename=birthObj.buttonApp @childToFatherTransferEvent="fatherGetFileFromChildAppButton"></picUpload>
            </el-form-item>
            <div style="margin-left: 55px">
              <label >移动端奖品背景:</label>
              <el-form-item label="红包背景:"prop="backgroundAppPrize" >
                <picUpload  :filename=birthObj.backgroundAppPrize @childToFatherTransferEvent="fatherGetFileFromChildAppBP"></picUpload>
              </el-form-item>
              <el-form-item label="加息券背景:"prop="backgroundAppCoupon" >
                <picUpload  :filename=birthObj.backgroundAppCoupon @childToFatherTransferEvent="fatherGetFileFromChildAppBPCoupon"></picUpload>
              </el-form-item>
            </div>


          </el-collapse-item>
        </el-collapse>

        <div  class="btnDiv">
          <el-row :gutter="20" type="flex" justify="center">
              <el-button type="primary"
                         @click="saveBirthObj('birth')"
                         :disabled="savebtnDisabled"
                         v-loading.fullscreen.lock="fullscreenLoading"
                          class="marR10"
              >确认</el-button>
            <el-button type="primary" @click="resetForm('birth')":plain="true" >取消</el-button>
          </el-row>
        </div>
      </el-form>
      <!-- 对话框 -->
      <el-dialog title="提示" v-model="dialogVisible" size="tiny">
        <span>{{msg}}</span>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog()">确 定</el-button>
      </span>
      </el-dialog>

    </div>
  </div>
</template>
<style lang="less" scoped>
  /*@import "addbirthInfo.less";*/
  .btnDiv{
    text-align: center;
    padding-bottom: 80px;
  }
  .marR10{
    margin-right: 10px;
  }
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import picUpload from '../../../comComponents/pic-upload-simple.vue'
  import * as TOOLS from '../../../../assets/js/tools'
  import * as API from '../../../../store/api'

  export default {
    data () {
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        activeNames: ['1', '2'],
        birthObj: {
          id: 0,
          title: '',
          content: '',
          rule: '',
          backgroundPc: '',
          backgroundPcCoupon: '',
          backgroundPcPrize: '',
          appBanner: '',
          backgroundApp: '',
          buttonApp: '',
          backgroundAppCoupon: '',
          backgroundAppPrize: ''

        },
        dialogVisible: false,
        msg: '',
        rules: {
          title: [
            { required: true, message: '活动标题不能为空', trigger: 'blur' },
            { min: 0, max: 100, message: '长度必须在100个字符以内', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '活动内容不能为空', trigger: 'blur' },
            { min: 0, max: 1000, message: '长度必须在1000个字符以内', trigger: 'blur' }
          ],
          rule: [
            { required: true, message: '活动规则不能为空', trigger: 'blur' },
            { min: 0, max: 1000, message: '长度必须在1000个字符以内', trigger: 'blur' }
          ],
          backgroundPc: [
            { required: true, message: 'PC背景不能为空', trigger: 'blur' }
          ],
          backgroundPcPrize: [
            { required: true, message: 'PC奖品红包背景不能为空', trigger: 'blur' }
          ],
          backgroundPcCoupon: [
            { required: true, message: 'PC奖品加息券背景不能为空', trigger: 'blur' }
          ],
          appBanner: [
            { required: true, message: '移动端banner不能为空', trigger: 'blur' }
          ],
          backgroundApp: [
            { required: true, message: '移动端背景不能为空', trigger: 'blur' }
          ],
          buttonApp: [
            { required: true, message: '移动端按钮不能为空', trigger: 'blur' }
          ],
          backgroundAppPrize: [
            { required: true, message: '移动端奖品红包背景不能为空', trigger: 'blur' }
          ],
          backgroundAppCoupon: [
            { required: true, message: '移动端奖品加息券背景不能为空', trigger: 'blur' }
          ]
        }

      }
    },
    components: {
      breadcrumbNav,
      picUpload
    },

    mounted () {
      API.$bizBirthdayQuery(res => {
        if (res.success) {
          if (res.data) {
            this.birthObj = res.data
            this.birthObj.id = TOOLS.getProID(this.birthObj.id)
          }
        } else {
          this.popDialog(res.resultMsg)
        }
      })
    },
    methods: {

      // 父组件从子组件获取文件转换方法-PC背景
      fatherGetFileFromChildBPc (msg) {
        this.birthObj.backgroundPc = msg
      },
      // 父组件从子组件获取文件转换方法-PC奖品背景加息券
      fatherGetFileFromChildBPcPCoupon (msg) {
        this.birthObj.backgroundPcCoupon = msg
      },
      // 父组件从子组件获取文件转换方法-PC奖品背景
      fatherGetFileFromChildBPcP (msg) {
        this.birthObj.backgroundPcPrize = msg
      },
      // 父组件从子组件获取文件转换方法-移动端banner
      fatherGetFileFromChildAppBanner (msg) {
        this.birthObj.appBanner = msg
      },
      // 父组件从子组件获取文件转换方法-移动端背景
      fatherGetFileFromChildAppB (msg) {
        this.birthObj.backgroundApp = msg
      },
      // 父组件从子组件获取文件转换方法-移动端按钮
      fatherGetFileFromChildAppButton (msg) {
        this.birthObj.buttonApp = msg
      },
      // 父组件从子组件获取文件转换方法-移动端奖品红包背景
      fatherGetFileFromChildAppBP (msg) {
        this.birthObj.backgroundAppPrize = msg
      },
      // 父组件从子组件获取文件转换方法-移动端奖品加息券背景
      fatherGetFileFromChildAppBPCoupon (msg) {
        this.birthObj.backgroundAppCoupon = msg
      },
      popDialog (msg) {
        this.msg = msg
        this.dialogVisible = true
      },
      // 关闭对话框
      closeDialog (msg) {
        this.dialogVisible = false
        this.savebtnDisabled = false
      },
      // 确认提交
      saveBirthObj (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.activeNames = ['1', '2']
            return false
          } else {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            if (this.birthObj.id != 0) {
              API.$bizBirthdayUpdateById(this.birthObj, res => {
                this.fullscreenLoading = false
                if (res.success) {
                  this.popDialog('模板修改成功!!!')
                } else {
                  this.popDialog(res.resultMsg)
                }
              })
            } else {
              API.$bizBirthdayInsert(this.birthObj, res => {
                this.fullscreenLoading = false
                if (res.success) {
                  this.popDialog('模板上传成功!!!')
                } else {
                  this.popDialog(res.resultMsg)
                }
              })
            }
          }
        })
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      //        this.back();
      },
      // 返回
      back () {
        this.$router.go(-1)
      }

    }

  }
</script>
