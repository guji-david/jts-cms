<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <h3>流标明细</h3>
    <hr>
    <el-table
      :data="tableData"
      border
      style="width: 100%;margin-top: 50px">
      <el-table-column
        prop="id"
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
        label="出借金额（元）"
      >
      </el-table-column>
      <el-table-column
        prop="payAmount"
        :formatter="moneyFormat"
        label="出借本金（元）"
      >
      </el-table-column>
      <el-table-column
        prop="redPacketAmount"
        :formatter="moneyFormat"
        label="红包金额（元）"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter='dateFormat'
        label="出借时间"
      >
      </el-table-column>
      <el-table-column
        prop="serialNo"
        label="本金冻结流水号"
      >
      </el-table-column>
      <el-table-column
        prop="loanSerialNo"
        label="银行解冻流水号"
      >
      </el-table-column>
      <el-table-column
        prop="notifyStatus"
        :formatter="notifyLoanStatusFomat"
        label="银行处理进度"
      >
      </el-table-column>
    </el-table>
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
    <el-row :gutter="20" type="flex" justify="center">
      <el-button @click="goback"  type="primary" class="is-plain">返回</el-button>
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
        form: {
          productId: TOOL.getProID(this.$route.params.id)
        },
        notifyLoanStatusTrans: [
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
        ]// 银行处理进度枚举
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 银行处理进度转换
      notifyLoanStatusFomat (row, column) {
        return TOOL.valueToLabel(this.notifyLoanStatusTrans, row[column.property])
      },
      // 金额转换
      moneyFormat (row, column) {
        let money = row[column.property]
        return TOOL.fenToYuan(money)
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
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
      getTableList (obj) {
        API.$flowDetailList(obj, res => {
          this.totalCount = res.totalCount
          this.tableData = res.list
        })
      }
    }
  }
</script>
