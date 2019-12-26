<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="bankForm" label-width="160px" :rules="rules" ref="bankForm">
        <el-form-item label="银行名称：" prop="name">
          <el-input v-model="bankForm.name" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="银行代码：" prop="code">
          <el-input v-model="bankForm.code" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="单笔限额(分)：" prop="quotaSingle">
          <el-input v-model.number="bankForm.quotaSingle"></el-input>
        </el-form-item>
        <el-form-item label="单日限额(分)：" prop="quotaDaily">
          <el-input v-model.number="bankForm.quotaDaily"></el-input>
        </el-form-item>
        <el-form-item label="移动端图片:" prop="iconApp">
          <picUpload  :filename=bankForm.iconApp @childToFatherTransferEvent="fatherGetFileFromChildMobile"></picUpload>
        </el-form-item>
        <el-form-item label="PC图片:" prop="icon">
          <picUpload  :filename=bankForm.icon @childToFatherTransferEvent="fatherGetFileFromChildPc"></picUpload>
        </el-form-item>
        <el-form-item label="状态：" required>
          <el-radio class="radio m2" v-model="bankForm.status" label="1">启用</el-radio>
          <el-radio class="radio m2" v-model="bankForm.status" label="0">停用</el-radio>
        </el-form-item>
        <div style="padding:20px 0px 50px 0px; text-align:center">
          <el-button type="primary" @click="saveBank('bankForm')">保存</el-button>
          <el-button style="margin-left: 10px" size=""@click="resetForm('bankForm')">取消</el-button>
        </div>
      </el-form>
    </div>

    <!-- 对话框 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span >{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="stopStatusBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->
  </div>
</template>
<style lang="less" scoped>
  @import "editBank.less";
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import picUpload from '../../../comComponents/pic-upload-simple.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'
  export default {
    data () {
      return {
        breadcrumName: '',
        ActivityType: TOOLS.fetchObj('commonObj').AdvertiseChannelType,
        plate: TOOLS.fetchObj('commonObj').Platform,
        bankForm: {
          id: '',
          name: '',
          code: '',
          quotaSingle: '',
          quotaDaily: '',
          status: 0,
          iconApp: '',
          icon: ''
        },
        rules: {
          name: [
            { required: true, message: '银行名称不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '银行代码不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          quotaSingle: [
            {required: true, message: '单笔限额不能为空'},
            { type: 'number', min: 0, max: 1000000000000000, message: '请输入长度不超过15的正整数', trigger: 'blur' }
          ],
          quotaDaily: [
            {required: true, message: '单日限额不能为空'},
            { type: 'number', min: 0, max: 1000000000000000, message: '请输入长度不超过15的正整数', trigger: 'blur' }
          ],
          iconApp: [
            { required: true, message: '图片为必上传项', trigger: 'blur' }
          ],
          icon: [
            { required: true, message: '图片为必上传项', trigger: 'blur' }
          ]

        },
        productTypeOptions: TOOLS.fetchObj('commonObj').ProductType.reverse(),
        bankId: TOOLS.getProID(this.$route.params.bankId),
        dialogVisible: false,
        msg: '您确定 停用 此银行信息 '
      }
    },
    components: {
      breadcrumbNav,
      picUpload

    },

    mounted () {
      if (this.bankId != 0) {
        this.breadcrumName = '编辑'
        API.postRequest('/gateway/bank/get', {id: this.bankId}, res => {
          this.bankForm = res.data
          this.bankForm.status = this.bankForm.status.toString()
        })
      } else {
        this.breadcrumName = '新增'
      }
    },
    methods: {
      // 父组件从子组件获取文件转换方法-移动端
      fatherGetFileFromChildMobile (msg) {
        this.bankForm.iconApp = msg
      },
      // 父组件从子组件获取文件转换方法-pc端
      fatherGetFileFromChildPc (msg) {
        this.bankForm.icon = msg
      },
      // 处理入参调用接口
      ajax: function () {
        let obj = {
          id: this.bankForm.id,
          name: this.bankForm.name,
          code: this.bankForm.code,
          quotaSingle: this.bankForm.quotaSingle,
          quotaDaily: this.bankForm.quotaDaily,
          icon: this.bankForm.icon,
          iconApp: this.bankForm.iconApp,
          status: this.bankForm.status
        }
        API.$updateBank(obj, res => {
          if (res.success) {
            this.back()
          } else {
            alert(res.resultMsg)
          }
        })
      },
      // 状态为停用是二次提示
      stopStatusBtn () {
        this.ajax()
      },
      // 确认提交
      saveBank (bankForm) {
        this.$refs[bankForm].validate((valid) => {
          if (valid) {
            if (this.bankForm.status === '0') {
              this.dialogVisible = true
            } else {
              this.ajax()
            }
          } else {
            TOOLS.log('error submit!!')
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
