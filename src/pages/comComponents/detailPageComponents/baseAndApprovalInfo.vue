<template>
  <div>
    <el-form :model="formAlignRight" label-width="220px" ref="formAlignRight">
      <el-collapse v-model="activeNames">
        <!--折叠栏1-->
        <el-collapse-item title="借款方信息" name="1">
          <el-form-item label="借款方名称：">
            {{formAlignRight.borrowerName}}
          </el-form-item>
          <el-form-item label="营业执照/信用代码：">
            {{formAlignRight.certNo}}
          </el-form-item>

          <el-form-item label="法定代表人姓名：" v-if="proType === 'approval'">
            {{formAlignRight.legalPerson}}
          </el-form-item>
          <el-form-item label="成立时间：" v-if="proType === 'approval'">
            {{foundingTime}}
          </el-form-item>
          <el-form-item label="注册资本（元）：" v-if="proType === 'approval'">
            {{regCapital}}
          </el-form-item>
          <el-form-item label="注册地址：" v-if="proType === 'approval'">
            {{formAlignRight.regAddress}}
          </el-form-item>

          <el-form-item label="项目联系人：">
            {{formAlignRight.contactName}}
          </el-form-item>
          <el-form-item label="项目联系人电话：">
            {{formAlignRight.contactPhone}}
          </el-form-item>
          <el-form-item label="收款银行：">
            {{formAlignRight.dueBank}}
          </el-form-item>
          <el-form-item label="收款银行支行：">
            {{formAlignRight.branchBank}}
          </el-form-item>
          <el-form-item label="收款账户：">
            {{formAlignRight.accountName}}
          </el-form-item>
          <el-form-item label="收款账号：">
            {{formAlignRight.accountNo}}
          </el-form-item>
        </el-collapse-item>
        <!--折叠栏1end-->

        <!--折叠栏2-->
        <el-collapse-item title="项目基本信息" name="2">
          <el-form-item label="项目类型：" v-if="proType === 'default' || proType === 'approval'">
            <!--{{formAlignRight.basicInformation.type}}-->
            投标贷
            <!--威望让写的-->
          </el-form-item>
          <el-form-item label="项目名称：">
            {{formAlignRight.name}}
          </el-form-item>
          <el-form-item label="项目ID：">
            {{formAlignRight.productId}}
          </el-form-item>
          <el-form-item label="申请ID：">
            {{formAlignRight.loanNo}}
          </el-form-item>
          <el-form-item label="借款金额(元)：">
            {{loanAmount}}
          </el-form-item>
          <el-form-item label="借款利率(%)：">
            <!--{{(formAlignRight.rate || 0 ) + '%'}}{{rateType}}-->
            {{(rate || 0 ) + '%'}}{{rateType}}
          </el-form-item>
          <el-form-item :label=loanTimeUnit>
            {{formAlignRight.loanTime}}
          </el-form-item>
          <el-form-item label="起息日：" v-if="proType !== 'default' && proType !== 'approval'">
            {{repayStartDate }}
          </el-form-item>
          <el-form-item label="到期日：" v-if="proType !== 'default' && proType !== 'approval'">
            {{repayEndDate}}
          </el-form-item>
          <el-form-item label="还款方式：">
            {{repayType}}
          </el-form-item>
        </el-collapse-item>
        <!--折叠栏2end-->

        <!--发布详情-->
        <el-collapse-item title="项目运营" name="6" v-if="proType !== 'default' && proType !== 'approval'">
          <el-form-item label="是否收取出借人手续费：">
            {{isLenderFee}}
          </el-form-item>
          <el-form-item label="是否线上收取融资人费用：">
            {{isGatherFee}}
          </el-form-item>
          <el-form-item label="是否支付投资奖励金：">
            {{isTenderingPay}}
          </el-form-item>
          <el-form-item label="是否允许转让：">
            {{isAssignment}}
          </el-form-item>
          <el-form-item label="是否允许提前还款：">
            {{isAdvanceRepayment }}
          </el-form-item>
          <el-form-item label="是否允许逾期还款：">
            {{isOverdueRepayment}}
          </el-form-item>
        </el-collapse-item>

        <el-collapse-item title="销售信息" name="7" v-if="proType !== 'default'&& proType !== 'approval'">
          <el-form-item label="募集开始时间：">
            {{tenderStartTime}}
          </el-form-item>
          <el-form-item label="募集结束时间：">
            {{tenderEndTime}}
          </el-form-item>
          <el-form-item label="起投金额：">
            {{tenderInitAmount}}
          </el-form-item>
          <el-form-item label="递增金额：">
            {{tenderIncreaseAmount}}
          </el-form-item>
          <el-form-item label="单笔出借限额：">
            {{singleMaxAmont}}
          </el-form-item>
          <el-form-item label="单人出借限额：">
            {{tenderMaxAmount}}
          </el-form-item>
        </el-collapse-item>
        <!--发布详情end-->

        <!--折叠栏3-->
        <el-collapse-item title="资料介绍" name="3">
          <el-form-item label="负债情况：">
            {{isDebt}}
          </el-form-item>
          <el-form-item label="近6个月逾期情况：">
            {{isOverdue}}
          </el-form-item>
          <el-form-item label="第三方平台借款情况：">
            {{isBorrow}}
          </el-form-item>
          <el-form-item label="项目简介：">
            {{formAlignRight.productProfile}}
          </el-form-item>
          <el-form-item label="借款用途：">
            {{formAlignRight.loanUsage}}
          </el-form-item>
          <el-form-item label="还款来源：">
            {{formAlignRight.repaySource}}
          </el-form-item>
          <el-form-item label="还款保障措施：">
            {{formAlignRight.repaymentGuaranteeMeasures }}
          </el-form-item>
          <el-form-item label="附件：">
            <el-row type="flex">
              <el-col v-for="x in formAlignRight.attachments" style="text-align: center" class="pLeft20">
                <img :src='x.doodleUrl? `${picUrl}${x.doodleUrl}`: x.thumbnailUrl' alt="此处为图片" class="imgShow " :class="{pointer:proType === 'approval'}"
                     @click='picAlertBox(x)'>
                <p  v-if="x.doodleUrl" >{{x.desc}} <i class="el-icon-circle-check" style="color: #00AA88"></i></p>
                <p v-else>{{x.desc}}</p>
              </el-col>
            </el-row>
          </el-form-item>
        </el-collapse-item>
        <!--折叠栏3end-->

        <!--折叠栏4-->
        <el-collapse-item title="标包信息" name="4">
          <el-form-item label="项目名称：">
            {{formAlignRight.productName}}
          </el-form-item>
          <el-form-item label="项目编号：">
            {{formAlignRight.productNo}}
          </el-form-item>
          <el-form-item label="标包编号：">
            {{formAlignRight.packetNo}}
          </el-form-item>
        </el-collapse-item>
        <!--折叠栏4end-->

        <!--折叠栏5-->
        <el-collapse-item title="审核信息" v-if="proType === 'approval'" name="5">

          <el-form-item label="审核结果：" required>
            <el-radio v-model="form.status" label='10'>通过</el-radio>
            <el-radio v-model="form.status" label='20'>不通过</el-radio>
          </el-form-item>

          <el-form-item label="项目风险等级：" v-show="form.status === '10'" required>
            <el-select name="type" v-model="form.riskLevel">
              <el-option v-for="x in productRiskLevelOptions" :value="x.value"
                         :label="(x.label.length>2 ? x.label.substr(2) : x.label)"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="原因：" v-show="form.status === '20'" required>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.reason">
            </el-input>
          </el-form-item>

          <el-row :gutter="20">
            <el-form-item label="">
              <el-button type="primary" size="large" class="btn" @click="saveData" :disabled="disabledStatus"
                         v-loading.fullscreen.lock="loadingFull">保存
              </el-button>
              <el-button :plain="true" type="danger" size="large" @click="backPage" class="btn">取消</el-button>
            </el-form-item>
          </el-row>
        </el-collapse-item>
        <!--折叠栏5end-->

      </el-collapse>
    </el-form>

    <!-- 对话框 -->
    <el-dialog title="" v-model="alertBox" size="tiny">
      <div style="text-align: center">是否确认该项目审核不通过，企业支付的保证金将自动退回</div>
      <div slot="footer" class="dialog-footer" style="text-align: center;display: flex;justify-content: space-around">
        <el-button @click="alertBox = false;disabledStatus = false">取 消</el-button>
        <el-button type="primary" @click="ajaxFn">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import * as API from '../../../store/api'
  import * as TOOL from '../../../assets/js/tools'

  export default {
    props: ['formAlignRight', 'proId', 'proType'],
    data () {
      return {
        activeNames: ['1', '2', '3', '4', '5', '6', '7'],
        picUrl: TOOL.getDomain(),
        productRiskLevelOptions: TOOL.fetchObj('commonObj').ProductRiskLevel, // 项目风险等级下拉框---未与api确认过
        borrowerTypeZZOptions: TOOL.fetchObj('commonObj').BorrowerTypeZZ, // ????
        certTypeZZOptions: TOOL.fetchObj('commonObj').CertTypeZZ, // 项目风险等级下拉框---未与api确认过
        isBorrowZZOptions: TOOL.fetchObj('commonObj').IsBorrowZZ, // 第三方平台借款情况
        isDebtZZOptions: TOOL.fetchObj('commonObj').IsDebtZZ, // 负债情况
        isOverdueZZOptions: TOOL.fetchObj('commonObj').IsOverdueZZ, // 近6个月逾期情况
        loanTimeUnitZZOptions: TOOL.fetchObj('commonObj').LoanTimeUnitZZ, // 借款期限(天) 单位
        rateTypeZZOptions: TOOL.fetchObj('commonObj').RateTypeZZ, // 利率类型
        repayTypeZZOptions: TOOL.fetchObj('commonObj').RepayTypeZZ, // 还款方式
        isXXXOptions: TOOL.fetchObj('commonObj').IsXXX, // 是否
        disabledStatus: false, // 保存按钮禁用状态
        loadingFull: false, // loading
        form: {
          productId: this.proId,
          status: '10',
          reason: '',
          riskLevel: ''
        }, // 审核表单内容
        alertBox: false// 弹出框
      }
    },
    methods: {
      backPage () {
        this.$router.go(-1)
      },

      // 图片展示详情
      picAlertBox (x) {
        if (this.proType === 'approval') {
          TOOL.saveObj('editActiveImgObj', x)
          this.$router.push({name: 'TBDEditImg'})
        }
      },

      saveData () {
        // 审核通过
        if (this.form.status === '10') {
          // 页面中有未涂鸦的附件
          let nullDoodle = []
          for (let x of this.formAlignRight.attachments) {
            if (!x.doodleUrl) {
              nullDoodle.push(x.desc)
            }
          }
          if (nullDoodle.length) {
            TOOL.msgBox(this, `附件 ${nullDoodle.join(' ')} 未涂鸦`, false, false)
            return false
          }
          // 未选择风险等级
          if (!this.form.riskLevel) {
            TOOL.msgBox(this, '请检查字段录入规则', false, false)
            return false
          }
        }

        // 审核不通过
        if (this.form.status === '20') {
          if (!this.form.reason || this.form.reason.length > 1024) {
            TOOL.msgBox(this, '请检查字段录入规则', false, false)
            return false
          } else {
            this.alertBox = true
            return false
          }
        }
        this.ajaxFn()
      },

      // 审核接口
      ajaxFn () {
        this.alertBox = false
        this.loadingFull = true// 全屏loading
        API.$productAudit(this.form, res => {
          setTimeout(() => { // 在不通过情况下,后台数据同步慢,所以加上500毫秒延迟
            this.disabledStatus = false// 保存按钮禁用
            this.loadingFull = false// 全屏loading
            if (res.success) {
              this.$router.go(-1)
            } else {
              TOOL.msgBox(this, res.resultMsg, false, true, '', () => {
                this.$router.go(-1)
              })
            }
          }, 500)
        })
      }
    },
    computed: {
      loanAmount: function () {
        return TOOL.fenToYuan(this.formAlignRight.loanAmount)
      },
      //      rate: function () {
      //        return this.formAlignRight.rate;
      //      },
      rate: function () {
        return TOOL.yuanToFen(this.formAlignRight.rate)
      },
      tenderInitAmount: function () { // 起投金额
        return TOOL.fenToYuan(this.formAlignRight.tenderInitAmount)
      },
      tenderIncreaseAmount: function () { // 递增金额
        return TOOL.fenToYuan(this.formAlignRight.tenderIncreaseAmount)
      },
      singleMaxAmont: function () { // 单笔出借限额
        return TOOL.fenToYuan(this.formAlignRight.singleMaxAmont)
      },
      tenderMaxAmount: function () { // 单人出借限额
        return TOOL.fenToYuan(this.formAlignRight.tenderMaxAmount)
      },
      tenderStartTime: function () { // 募集开始时间
        return TOOL.normalTime(this.formAlignRight.tenderStartTime)
      },
      tenderEndTime: function () { // 募集结束时间
        return TOOL.normalTime(this.formAlignRight.tenderEndTime)
      },
      repayStartDate: function () { // 起息日
        return TOOL.normalTime(this.formAlignRight.repayStartDate)
      },
      isBorrow: function () { // 第三方平台借款情况
        return TOOL.valueToLabel(this.isBorrowZZOptions, this.formAlignRight.isBorrow)
      },
      isOverdue: function () { // 近6个月逾期情况
        return TOOL.valueToLabel(this.isOverdueZZOptions, this.formAlignRight.isOverdue)
      },
      isDebt: function () { // 负债情况
        return TOOL.valueToLabel(this.isDebtZZOptions, this.formAlignRight.isDebt)
      },
      loanTimeUnit: function () { // 借款期限(天)
        return `借款期限(${TOOL.valueToLabel(this.loanTimeUnitZZOptions, this.formAlignRight.loanTimeUnit)})：`
      },
      repayType: function () { // 还款方式
        return TOOL.valueToLabel(this.repayTypeZZOptions, this.formAlignRight.repayType)
      },
      rateType: function () { // 利率类型
        return TOOL.valueToLabel(this.rateTypeZZOptions, this.formAlignRight.rateType)
      },
      isLenderFee: function () { // 是否收取出借人手续费
        return TOOL.valueToLabel(this.isXXXOptions, this.formAlignRight.isLenderFee)
      },
      isGatherFee: function () { // 是否线上收取融资人费用
        return TOOL.valueToLabel(this.isXXXOptions, this.formAlignRight.isGatherFee)
      },
      isTenderingPay: function () { // 是否支付投资奖励金
        return TOOL.valueToLabel(this.isXXXOptions, this.formAlignRight.isTenderingPay)
      },
      isAssignment: function () { // 是否允许转让
        return TOOL.valueToLabel(this.isXXXOptions, this.formAlignRight.isAssignment)
      },
      isAdvanceRepayment: function () { // 是否允许提前还款
        return TOOL.valueToLabel(this.isXXXOptions, this.formAlignRight.isAdvanceRepayment)
      },
      isOverdueRepayment: function () { // 是否允许逾期还款
        return TOOL.valueToLabel(this.isXXXOptions, this.formAlignRight.isOverdueRepayment)
      },
      foundingTime: function () { // 成立时间
        return TOOL.normalTimeDay(this.formAlignRight.foundingTime)
      },
      regCapital: function () { // 注册资本
        return TOOL.fenToYuan(this.formAlignRight.regCapital)
      },
      repayEndDate: function () { // 到期时间
        return TOOL.normalTime(this.formAlignRight.repayEndDate)
      }
    }
  }
</script>

<style lang="less" scoped>
  .pointer {
    cursor: pointer;
  }
</style>
