<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form  :model="customerObj" label-width="160px" :rules="rules" ref="customer">
        <el-form-item label="渠道名称：" prop="name">
          <el-input v-model="customerObj.name"></el-input>
        </el-form-item>
        <el-form-item label="渠道编号：" prop="source">
          <el-input v-model="customerObj.source"
                    @blur="checkSourceIsOnly(customerObj.source)"
          ></el-input>
          <div style="font-size: 12px;color: #ff4949;line-height: 1;position: absolute;top: 40px;z-index: 10;" v-if="sourceIsOnlyVisable">
            您输入的渠道编号已经存在,请重新输入
          </div>
        </el-form-item>
        <el-form-item label="合作平台：" prop="platformType">
          <el-select  name="type"v-model="customerObj.platformType">
            <el-option v-for="(x,index) in platformTypeOptions" :value="x.value" :label="x.label" v-if="index>0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合作方式：" prop="workType">
          <el-select name="type" v-model="customerObj.workType">
            <el-option v-for="(x,index) in workTypeOptions" :value="x.value" :label="x.label" v-if="index>0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算方式：" prop="balanceType">
          <el-select name="type" v-model="customerObj.balanceType">
            <el-option v-for="(x,index) in balanceTypeOptions" :value='x.value+""' :label="x.label" v-if="index>0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="链接地址：" prop="link">
          <el-input v-model="customerObj.link"></el-input>
        </el-form-item>
        <div class="text-center">
            <el-button type="primary"
                       @click="saveCustomer('customer')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
                       class="marR10"
            >确认</el-button>
          <el-button type="primary" @click="resetForm('customer')":plain="true" >取消</el-button>

        </div>
      </el-form>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "editCustomer.less";
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
        platformTypeOptions: TOOLS.fetchObj('commonObj').Platform, // 平台类型
        workTypeOptions: TOOLS.fetchObj('commonObj').WorkType, // 合作方式
        balanceTypeOptions: TOOLS.fetchObj('commonObj').BalanceType, // 结算方式
        customerObj: {
          name: '',
          source: '',
          platformType: '',
          workType: '',
          balanceType: '',
          link: ''
        },
        rules: {
          name: [
            { required: true, message: '渠道名称不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          source: [
            { required: true, message: '渠道编号不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }
          ],
          platformType: [
            { required: true, message: '合作平台不能为空', trigger: 'change' }
          ],
          workType: [
            { required: true, message: '合作方式不能为空', trigger: 'change' }
          ],
          //          balanceType:[
          //            { required: true, message: '结算方式不能为空', trigger: 'change' }
          //          ],
          link: [
            { min: 0, max: 200, message: '长度必须在200个字符以内', trigger: 'blur' }
          ]

        },
        customerId: TOOLS.getProID(this.$route.params.customerId),
        sourceIsOnlyVisable: false
      }
    },
    components: {
      breadcrumbNav
    },

    mounted () {
      if (this.customerId != 0) {
        this.breadcrumName = '编辑'
        API.$channelQueryById(this.customerId, res => {
          this.customerObj = res.data
          TOOLS.setSource(this.customerObj.source)
        })
      } else {
        this.breadcrumName = '新增'
      }
    },
    methods: {
      // 检查渠道是否唯一
      checkSourceIsOnly (source) {
        this.sourceIsOnlyVisable = false
        if (this.customerId != 0) {
          if (TOOLS.getSource() === this.customerObj.source) {

          } else {
            this.getCheckSource(source)
          }
        } else {
          this.getCheckSource(source)
        }
      },
      // 获取检查渠道是否重复接口
      getCheckSource (source) {
        if (!source) {
          this.sourceIsOnlyVisable = false
          return
        }
        API.$checkSource(source, res => {
          if (res.success) {
            this.sourceIsOnlyVisable = false
            TOOLS.log('source--success', JSON.stringify(res))
          } else {
            this.sourceIsOnlyVisable = true
            TOOLS.log('source--false', JSON.stringify(res))
          }
        })
      },
      // 确认提交
      saveCustomer (formName) {
        if (this.sourceIsOnlyVisable) {
          return
        }
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            return false
          } else {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            if (this.customerId == 0) {
              API.$channelAdd(this.customerObj, res => {
                this.savebtnDisabled = false
                this.fullscreenLoading = false
                if (res.success) {
                  this.back()
                } else {
                  alert(res.resultMsg)
                }
              })
            } else {
              this.savebtnDisabled = false
              this.fullscreenLoading = false
              API.$channelUpdate(this.customerObj, res => {
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
      },
      handleClick (tab, event) {
        console.log(tab, event)
      },
      successHandle (response, file, fileList) {
      },
      previewHandle (file) {
        console.log(file)
      }
    }

  }
</script>
