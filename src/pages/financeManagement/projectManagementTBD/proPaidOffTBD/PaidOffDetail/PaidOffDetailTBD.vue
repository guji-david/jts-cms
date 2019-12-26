<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <header class="header">
      <div v-for="(x,index) in headerData" @click="repaymentPlantTBD(x.productId,x.repayPlanDate,index)" :class="{active:active===index}">{{planDate[index]}}</div>
    </header>
    <main>
      <el-row class="m20">
        <span class=" mRight20">当期还款状态：</span><span class="mRight20">{{repayStatus}}</span>
      </el-row>

      <el-row class="m20">
        <span class="mRight20">当期还款账户：</span>
        <span  v-if="accountType == 1 ">内部户</span>
        <!--<span  v-if="accountType == 2 ">保证金账户</span>-->
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
          label="手续费"
        >
          <template scope="scope">
            <span>0</span>
          </template>
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
    <el-button @click="goback" icon="caret-left" type="primary"></el-button>
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
        repayStatus: '',
        active: 0, // 要换的期数-就是当前是第几期
        accountType: '', // 按钮
        breadcrumName: '详情',
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
          {'label': '受理失败', 'value': 'fail'}],
        repayStatusOptions2: [
          {'label': '', 'value': 'unrepay'},
          {'label': '还款成功', 'value': 'repay'},
          {'label': '还款失败', 'value': 'fail'}],
        repayTypeOptions: TOOL.fetchObj('commonObj').RepayType,
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        productId: TOOL.getProID(this.$route.params.id),
        repayPlanDate: '',
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
        repaymentTradeStatusTrans: [
          {
            label: '',
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
    //        console.log("this.repayStatusOptions");
    //        console.log(JSON.stringify(this.repayStatusOptions));
      API.$repaymentPlanList(this.productId, res => {
        if (res.data.length) {
          this.headerData = res.data// 头部获取数据
          // 转换时间
          for (let x of res.data) {
            this.planDate.push(TOOL.normalTimeDay(x.repayPlanDate))
          }
          // 转换时间结束
          let firstAjax = res.data[0]
          this.repayPlanDate = firstAjax.repayPlanDate
          if (firstAjax) {
            // 还款详情列表
            /* API.$extendList({
              'productId':this.productId ,
              'repayPlanDate':this.repayPlanDate,
              'pageNo':this.pageNo,
              'pageSize':this.pageSize
            },res=>{
              console.log(11111,res.list);
              this.mainData = res.list;
              this.totalCount = res.totalCount;
            }); */
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
      // 还款状态转换
      businessRepayStatusFormatter (row, column) {
        return TOOL.valueToLabel(this.businessRepayStatusOption, row[column.property])
      },
      // 还款方式转换
      repayFomat (row, column) {
        return TOOL.valueToLabel(this.repayTypeOptions, row[column.property])
      },
      // 时间格式化
      dateFormat: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 金额转换
      moneyFormat (row, column) {
        let money = row[column.property]
        return TOOL.fenToYuan(money)
      },
      // 状态类型转换
      formatterRepaymentPeriodStatus (val) {
        return TOOL.valueToLabel(this.repayStatusOptions2, val)
      },
      // 状态类型转换
      formatterRepaymentPeriodStatusTable (row, column) {
        return TOOL.valueToLabel(this.repayStatusOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.productId, this.repayPlanDate)
      //        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.productId, this.repayPlanDate)
      //        console.log(`当前页: ${this.pageNo}这是啥?${this.currentPage}`)
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 头部的tab切换
      repaymentPlant (productId, repayPlanDate, index) {
        this.active = index
        this.mainData.length = 0
        this.repayPlanDate = repayPlanDate
        this.btnAjax()
        this.getTableList()
        this.statusText()
      },

      // 发送按钮的请求
      btnAjax () {
        API.$repaymentPeriodAccount(this.productId, this.headerData[this.active].atIndex, res => {
        //          console.log('按钮',res.data);
        //          console.log(res.data.accountType);
          this.accountType = res.data.accountType
        })
      },

      // 获取还款状态
      statusText () {
        API.$repaymentPeriodStatus(this.productId, this.headerData[this.active].atIndex, res => {
          this.repayStatus = this.formatterRepaymentPeriodStatus(res.data.repaymentStatus)
        })
      },

      goback () {
        this.$router.go(-1)
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
</style>
