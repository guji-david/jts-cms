<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="transferForm" :model="transferForm" label-width="120px">
        <el-row>
          <el-col :span="8">
              <el-form-item label="订单号:" prop="orderNo">
                <el-input v-model="transferForm.orderNo" placeholder="请输入订单号"></el-input>
              </el-form-item>
          </el-col>
         <!-- <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="业务类型：" prop="fundsFor">
                <el-select name="type" v-model="transferForm.fundsFor">
                  <el-option v-for='x in businessTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>-->
          <el-col :span="8">
              <el-form-item label="资金划转账户：" prop="type">
                <el-select name="type" v-model="transferForm.type">
                  <el-option v-for='x in fundTransferTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item label="交易时间：" prop="createTime">
                <el-date-picker
                  v-model="transferForm.createTime"
                  type="daterange"
                  @change="sendTimeChange"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="8">
              <el-form-item label="银行流水号:" prop="bankSerialNo">
                <el-input v-model="transferForm.bankSerialNo" placeholder="请输入银行流水号"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="8" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" v-if="disabledArray[0] === 'true'"@click="searchForm()">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('transferForm')">重置</el-button> </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="plus"v-if="disabledArray[1] === 'true'" @click="accountTransfer()">资金划拨</el-button></span>
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
      <!--<el-table-column
        prop="fundsFor"
        :formatter="formatterFundsFor"
        label="业务类型"
      >
      </el-table-column>-->
      <el-table-column
        prop="type"
        :formatter="formatterType"
        label="资金划转账户"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        :formatter="formatterAmount"
        label="付款金额"
      >
      </el-table-column>
      <el-table-column
        prop="inputId"
        label="付款账户"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDate"
        label="交易时间"
      >
      </el-table-column>
      <el-table-column
        prop="bankSerialNo"
        label="银行流水号"
      >
      </el-table-column>
      <el-table-column
        prop="remarks"
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
    <!-- 分页结束 -->

    <!-- 对话框 -->
    <!-- 批量操作没有选择任何列的时候提示 -->
    <el-dialog title="提示" v-model="updataDialogVisible" size="tiny">
      <span>请选择需要操作的数据列表</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updataDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>



<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'

  export default {
    data () {
      return {
        breadcrumName: '',
        updataDialogVisible: false,
        DelDialogVisible: false,
        totalCount: 0,
        currentPage: 1,
        businessTypeOptions: TOOLS.fetchObj('commonObj').BusinessType,
        fundTransferTypeOptions: TOOLS.fetchObj('commonObj').FundTransferType,
        transferForm: {
          orderNo: '', // 订单号
          fundsFor: '', // 业务类型
          type: '', // 资金划转账户
          createTime: [], // 交易时间
          searchStartTime: '',
          searchEndTime: '',
          bankSerialNo: ''// 银行流水号
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: []// 权限控制\1/查询,2/资金划拨
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
    mounted () {
      if (this.getFunctionList.length > 0) {
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '资金划拨':
              this.disabledArray[1] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {
      sendTimeChange (val) {
        if (val.length) {
          if (val[0] && val[1]) {
            this.transferForm.searchStartTime = this.transferForm.createTime[0].getTime()
            this.transferForm.searchEndTime = this.transferForm.createTime[1].getTime() + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.transferForm.searchStartTime = ''
            this.transferForm.searchEndTime = ''
          }
        } else {
          this.transferForm.searchStartTime = ''
          this.transferForm.searchEndTime = ''
        }
      },
      // 业务类型转换
      formatterFundsFor (val) {
        return TOOLS.valueToLabel(this.businessTypeOptions, val.fundsFor)
      },
      // 资金划转账户转换
      formatterType (val) {
        return TOOLS.valueToLabel(this.fundTransferTypeOptions, val.type)
      },
      // 付款金额转换
      formatterAmount (val) {
        return TOOLS.fenToYuan(val.amount)
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
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
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //  资金划转
      accountTransfer () {
        this.$router.push({name: 'EditTransfer'})
      },

      // 请求数据
      getTableList (pageNo, pageSize) {
        var obj = {
          'accountType': 111,
          'typeForQuery': 10,
          'pageNo': pageNo,
          'pageSize': pageSize,
          'orderNo': this.transferForm.orderNo, // 订单号
          'type': this.transferForm.type, // 资金划转账户
          'searchStartTime': this.transferForm.searchStartTime, // 交易时间-开始
          'searchEndTime': this.transferForm.searchEndTime, // 交易时间-结束
          'bankSerialNo': this.transferForm.bankSerialNo// 银行流水号
        }
        API.$financeListPage(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }

    }
  }
</script>
<style lang="less" scope>
</style>
