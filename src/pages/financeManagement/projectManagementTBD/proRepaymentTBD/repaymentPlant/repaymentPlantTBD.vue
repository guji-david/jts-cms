<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <header class="header">
        <div v-for="(x,index) in headerData" @click="repaymentPlantTBD(x.repayPlanDate,index)" :class="{active:active===index}">{{planDate[index]}}</div>
    </header>
    <main>

      <el-row class="m20">
        <el-button @click="repaymentConfirm('1')" style="padding: 8px 25px;" :disabled="repaymentDisabled">还款</el-button>
      </el-row>
    </main>
    <!--下面的表-->
    <el-table
        :data="mainData"
        border
        style="width: 100%">
        <el-table-column
          prop="tradeTenderId"
          label="平台流水号"
        >
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="transAmount"
          :formatter="moneyFormat"
          label="出借金额(元)"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          :formatter='dateFormat'
          label="出借时间"
        >
        </el-table-column>
        <el-table-column
          prop="investmentSerialNo"
          label="原出借流水号"
        >
        </el-table-column>
        <el-table-column
          prop="repayAmount"
          :formatter="moneyFormat"
          label="还款金额"
        >
        </el-table-column>
        <el-table-column
          prop="fee"
          :formatter="moneyFormat"
          label="手续费"
        >
        </el-table-column>
        <el-table-column
          prop="repayCouponInterestAmount"
          :formatter="moneyFormat"
          label="加息金额"
        >
        </el-table-column>
        <el-table-column
          prop="repayType"
          :formatter='repayFomat'
          label="还款类型"
        >
        </el-table-column>
        <el-table-column
          prop="businessRepayStatus"
          :formatter='businessRepayStatusFormatter'
          label="还款状态"
        >
        </el-table-column>
        <el-table-column
          prop="repaymentSerialNo"
          label="银行还款流水号"
        >
        </el-table-column>
        <el-table-column
          prop="instSettleDate"
          :formatter='dateFormat'
          label="机构清算日期"
        >
        </el-table-column>
      <el-table-column
        prop="repayStatus"
        :formatter='formatterRepaymentPeriodStatusTable'
        label="受理状态"
      >
      </el-table-column>
        <el-table-column
          prop="repaymentTradeStatus"
          :formatter="repaymentTradeStatusFomat"
          label="银行处理进度"
        >
        </el-table-column>
      </el-table>
    <!--下面的表end-->
    <!-- 分页开始 -->
    <div class="z-pager">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10,20,40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页结束 -->
    <!--提示框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      >
      <!--:before-close="handleClose"-->

      <!--<el-row type="flex" justify="center" v-show="!dialogErr">-->

        <!--<span class="trans">红利发放：</span>-->
        <!--<i class="el-icon-loading" v-if="dialogLoading"></i>-->
        <!--<span v-if="!dialogLoading" class="mRight20">已发放</span>-->
        <!--<i class="el-icon-check" v-if="!dialogLoading"></i>-->

      <!--</el-row>-->
      <el-row type="flex" justify="center" v-show="!dialogErr">

        <span class="trans">项目还款：</span>
        <i class="el-icon-loading" v-if="dialogLoading"></i>
        <span v-if="!dialogLoading" class="mRight20">已还款</span>
        <i class="el-icon-check" v-if="!dialogLoading"></i>

      </el-row>
      <el-row v-if="!dialogLoading" type="flex" justify="center" v-show="!dialogErr">
        <small class="redFont">此时还款仅代表银行接收还款指令，实际还款由银行处理，您可实时查询银行处理进度。</small>
      </el-row>

      <el-row type="flex" justify="center">
        <h2 v-if="dialogErr">{{dialogErrContent}}</h2>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="space-around">
           <el-button @click="repaymentSending" v-if="dialogErr" type="primary">重 发</el-button>
          <el-button @click="dialogVisible = false" v-if="dialogErr">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false" v-if="!dialogLoading && !dialogErr">确 定</el-button>
        </el-row>
      </span>
    </el-dialog>
    <!--提示框end-->
  </div>
</template>
<script>
  import breadcrumbNav from '../../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../.././../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'

  export default {
    props: ['id'],
    data () {
      return {
        headerData: [],
        mainData: [],
        active: 0, // 要换的期数-就是当前是第几期
        repayStatus: '', // 状态的中文翻译
        accountType: '', // 按钮
        businessRepayStatusOption: [
          {
            label: '未还款',
            value: '10'
          },
          {
            label: '已还款',
            value: '20'
          },
          {
            label: '失败',
            value: '30'
          },
          {
            label: '',
            value: '' || null
          }
        ], // 还款状态枚举
        repaymentPeriodStatusOption: [
          {
            label: '还款完成',
            value: 'repay'
          },
          {
            label: '还款未完成',
            value: 'unrepay'
          }
        ],
        //        repayStatusOptions:TOOL.fetchObj('commonObj').RepayStatus,
        repayStatusOptions: [
          {'label': '', 'value': 'unrepay'},
          {'label': '受理成功', 'value': 'repay'},
          {'label': '受理失败', 'value': 'fail'}
        ],
        repayTypeOptions: TOOL.fetchObj('commonObj').RepayType,
        dialogVisible: false,
        dialogLoading: true, // 弹出框的读取图标
        repaymentDisabled: false,
        dialogErr: false,
        dialogErrContent: '', // 返回的错误信息
        accountTypeNum: null, // 还款账户类型被点击后的数字
        breadcrumName: '还款计划管理',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        productId: TOOL.getProID(this.$route.params.id),
        repayPlanDate: '',
        repaymentTradeStatusTrans: [
          {
            label: '', // 2017年8月14日独有龙让这么改的
            value: 0
          },
          {
            label: '成功',
            value: 4
          },
          {
            label: '失败',
            value: 5
          }
        ], // 银行处理进度枚举
        planDate: []// 期数备份
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      API.$repaymentPlanList(this.productId, res => {
        if (res.data.length) {
          this.headerData = res.data// 头部获取数据
          // 转换时间
          for (let x of res.data) {
          //            this.planDate.push(x.repayPlanDate);
          //            x.repayPlanDate = TOOL.normalTimeDay(x.repayPlanDate)
            this.planDate.push(TOOL.normalTimeDay(x.repayPlanDate))
          }
          // 转换时间结束
          let firstAjax = res.data[0]
          this.repayPlanDate = firstAjax.repayPlanDate
          if (firstAjax) {
            // 还款详情列表
            this.getTableList()
            // 请求按钮数据
            this.btnAjax()
            // 请求状态数据
            this.statusText()
          }
        }
      })
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 银行处理进度转换
      repaymentTradeStatusFomat (row, column) {
        return TOOL.valueToLabel(this.repaymentTradeStatusTrans, row[column.property])
      },
      // 受理状态转换
      repayFomat (row, column) {
        return TOOL.valueToLabel(this.repayTypeOptions, row[column.property])
      },
      // 还款状态转换
      businessRepayStatusFormatter (row, column) {
        return TOOL.valueToLabel(this.businessRepayStatusOption, row[column.property])
      },
      // 时间格式化
      dateFormat: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 金额转换
      moneyFormat (row, column) {
        let money = row[column.property]
        if (!money) {
          return 0
        } else {
          return TOOL.fenToYuan(money)
        }
      },
      // 状态类型转换按钮用
      formatterRepaymentPeriodStatus (val) {
        return TOOL.valueToLabel(this.repayStatusOptions, val)
      },
      // 状态类型转换
      formatterRepaymentPeriodStatusTable (row, column) {
        return TOOL.valueToLabel(this.repayStatusOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList()
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 头部的tab切换
      repaymentPlant (repayPlanDate, index) {
        this.active = index
        this.mainData.length = 0
        this.repayPlanDate = repayPlanDate
        this.getTableList()
        this.btnAjax()
        this.statusText()
      },

      // 还款发送
      repaymentSending () {
        API.$repaymentButton(this.accountTypeNum, this.productId, this.headerData[this.active].atIndex, res => {
          if (res.success) {
            this.btnAjax()// 按钮变化
            this.statusText()// 文本变化
            this.getTableList()// 列表变化
            this.dialogLoading = false
            this.repaymentDisabled = true
          } else {
            this.repaymentDisabled = false
            this.dialogErrContent = res.resultMsg
            this.dialogErr = true
          }
        })
      },

      // 弹出还款确认
      repaymentConfirm (num) {
        this.accountTypeNum = num
        this.$confirm('您将进行还款, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogVisible = true
          this.repaymentSending()
        }).catch((e) => {})
      },

      // 发送按钮的请求
      btnAjax () {
        API.$repaymentPeriodAccount(this.productId, this.headerData[this.active].atIndex, res => {
          this.accountType = res.data.accountType
        })
      },

      // 还款状态的请求
      statusText () {
        API.$repaymentPeriodStatus(this.productId, this.headerData[this.active].atIndex, res => {
          this.repayStatus = this.formatterRepaymentPeriodStatus(res.data.repaymentStatus)
        })
      },
      getTableList () {
        API.$extendList({
          'productId': this.productId,
          'repayPlanDate': new Date(this.repayPlanDate).getTime(),
          'pageNo': this.pageNo,
          'pageSize': this.pageSize
        }, res => {
          this.mainData = res.list || []
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>
<style scoped lang="less">
  .header{
    margin: 10px 0;
    height: 50px;
    display: flex;
    border: 1px solid lightgray;
    &>div{
      display: flex;
      flex: 1;
      justify-content: center;
      align-items: center;
      border-right: 1px solid lightgray ;
      box-sizing: content-box;
      cursor: pointer;
    }
  }
  .active{
    border-bottom: 2px solid #00AA88;
    box-sizing: border-box;
  }
  .m20{
    margin: 20px 0;
  }
  .mRight20{
    margin-right: 20px;
  }
  .redFont{
    color:#ff4949;
  }
  .trans{
    transform: translate(-50%,0);
  }
</style>
