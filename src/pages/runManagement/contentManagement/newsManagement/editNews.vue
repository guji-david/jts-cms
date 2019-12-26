<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="newsForm" label-width="160px" :rules="rules" ref="newsForm">
        <el-form-item label="类别:" prop="types">
          <el-radio-group v-model="newsForm.types" style="width: 80%;float:left">
            <el-radio v-for="item in newsTypeOptions":label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题：" prop="topic">
          <el-input v-model="newsForm.topic"></el-input>
        </el-form-item>
        <el-form-item label="关键词：" prop="keywords">
          <el-input v-model="newsForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="descriptions">
          <el-input type="textarea" :rows="3" v-model="newsForm.descriptions"></el-input>
        </el-form-item>
        <el-form-item label="内容摘要：" prop="brief">
          <el-input type="textarea" :rows="3" v-model="newsForm.brief"></el-input>
        </el-form-item>
        <el-form-item label="宣传图片:" required>
          <picUpload  :filename=newsForm.coverImgAlt @childToFatherTransferEvent="fatherGetFileFromChild"></picUpload>
          <small style="color: #ff4949" v-show="redFontsVisable">图片不能为空</small>
        </el-form-item>
        <el-form-item label="正文内容：" required>
          <div class="edit-area">
            <editor :content='content' :path="path" v-on:input="fatherGetDataFromChild"></editor>
          </div>
          <!--<small style="color: #ff4949" v-show="editErrorMsgVisable">正文内容不能为空</small>-->
        </el-form-item>
        <el-form-item label="作者：" prop="author">
          <el-input v-model="newsForm.author"></el-input>
        </el-form-item>
        <el-form-item label="资讯来源：" prop="source">
          <el-input v-model="newsForm.source"></el-input>
        </el-form-item>
        <el-form-item label="资讯来源Logo:" prop="sourceLogo">
          <picUpload  :filename=newsForm.sourceLogo @childToFatherTransferEvent="fatherGetFileFromChild2"></picUpload>
        </el-form-item>
        <el-form-item label="资讯来源Url：" prop="sourceUrl">
          <el-input  v-model="newsForm.sourceUrl"></el-input>
        </el-form-item>
        <el-form-item label="报道时间：" prop="reportDate">
          <el-date-picker
            v-model="newsForm.reportDate"
            type="datetime"
            placeholder="选择日期"
            >
          </el-date-picker>

        </el-form-item>
        <el-form-item label="发布状态:" prop="publishStatus">
          <el-radio class="radio m2" v-model="newsForm.publishStatus" label="noUse">暂不发布</el-radio>
          <el-radio class="radio m2" v-model="newsForm.publishStatus" label="isUse">发布</el-radio>
        </el-form-item>
        <div style="padding:20px 0px 50px 0px; text-align:center">
          <el-button type="primary" @click="saveRedpacket('newsForm')">保存</el-button>
          <el-button style="margin-left: 10px" size=""@click="resetForm('newsForm')">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editNews.less";
</style>
<script>
  import editor from '../../../../components/editor/editor.vue'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import picUpload from '../../../comComponents/pic-upload-simple.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'
  import {$addNews, $updateNews} from '../../../../store/api'

  export default {
    data () {
      var dateRule = (rule, value, callback) => {
        setTimeout(() => {
          if (!value) {
            callback(new Error('不能为空'))
          } else {
            callback()
          }
        }, 100)
      }
      return {
        content: '', // output content from editor
        //        path:'http://127.0.0.1:8080/console/gateway/fileManage/upload',
        path: `${process.env.API_ROOT}/gateway/oss/signature`, // set image upload api url
        breadcrumName: '',
        newsTypeOptions: TOOLS.getList('newsTypeOptions'),
        plate: TOOLS.fetchObj('commonObj').Platform,
        newsForm: {
          reportDate: '',
          content: '',
          source: '',
          sourceUrl: '',
          brief: '',
          descriptions: '',
          keywords: '',
          publishStatus: '',
          topic: '',
          sourceLogo: '',
          coverImgAlt: '',
          types: '',
          author: ''
        },
        redFontsVisable: false,
        editErrorMsgVisable: false,
        rules: {
          topic: [
            { required: true, message: '渠道名称不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          types: [
            { required: true, message: '类别不能为空', trigger: 'change' }
          ],
          keywords: [
            { required: true, message: '关键词不能为空', trigger: 'blur' }
          ],
          descriptions: [
            { required: true, message: '描述不能为空', trigger: 'blur' }
          ],
          brief: [
            { required: true, message: '摘要不能为空', trigger: 'blur' }
          ],
          content: [
          //            { required: true, message: '正文不能为空', trigger: 'blur' }
          ],

          reportDate: [
          //            { required: true,type:'date', message: '报道时间不能为空', trigger: 'blur,change' }
            {required: true, type: 'date', validator: dateRule, trigger: 'blur,change'}
          ],
          publishStatus: [
            { required: true, message: '发布状态不能为空', trigger: 'blur' }
          ]

        },
        productTypeOptions: TOOLS.fetchObj('commonObj').ProductType.reverse(),
        newsId: TOOLS.getProID(this.$route.params.newsId)
      }
    },
    components: {
      breadcrumbNav,
      picUpload,
      editor
    },

    mounted () {
      if (this.newsId != 0) {
        this.breadcrumName = '编辑'
        API.postRequest('/gateway/news/byPrimaryKey', {id: this.newsId}, res => {
          this.newsForm = res.data
          this.content = res.data.content
        })
      } else {
        this.breadcrumName = '新增'
      }
    },
    methods: {

      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) {
        this.newsForm.coverImgAlt = msg
        this.redFontsVisable = this.newsForm.coverImgAlt == ''
      },
      fatherGetFileFromChild2 (msg) {
        this.newsForm.sourceLogo = msg
      },

      //      监听编辑组件
      fatherGetDataFromChild (data) {
        if (TOOLS.checkIframe(data)) {
          this.newsForm.content = TOOLS.parseIframe(data)
        } else {
          this.newsForm.content = data
        }
        // new div
        // div html(data)
        // get div iframes
        // loop iframes and get src
        // new iframe src = src
        // iframe other pers
        // div innerText
        // content

        this.editErrorMsgVisable = this.newsForm.content == ''
      },
      // 确认提交
      saveRedpacket (newsForm) {
        this.$refs[newsForm].validate((valid) => {
          if (!this.newsForm.coverImgAlt) {
            this.redFontsVisable = true
            return
          }
          /* if(!this.newsForm.content){
            this.editErrorMsgVisable=true;
            return;
          } */
          if (valid) {
            if (this.newsId == 0) {
              $addNews(this.newsForm, res => {
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              this.newsForm.id = this.newsId
              $updateNews(this.newsForm, res => {
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

      //      取消
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

