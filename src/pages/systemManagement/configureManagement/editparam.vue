<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form  :model="sysObj" label-width="160px" :rules="rules" ref="sys">
        <el-form-item label="配置名称：" prop="bizName">
          <el-input v-model="sysObj.bizName"></el-input>
        </el-form-item>
        <el-form-item label="配置key：" prop="bizKey">
          <el-input v-model="sysObj.bizKey" @blur="checkKeyIsOnly(sysObj.bizKey)"></el-input>
          <div style="font-size: 12px;color: #ff4949;line-height: 1;position: absolute;top: 40px;z-index: 10;" v-if="keyIsOnlyVisable">
            您输入的活动代码已经存在,请重新输入
          </div>
        </el-form-item>
        <el-form-item label="配置value：" prop="bizValue">
          <el-input v-model="sysObj.bizValue"></el-input>
        </el-form-item>
        <el-form-item label="配置类型：" prop="bizType">
          <el-select  name="type"v-model="sysObj.bizType">
            <el-option v-for="x in bizTypeOptions" :value="x.value" :label="x.label" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否可用：" prop="isInvalid">
          <el-radio class="radio m2" v-model="sysObj.isInvalid" label="true">是</el-radio>
          <el-radio class="radio m2" v-model="sysObj.isInvalid" label="false">否</el-radio>
        </el-form-item>
        <div>
          <el-row :gutter="20" type="flex" justify="center">
              <el-button type="primary"
                         @click="saveSys('sys')"
                         :disabled="savebtnDisabled"
                         v-loading.fullscreen.lock="fullscreenLoading"
                         class="marR10"
              >确认</el-button>
            <el-button type="primary" @click="resetForm('sys')" :plain="true" >取消</el-button>
          </el-row>
        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editparam.less";
</style>
<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'

  import * as TOOLS from '../../../assets/js/tools'
  import * as API from '../../../store/api'

  export default {
    data () {
      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        keyIsOnlyVisable: false,
        bizTypeOptions: [], // 配置类型
        sysObj: {
          bizName: '',
          bizKey: '',
          bizValue: '',
          bizType: '',
          isInvalid: 'false'
        },
        rules: {
          bizName: [
            { required: true, message: '配置名称不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          bizKey: [
            { required: true, message: '配置key不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          bizValue: [
            { required: true, message: '配置value不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          bizType: [
            { required: true, message: '合作平台不能为空', trigger: 'change' }
          ]

        },
        paramId: TOOLS.getProID(this.$route.params.paramId)
      }
    },
    components: {
      breadcrumbNav
    },

    mounted () {
      // 对配置类型进行处理
      let bizTypeOptionsList = TOOLS.fetchObj('commonObj').SysType
      bizTypeOptionsList.splice(0, 1)
      this.bizTypeOptions = bizTypeOptionsList
      if (this.paramId != 0) {
        this.breadcrumName = '编辑'
        API.$sysQueryById(this.paramId, res => {
          this.sysObj = res.data
          TOOLS.setKey(this.sysObj.bizKey)
        })
      } else {
        this.breadcrumName = '新增'
      }
    },
    methods: {
      // 检查key是否唯一
      checkKeyIsOnly (key) {
        this.keyIsOnlyVisable = false
        if (!key) {
          return
        }
        if (this.paramId != 0) {
          if (TOOLS.getKey() === this.sysObj.bizKey) {

          } else {
            this.getCheckKey(key)
          }
        } else {
          this.getCheckKey(key)
        }
      },
      // 获取key是否重复接口
      getCheckKey (key) {
        API.$sysCheckKey(key, res => {
          if (res.success) {
            this.keyIsOnlyVisable = false
            TOOLS.log('key--success')
          } else {
            this.keyIsOnlyVisable = true
            TOOLS.log('key--false')
          }
        })
      },
      // 确认提交
      saveSys (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            if (this.paramId == 0) {
              API.$sysAdd(this.sysObj, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              API.$sysUpdate(this.sysObj, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                this.back()
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
