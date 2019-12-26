<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="noticeForm" label-width="160px" :rules="rules" ref="noticeForm">
        <el-form-item label="类别:" prop="types">
          <el-radio-group v-model="noticeForm.types">
            <el-radio v-for="item in stateType":label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题：" prop="topic">
          <el-input v-model="noticeForm.topic"></el-input>
        </el-form-item>
        <el-form-item label="关键词：" prop="keywords">
          <el-input v-model="noticeForm.keywords"></el-input>
        </el-form-item>
        <el-form-item label="描述：" prop="descriptions">
          <el-input type="textarea" :rows="3"  v-model="noticeForm.descriptions"></el-input>
        </el-form-item>
        <el-form-item label="内容：" prop="content">
          <!--<el-input v-model="noticeForm.content" type="textarea" :rows="3"></el-input>-->
          <div class="edit-area" prop="content">
            <editor :content='content' :path="path" v-on:input="fatherGetDataFromChild"></editor>
          </div>
        </el-form-item>

        <!--<el-form-item label="发布平台类型:" prop="platformType">-->

            <!--&lt;!&ndash;<el-col :span="3">&ndash;&gt;-->
              <!--&lt;!&ndash;<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange">全选</el-checkbox>&ndash;&gt;-->
            <!--&lt;!&ndash;</el-col>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-checkbox label="全部" :indeterminate="isIndeterminate" v-model="checkAll" @change="checkAllChange"></el-checkbox>&ndash;&gt;-->
          <!--&lt;!&ndash;<el-checkbox-group v-model="noticeForm.platformType" @change="checkChange">&ndash;&gt;-->

                <!--&lt;!&ndash;<el-checkbox v-for="item in plate"&ndash;&gt;-->
                             <!--&lt;!&ndash;:label="item.value"&ndash;&gt;-->
                <!--&lt;!&ndash;&gt;{{item.label}}</el-checkbox>&ndash;&gt;-->
          <!--&lt;!&ndash;</el-checkbox-group>&ndash;&gt;-->

          <!--<el-radio-group v-model="noticeForm.platformType">-->
            <!--<el-radio v-for="item in plate" :label="item.value">{{item.label}}</el-radio>-->
          <!--</el-radio-group>-->
        <!--</el-form-item>-->
        <el-form-item label="发布状态:" prop="publishStatus">
          <el-radio class="radio m2" v-model="noticeForm.publishStatus" label="noUse">暂不发布</el-radio>
          <el-radio class="radio m2" v-model="noticeForm.publishStatus" label="isUse">发布</el-radio>
        </el-form-item>
        <div style="padding:20px 0px 50px 0px; text-align:center">
          <el-button type="primary" @click="saveRedpacket('noticeForm')">保存</el-button>
          <el-button style="margin-left: 10px" size=""@click="resetForm('noticeForm')">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editNotice.less";
</style>
<script>
  import editor from '../../../../components/editor/editor.vue'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import picUpload from '../../../comComponents/pic-upload-simple.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'
  export default {
    data () {
      return {
        breadcrumName: '',
        stateType: TOOLS.fetchObj('commonObj').BulletinTypes,
        plate: [
          {label: 'pc', value: 'pc'},
          {label: 'app', value: 'app'},
          {label: 'h5', value: 'h5'}
        ],
        status: TOOLS.fetchObj('commonObj').PublishStatus,
        isIndeterminate: true,
        checkAll: true,
        plates: this.plate,
        content: '',
        //        path:'http://127.0.0.1:8080/console/gateway/fileManage/upload',
        path: `${process.env.API_ROOT}/gateway/oss/signature`,
        noticeForm: {
          content: '',
          dataStatus: '',
          descriptions: '',
          isTop: '',
          keywords: '',
          platformType: '',
          publishStatus: '',
          topic: '',
          types: ''
        },
        rules: {
          topic: [
            { required: true, message: '标题不能为空', trigger: 'change' }
          ],
          types: [
            { required: true, message: '类别不能为空', trigger: 'change' }
          ],
          keywords: [
            { required: true, message: '关键词不能为空', trigger: 'change' }
          ],
          platformType: [
            { required: true, message: '发布平台不能为空', trigger: 'change' }
          ],
          publishStatus: [
            { required: true, message: '发布状态不能为空', trigger: 'blur' }
          ]
        },
        productTypeOptions: TOOLS.fetchObj('commonObj').ProductType.reverse(),
        noticeId: TOOLS.getProID(this.$route.params.noticeId) || 0
      }
    },
    components: {
      breadcrumbNav,
      picUpload,
      editor
    },

    mounted () {
      if (this.noticeId != 0) {
        this.breadcrumName = '编辑'
        API.postRequest('/gateway/bulletin/byPrimaryKey', {id: this.noticeId}, res => {
          this.noticeForm = res.data
          this.content = res.data.content
        })
      } else {
        this.breadcrumName = '新增'
      }
    },
    methods: {

      // 全选
      checkAllChange (event) {
        this.isIndeterminate = false
        this.noticeForm.platformType = event.target.checked ? this.plate : []
      },
      // 单选checkbox
      checkChange (value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.plates.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.plates.length
      },
      // 确认提交
      saveRedpacket (noticeForm) {
        this.$refs[noticeForm].validate((valid) => {
          if (valid) {
            if (this.noticeId == 0) {
              API.$addNotice(this.noticeForm, res => {
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              API.$updateNotice(this.noticeForm, res => {
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
      //      监听编辑组件
      fatherGetDataFromChild (data) {
        if (TOOLS.checkIframe(data)) {
          this.noticeForm.content = TOOLS.parseIframe(data)
        } else {
          this.noticeForm.content = data
        }
      },
      // 返回
      back () {
        this.$router.go(-1)
      }
    }

  }
</script>
