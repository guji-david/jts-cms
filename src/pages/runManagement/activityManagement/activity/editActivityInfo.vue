<template>
  <div class="main">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form  :model="activityObj" label-width="160px" :rules="rules" ref="activity">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="活动基本信息" name="1">
            <el-form-item label="活动名称：">
              <span v-text="activityObj.name"></span>
            </el-form-item>
            <el-form-item label="活动代码：" >
              <span v-text="activityObj.code"></span>
            </el-form-item>
            <el-form-item label="活动类型：">
              <span>{{type}}</span>

            </el-form-item>
            <el-form-item label="开始时间：" >
              <span>{{onlineTime}}</span>
            </el-form-item>
            <el-form-item label="结束时间："prop="offlineTime" v-if="activityStatus!='end'">
              <el-date-picker
                v-model="activityObj.offlineTime"
                type="datetime"
                placeholder="选择日期"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间：" v-else="activityStatus=='end'">
              <span>{{offlineTime}}</span>
            </el-form-item>
            <el-form-item label="活动简介："  prop="summaryPc" v-if="activityStatus!='end'">
              <el-input
                type="textarea"
                :rows="8"
                placeholder="请输入活动简介"
                v-model="activityObj.summaryPc">
              </el-input>
            </el-form-item>
            <el-form-item label="活动简介：" v-else="activityStatus=='end'">
              <span>{{activityObj.summaryPc}}</span>
            </el-form-item>
            <el-form-item label="适用项目类型：">
             <span>{{productScope}}</span>
            </el-form-item>
            <el-form-item label="上架时间：">
              <span>{{shelfTime}}</span>
            </el-form-item>
            <el-form-item label="是否需要登录：">
              <span>{{isLogin}}</span>
            </el-form-item>
            <el-form-item label="排列序号：">
              <span>{{activityObj.orderNum}}</span>
            </el-form-item>
          </el-collapse-item>
          <el-collapse-item title="活动宣传信息" name="2">
            <el-form-item label="是否pc端展示:">
              <span>{{isShowPc}}</span>
            </el-form-item>
            <el-form-item label="宣传图片:" v-if="activityObj.isShowPc=='true'&&activityObj.picUrlPc!=''">
              <img :src="picUrlPc" alt="">
            </el-form-item>

            <el-form-item label="是否App端展示:">
              <span>{{isShowApp}}</span>
            </el-form-item>
            <el-form-item label="宣传图片:" v-if="activityObj.isShowApp=='true'&&activityObj.picUrlApp!=''">
              <img :src="picUrlApp" alt="">
            </el-form-item>
            <el-form-item label="是否H5端展示:">
              <span>{{isShowApp}}</span>
            </el-form-item>
            <el-form-item label="宣传图片:" v-if="activityObj.isShowWechat=='true'&&activityObj.picUrlWechat!=''">
              <img :src="picUrlWechat" alt="">
            </el-form-item>

          </el-collapse-item>
          <el-collapse-item title="活动奖品信息" name="3">
            <el-form >
              <el-collapse v-model="activeNamesPrize">
                <el-collapse-item title="红包" name="1">
                  <hr>
                  <!--红包表-->
                  <el-table
                    :data="activityObj.bizActivityRedpackets"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="name"
                      label="红包名称"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="amount"
                      :formatter="formatterAmount"
                      label="金额(元)"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="validLimit"
                      label="有效期(天)"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="productType"
                      :formatter="formatterProductType"
                      label="限投产品类型"
                      >
                    </el-table-column>
                    <el-table-column
                      label="起投金额(元)"
                      >
                      <template scope="props">
                        <div class="table-line" >
                          <ul>
                            <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.minAmount/100}}</li>
                          </ul>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      label="投资产品最低期限(天)"
                      >
                      <template scope="props">
                        <div class="table-line" >
                          <ul>
                            <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.limit}}</li>
                          </ul>

                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="创建时间"
                      :formatter="formatterDate"
                      >
                    </el-table-column>
                    <el-table-column
                      label="适用规则"
                      prop="ruleSource"
                      :formatter="formatterRuleSource"
                      >
                    </el-table-column>
                    <el-table-column
                      label="总数"
                      prop="allNum"
                      >
                    </el-table-column>
                  </el-table>
                  <!--红包表end-->
                </el-collapse-item>
                <el-collapse-item title="加息券" name="2">
                  <hr>
                  <!--加息劵表-->
                  <el-table
                    :data="activityObj.bizActivityCoupons"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="name"
                      label="加息券名称"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="rate"
                      label="加息额度(%)"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="validLimit"
                      label="有效期(天)"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="productType"
                      :formatter="formatterProductType"
                      label="限投产品类型"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="maxRateAmount"
                      :formatter="formatterMaxRateAmount"
                      label="最高加息金额(元) "
                      >
                    </el-table-column>
                    <el-table-column
                      prop="maxRateLimit"
                      label="最高加息天数(天)"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="minInvestAmount"
                      :formatter="formatterMinInvestAmount"
                      label="最低投资金额(元)"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="minInvestLimit"
                      label="投资产品最低期限(天)"
                     >
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="创建时间"
                      :formatter="formatterDate"
                     >
                    </el-table-column>
                    <el-table-column
                      label="适用规则"
                      prop="ruleSource"
                      :formatter="formatterRuleSource"
                      >


                    </el-table-column>
                    <el-table-column
                      label="总数"
                      prop="allNum"
                      >
                    </el-table-column>
                  </el-table>
                  <!--加息劵表end-->
                </el-collapse-item>
                <el-collapse-item title="实物" name="3">
                  <!--实物表-->
                  <el-table
                    :data="activityObj.bizActivityGifts"
                    border
                    style="width: 100%">
                    <el-table-column
                      label="实物名称"
                      prop="name"
                    >
                    </el-table-column>
                    <el-table-column
                      label="实物类型"
                      prop="type"
                      :formatter="formatterType"
                      >


                    </el-table-column>
                    <el-table-column
                      label="适用规则"
                      prop="ruleSource"
                      :formatter="formatterRuleSource"
                      >

                    </el-table-column>
                    <el-table-column
                      label="总数"
                      prop="allNum"
                      >
                    </el-table-column>

                  </el-table>

                  <!--实物表end-->
                </el-collapse-item>
              </el-collapse>
            </el-form>

          </el-collapse-item>
        </el-collapse>

        <div style="padding:20px 0px 50px 0px; text-align:center;" v-if="activityStatus!='end'">
          <span style="margin-right: 15px">
            <el-button type="primary"
                       @click="saveActivity('activity')"
                       :disabled="savebtnDisabled"
                       v-loading.fullscreen.lock="fullscreenLoading"
            >确认</el-button>
          </span>
          <span style="margin-left: 15px"> <el-button type="primary" @click="resetForm('activity')":plain="true" >取消</el-button></span>
        </div>
        <div style="padding:20px 0px 50px 0px; text-align:center;" v-else="activityStatus=='end'">
          <span style="margin-left: 15px"> <el-button type="primary" @click="back":plain="true" >返回</el-button></span>
        </div>
      </el-form>

      <!-- 对话框 -->
      <el-dialog title="提示" v-model="dialogVisible" size="tiny">
        <span>{{msg}}</span>
        <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import "addActivityInfo.less";
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  import * as TOOLS from '../../../../assets/js/tools'
  import * as API from '../../../../store/api'

  export default {
    data () {
      var onlineTimeValidate = (rule, value, callback) => {
        setTimeout(() => {
          if (!value) {
            callback(new Error('时间不能为空'))
          } else {
            callback()
          }
        }, 100)
      }

      return {
        fullscreenLoading: false,
        savebtnDisabled: false,
        breadcrumName: '',
        activeNames: ['1'],
        activeNamesPrize: ['1'],
        activityObj: {
          productScope: [],
          offlineTime: '',
          summaryPc: ''
        },
        // 上架时间禁用选项
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        activityTypeOptions: '',
        activityGiftTypeOptions: '',
        activityRulesOptions: '', // 适用规则
        rules: {
          offlineTime: [
            { required: true, type: 'date', validator: onlineTimeValidate, trigger: 'blur,change' }
          ],
          summaryPc: [
            { required: true, message: '活动简介不能为空', trigger: 'blur' },
            { min: 0, max: 500, message: '长度必须在500个字符以内', trigger: 'blur' }
          ]
        },
        productTypeOptions: '',
        productTypeALLValueList: '',
        dialogVisible: false,
        msg: '',
        activityId: TOOLS.getProID(this.$route.params.activityId),
        activityStatus: TOOLS.getProType(this.$route.params.activityStatus)
      }
    },
    computed: {
      // 计算属性的 getter 机构类型转换
      type: function () {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').ActivityType, this.activityObj.type)
      },
      onlineTime: function () {
        return TOOLS.normalTime(this.activityObj.onlineTime)
      },
      offlineTime: function () {
        return TOOLS.normalTime(this.activityObj.offlineTime)
      },
      shelfTime: function () {
        return TOOLS.normalTime(this.activityObj.shelfTime)
      },
      productScope: function () { // 产品类型转换
        return TOOLS.valueToLabelListStr(TOOLS.fetchObj('commonObj').ProductType, this.activityObj.productScope)
      },
      isLogin: function () {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').IsXXX, this.activityObj.isLogin)
      },
      isShowPc: function () {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').IsXXX, this.activityObj.isShowPc)
      },
      picUrlPc: function () {
        return TOOLS.getDomain() + this.activityObj.picUrlPc
      },
      isShowApp: function () {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').IsXXX, this.activityObj.isShowApp)
      },
      picUrlApp: function () {
        return TOOLS.getDomain() + this.activityObj.picUrlApp
      },
      isShowWechat: function () {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').IsXXX, this.activityObj.isShowWechat)
      },
      picUrlWechat: function () {
        return TOOLS.getDomain() + this.activityObj.picUrlWechat
      }
    },
    components: {
      breadcrumbNav
    },

    mounted () {
      // 对实物类型进行处理
      let activityGiftTypeOptionsList = TOOLS.fetchObj('commonObj').ActivityGiftType
      activityGiftTypeOptionsList.splice(0, 1)
      this.activityGiftTypeOptions = activityGiftTypeOptionsList

      // 对适用规则进行处理
      let activityRulesOptionsList = TOOLS.fetchObj('commonObj').ActivityRules
      activityRulesOptionsList.splice(0, 1)
      this.activityRulesOptions = activityRulesOptionsList

      /* this.activityId=this.$route.params.activityId;
    this.activityStatus=this.$route.params.activityStatus; */

      if (this.activityId != 0) {
        this.updatedisabled = true
        this.breadcrumName = '编辑'
        API.$activityQueryById(this.activityId, res => {
          if (res.success) {
            this.activityObj = res.data
            this.activityObj.productScope = JSON.parse(res.data.productScope)
            TOOLS.setCode(this.activityObj.code)
          } else {
            alert(res.resultMsg)
          }
        })
      }
    },
    methods: {

      // 金额转换-红包
      formatterAmount (val) {
        return TOOLS.fenToYuan(val.amount)
      },
      // 最高加息金额(元)金额转换-加息券
      formatterMaxRateAmount (val) {
        return TOOLS.fenToYuan(val.maxRateAmount)
      },
      // 最低投资金额(元)金额转换-加息券
      formatterMinInvestAmount (val) {
        return TOOLS.fenToYuan(val.minInvestAmount)
      },
      popDialog (msg) {
        this.msg = msg
        this.dialogVisible = true
      },

      formatterRule (val) {
        return JSON.parse(val)
      },
      // 产品类型转换
      formatterProductType (val) {
        if (!val.productType) {
          return ''
        } else {
          return TOOLS.valueToLabelListStr(TOOLS.fetchObj('commonObj').ProductType, JSON.parse(val.productType))
        }
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },
      // 格式化适用规则
      formatterRuleSource (val) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').ActivityRules, val.ruleSource)
      },
      // 格式化实物类型
      formatterType (val) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').ActivityGiftType, val.type)
      },

      // 确认提交
      saveActivity (formName) {
        this.$refs[formName].validate((valid) => {
          if (!valid) {
            this.activeNames = ['1', '2']
            return false
          } else {
            this.savebtnDisabled = true
            this.fullscreenLoading = true
            API.$activityUpdate(this.activityObj, res => {
              this.savebtnDisabled = false
              this.fullscreenLoading = false
              if (res.success) {
                this.back()
              } else {
                this.popDialog(res.resultMsg)
              }
            })
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
