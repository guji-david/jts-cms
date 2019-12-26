<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="adForm" label-width="160px" :rules="rules" ref="adForm">
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="adForm.name"></el-input>
        </el-form-item>
        <!--<el-form-item label="父类：" prop="parentId">-->
          <!--<el-select  v-model="adForm.parentId">-->
            <!--<el-option v-for="x in lists" :value="x.id" :label="x.name"></el-option>-->
          <!--</el-select>-->
        <!--</el-form-item>-->
        <el-form-item label="分类顺序：" prop="seqnum">
          <el-input v-model.number="adForm.seqnum"></el-input>
        </el-form-item>
        <el-form-item label="分类图标：" prop="picUrl">
          <picUpload  :filename=adForm.picUrl @childToFatherTransferEvent="fatherGetFileFromChild"></picUpload>
        </el-form-item>
        <el-form-item label="hover图标：" prop="picMouseUrl">
          <picUpload  :filename=adForm.picMouseUrl @childToFatherTransferEvent="fatherGetFileFromChild1"></picUpload>
        </el-form-item>
        <el-form-item label="描述：" prop="description">
          <el-input type="textarea" :rows="3" v-model="adForm.description"></el-input>
        </el-form-item>
        <div style="padding:20px 0px 50px 0px; text-align:center">
          <el-button type="primary" @click="saveRedpacket('adForm')">保存</el-button>
          <el-button style="margin-left: 10px" size=""@click="resetForm('adForm')">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editQuestion.less";
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
        lists: '',
        status: TOOLS.fetchObj('commonObj').StatusType,
        ActivityType: TOOLS.fetchObj('commonObj').AdcertiseChannelType,
        plate: TOOLS.fetchObj('commonObj').Platform,
        adForm: {
          description: '',
          seqnum: '',
          name: '',
          picUrl: '',
          picMouseUrl: ''
        },
        rules: {
          name: [
            { required: true, message: '分类名称不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '分类名称长度必须在50个字符以内', trigger: 'blur' }
          ],
          seqnum: [
            { required: true, type: 'number', message: '分类顺序不能为空且为数字', trigger: 'blur' }
          //            {  min: 0, max: 50, type: 'number',message: '分类顺序为数字且最大50个字符', trigger: 'blur' }
          ],
          picUrl: [
            { required: true, message: '分类图标为必填', trigger: 'change' }
          ],
          picMouseUrl: [
            { required: true, message: 'hover的图标为必填', trigger: 'change' }
          ]
        },
        questionClassId: TOOLS.getProID(this.$route.params.questionClassId)

      }
    },
    components: {
      breadcrumbNav,
      picUpload
    },

    mounted () {
      if (this.questionClassId != 0) {
        this.breadcrumName = '编辑'
        API.postRequest('/gateway/bizProblem/getWebsiteProblemCategory', {id: this.questionClassId}, res => {
          console.log(res.data)
          this.adForm = res.data
          this.adForm.parentId = res.data.id
          this.lists = res.data.lists
        })
      } else {
        this.breadcrumName = '新增'
        this.classList()
      }
    },
    methods: {
      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) {
        this.adForm.picUrl = msg
        this.$refs.adForm.validateField('picUrl', (valid) => {
          if (valid) {

          } else {
            TOOLS.log('error submit!!')
            return false
          }
        })
      },
      fatherGetFileFromChild1 (msg) {
        this.adForm.picMouseUrl = msg
        this.$refs.adForm.validateField('picMouseUrl', (valid) => {
          if (valid) {

          } else {
            TOOLS.log('error submit!!')
            return false
          }
        })
      },

      classList () {
        API.$questionClassList(res => {
          this.lists = res.data.lists
          console.log(res)
        })
      },
      // 确认提交
      saveRedpacket (adForm) {
        this.$refs[adForm].validate((valid) => {
          if (valid) {
            console.log(this.questionClassId)
            if (this.questionClassId == 0) {
              API.$addQuestionClass(this.adForm, res => {
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              this.adForm.id = this.questionClassId
              API.$updateQuestionClass(this.adForm, res => {
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
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
