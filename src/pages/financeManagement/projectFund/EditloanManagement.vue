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

    <div class="z-tool-bar-loan" >
      还款明细
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
        prop="principalAmount"
        :formatter="formatterPrincipalAmount"
        label="出借金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="tradeTenderCreateTime"
        :formatter="formatterTradeTenderCreateTime"
        label="出借时间"
      >
      </el-table-column>
      <el-table-column
        prop="repayPlanDate"
        label="原出借流水号"
      >
      </el-table-column>
      <el-table-column
        prop="repayAmount"
        :formatter="formatterRepayAmount"
        label="还款总金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="principalAmount"
        :formatter="formatterPrincipalAmount"
        label="还款本金(元)"
      >
      </el-table-column>
      <el-table-column
        prop="repayInterestAmount"
        :formatter="formatterRepayInterestAmount"
        label="还款利息(元)"
      >
      </el-table-column>
      <el-table-column
        prop=""
        label="手续费(元)"
      >
        <template scope="scope">
          <span>0</span>

        </template>
      </el-table-column>
      <el-table-column
        prop="repayCouponInterestAmount"
        :formatter="formatterRepayCouponInterestAmount"
        label="加息金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="repayType"
        :formatter=formatterRepayType
        label="还款类型"
      >
      </el-table-column>
      <el-table-column
        prop="repayStatus"
        :formatter=formatterRepayStatus
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
        label="机构清算日期"
      >
      </el-table-column>
      <el-table-column
        prop="repaymentTradeStatus"
        :formatter="fomatterRepaymentTradeStatus"
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

    <div class="z-tool-bar-back text-center" >
      <el-button  @click="back">返回</el-button>
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
        businessRepayStatusOptions: [
          {
            label: '未还款',
            value: 10
          },
          {
            label: '已还款',
            value: 20
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
        repayTypeOptions: TOOLS.fetchObj('commonObj').RepayType,
        loanManagerForm: {
          repayPlanDate: '', // 还款日
          productName: ''// 项目名称
        },
        tableData: [],
        multipleSelection: [],
        pageNo: 1,
        pageSize: 5,
        productId: TOOLS.getProID(this.$route.params.productId),
        repayPlanDate: TOOLS.normalTimeDay(TOOLS.getProType(this.$route.params.repayPlanDate)),
        repaymentTradeStatusOptions: [
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
      this.breadcrumName = '详情'
      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {
      // 出借金额(元)转换
      formatterPrincipalAmount (val) {
        return TOOLS.fenToYuan(val.principalAmount)
      },
      // 格式化出借时间
      formatterTradeTenderCreateTime (val) {
        return TOOLS.normalTime(val.tradeTenderCreateTime)
      },
      // 还款总金额(元)转换
      formatterRepayAmount (val) {
        return TOOLS.fenToYuan(val.repayAmount)
      },
      // 还款本金(元)转换
//      formatterPrincipalAmount (val) {
//        return TOOLS.fenToYuan(val.principalAmount)
//      },
      // 还款利息(元)转换
      formatterRepayInterestAmount (val) {
        return TOOLS.fenToYuan(val.repayInterestAmount)
      },
      // 手续费(元)转换
      formatterFee (val) {
        return TOOLS.fenToYuan(val.fee)
      },
      // 加息金额(元)转换
      formatterRepayCouponInterestAmount (val) {
        return TOOLS.fenToYuan(val.repayCouponInterestAmount)
      },

      // 还款状态转换
      formatterRepayStatus (val) {
        return TOOLS.valueToLabel(this.businessRepayStatusOptions, val.businessRepayStatus)
      },
      // 还款账户类型转换
      formatterRepayType (val) {
        return TOOLS.valueToLabel(this.repayTypeOptions, val.repayType)
      },

      // 银行处理进度转换
      fomatterRepaymentTradeStatus (val) {
        /* console.log("val.notifyLoanStatus-------->"+val.notifyLoanStatus)
         if(val.notifyLoanStatus==20){
         return "成功"
         }else{
         return "失败"
         } */
        return TOOLS.valueToLabel(this.repaymentTradeStatusOptions, val.repaymentTradeStatus)
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
          'productId': this.productId,
          'repayPlanDate': this.repayPlanDate
        }
        API.$periodDetailList(obj, res => {
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
<style lang="less" scope>
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
</style>
