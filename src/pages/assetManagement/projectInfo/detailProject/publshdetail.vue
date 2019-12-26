<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="formAlignRight" label-width="220px"  ref="formAlignRight">
        <el-collapse v-model="activeNames" >
          <!--折叠栏1-->
          <el-collapse-item title="借款方信息" name="1">
            <el-form-item label="借方类型：">
              {{formAlignRight.unitType}}
            </el-form-item>
            <el-form-item label="借方名称：" >
              {{formAlignRight.borrowerName}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏1end-->

          <!--折叠栏2-->
          <el-collapse-item title="项目信息" name="2">
            <el-form-item label="项目类型：">
              {{formAlignRight.type}}
            </el-form-item>
            <el-form-item label="项目名称：" >
              {{formAlignRight.name}}
            </el-form-item>
            <el-form-item label="项目ID：" >
              {{proId}}
            </el-form-item>
            <el-form-item label="借款金额(元)：">
              {{formAlignRight.amount}}
            </el-form-item>
            <el-form-item label="还款方式：">
              {{formAlignRight.repayType}}
            </el-form-item>
            <el-form-item label="结息日：">
              {{formAlignRight.repayInterestDay}}
            </el-form-item>
            <el-form-item label="借款利率(%)：">
              {{formAlignRight.annualRate}}
            </el-form-item>
            <!--<el-form-item label="浮动利率(%)：">-->
              <!--{{formAlignRight.floatAnnualRate}}-->
            <!--</el-form-item>-->
            <el-form-item label="借款期限(天)：">
              {{formAlignRight.timeLimit}}
            </el-form-item>
            <el-form-item label="起息日：">
              {{formAlignRight.repayStartDate}}
            </el-form-item>
            <el-form-item label="到期日：">
              {{formAlignRight.repayEndDate}}
            </el-form-item>
            <el-form-item label="项目风险等级：">
              {{formAlignRight.riskRating}}
            </el-form-item>
            <el-form-item label="是否支付募集期利息：">
             {{formAlignRight.isTenderingPay}}
            </el-form-item>
            <el-form-item label="是否允许转让：">
              {{formAlignRight.isAssignment}}
            </el-form-item>
            <el-form-item label="转让规则：" v-if="formAlignRight.isAssignment=='true'">
              <el-row>
                持有
                <input type="text">
                天，
                <input type="text">
                天不允许转让
              </el-row>
            </el-form-item>
            <el-form-item label="是否允许使用红包：">
              {{formAlignRight.isUseRedpacket}}
            </el-form-item>
            <el-form-item label="是否允许使用加息券：">
              {{formAlignRight.isUseCoupon}}
            </el-form-item>
            <el-form-item label="是否允许提前还款：">
              {{formAlignRight.isAdvanceRepayment}}
            </el-form-item>
            <el-form-item label="最大提前天数：" v-if="formAlignRight.isAdvanceRepayment == 'true'">
              {{formAlignRight.advanceDay}}
            </el-form-item>
            <el-form-item label="是否允许逾期还款：">
              {{formAlignRight.isOverdueRepayment}}
            </el-form-item>
            <el-form-item label="最大逾期天数：" v-if="formAlignRight.isOverdueRepayment == 'true'">
              {{formAlignRight.overdueDay}}
            </el-form-item>
            <el-form-item label="是否收取融资人费用：">
              {{formAlignRight.isGatherFee}}
            </el-form-item>
            <el-form-item label="收费时点：" v-if="formAlignRight.isGatherFee == 'true'">
              {{formAlignRight.gatherFeePoint}}
            </el-form-item>
            <el-form-item label="收费方式：" v-if="formAlignRight.isGatherFee == 'true'">
              {{formAlignRight.gatherFeeType}}
            </el-form-item>
            <el-form-item label="收费内容：" v-if="formAlignRight.isGatherFee == 'true'">
              {{formAlignRight.gatherFeeContent}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏2end-->

          <!--折叠栏3-->
          <el-collapse-item title="合同信息" name="3">
            <el-form-item label="交易合同编号：" >
              {{formAlignRight.tradeContractNO}}
            </el-form-item>
            <el-form-item label="交易合同名称：" >
              {{formAlignRight.contractName}}
            </el-form-item>
            <el-form-item label="交易合同应收账款金额(元)：" >
              {{formAlignRight.contractCollectFeesFinancing}}
            </el-form-item>
            <el-form-item label="保理合同号：" >
              {{formAlignRight.baoliContractNO}}
            </el-form-item>
            <el-form-item label="保理合同名称：">
              {{formAlignRight.baoliContractName}}
            </el-form-item>
            <el-form-item label="合同编号：">
              {{formAlignRight.contractNO}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏3end-->

          <!--折叠栏4-->
          <el-collapse-item title="项目描述" name="4">
            <el-form-item label="项目简介：" >
              {{formAlignRight.productProfile}}
            </el-form-item>
            <el-form-item label="项目介绍：" >
              {{formAlignRight.productIntroduction}}
            </el-form-item>
            <el-form-item label="业务介绍：" >
              {{formAlignRight.businessIntroduction}}
            </el-form-item>
            <el-form-item label="还款来源：" >
              {{formAlignRight.repaySource}}
            </el-form-item>
            <el-form-item label="风控措施：">
              {{formAlignRight.riskMethod}}
            </el-form-item>
            <el-form-item label="增信措施：">
              {{formAlignRight.trustMethod}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏4end-->

          <!--折叠栏5-->
          <el-collapse-item title="销售信息" name="5">
            <el-form-item label="募集开始时间：" >
              {{formAlignRight.tenderStartTime}}
            </el-form-item>
            <el-form-item label="募集结束时间：" >
              {{formAlignRight.tenderEndTime}}
            </el-form-item>
            <el-form-item label="起投金额：" >
              {{formAlignRight.tenderInitAmount}}
            </el-form-item>
            <el-form-item label="递增金额：" >
              {{formAlignRight.tenderIncreaseAmount}}
            </el-form-item>
            <el-form-item label="累计最大可投金额：">
              {{formAlignRight.tenderMaxAmount}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏5end-->

          <!--折叠栏6-->
          <el-collapse-item title="附件资料" name="6">
            <el-row type="flex">
              <el-col v-for="x in imgList">
                <p class="pLeft20">{{formatImgTitle(x.property)}}</p>
                <img :src='[x.value?url+x.value:""]' alt="此处为图片" class="imgShow">
              </el-col>
            </el-row>
          </el-collapse-item>
          <!--折叠栏6end-->

          <el-form-item label=""  v-if="$route.params.type == 'default'">
            <el-row :gutter="20">
              <el-button type="primary" size="large" class='btn'  @click="backPage">确定</el-button>
              <el-button :plain="true" type="danger"  @click="backPage" class="btn">取消</el-button>
            </el-row>
          </el-form-item>

          <Afooter :routerId="proId"  v-if="proType == 'approval'"></Afooter>
          <Pfooter :routerId="proId"  v-if="proType == 'publish'"></Pfooter>

        </el-collapse>
      </el-form>
    </div>
  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import Afooter from '../components/footerApprove.vue'
  import Pfooter from '../components/footerPublish.vue'
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        activeNames: ['1', '2', '3', '4', '5', '6', '7'],
        productTypeOptions: TOOL.fetchObj('commonObj').ProductType,
        repayTypeLstOption: TOOL.fetchObj('commonObj').RepayType,
        unitTypeOptions: TOOL.fetchObj('commonObj').BorrowerType,
        riskGradeLst: TOOL.fetchObj('commonObj').RiskRating,
        formAlignRight: {
          gatherFeeContent: '', // 收费内容
          gatherFeeType: '', // 收费方式
          gatherFeePoint: '', // 收费时间点
          isAssignment: '', // 是否允许转让
          isFinancierFee: '',
          repayType: '',
          type: 'default',
          unitType: '',
          borrowerId: '',
          borrowerName: '',
          name: '',
          amount: '',
          annualRate: '',
          floatAnnualRate: '',
          timeLimit: '',
          repayInterestDay: '',
          isAdvanceRepayment: '',
          isOverdueRepayment: '',
          isGatherFee: '',
          advanceDay: '',
          riskRating: '',
          overdueDay: '',
          repayStartDate: '',
          repayEndDate: '',
          businessLicense: '', // 图片的路径
          taxFile: '', // 图片的路径
          isUseRedpacket: '', // 是否让用红包
          isUseCoupon: '', // 是否让用加息劵
          isCollectFeesForFinancing: '', // radio3
          collectFeesDays: '', // radio4
          collectFeesMethod: '', // radio5
          collectFeesContent: '',
          tradeContractNO: '',
          contractName: '',
          contractCollectFeesFinancing: '',
          baoliContractNO: '',
          baoliContractName: '',
          contractNO: '',
          productProfile: '',
          productIntroduction: '',
          businessIntroduction: '',
          repaySource: '',
          riskMethod: '',
          trustMethod: '', // radio6
          tenderStartTime: '',
          tenderEndTime: '',
          tenderInitAmount: '',
          tenderIncreaseAmount: '',
          tenderMaxAmount: '',
          isTenderingPay: ''
        },
        resData: null,
        breadcrumName: TOOL.getBreadcrumName(this.$route.params.breadcrumName),
        imgList: [],
        url: TOOL.getDomain(),
        proId: TOOL.getProID(this.$route.params.id),
        proType: TOOL.getProType(this.$route.params.type)
      }
    },
    methods: {
      moneyFormat001 () {
        this.formAlignRight.amount = TOOL.fenToYuan(this.formAlignRight.amount)
        this.formAlignRight.contractCollectFeesFinancing = TOOL.fenToYuan(this.formAlignRight.contractCollectFeesFinancing)
        this.formAlignRight.tenderInitAmount = TOOL.fenToYuan(this.formAlignRight.tenderInitAmount)
        this.formAlignRight.tenderIncreaseAmount = TOOL.fenToYuan(this.formAlignRight.tenderIncreaseAmount)
        this.formAlignRight.tenderMaxAmount = TOOL.fenToYuan(this.formAlignRight.tenderMaxAmount)
      },
      formatImgTitle (val) {
        if (val === 'qualificationCertificate') {
          return '资质证明'
        } else if (val === 'contractCertificate') {
          return '合同证明'
        }
      },
      arrValue (val, localImg) {
        localImg.length = 0
        for (let i = 0; i < val.length; i++) {
          if (val[i]['property'] === 'qualificationCertificate' || val[i]['property'] === 'contractCertificate') {
            localImg.push(val[i])
          }
        }
        console.log(localImg)
      },
      backPage () {
        this.$router.go(-1)
      }
    },
    components: {
      breadcrumbNav,
      Pfooter,
      Afooter
    },
    mounted () {
    //      this.formAlignRight.type = this.$route.params.type;//转换产品类型,因为这个传的就是空,所以不用写
      console.log(this.proType)
      console.log('id', this.proId)
      console.log(this.$route.params.id)
      console.log(this.$route.params.type)
      API.postRequest('/gateway/product/get', {id: this.proId}, res => {
        console.log(res.data)
        let resData = res.data

        TOOL.replaceArrayVal(resData.productExtends, this.formAlignRight)
        TOOL.replaceVal(resData, this.formAlignRight)

        this.formAlignRight.repayStartDate = TOOL.normalTimeDay(this.formAlignRight.repayStartDate)

        this.formAlignRight.tenderStartTime = TOOL.normalTime(this.formAlignRight.tenderStartTime)
        this.formAlignRight.tenderEndTime = TOOL.normalTime(this.formAlignRight.tenderEndTime)

        TOOL.trueOrFalse(this.formAlignRight)
        this.formAlignRight.type = TOOL.valueToLabel(this.productTypeOptions, this.formAlignRight.type)
        // 由于没有返回unitType采用的临时方法
        this.formAlignRight.unitType = TOOL.valueToLabelTemporary(this.unitTypeOptions, this.formAlignRight.unitType)
        this.formAlignRight.repayType = TOOL.valueToLabel(this.repayTypeLstOption, this.formAlignRight.repayType)
        this.formAlignRight.riskRating = TOOL.valueToLabel(this.riskGradeLst, this.formAlignRight.riskRating)
        this.arrValue(resData.productExtends, this.imgList)
        this.formAlignRight.repayEndDate = TOOL.timeLimitFormatDay(this.formAlignRight.repayStartDate, this.formAlignRight.timeLimit)
        this.moneyFormat001()
      })
    }
  }
</script>
<style lang="less" scoped>
  .imgShow{
    width: 100px;
    height: 100px;
    background: lightgray;
  }
  .m2{
    margin-bottom: 3%;
  }
  .btn{
    margin-right: 15%;
    margin-left: 5%;
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
    padding: 0 20px;
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
</style>
