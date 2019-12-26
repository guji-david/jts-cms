<template>
  <div id="content-body" class="content-body">
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="订单号：" prop="orderNo">
                <el-input v-model="form.orderNo" placeholder="请输入订单号" ></el-input>
              </el-form-item>

            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="交易流水号：" prop="paymentNo">
                <el-input v-model="form.paymentNo" placeholder="请输入交易流水号" ></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入项目名称" ></el-input>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="productId">
                <el-input v-model="form.productId" placeholder="请输入项目ID" ></el-input>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="发起时间：" prop="queryDate">
                <el-date-picker
                  type="daterange"
                  placeholder="选择日期"
                  v-model="form.queryDate">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="status">
                <el-select name="type" v-model="form.status">
                  <el-option v-for='x in statusOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0]">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
    </div>
    <!-- 工具栏结束 -->

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
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="处理时间"
        :formatter="formatterDayTime"
      >
      </el-table-column>
      <el-table-column
        label="备注"
      >
        <template scope="scope">
          <span v-if="scope.row.remark !== null && scope.row.remark !==''">
            {{scope.row.remark}}
          </span>
          <span v-else>
            ——
          </span>
        </template>
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

  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        searchBtnViable: false,
        detailBtnViable: false,
        breadcrumName: '',
        tabName: '1',
        totalCount: 0,
        currentPage: 1,
        statusOptions: TOOLS.fetchObj('commonObj').PayStatus,
        form: {
          productId: '', // 项目ID
          productName: '', // 项目名称
          orderNo: '', // 订单号
          paymentNo: '', // 交易流水号
          queryDate: [], // 发起时间
          status: ''// 状态
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray:[]//权限配置
      }
    },
    components: {
      breadcrumbNav
    },
    computed: {
      getFunctionList () {
        if (this.$store.state.functionList.length > 0) {
          return this.$store.state.functionList
        } else {
          this.$store.commit('updataFunctionList', TOOLS.getList('functionList'))
          return this.$store.state.functionList
        }
      }
    },
    beforeMount() {
      if (this.getFunctionList.length > 0) {
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '入账查询':
              this.disabledArray[0] = true
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getTableList(this.tabName, this.pageNo, this.pageSize)
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 格式化日期
      formatterDayTime (row, column) {
        return TOOLS.normalTime(row[column.property])
      },
      // 借款金额（元）转换
      formatterAmount (row, column) {
        return TOOLS.fenToYuan(row[column.property])
      },
      // 状态转换
      fomatterStatus (row, column) {
        return TOOLS.valueToLabel(this.statusOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 每页显示多少条
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.tabName, this.pageNo, this.pageSize)
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 第几页
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.tabName, this.pageNo, this.pageSize)
        console.log(`当前页: ${this.pageNo}`)
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */

      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.tabName, this.pageNo, this.pageSize)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      queryDateChange () {
        if (this.form.queryDate.length) {
          if (this.form.queryDate[0] && this.form.queryDate[1]) {
            this.form.startTime = +this.form.queryDate[0]
            this.form.endTime = +this.form.queryDate[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.startTime = ''
            this.form.endTime = ''
          }
        } else {
          this.form.startTime = ''
          this.form.endTime = ''
        }
      },
      // 请求数据
      getTableList (tabName, pageNo, pageSize) {
        this.queryDateChange()
        let obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'productId': this.form.productId, // 项目ID
          'productName': this.form.productName, // 项目名称
          'orderNo': this.form.orderNo, // 订单号
          'startTime': this.form.startTime, // 发起时间
          'endTime': this.form.endTime, // 结束时间
          'status': this.form.status, // 状态
          'paymentNo': this.form.paymentNo// 交易流水号
        }
        API.$pageQueryOverduePay(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>

<style lang="less" scoped>
</style>
