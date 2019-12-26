<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="form" label-width="160px">
        <el-collapse v-model="activeNames" >
          <!--折叠栏1-->
          <el-collapse-item title="基本信息" name="1">
            <el-form-item label="手机号：">
              {{form.mobile}}
            </el-form-item>
            <el-form-item label="真实姓名：" >
              {{form.name}}
            </el-form-item>
            <el-form-item label="身份证号：" >
              {{form.idNo}}
            </el-form-item>
            <el-form-item label="邮箱：" >
              {{form.email}}
            </el-form-item>
            <el-form-item label="是否开户：" >
              {{form.isOpen}}
            </el-form-item>
            <el-form-item label="开户类型：" >
              {{form.eCardType}}
            </el-form-item>
            <el-form-item label="注册来源：" >
              {{!form.source?'自然用户':''}}
            </el-form-item>
            <el-form-item label="剩余可投金额(元)：" >
              {{form.amount}}
            </el-form-item>
            <el-form-item label="注册时间：" >
              {{form.time}}
            </el-form-item>
           <!-- <el-form-item label="是否线下标识：" >
              {{form.isEmployee}}
            </el-form-item>-->
            <el-form-item label="测评结果：" >
              {{form.riskRating}}
            </el-form-item>
            <el-form-item label="测评时间：" >
              {{form.riskTime}}
            </el-form-item>
            <el-form-item label="测评结果是否有效：" >
              {{form.isEffective}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏1end-->

          <!--折叠栏2-->
          <el-collapse-item title="存管账户信息" name="2">
            <el-form-item label="客户绑定协议号：">
              {{form.bindSerialNo}}
            </el-form-item>
            <el-form-item label="存管小帐号：" >
              {{form.virECardNo }}
            </el-form-item>
            <el-form-item label="存管账户类型：" >
              {{form.eCardType}}
            </el-form-item>
            <el-form-item label="存管账户：">
              {{form.eCardNo}}
            </el-form-item>
            <el-form-item label="开户日期：">
              {{form.openTime}}
            </el-form-item>
            <el-form-item label="绑卡银行：">
              {{form.bankId}}
            </el-form-item>
            <el-form-item label="银行卡号：">
              {{form.bankCard}}
            </el-form-item>
            <el-form-item label="银行预留手机号：">
              {{form.accountMobile}}
            </el-form-item>
            <!--<el-form-item label="是否开通增金宝：" >-->
              <!--{{form.openZjb}}-->
            <!--</el-form-item>-->
            <!--<el-form-item label="开通时间：">-->
              <!--{{form.openZjbTime}}-->
            <!--</el-form-item>-->
          </el-collapse-item>
          <!--折叠栏2end-->

          <!--折叠栏3-->
          <el-collapse-item title="平台账户资金信息" name="3">
            <el-form-item label="账户总资产：" >
              {{form.totalAmount}}
            </el-form-item>
            <el-form-item label="可用余额：" >
              {{form.accountBalancePt}}
            </el-form-item>
            <el-form-item label="冻结金额：" >
              {{form.frozenBalancePt}}
            </el-form-item>
            <!--<el-form-item label="可提现金额：" >
              {{form.rechargeAmountPt}}
            </el-form-item>-->
          </el-collapse-item>
          <!--折叠栏3end-->

          <!--折叠栏4-->
          <el-collapse-item title="存管账户资金信息" name="4">
            <el-form-item label="可用余额：" >
              {{form.accountBalance}}
            </el-form-item>
            <el-form-item label="冻结金额：" >
              {{form.frozenBalance}}
            </el-form-item>
            <el-form-item label="可提现金额：" >
              {{form.rechargeAmount}}
            </el-form-item>
            <!--<el-form-item label="最后操作时间：" >-->

            <!--</el-form-item>-->
          </el-collapse-item>
          <!--折叠栏4end-->
        </el-collapse>
        <el-row :gutter="20" type="flex" justify="center">
          <el-button type="primary" @click="backPage" class="is-plain marT20">返回</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
  import breadcrumbNav from '../../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'

  export default {
    data () {
      return {
        activeNames: ['1', '2', '3', '4', '5'],
        options1: [
          {
            value: '1',
            label: '个人'
          }, {
            value: '2',
            label: '企业'
          }],
        repayTypeLst: [
          {
            value: 'anyue',
            label: '按月付息到期还本'
          }],
        riskGradeLst: [
          {
            value: '低',
            label: '低级'
          }, {
            value: '中',
            label: '中级'
          }, {
            value: '高',
            label: '高级'
          }],
        form: {
          accountBalance: '', // 可用余额-存管账户资金信息 ,
          accountBalancePt: '', // 可用余额-平台账户资金信息 ,
          accountId: '', // ,
          accountMobile: '', // 银行预留手机号 ,
          amount: '', // 剩余可投金额 ,
          bankCard: '', // 银行卡号 ,
          bankId: '', // 绑卡银行名称 ,
          bindSerialNo: '', // 客户绑定协议号 ,
          eCardNo: '', // 存管账户 ,
          eCardType: '', // 开户类型/存管账户类型 存管账号(0.存管e户 1.浙商卡) ,
          email: '', // 邮箱 ,
          frozenBalance: '', // 冻结金额-存管账户资金信息 ,
          frozenBalancePt: '', // 冻结金额-平台账户资金信息 ,
          idNo: '', // 身份证号 ,
          isEffective: '', // 测评结果是否有效 ,
          isFreezen: '', // 是否冻结 isxxx true 已冻结 false 未冻结 ,
          isOpen: '', // 是否开户 isxxx true 开户 false 未开户 ,
          mobile: '', // 手机号 ,
          name: '', // 客户姓名 ,
          openTime: '', // 开户日期 ,
          //          openZjb : '',//开通增金宝(0.未开通 1.已开通) ,
          //          openZjbTime : '',//开通增金宝时间 ,
          rechargeAmount: '', // 可提现金额-存管账户资金信息 ,
          rechargeAmountPt: '', // 可提现金额-平台账户资金信息 ,
          riskRating: '', // 风险测评等级 ,
          riskTime: '', // 风险测评时间 ,
          source: '', // 用户来源 ,
          isEmployee: '', // 是否线下用户
          time: '', // 注册时间 ,
          isRecommendReg: '', // 是否线下用户
          totalAmount: '', // 账户总资产 ,
          userId: '',
          virECardNo: ''// 存管小帐号
        },
        resData: null,
        breadcrumName: '预览',
        eCardTypeOption: [
          {
            label: '存管e户',
            value: 0
          },
          {
            label: '浙商卡',
            value: 1
          }
        ],
        mobile: TOOL.getProID(this.$route.params.mobile),
        riskRatingOptions: TOOL.fetchObj('commonObj').RiskRating
      }
    },
    methods: {
      backPage () {
        this.$router.go(-1)
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      API.$GetUserAccountBank(this.mobile, res => {
        console.log(res)
        TOOL.replaceVal(res.data, this.form)
        // 金额转换
        this.form.amount = TOOL.fenToYuan(this.form.amount)
        this.form.accountBalancePt = TOOL.fenToYuan(this.form.accountBalancePt)
        this.form.totalAmount = TOOL.fenToYuan(this.form.totalAmount)
        this.form.frozenBalancePt = TOOL.fenToYuan(this.form.frozenBalancePt)
        this.form.rechargeAmountPt = TOOL.fenToYuan(this.form.rechargeAmountPt)
        this.form.accountBalance = TOOL.fenToYuan(this.form.accountBalance)
        this.form.frozenBalance = TOOL.fenToYuan(this.form.frozenBalance)
        console.log('this.form.rechargeAmount-----1---->' + this.form.rechargeAmount)
        this.form.rechargeAmount = TOOL.fenToYuan(this.form.rechargeAmount)
        console.log('this.form.rechargeAmount---2------>' + this.form.rechargeAmount)
        // 时间转化
        //        this.form.openZjbTime = TOOL.normalTimeDay(this.form.openZjbTime);
        this.form.openTime = TOOL.normalTimeDay(this.form.openTime)
        this.form.riskTime = TOOL.normalTimeDay(this.form.riskTime)
        this.form.time = TOOL.normalTimeDay(this.form.time)
        // 全文替换是否
        TOOL.trueOrFalse(this.form)
        // 格式转换
        this.form.eCardType = TOOL.valueToLabel(this.eCardTypeOption, this.form.eCardType)
        this.form.riskRating = TOOL.valueToLabel(this.riskRatingOptions, this.form.riskRating)
      //        this.form.openZjb =TOOL.valueToLabel(this.openZjb,this.form.openZjb);
      })
    }
  }
</script>
<style lang="less" scoped>

  .m2{
    margin-bottom: 3%;
  }
  #z-edit {
    margin-top: 20px;
  }
  .el-input, .el-textarea {
    width: 80%;
    float: left;
  }

  .z-input-span {
    color: #ff0000;
    padding: 0px 20px;
  }
  .alertBorr{
    color: #FF9900;
  }
  .el-collapse-item__wrap {
    background: #fff;
  }

  .el-collapse-item__header__arrow {
    float: right;
  }

  .el-collapse-item__header {
    border: none
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .marT20{
    margin-top: 20px;
  }
</style>
