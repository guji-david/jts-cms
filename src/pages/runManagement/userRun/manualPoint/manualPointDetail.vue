<template>
  <div  class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <h2>发放详情</h2>
    <hr>
    <div class="pointForm">
      <!-- 列表开始 -->
      <el-table
        :data="tableData"
        type="expand"
        border
        style="width: 100%">
        <el-table-column
          prop="mobile"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="point"
          label="积分"
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          :formatter="formatterDate"
          label="时间"
        >
        </el-table-column>
        <el-table-column
          prop="sendStatus"
          :formatter="sendStatusFomat"
          label="状态"
        >
        </el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
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
      <!-- 分页结束 end-->
      <div style="padding:20px 0px 50px 0px; text-align:center"  v-if="type!=1">
        <el-button :plain="true" style="margin-left: 10px" type="primary" size="" @click="back" class="btn">返回</el-button>
      </div>
    </div>







  </div>
</template>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        breadcrumName: '',
        currentPage: 1,
        totalCount: 0,
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        id: TOOLS.getProID(this.$route.params.id),
        MessageSendStatusOptions: TOOLS.fetchObj('commonObj').MessageSendStatus
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      this.breadcrumName = '详情'
      this.getTableList(this.pageSize, this.pageNo)
    },
    methods: {
      // 时间转化
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },
      // 发送状态转化
      sendStatusFomat (row, column) {
        return TOOLS.valueToLabel(this.MessageSendStatusOptions, row[column.property])
      },
      getTableList (pageSize, pageNo) {
        API.$pointBatchRecordList(this.id, pageSize, pageNo, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 分页
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageSize, this.pageNo)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageSize, this.pageNo)
      },
      // 返回
      back () {
        this.$router.go(-1)
      }
    }
  }
</script>
<style scoped lang="less">
  .pointForm{
    margin: 50px;

  }
</style>
