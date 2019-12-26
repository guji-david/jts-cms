<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
  <!--  <div class="z-search-box">
      <el-form :model="loanManagerForm" label-width="120px" ref="loanManagerForm">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="还款日：" prop="repayPlanDate ">
                <el-date-picker
                  v-model="loanManagerForm.repayPlanDate"
                  type="date"
                  placeholder="选择日期"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="产品名称：" prop="productName">
                <el-input v-model="loanManagerForm.productName"placeholder="请输入项目名称" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="产品代码：" prop="productName">
                <el-input v-model="loanManagerForm.productName"placeholder="请输入项目名称" ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
       &lt;!&ndash; <el-row>
          <el-col :span="8" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
          </el-col>
        </el-row>&ndash;&gt;
      </el-form>
    </div>-->
    <!-- 搜索结束 -->

    <div class="z-tool-bar-loan">
      放款明细
    </div>

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">

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
        prop="serialNo"
        label="资金冻结流水"
      >
      </el-table-column>
      <el-table-column
        prop="transAmount"
        :formatter="formatterTransAmount"
        label="出借金额(元)"
      >
      </el-table-column>
    <!--  <el-table-column
        prop="interest"
        label="利息(元)"
      >
      </el-table-column>
      <el-table-column
        prop="loanStatus"
        :formatter=formatterLoanStatus
        label="放款状态"
      >
      </el-table-column>-->
      <el-table-column
        prop="loanSerialNo"
        label="银行放款流水号"
      >
      </el-table-column>
      <el-table-column
        prop="instSettleDate"
        label="机构清算日期"
      >
      </el-table-column>
      <el-table-column
        prop="notifyStatus"
        :formatter="fomatterNotifyStatus"
        label="银行处理进度"
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

    <div class="z-tool-bar-back text-center">
      <el-button type="primary" @click="back" class="is-plain">返回</el-button>
    </div>



  </div>
</template>



<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'

  export default {
    data () {
      return {
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        breadcrumName: '',
        totalCount: 0,
        currentPage: 1,
        //        notifyStatusOptions:TOOLS.fetchObj("commonObj").RepayStatus,
        notifyStatusOptions: [

          {
            label: '成功',
            value: 4
          },
          {
            label: '失败',
            value: 5
          }
        ], // 银行处理进度枚举,
        repayTypeOptions: TOOLS.fetchObj('commonObj').RepayType,
        loanManagerForm: {
          repayPlanDate: '', // 还款日
          productName: ''// 项目名称
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        productId: TOOLS.getProID(this.$route.params.productId)
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      this.breadcrumName = '详情'
      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {

      // 红包金额（元）转换
      formatterTransAmount (val) {
        return TOOLS.fenToYuan(val.transAmount)
      },

      // 银行处理进度转换
      fomatterNotifyStatus (val) {
        return TOOLS.valueToLabel(this.notifyStatusOptions, val.notifyStatus)
      },

      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.instSettleDate)
      },

      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageNo, this.pageSize)
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageNo
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageNo, this.pageSize)
        console.log(`当前页: ${this.pageNo}`)
      },

      // 请求数据
      getTableList (pageNo, pageSize) {
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'productId': this.productId
        //          "repayPlanDate":this.repayPlanDate,
        }
        API.$productLoanPageList(obj, res => {
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
<style lang="less" scoped>
  .z-tool-bar-loan{
    position: relative;
    height: 45px;
    line-height: 45px;
    padding: 10px 20px;
    margin-bottom: 10px;
    font-size: 20px;
    color: #48576a;
    font-family: "Microsoft Yahei";
    border-bottom: 1px solid #dfeceb;
    .z-tool-bar-back{
      position: absolute;
      top: 5px;
      right: 20px;
    }
  }
  .text-center{
    text-align: center;
  }
</style>
