<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column
        prop="batchNo"
        label="批次号"
        >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
        >
      </el-table-column>


      <el-table-column
        prop="sendStatus"
        :formatter="formatterSendStatus"
        label="发送状态"
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDate"
        label="发送时间"
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
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页结束 -->
    <div class="text-center">
      <el-button type="primary"  @click="back" class="is-plain">返回</el-button>
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
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        tableData: [],
        batchNo: TOOLS.getProID(this.$route.params.batchNo)
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      this.breadcrumName = '站内信列表'
      this.messageList(this.pageNo, this.pageSize)
    },
    methods: {
      // 产品类型转换
      formatterSendStatus (val) {
      //        return TOOLS.valueToLabel(this.sendStatusOptions,val.businessType)
        return '发送成功'
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },
      // 获取站内信列表
      messageList (pageNo, pageSize) {
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'batchNo': this.batchNo
        }
        API.$queryMessageView(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.messageList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.messageList(val, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      back () {
        this.$router.go(-1)
      }

    }
  }
</script>
<style lang="less" scope>
  .text-center{
    text-align:  center;
  }
</style>
