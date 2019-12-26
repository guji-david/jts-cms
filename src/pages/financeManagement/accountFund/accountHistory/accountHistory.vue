<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <div class="tabs-header">
      <div class="nav-wrap">
        <div class="nav-scroll">
          <div class="tabs-nav">
            <div class="tabs-item":class="{'is-active':activeIndex==index}" v-for="(item,index) in  tabUserList" @click="shiftTabUser(index)">
              {{item.name}}
            </div>
          </div>
        </div>


      </div>
    </div>
    <!-- 搜索开始 -->
    <el-form :model="accountForm" label-width="120px"  ref="accountForm">
      <el-row>
        <el-col :span="6">
          <div class="z-span-20">
            <el-form-item label="平台流水号：" prop="orderNo">
              <el-input v-model="accountForm.orderNo" placeholder="请输入平台流水号"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="z-span-25">
            <el-form-item label="交易类型：" prop="typeForQuery">
              <el-select name="status" v-model="accountForm.typeForQuery">
                <el-option v-for="x in typeForQueryOptions" :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="z-span-25">
            <el-form-item label="收支类型：" prop="inOrOut">
              <el-select name="status" v-model="accountForm.inOrOut">
                <el-option v-for="x in incomeType" :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="z-span-20">
            <el-form-item label="银行流水号：" prop="bankSerialNo">
              <el-input v-model="accountForm.bankSerialNo" placeholder="请输入银行流水号"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="z-span-25">
            <el-form-item label="交易时间：" prop="queryDate">
              <el-date-picker
                v-model="accountForm.queryDate"
                type="daterange"
                @change="sendTimeChange"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="z-span-12">
            <el-form-item label="交易对方：" prop="tradeTargetForQuery">
              <el-input v-model="accountForm.tradeTargetForQuery" placeholder="请输入交易对方"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="z-span-20">
            <el-form-item label="项目名称：" prop="productName">
              <el-input v-model="accountForm.productName" placeholder="请输入项目名称"></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="6" v-if="accountForm.accountType=='333'">
          <div class="z-span-20">
            <el-form-item label="项目虚拟户：" prop="outputId ">
              <el-input v-model="accountForm.outputId "
                        placeholder=""></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="z-span-20" style="padding-left:20px">
                <span class="z-btn-span">
                  <el-button type="primary"
                             icon="search"
                             @click="searchForm()"
                  >查询</el-button>
                </span>
            <span class="z-btn-span"><el-button @click="resetForm('accountForm')">重置</el-button> </span>
          </div>
        </el-col>

      </el-row>

    </el-form>
    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
      <el-form  label-width="100px" >
        <el-row>
          <el-col :span="17">
          <span class="z-btn-span">
        <el-button type="default"@click="goAddMoneyPage(111)" v-if="addMoneyBtnViable1&&(accountForm.accountType=='111')">手动加款</el-button>
        <el-button type="default"@click="goAddMoneyPage(222)" v-if="addMoneyBtnViable2&&(accountForm.accountType=='222')">手动加款</el-button>
      </span>
          </el-col>
          <el-col :span="7" v-if="accountForm.accountType=='111'||accountForm.accountType=='222'">
            <el-form-item label="账户余额：">
              <span>{{balance}} 元</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>


    </div>
    <!-- 工具栏结束 -->


    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">

      <el-table-column
        prop="orderNo"
        label="平台流水号"
        width="170">
      </el-table-column>
      <el-table-column
        prop="typeForQuery"
        label="交易类型"
        width="140">
      </el-table-column>
      <el-table-column
        prop="inOrOut"
        label="收支类型"
        :formatter="incomesDate"
        width="140">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="交易资金(元)"
        :formatter="formatterAmount"
        width="120">
      </el-table-column>
      <el-table-column
        prop="bankSerialNo"
        label="银行流水号"
        width="170">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="交易时间"
        :formatter="formatterDate"
        width="170">
      </el-table-column>
      <el-table-column
        prop="tradeTargetForQuery"
        label="交易对方"
        width="170">
      </el-table-column>
      <el-table-column
        prop="productName"
        label="项目名称"
        width="170">
      </el-table-column>
      <el-table-column
        prop="remarks"
        label="备注"
        width="130">
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

  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  let TYPEFORQUERY_OPTONS = [
    {'label': '全部', 'value': ''},
    {'label': '手动加款', 'value': '20'},
    {'label': '放款-红包', 'value': '40'},
    {'label': '还款-加息', 'value': '50'},
    {'label': '分账-投资奖励金', 'value': '60'}]
export default {
    data () {
      return {
        addMoneyBtnViable1: false,
        addMoneyBtnViable2: false,
        incomeType: [{
          value: 'income',
          label: '收入'
        },
        {
          value: 'outcome',
          label: '支出'
        },
        {
          value: '',
          label: '全部'
        }],
        breadcrumName: '',
        accountId: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        updataDialogVisible: false,
        delDialogVisible: false,
        accountForm: {
          queryDate: [],
          searchStartTime: '',
          searchEndTime: '',
          //          accountCode:'',
          accountType: '111',
          bankSerialNo: '',
          typeForQuery: '',
          inOrOut: '',
          orderNo: '',
          productName: '',
          outputId: '',
          tradeTargetForQuery: '',
          remarks: '',
          radeTarget: '',
          type: ''
        },
        stateType: TOOLS.fetchObj('commonObj').BulletinTypes,
        plateType: TOOLS.fetchObj('commonObj').BulletinPlatformType,
        typeForQueryOptions: [
          {'label': '全部', 'value': ''},
          {'label': '资金划拨', 'value': '10'},
          {'label': '手动加款', 'value': '20'}
        ],
        tableData: [],
        tabUserList: [
          {name: '自有资金账户', accountType: '111'},
          {name: '红利账户', accountType: '222'}
        //            {name:"平台内部账户",accountType:'333'},
        //            {name:"保证金账户",accountType:'444'},
        ],
        activeIndex: 0,
        balance: 0
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
        for (let i = 0, len = this.getFunctionList.length; i < len; i++) {
          if (this.getFunctionList[i].label === '自有资金账户-手动加款') {
            this.addMoneyBtnViable1 = true
          }
          if (this.getFunctionList[i].label === '红利内部户-手动加款') {
            this.addMoneyBtnViable2 = true
          }
        }
      }
      this.getTableList(this.pageNo, this.pageSize)
    },

    watch: {
    /*  '$route.params' (to, from) {
        this.accountId=to.accountId;
        this.changeStates();

      } */

    },
    methods: {
      incomesDate (val) {
        return TOOLS.valueToLabel(this.incomeType, val.inOrOut)
      },

      accountType (val) {
        return TOOLS.valueToLabel(this.typeForQueryOptions, val.typeForQuery)
      },
      // 交易资金(元)转换
      formatterAmount (val) {
        return TOOLS.fenToYuan(val.amount)
      },
      shiftTabUser (index) {
        this.activeIndex = index
        this.accountForm.accountType = this.tabUserList[index].accountType
        if (this.accountForm.accountType === '111') {
          this.typeForQueryOptions = [
            {'label': '全部', 'value': ''},
            {'label': '资金划拨', 'value': '10'},
            {'label': '手动加款', 'value': '20'}
          ]// TOOLS.fetchObj("commonObj").TradeTypeForQuery
        } else {
          this.typeForQueryOptions = TYPEFORQUERY_OPTONS
        }
        this.$refs['accountForm'].resetFields()
        this.getTableList(this.pageNo, this.pageSize)
      },

      sendTimeChange (val) {
        if (val.length) {
          if (val[0] && val[1]) {
            this.accountForm.searchStartTime = this.accountForm.queryDate[0].getTime()
            this.accountForm.searchEndTime = this.accountForm.queryDate[1].getTime() + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.accountForm.searchStartTime = ''
            this.accountForm.searchEndTime = ''
          }
        } else {
          this.accountForm.searchStartTime = ''
          this.accountForm.searchEndTime = ''
        }
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
      },

      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getTableList(val, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 获取列表
      getTableList (pageNo, pageSize) {
        if (this.accountForm.accountType === '111' || this.accountForm.accountType === '222') {
          API.$virtualAccountTotalMessage(this.accountForm.accountType, res => {
            if (res.success == true) {
              this.balance = TOOLS.fenToYuan(res.data.balance)
            } else {
              this.balance = 0
            }
          })
        }
        this.sendTimeChange(this.accountForm.queryDate)
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'orderNo': this.accountForm.orderNo,
          'accountType': this.accountForm.accountType,
          'typeForQuery': this.accountForm.typeForQuery,
          'inOrOut': this.accountForm.inOrOut,
          'bankSerialNo': this.accountForm.bankSerialNo,
          'searchStartTime': this.accountForm.searchStartTime,
          'searchEndTime': this.accountForm.searchEndTime,
          'tradeTargetForQuery': this.accountForm.tradeTargetForQuery,
          'productName': this.accountForm.productName
        }
        API.$financeListPage(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 重置表单
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 跳转到手动加款页面
      goAddMoneyPage (type) {
        TOOLS.clearProData()
        this.$router.push({name: 'AddMoneyPage', params: { type: type }})
      }

    }
  }
</script>

<style lang="less" scope>
  @import "./accountHistory.less";
</style>
