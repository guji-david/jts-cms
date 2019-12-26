<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <div style="margin: 50px 10px"></div>
    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      style="width: 100%">
      <el-table-column
        label="手机号"
        prop="mobile"
      >
        <!--<template scope="scope">
          <div @click="toTelDetail(scope.row)" class="linkColor">{{scope.row.mobile}}</div>
        </template>-->
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        :formatter='moneyFormat'
        label="在投金额"
      >
      </el-table-column>
    </el-table>
    <!-- 列表结束 -->
    <!-- 分页开始 -->
    <div class="z-pager" v-if="totalCount>0">
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
    <div class="back-btn text-center">
      <el-button @click="back()" >返回</el-button>
    </div>
  </div>
</template>

<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  export default {
    data () {
      return {
        breadcrumName: '详情',
        cashId: TOOL.getProID(this.$route.params.id),
        totalCount: 0,
        currentPage: 1,
        tableData: [],
        pageNo: 1,
        pageSize: 5
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      this.getTablelist()
    },
    methods: {
      // 跳转详情
      toTelDetail (row) {
        TOOL.clearProData()
        this.$router.push({name: 'AccountInfoDetail', params: { mobile: row.mobile }})
      },
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 金额转换
      moneyFormat (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },

      /* --------------------------------------------分页,查询---------------------------------------------------------- */

      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTablelist()
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTablelist()
        console.log(`当前页: ${this.pageNo}`)
      },

      getTablelist () {
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'id': this.cashId
        }
        API.$userProfitDetails(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      // 返回
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>
