<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form  :model="addMoneyObj" label-width="160px" :rules="rules" ref="addMoneyObj">
        <el-form-item label="加款账户：" >
          <span v-text="typeName"></span>
        </el-form-item>
        <el-form-item label="加款金额(元)：" prop="amount">
          <el-input v-model="addMoneyObj.amount"></el-input>
        </el-form-item>
        <el-form-item label="银行流水号" prop="bankSerialNo">
          <el-input v-model="addMoneyObj.bankSerialNo"></el-input>
        </el-form-item>
        <el-form-item label="交易凭证：" required>
          <picUpload  :filename=addMoneyObj.imgUrl @childToFatherTransferEvent="fatherGetFileFromChildPicUr"></picUpload>
          <small style="color: #ff4949" v-show="redFontsVisable">交易凭证不能为空</small>
        </el-form-item>

        <div>
          <el-row :gutter="20" type="flex" justify="center">
            <el-button type="primary" @click="saveMoney('addMoneyObj')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       class="marR10"
            >确认</el-button>
            <el-button type="primary" @click="resetForm('addMoneyObj')":plain="true" >取消</el-button>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
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
        addMoneyObj: {
          amount: '',
          bankSerialNo: '',
          imgUrl: ''
        },
        rules: {
          amount: [
            { required: true, message: '加款金额不能为空', trigger: 'blur' }
          ],
          bankSerialNo: [
            { required: true, message: '银行流水号不能为空', trigger: 'blur' }
          ]

        },
        type: TOOLS.getProType(this.$route.params.type),
        typeName: '自有资金账户',
        redFontsVisable: false
      }
    },
    components: {
      breadcrumbNav,
      picUpload
    },

    mounted () {
      this.breadcrumName = '手动加款'
      if (this.type === 2) {
        this.typeName = '红利账户'
      } else {
        this.typeName = '自有资金账户'
      }
    },
    methods: {
      // 父组件从子组件获取文件转换方法-pc
      fatherGetFileFromChildPicUr (msg) {
        this.addMoneyObj.imgUrl = msg
        this.redFontsVisable = this.addMoneyObj.imgUrl == ''
      },
      // 确认提交
      saveMoney (formName) {
        this.$refs[formName].validate((valid) => {
          if (!this.addMoneyObj.imgUrl) {
            this.redFontsVisable = true
            return
          }
          if (!valid) {
            return false
          } else {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            this.addMoneyObj.amount = TOOLS.yuanToFen(this.addMoneyObj.amount)
            API.$rechargeForSelfAccount(this.type,
              this.addMoneyObj.amount,
              this.addMoneyObj.bankSerialNo,
              this.addMoneyObj.imgUrl, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success == true) {
                  this.back()
                } else {
                  alert(res.resultMsg)
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
      }

    }

  }
</script>
