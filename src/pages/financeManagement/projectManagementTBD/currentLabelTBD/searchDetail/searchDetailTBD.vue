<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <h3>项目ID：{{productId}}</h3>
    <hr>
    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column
        prop="orderNo"
        label="订单号"
      >
      </el-table-column>
      <el-table-column
        prop="paymentNo"
        label="交易流水号"
        v-if="proType==1"
      >
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        label="交易流水号"
        v-if="proType==2"
      >
      </el-table-column>
      <el-table-column
        prop="paymentNo"
        label="原支付流水号"
        v-if="proType==2"
      >
      </el-table-column>
      <el-table-column
        prop="refundsType"
        label="交易类型"
        :formatter="formatterRefundsType"
        v-if="proType==2"
      >
      </el-table-column>
      <el-table-column
        prop="borrowerName"
        label="借款人名称"
      >
      </el-table-column>
      <el-table-column
        prop="productName"
        label="项目名称"
      >
      </el-table-column>
      <el-table-column
        prop="productId"
        label="项目ID"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        :formatter="formatterAmount"
        label="金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDayTime"
        label="发起时间"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="fomatterStatus"
        label="状态"
      >
        <!--:formatter="fomatterStatus"-->
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="处理时间"
        :formatter="formatterDayTime"
      >
      </el-table-column>
    </el-table>
    <!-- 列表结束 -->
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
    <el-row style="text-align: center">
      <el-button @click="goback" type="primary" class="is-plain">返回</el-button>
    </el-row>
  </div>
</template>
<script>
  import breadcrumbNav from '../../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../.././../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'

  export default{
    data () {
      return {
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        tableData: [],
        breadcrumName: '详情',
        productId: TOOL.getProID(this.$route.params.id), // id 持久化
        proType: TOOL.getProType(this.$route.params.type), // proType 持久化
        PayStatusOptions: TOOL.fetchObj('commonObj').PayStatus, // proType=1 状态
        RefundsStatusOptions: TOOL.fetchObj('commonObj').RefundsStatus, // proType=2 状态
        refundsTypeOptions: TOOL.fetchObj('commonObj').RefundsType // proType=2 交易类型
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      // 面包屑切换
      (this.proType == '1') ? this.breadcrumName = '项目入账查询' : this.breadcrumName = '项目退款查询'
      this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      this.productId = TOOL.getProID(this.$route.params.id)
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 格式化日期
      formatterDayTime (row, column) {
        return TOOL.normalTime(row[column.property])
      },
      // 借款金额（元）转换
      formatterAmount (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },
      // 交易类型转换 proType=2
      formatterRefundsType (row, column) {
        return TOOL.valueToLabel(this.refundsTypeOptions, row[column.property])
      },
      // 状态转换
      fomatterStatus (row, column) {
        if (this.proType == '1') {
          return TOOL.valueToLabel(this.PayStatusOptions, row[column.property])
        } else {
          return TOOL.valueToLabel(this.RefundsStatusOptions, row[column.property])
        }
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      goback () {
        this.$router.go(-1)
      },
      // 统一处理数据
      objFn () {
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'productId': this.productId, // 项目ID
          'productName': '', // 项目名称
          'orderNo': '', // 订单号
          'startTime': '', // 发起时间
          'endTime': '', // 结束时间
          'status': '', // 状态
          'refundsType': '', // 交易类型
          'paymentNo': ''// 交易流水号
        }
        return obj
      },
      getTableList () {
        if (this.proType == '1') {
          // 入账查询
          API.$pageQueryPay(this.objFn(), res => {
            this.tableData = res.list
            this.totalCount = res.totalCount
          })
        } else {
          // 退款查询
          API.$pageQueryRefunds(this.objFn(), res => {
            this.tableData = res.list
            this.totalCount = res.totalCount
          })
        }
      }
    }
  }
</script>
