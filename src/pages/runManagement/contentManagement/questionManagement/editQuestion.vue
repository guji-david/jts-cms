<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="questionForm" label-width="160px" :rules="rules" ref="questionForm">
        <el-form-item label="标题：" prop="topic">
          <el-input v-model="questionForm.topic"></el-input>
        </el-form-item>
        <el-form-item label="分类名称：" prop="problemCategoryId">
          <el-select  v-model="questionForm.problemCategoryId">
            <el-option v-for="x in lists" :value="x.id" :label="x.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="顺序：" prop="seqnum">
          <el-input v-model.number="questionForm.seqnum" type="number"></el-input>
        </el-form-item>
        <el-form-item label="问题答案："required>
         <!-- <el-input  type="textarea" :rows="3" v-model="questionForm.answer"></el-input>-->
          <div class="edit-area" >
            <editor :content='answer' :path="path" v-on:input="fatherGetDataFromChild"></editor>
            <small style="color: #ff4949" v-show="editErrorMsgVisable">问题答案不能为空</small>
          </div>
        </el-form-item>
        <el-form-item label="热门问题:" prop="isHot">
          <el-radio class="radio m2" v-model="questionForm.isHot" label="true">是</el-radio>
          <el-radio class="radio m2" v-model="questionForm.isHot" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="热门顺序："
                      prop="hotSequence">
          <el-input v-model="questionForm.hotSequence"></el-input>
        </el-form-item>
        <el-form-item label="发布状态:" prop="publishStatus">
            <el-radio class="radio m2" v-model="questionForm.publishStatus" label="noUse">暂不发布</el-radio>
            <el-radio class="radio m2" v-model="questionForm.publishStatus" label="isUse">发布</el-radio>
        </el-form-item>
        <div style="padding:20px 0px 50px 0px; text-align:center">
          <el-button type="primary" @click="saveRedpacket('questionForm')">保存</el-button>
          <el-button style="margin-left: 10px" size=""@click="resetForm('questionForm')">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editQuestion.less";
</style>
<script>
  import editor from '../../../../components/editor/editor.vue'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'
  export default {
    data () {
      return {

        answer: '', // output content from editor
        //        path:'http://127.0.0.1:8080/console/gateway/fileManage/upload',
        path: `${process.env.API_ROOT}/gateway/oss/signature`, // set image upload api url
        breadcrumName: '',
        editErrorMsgVisable: false,
        lists: '',
        statusList: {},
        status: TOOLS.fetchObj('commonObj').PublishStatus,
        ActivityType: TOOLS.fetchObj('commonObj').AdcertiseChannelType,
        plate: TOOLS.fetchObj('commonObj').Platform,
        questionForm: {
          answer: '',
          hotSequence: '',
          isHot: 'false',
          problemCategoryId: '',
          seqnum: '',
          topic: '',
          publishStatus: ''
        },
        rules: {
          topic: [
            { required: true, message: '标题不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          problemCategoryId: [
            { required: true, message: '分类名称不能为空', trigger: 'change' }
          ],
          publishStatus: [
            { required: true, message: '发布状态不能为空', trigger: 'change' }
          ],
          answer: [
            { required: true, message: '答案不能为空', trigger: 'change' }
          ],
          isHot: [
            { required: true, message: '热门问题不能为空', trigger: 'change' }
          ]
        //          seqnum: [
        //            { required: true,message: '顺序不能为空', trigger: 'blur' },
        //            { type:'number',min: 0, max: 500, message: '顺序最大五个字符', trigger: 'blur' }
        //          ]

        },
        productTypeOptions: TOOLS.fetchObj('commonObj').ProductType.reverse(),
        questionId: TOOLS.getProID(this.$route.params.questionId)
      }
    },
    components: {
      editor,
      breadcrumbNav

    },

    mounted () {
      if (this.questionId != 0) {
        this.breadcrumName = '编辑'
        API.postRequest('/gateway/bizProblem/getWebsiteProblem', {id: this.questionId}, res => {
          this.questionForm = res.data
          this.answer = res.data.answer
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
        this.questionForm.picUrlPc = msg
      },
      //      监听编辑组件
      fatherGetDataFromChild (data) {
        this.questionForm.answer = data
        this.editErrorMsgVisable = this.questionForm.answer == ''
      },
      classList () {
        API.$questionClassList(res => {
          this.lists = res.data.lists
        })
      },
      // 确认提交
      saveRedpacket (questionForm) {
        this.$refs[questionForm].validate((valid) => {
          if (!this.questionForm.answer) {
            this.editErrorMsgVisable = true
            return
          }
          if (valid) {
            if (this.questionId == 0) {
              API.$addQuestion(this.questionForm, res => {
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              this.questionForm.id = this.questionId
              API.$updateQuestion(this.questionForm, res => {
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
