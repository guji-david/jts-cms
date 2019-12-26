<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="adForm" label-width="160px" :rules="rules" ref="adForm">
        <el-form-item label="名称：" prop="name">
          <el-input v-model="adForm.name"></el-input>
        </el-form-item>
        <el-form-item label="平台：" prop="platform">
          <el-select v-model="adForm.platform">
            <el-option v-for="x in plate" :value="x.value" :label="x.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置：" prop="channel">
          <el-select v-model="adForm.channel">
            <el-option v-for="x in ActivityType" :value="x.value" :label="x.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="dataStatus">
          <el-select v-model="adForm.dataStatus">
            <el-option v-for="x in status" :value="x.value" :label="x.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="宣传图片:" required>
          <picUpload :filename=adForm.advertisePicture @childToFatherTransferEvent="fatherGetFileFromChild"></picUpload>
          <small style="color: red" v-show="redFontsVisable">图片不能为空</small>
        </el-form-item>
        <el-form-item label="链接地址："
                      prop="targetUrl">
          <el-input v-model="adForm.targetUrl"></el-input>
        </el-form-item>
        <el-form-item label="是否需要登录:" prop="isLogin">
          <el-radio class="radio m2" v-model="adForm.isLogin" label="true">是</el-radio>
          <el-radio class="radio m2" v-model="adForm.isLogin" label="false">否</el-radio>
        </el-form-item>
        <el-form-item label="排列序号：" prop="seqnum">
          <el-input v-model.number="adForm.seqnum"></el-input>
        </el-form-item>

        <div style="padding:20px 0px 50px 0px; text-align:center">
          <el-button type="primary" @click="saveRedpacket('adForm')">保存</el-button>
          <el-button style="margin-left: 10px"  @click="back">取消</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editAd.less";
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import picUpload from '../../../comComponents/pic-upload-simple.vue'
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  export default {
    data () {
      return {
        breadcrumName: '',
        adId: TOOL.getProID(this.$route.params.adId),
        status: [
          {
            value: 'valid',
            label: '启用'
          },
          {
            value: 'invalid',
            label: '停用'
          },
          {
            value: '',
            label: '全部'
          }
        ],
        ActivityType: TOOL.fetchObj('commonObj').AdvertiseChannelType,
        plate: TOOL.fetchObj('commonObj').Platform,
        adForm: {
          name: '',
          channel: '',
          platform: '',
          isLogin: 'true',
          advertisePicture: '',
          code: '123',
          targetUrl: '',
          seqnum: '',
          dataStatus: ''
        },
        redFontsVisable: false,
        rules: {
          name: [
            {required: true, message: '广告位名称不能为空', trigger: 'blur'},
            {min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur'}
          ],
          channel: [
            {required: true, message: '位置不能为空', trigger: 'change'}
          ],
          platform: [
            {required: true, message: '平台不能为空', trigger: 'change'}
          ],
          dataStatus: [
            {required: true, message: '状态不能为空', trigger: 'blur'}
          ],
          isLogin: [
            {required: true, message: '是否登录必填', trigger: 'blur'}
          ],
          targetUrl: [
            {min: 0, max: 200, message: '链接地址最大200字符', trigger: 'blur'}
          ]

        },
        productTypeOptions: TOOL.fetchObj('commonObj').ProductType.reverse()

      }
    },
    components: {
      breadcrumbNav,
      picUpload
    },
    mounted () {
      if (this.adId != 0) {
        this.breadcrumName = '编辑'
        API.postRequest('/gateway/advertise/byPrimaryKey', {id: this.adId}, res => {
          this.adForm = res.data
        })
      } else {
        this.breadcrumName = '新增'
      }
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // formatterTypes(val){
      // return TOOL.valueToLabel(TOOL.fetchObj("commonObj").DataStatus,val.types)
      // },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 父组件从子组件获取文件转换方法
      fatherGetFileFromChild (msg) {
        this.adForm.advertisePicture = msg
        this.redFontsVisable = this.adForm.advertisePicture === ''
      },

      // 确认提交
      saveRedpacket (adForm) {
        this.$refs[adForm].validate((valid) => {
          if (!this.adForm.advertisePicture) {
            this.redFontsVisable = true
            return
          }
          if (valid) {
            console.log(this.adId)
            if (this.adId == 0) {
              API.$addAd(this.adForm, res => {
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              API.$updateAd(this.adForm, res => {
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            }
          } else {
            TOOL.log('error submit!!')
            return false
          }
        })
      },

      // 返回
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>
