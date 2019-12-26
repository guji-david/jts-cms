<template>
  <div  class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <h2>渠道信息</h2>
    <hr>
    <div class="pointForm">
      <el-form  :model="pointForm" label-width="160px" :rules="rules" ref="pointForm">
          <el-form-item label="合作方式：" prop="workType">
            <el-select name="type"v-model="pointForm.workType">
              <el-option v-for="(x,index) in workTypeOptions" :value="x.value" :label="x.label"v-if="index>0" ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="渠道结算方式：" prop="balanceType">
            <el-select name="type"v-model="pointForm.balanceType">
              <el-option v-for="(x,index) in balanceTypeOptions" :value="x.value" :label="x.label" v-if="index>0"></el-option>
            </el-select>
          </el-form-item>
        <div class="btnDiv">
          <el-row :gutter="20" type="flex" justify="center">
            <el-button type="primary" @click="savePoint('pointForm')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       class="marR10"
            >确认</el-button>
            <el-button type="primary" @click="resetForm('pointForm')":plain="true" >取消</el-button>
          </el-row>
        </div>
      </el-form>
    </div>

  </div>
</template>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        workTypeOptions: TOOLS.fetchObj('commonObj').WorkType, // 合作方式
        balanceTypeOptions: TOOLS.fetchObj('commonObj').BalanceType, // 结算方式
        pointForm: {
          pointId: 0,
          outType: 10,
          workType: '',
          balanceType: ''
        },

        rules: {
          workType: [
            { required: true, message: '合作方式不能为空', trigger: 'blur' }
          ],
          balanceType: [
            { required: true, message: '渠道结算方式不能为空', trigger: 'blur' }
          ]

        }
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      if (this.$route.params.pointObj) {
        this.breadcrumName = '编辑'
        TOOLS.saveObj('pointObj', this.$route.params.pointObj)
        this.pointForm = TOOLS.fetchObj('pointObj')
      } else {
        this.breadcrumName = '新增'
        this.pointForm = {
          pointId: 0,
          outType: 10,
          workType: '',
          balanceType: ''
        }
      }
    },
    methods: {
      // 确认提交
      savePoint (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            if (this.pointForm.pointId == 0) {
              API.$pointChannelConfigInsert(this.pointForm, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              API.$pointChannelConfigEdit(this.pointForm, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            }
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
<style scoped lang="less">
  .pointForm{
    margin: 50px;
    .el-select{
      width: 80%;
    }
  }
  .btnDiv{
    padding-bottom: 80px;
  }
</style>
