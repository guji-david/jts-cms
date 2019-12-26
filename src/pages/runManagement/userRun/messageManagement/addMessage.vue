<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <h2>发放方式</h2>
    <hr>
    <div class="tabs-header">
      <div class="nav-wrap">
        <div class="nav-scroll">
          <div class="tabs-nav">
            <div class="tabs-item":class="{'is-active':activeIndex==index}" v-for="(item,index) in  tabMessageList" @click="shiftTabmessage(index)">
              {{item}}
            </div>
          </div>
        </div>


      </div>
    </div>
    <el-form :model="messageFormObj" label-width="160px" :rules="rules" ref="messageFormObj"  class="demo-ruleForm">
         <el-collapse v-model="activeNames">
           <el-collapse-item title="发送用户" name="1">
             <div v-if="activeIndex==0">
               <el-row>
                 <el-col :span="16">
                   <div class="z-span-20">
                     <el-form-item label="用户手机号码：">
                       <el-input v-model="phone" placeholder="11位手机号之间用逗号隔开"></el-input>
                     </el-form-item>
                   </div>
                 </el-col>
                 <el-col :span="8" >
                   <div class="z-span-20" style="padding-left:20px">
                     <span class="z-btn-span"><el-button type="primary" icon="search"  @click="mobileQuery()">查询</el-button></span>
                     <span class="z-btn-span"><el-button @click="resetForm('borrowerForm')">重置</el-button> </span>
                   </div>
                 </el-col>
               </el-row>
               <el-table
                 :data="tableData"
                 type="expand"
                 border
                 @selection-change="handleSelectionChange"
                 style="width: 100%">
                 <el-table-column
                   type="selection"
                   width="50%"
                 >
                 </el-table-column>
                 <el-table-column
                   prop="mobile"
                   label="手机号"
                 >
                 </el-table-column>
                 <el-table-column
                   prop="name"
                   label="用户姓名"
                 >
                 </el-table-column>
                 <el-table-column
                   prop="createTime"
                   label="创建时间"
                   :formatter="formatterDate"
                 >
                 </el-table-column>
               </el-table>
             </div>
             <div v-if="activeIndex==1">
               <div class="z-span-20">
                 <el-form-item label="导入用户：">
                   <el-col :span="19">
                     <el-input type="text" :disabled="true"placeholder="请上传后缀名为.csv的文件 谢谢!" v-model="filename"></el-input>
                   </el-col>
                   <el-col :span="3" :push="1">
                     <fileUpload @childToFatherTransferEvent="fatherGetFileFromChild"></fileUpload>
                   </el-col>
                 </el-form-item>
               </div>
             </div>
             <div v-if="activeIndex==2">
               <p class="mar20 textInd">用户列表：所有用户</p>
             </div>
           </el-collapse-item>
           <el-collapse-item title="站内信内容" name="2">
             <el-form-item label="标题："prop="topic">
               <el-input v-model.trim="messageFormObj.topic"></el-input>
             </el-form-item>
             <el-form-item label="消息内容：" prop="content">
               <el-input
                 type="textarea"
                 :rows="5"
                 v-model.trim="messageFormObj.content"
                 placeholder="请输入内容"
               >
               </el-input>
             </el-form-item>
             <!--<el-form-item label="内容类型："prop="contentType">
               <el-select name="type"v-model="messageFormObj.contentType">
                 <el-option v-for="x in businessTypeOptions" :value="x.value" :label="x.label" ></el-option>
               </el-select>
             </el-form-item>-->
           </el-collapse-item>
           <el-collapse-item title="发送方式" name="3">
             <el-form-item label="发送方式：">
               <el-col :span="5" >
                 <el-radio-group v-model="messageFormObj.sendType">
                   <el-radio v-for="item in messageSendTypeOptions":label="item.value">{{item.label}}</el-radio>
                 </el-radio-group>
               </el-col>
               <el-col :span="5" v-if="messageFormObj.sendType=='Date'">
                 <el-date-picker
                                 v-model="messageFormObj.sendTime"
                                 type="datetime"
                                 placeholder="选择日期"
                 >
                 </el-date-picker>
               </el-col>




             </el-form-item>
           </el-collapse-item>
         </el-collapse>
       </el-form>




    <!--底部按钮-->
    <div class="btnDiv">
      <el-button type="primary" size=""@click="viewMessageBtn('messageFormObj')"v-if="activeIndex==1"
                 :disabled="viewbtnDisabled"  class="marR10"
      >预览</el-button>
      <el-button type="primary" size=""
                 @click="sendMessageBtn('messageFormObj')"
                 :disabled="savebtnDisabled"
                 v-loading.fullscreen.lock="fullscreenLoading"
                 style="margin-right: 10px"
      >发送</el-button>
      <el-button  size=""@click="cancelBtn('messageFormObj')" class="marL10">取消</el-button>
    </div>

    <!-- 对话框 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span>{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->
    <el-dialog title="预览" v-model="dialogViewVisible" size="large">
      <!-- 列表开始 -->
      <el-table
        :data="tableData"
        border
        style="width: 100%"
      >

        <el-table-column
          prop="mobile"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="topic"
          label="主题"
        >
        </el-table-column>
        <el-table-column
          prop="content"
          label="内容"
        >
        </el-table-column>

      </el-table>
      <!-- 列表结束 -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogViewVisible = false">确 定</el-button>
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
      var validateName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('此项不能为空'))
        }
        setTimeout(() => {
          if (value.length > 100) {
            callback(new Error('您输入的长度不能超过100个字符'))
          } else {
            callback()
          }
        }, 100)
      }
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        viewbtnDisabled: false,
        breadcrumName: '',
        activeNames: ['1', '2', '3'],
        tabMessageList: ['批量发放', '导入用户发放', '所有用户发放'],
        activeIndex: 0,
        phone: '',
        filename: '', // 文件内容-filename 相对路径
        messageFormObj: {
          sendScope: 'Select', // 发送范围选择MessageSendScope
          topic: '', // 标题
          sendUsers: [], // 发送范围选择的用户手机号
          content: '', // 内容
          //          contentType : "",// 内容类型BusinessType
          base64: '', // 文件内容-base64
          sendTime: '', // 定时发送时的发送时间
          sendType: 'Now' // 发送类型MessageSendType
        },
        tableData: [],
        multipleSelection: [],
        messageSendScopeOptions: [],
        messageSendTypeOptions: [],
        //        businessTypeOptions:[],
        pageNo: 1,
        pageSize: 5,
        rules: {
          topic: [
            { required: true, validator: validateName, trigger: 'blur' }
          ],
          content: [
            { required: true, validator: validateName, trigger: 'blur' }
          ],
          /* contentType:[
            {required:true, message: '内容类型不能为空', trigger: 'change' }
          ], */
          sendTime: [
            { type: 'date', required: true, message: '时间不能为空', trigger: 'change' }
          ]
        },
        dialogVisible: false,
        dialogViewVisible: false,
        msg: ''
      }
    },
    components: {
      breadcrumbNav,
      fileUpload
    },
    mounted () {
      this.breadcrumName = '新增'
      // 对发送用户范围进行处理
      let messageSendScopeOptionsList = TOOLS.fetchObj('commonObj').MessageSendScope
      messageSendScopeOptionsList.splice(0, 1)
      this.messageSendScopeOptions = messageSendScopeOptionsList
      // 对发送类型进行处理
      let messageSendTypeOptionsList = TOOLS.fetchObj('commonObj').MessageSendType
      messageSendTypeOptionsList.splice(0, 1)
      this.messageSendTypeOptions = messageSendTypeOptionsList
    },
    methods: {
      popDialog (msg) {
        this.msg = msg
        this.dialogVisible = true
      },
      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) {
        this.filename = msg[0]
        this.messageFormObj.base64 = msg[1]
      },
      shiftTabmessage (index) {
        this.activeIndex = index
        this.messageFormObj.sendScope = this.messageSendScopeOptions[index].value
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },
      // 手机号码查询
      mobileQuery () {
        API.$getUserByMobiles(this.phone, res => {
          console.log(res)
          if (res.success) {
            this.tableData = res.data
          } else {
          //            this.popDialog("请输入正确的手机号,多个手机号用逗号隔开")
          }
        })
      },
      resetForm () {
        this.phone = ''
      },

      // 发送礼品的取消按钮
      cancelBtn () {
        this.back()
      },
      // 导入用户发放-预览
      viewMessageBtn (formName) {
        this.messageFormObj.sendUsers = ''
        if (this.messageFormObj.base64 === '') {
          this.popDialog('请上传文件')
          return
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.viewbtnDisabled = true
            API.$messageAddView(TOOLS.noEmetyProp(this.messageFormObj), res => {
              this.viewbtnDisabled = false
              this.dialogViewVisible = true
              this.tableData = res.list
            })
          } else {
            return false
          }
        })
      },
      // 发送站内信
      sendMessageBtn (formName) {
        if (this.messageFormObj.sendScope == this.messageSendScopeOptions[0].value) {
          this.messageFormObj.base64 = ''
          if (this.messageFormObj.sendUsers === '' || !this.messageFormObj.sendUsers.length) {
            this.popDialog('请选择用户')
            return
          }
          TOOLS.log('this.messageFormObj.sendScope', this.messageFormObj.sendScope)
        }
        if (this.messageFormObj.sendScope == this.messageSendScopeOptions[1].value) {
          this.messageFormObj.sendUsers = ''
          if (this.messageFormObj.base64 === '') {
            this.popDialog('请上传文件')
            return
          }
          TOOLS.log('this.messageFormObj.sendScope', this.messageFormObj.sendScope)
        }
        if (this.messageFormObj.sendScope == this.messageSendScopeOptions[2].value) {
          this.messageFormObj.sendUsers = ''
          this.messageFormObj.base64 = ''
          TOOLS.log('this.messageFormObj.sendScope', this.messageFormObj.sendScope)
        }
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            API.$messageAdd(TOOLS.noEmetyProp(this.messageFormObj), res => {
              this.savebtnDisabled = false
              this.fullscreenLoading = false
              this.back()
              console.log(res)
            })
          } else {
            return false
          }
        })
      },
      back () {
        this.$router.go(-1)
      },

      // 用户列表多选
      handleSelectionChange (val) {
        this.multipleSelection = val
        TOOLS.log('val', val)
        this.messageFormObj.sendUsers = TOOLS.getListProp('mobile', this.multipleSelection)
        TOOLS.log('this.messageFormObj.sendUsers', this.messageFormObj.sendUsers)
      }
    }
  }
</script>
<style scoped lang="less">
 @import "addMessage.less";
</style>
