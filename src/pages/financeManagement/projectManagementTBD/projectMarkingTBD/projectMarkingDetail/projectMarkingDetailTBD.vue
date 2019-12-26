<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!--tab-->
    <div id="z-edit">
      <el-form :model="formData" label-width="160px" ref="formData">
        <el-collapse v-model="activeNames">
          <!--折叠栏1-->
          <el-collapse-item title="项目信息" name="1">
            <el-form-item label="项目名称：">
              {{formData.name}}
            </el-form-item>
            <el-form-item label="项目规模：">
              {{formData.amount / 100}}
            </el-form-item>
            <el-form-item label="预期年化收益率：">
              {{formData.annualRate}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏1end-->

          <!--折叠栏2-->
          <el-collapse-item title="募集信息" name="2">
            <el-form-item label="募集开始时间：">
              {{formData.tenderStartTime}}
            </el-form-item>
            <el-form-item label="募集结束时间：">
              {{formData.tenderEndTime}}
            </el-form-item>
            <el-form-item label="募集总额：">
              {{formData.tenderAmount}}
            </el-form-item>
            <el-form-item label="使用红包金额：">
              {{formData.redPacketAmount}} 元
            </el-form-item>
            <el-form-item label="募集总人数：">
              {{formData.tenderUserCount}}
            </el-form-item>
            <el-form-item label="募集总笔数：">
              {{formData.tenderItemCount}}
            </el-form-item>
            <el-form-item label="募集期利息：">
              {{formData.tenderInterest / 100}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏2end-->

          <!--折叠栏3-->
          <el-collapse-item title="募集结果" name="3">

            <!--<el-form-item label="融资结果：" v-if="!productLoanFlow ">-->
            <!--<span class="radio"  v-if="radioStatus == 'success'">募集成功</span>-->
            <!--<span class="radio"  v-if="radioStatus == 'fail'">募集失败</span>-->
            <!--</el-form-item>-->
            <el-form-item label="募集结果：">
              <span class="radio" v-if="productLoanFlow == 'success'">募集成功</span>
              <span class="radio" v-if="productLoanFlow == 'fail'">募集失败</span>
            </el-form-item>

            <!--<el-form-item label="融资结果：" v-if="productLoanFlow ">-->
            <!--<el-radio class="radio" v-model="formData.loanResult" label="success" :disabled="textShow == 'fail' || !formData.tenderUserCount" >募集成功</el-radio>-->
            <!--<el-radio class="radio" v-model="formData.loanResult" label="fail" :disabled="textShow == 'success'">募集失败</el-radio>-->
            <!--</el-form-item>-->


            <!--这里以后还得加一个判断-->
            <el-form-item label="是否生成合同：" v-show="!(radioStatus != 'success')">
              {{showData.isGenerateContract}}
              <i class="el-icon-loading" v-if="formData.isGenerateContract=='false' && buttonStatus">{{test}}</i>
            </el-form-item>

            <el-form-item label="是否完成放款：" v-show="!(radioStatus != 'success')">
              {{showData.loanStatus}}
              <i class="el-icon-loading" v-if="formData.loanStatus == 'false' && buttonStatus">{{test}}</i>
            </el-form-item>

            <el-form-item label="是否生成还款计划：" v-show="!(radioStatus != 'success')">
              {{showData.isGeneratePlan}}
              <i class="el-icon-loading" v-if="formData.isGeneratePlan == 'false' && buttonStatus">{{test}}</i>
            </el-form-item>

            <el-form-item label="手续费划转：" v-show="!(radioStatus != 'success')">
              {{showData.serviceCharge}}
              <i class="el-icon-loading" v-if="formData.serviceCharge == 'false' && buttonStatus">{{test}}</i>
            </el-form-item>

            <el-form-item label="是否支付募集期利息：" v-show="!(radioStatus != 'success') && formData.isTenderingPay=='true'">
              {{showData.isPaidInterest}}
              <i class="el-icon-loading" v-if="formData.isPaidInterest == 'false' && buttonStatus">{{test}}</i>
            </el-form-item>

            <!--下面再加一个或判断,判断一下募集期利息是否为true-->
            <el-form-item label="是否完成解冻：" v-show="!(radioStatus != 'fail')">
              {{showData.loanStatus}}
              <i class="el-icon-loading" v-if="formData.loanStatus == 'false' && buttonStatus">{{test}}</i>
            </el-form-item>

            <el-form-item label="是否完成退款：" v-show="!(radioStatus != 'fail')">
              {{showData.refundAdvanceCharge}}
              <i class="el-icon-loading" v-if="formData.refundAdvanceCharge == 'false' && buttonStatus">{{test}}</i>
            </el-form-item>

            <el-form-item label="是否支付募集期利息：" v-show="!(radioStatus != 'fail') && formData.isTenderingPay=='true'">
              {{showData.isPaidInterest}}
              <i class="el-icon-loading" v-if="formData.isPaidInterest == 'false' && buttonStatus">{{test}}</i>
            </el-form-item>
            <!--折叠栏3end-->

            <el-form-item label="" style="text-align: center">
              <el-row :gutter="20">
                <el-button type="primary" class='btn' @click="proMarkingConfirm" :disabled="buttonStatus"
                           style="margin-right: 0px">确定
                </el-button>
                <el-button :plain="true" type="danger" @click="backPage" class="btn" style="margin-left: 10px;">取消
                </el-button>
              </el-row>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <el-dialog
        title="提示"
        :visible.sync="alertVisible"
        size="small"
        :before-close="handleClose">
        <h2 style="text-align: center">请选择一种融资结果</h2>
        <span slot="footer" class="dialog-footer"></span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import breadcrumbNav from '../../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'
  import { MessageBox, Loading } from 'element-ui'

  export default {
    data () {
      return {
        activeNames: ['1', '2', '3', '4', '5', '6'],
        formData: {
          name: '',
          amount: '',
          annualRate: '',
          productType: '',
          tradeContractNO: 'true',
          tenderStartTime: '',
          tenderEndTime: '',
          isUseRedpacket: '',
          isTenderingPay: '', // 是否支付募集期利息使用这个判断下面的显示
          redPacketAmount: '', // 使用红包金额
          tenderUserCount: '', // 募集总人数
          tenderItemCount: '', // 募集总笔数
          tenderAmount: '', // 募集总额
          tenderInterest: '', // 募集期利息
          /* -------------------融资结果的数据----------------------------------- */
          loanResult: 'false', // 融资状态
          loanStatus: 'false', // 放款状态/流标状态
          isPaidInterest: 'false', // 是否支付募集期利息
          isInnerTransferCounpon: 'false', // 是否执行平台资金行内划拨(红包-放款子流程)
          interestAmount: 'false', // 标的投资所有应支付募集期利息
          isGenerateContract: 'false', // 是否生成合同
          isGeneratePlan: 'false', // 是否生成还款计划
          serviceCharge: 'false', // 手续费划转
          refundAdvanceCharge: 'false'// 是否完成退款
          /* -------------------融资结果的数据end----------------------------------- */
        },
        showData: {
          loanResult: false, // 融资状态
          loanStatus: 'false', // 放款状态/流标状态
          isPaidInterest: 'false', // 是否支付募集期利息
          isInnerTransferCounpon: 'false', // 是否执行平台资金行内划拨(红包-放款子流程)
          interestAmount: 'false', // 标的投资所有应支付募集期利息
          isGenerateContract: 'false', // 是否生成合同
          isGeneratePlan: 'false', // 是否生成还款计划
          isUseRedpacket: '', // 是否使用红包金额
          serviceCharge: '', // 手续费划转
          refundAdvanceCharge: ''// 是否完成退款
        },
        resData: null,
        footData: {
          radio: '0',
          value2: '',
          dis: false

        },
        breadcrumName: '项目结标',
        dialogVisible: false,
        dialogLoading: true, // 弹出框的读取图标
        dialogErr: false,
        dialogErrContent: '', // 错误信息的内容
        statusArr: [], // 用它来记录状态
        test: '', // 激活惰性的标签
        closeingOver: true, // 结标接口是否通过
        radioStatus: TOOL.getProType(this.$route.params.type), // radio状态
        buttonStatus: false, // 确认按钮状态
        num: 0, // 请求次数
        productLoanFlow: TOOL.getProType(this.$route.params.type),
        textShow: '', // 融资结果的文本显示
        proId: TOOL.getProID(this.$route.params.id),
        alertVisible: false// 未选择radio情况弹出
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      API.$productGet(this.proId, res => {
        TOOL.replaceVal(res.data, this.formData)
        //        TOOL.replaceVal(res.data.productLoanFlow,this.formData);
        TOOL.replaceVal(this.formData, this.showData)
        this.formData.tenderStartTime = TOOL.normalTimeDay(this.formData.tenderStartTime)
        this.formData.tenderEndTime = TOOL.normalTimeDay(this.formData.tenderEndTime)
        TOOL.trueOrFalse(this.showData)
        this.formData.loanResult = this.radioStatus
        //        this.radioStatus = this.formData.loanResult;
        //        this.productLoanFlow = !res.data.productLoanFlow;
        TOOL.formatNull(this.formData)// 把空值转为'无'
      })
      API.$tenderStat(this.proId, res => {
        TOOL.replaceVal(res.data, this.formData)
        this.formData.tenderAmount = TOOL.fenToYuan(this.formData.tenderAmount)
        this.formData.redPacketAmount = TOOL.fenToYuan(this.formData.redPacketAmount)
        //        this.formData.amount = TOOL.fenToYuan(this.formData.amount);
        TOOL.formatNull(this.formData)// 把空值转为'无'
      })
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 金额转换
      moneyFormat (row, column) {
        let money = row[column.property]
        return TOOL.fenToYuan(money)
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 使用第三方值来触发数据的更新
      triggerUpdata (val) {
        if (val) {
          this.test = ''
        }
        this.test = null
      },

      // 返回上一页
      backPage () {
        this.$router.go(-1)
      },

      // 判断最终结尾的数据
      endData () {
        if (this.formData.isTenderingPay === 'true') {
          return 'isPaidInterest'
        } else if (this.formData.loanResult === 'success') {
          return 'serviceCharge'
        } else if (this.formData.loanResult === 'fail') {
          return 'refundAdvanceCharge'
        } else {
          return 'loanStatus'
        }
      },

      handleClose () {
        this.alertVisible = false
      },

      // 弹出还款确认
      proMarkingConfirm () {
        let msg
        if (this.formData.loanResult !== 'success' && this.formData.loanResult !== 'fail') {
          this.alertVisible = true
        } else {
          if (this.formData.loanResult === 'success') {
            msg = '募集成功'
          } else if (this.formData.loanResult === 'fail') {
            msg = '募集失败'
          }

          MessageBox.confirm(`是否确认对该项目进行"${msg}"操作?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          //          this.dialogVisible = true;
            if (this.formData.tenderItemCount == 0) {
              this.buttonStatus = true
              let loadingInstance = Loading.service({fullscreen: true, lock: true})
              API.$closingOver(this.formData.loanResult, this.proId, res => {
                loadingInstance.close()
                this.buttonStatus = false
                if (res.success) {
                  TOOL.alertConfirm(this, () => {
                    this.$router.go(-1)
                  }, '募集操作成功')
                } else {
                  TOOL.alertConfirm(this, '', res.resultMsg, '', '是', '否', 'error')
                }
              //          this.times(this.endData());
              })
            } else {
              this.num = 0
              this.getTableList()
              this.radioStatus = this.formData.loanResult
              this.buttonStatus = true
              this.textShow = this.formData.loanResult// 融资结果显示
            }
          }).catch(() => {
            return false
          })
        }
      },

      // 轮询时间
      times (key) {
        if (this.num <= 20) {
          setTimeout(() => { this.polling(key) }, 1000)
        } else {
          this.buttonStatus = false
          TOOL.alertConfirm(this, () => {
            return false
          }, '网络速度慢请重新操作', '', '是', '否', '')
          return false
        }
      },

      // 轮询方法
      polling (key) {
        API.$closingFlow(this.proId, res => {
          this.num++
          // 如果返回的为真and结标状态也为真执行以下操作

          TOOL.log('this.closeingOver', this.closeingOver)

          if (res.success && this.closeingOver) {
            TOOL.replaceVal(res.data, this.formData)
            TOOL.replaceVal(this.formData, this.showData)
            TOOL.trueOrFalse(this.showData)
            TOOL.log('formData', this.formData)
            TOOL.log('showData', this.showData)
            TOOL.log('formData[key]', this.formData[key])

            // 如果最后一项返回成功
            if (this.formData[key] === 'true' || this.formData[key] == 10 || this.formData[key] == 20) {
              this.buttonStatus = false
              TOOL.alertConfirm(this, () => {
                this.$router.go(-1)
              }, '全部成功,是否返回上一页', '', '是', '否', '', false)
              // 判断线性请求的最后一项完成状态
            } else if (!this.formData[key] || this.formData[key] === 'false' || this.formData[key] == 30) {
              this.triggerUpdata(this.closeingOver)
              this.times(key)
            }

            // 如果返回的为真and结标状态也为真不成立
          } else {
            this.buttonStatus = false
            return false
          }
        }, err => {
          let condition = navigator.onLine ? 'online' : 'offline'
          TOOL.msgBox(this, `目前网络状态:${condition}`)
        })
      },

      // 请求数据(结标)
      getTableList () {
        API.$closingOver(this.formData.loanResult, this.proId, res => {
          if (res.success) {
            this.closeingOver = true
          } else {
            this.closeingOver = false
            TOOL.alertConfirm(this, '', res.resultMsg, '', '是', '否', 'error')
          }
        })
        this.times(this.endData())
      }
    }
  }
</script>
<style lang="less" scoped>

  .m2 {
    margin-bottom: 3%;
  }

  .btn {
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
    padding: 0px 20px;
  }

  .alertBorr {
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
