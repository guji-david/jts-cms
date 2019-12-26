<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <div id="z-edit">
      <el-form :model="form" label-width="250px" :rules="rules" ref="form">
        <el-form-item label="推荐人：" prop="inviterUserMobile">
          <el-input v-model="form.inviterUserMobile" type="tel"></el-input>
        </el-form-item>
        <el-form-item label="被推荐人：" prop="beInviterMobile">
          <el-input v-model="form.beInviterMobile" type="tel"></el-input>
        </el-form-item>
        <el-form-item label="建立好友关系方式：" prop="channel">
          <el-select v-model="form.channel">
            <el-option v-for="x in recommendChannelOptions" :value="x.value" :label="x.label"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row :gutter="20" type="flex" justify="center">
        <el-button @click="saveChannel('form')" type="primary" v-loading.fullscreen.lock="loadingFull" :disabled="disabledStatus" class="marR15">确定</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-row>
    </div>
  </div>
</template>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  import * as TOOL from '../../../../assets/js/tools'
  import {$userRecommendAdd} from '../../../../store/api'

  export default {
    data () {
      var validatePhoneNum = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('额度不能为空'))
        }
        setTimeout(() => {
          if (!TOOL.checkTel(value)) {
            callback(new Error('请输入正确手机号'))
          } else {
            if (value.length > 11) {
              callback(new Error('您输入的长度不能超过10个字符'))
            } else {
              callback()
            }
          }
        }, 0)
      }
      return {
        breadcrumName: '',
        form: {
          beInviterMobile: '', // 被推荐人手机号
          channel: '', // 推荐方式
          inviterUserMobile: ''// 推荐人手机号
        },
        recommendChannelOptions: [],
        rules: {
          beInviterMobile: [
            { required: true, validator: validatePhoneNum, trigger: 'blur' }
          ],
          inviterUserMobile: [
            { required: true, validator: validatePhoneNum, trigger: 'blur' }
          ],
          channel: [
            {required: true, message: '需要选一项', trigger: 'blur,change'}
          ]
        },
        disabledStatus: false, // 保存按钮禁用
        loadingFull: false// loading
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      let recommendChannelOptionsList = TOOL.fetchObj('commonObj').RecommendChannel
      recommendChannelOptionsList.splice(0, 1)
      this.recommendChannelOptions = recommendChannelOptionsList
    },
    methods: {
      // 确认提交
      saveChannel (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.disabledStatus = true// 保存按钮禁用
            this.loadingFull = true// 全屏loading
            $userRecommendAdd(this.form, res => {
              this.disabledStatus = false// 保存按钮禁用
              this.loadingFull = false// 全屏loading
              if (res.success) {
                TOOL.alertConfirm(this, () => {
                  this.$router.go(-1)
                }, '新增成功,是否返回上一页')
              } else {
                TOOL.alertConfirm(this, '', res.resultMsg)
              }
            })
          }
        })
      },
      // 返回
      goBack () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped="scoped" lang="less">
  #z-edit{
    form{
      &>*{
        /*padding: 3% 0;*/
      }
    }
  }
  .row{
    /*margin-top: 15%;*/
    padding:0 30%
  }
  .marR15{
    margin-right: 15px;
  }
</style>
