<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="tradeDetailForm" :model="tradeDetailForm" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="平台流水号：" prop="id">
                <el-input v-model="tradeDetailForm.id" placeholder="请输入平台流水号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="交易账户：" prop="userId">
                <el-input v-model="tradeDetailForm.userId" placeholder="请输入交易账户"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="账户类型：" prop="accountType">
                <el-select name="type" v-model="tradeDetailForm.accountType">
                  <el-option v-for='x in accountTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="收支类型：" prop="inOrOut">
                <el-select name="type" v-model="tradeDetailForm.inOrOut">
                  <el-option v-for='x in inComeOutComeTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="银行流水号：" prop="deductSerialNo">
                <el-input v-model="tradeDetailForm.deductSerialNo" placeholder="请输入银行流水号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="交易类型：" prop="businessType">
                <el-select name="type" v-model="tradeDetailForm.businessType">
                  <el-option v-for='x in businessTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="交易时间：" prop="createTime">
                <el-date-picker
                  v-model="tradeDetailForm.createTime"
                  type="daterange"
                  placeholder="选择日期"
                >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="searchBtnViable">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('tradeDetailForm')">重置</el-button> </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

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
        prop="userId"
        label="交易账户"
      >
      </el-table-column>
      <el-table-column
        prop="accountType"
        :formatter="formatterAccountType"
        label="账户类型"
      >
      </el-table-column>
      <el-table-column
        prop="businessType"
        :formatter="formatterBusinessType"
        label="交易类型"
      >
        </el-table-column>
      <el-table-column
        prop="inOrOut"
        :formatter="formatterInOrOut"
        label="收支类型"
      >
      </el-table-column>

      <el-table-column
        prop="amount"
        label="交易资金(元)"
        :formatter="formatterAmount"
      >
      </el-table-column>
      <el-table-column
        prop="deductSerialNo"
        label="银行流水号"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDate"
        label="交易时间"
      >
      </el-table-column>
      <el-table-column
        prop="descripts"
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




  </div>
</template>



<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'

  export default {
    data () {
      return {
        searchBtnViable: false,
        breadcrumName: '',
        totalCount: 0,
        currentPage: 1,
        //        businessTypeOptions:TOOLS.fetchObj('commonObj').BusinessType,
        businessTypeOptions: [
          {'label': '全部', 'value': ''},
          {'label': '在线充值', 'value': 'recharge'}, // 充值
          {'label': '网银转账', 'value': 'transfer'}, // 转账
          {'label': '提现', 'value': 'withdraw'},
          {'label': '投资', 'value': 'invest'},
          {'label': '投资-失败', 'value': 'invest_fail'}, // 投资失败
          {'label': '放款', 'value': 'invest_success'}, // 投资成功
          {'label': '分账-投资奖励金', 'value': 'collectdaysinterest'}, // 募集期利息
          {'label': '分账-邀请好友', 'value': 'friendGift'},
          {'label': '分账-摇一摇', 'value': 'shakeGift'},
          {'label': '流标', 'value': 'flow'},
          {'label': '手续费', 'value': 'fee'},
          {'label': '回款-本金', 'value': 'principal'}, // 回款本金
          {'label': '回款-利息', 'value': 'interest'}, // 付息
          {'label': '回款-本息', 'value': 'princ_interest'}, // 还本付息
          {'label': '回款-加息', 'value': 'coupon_interest'}// 加息券利息

          //          {"label": "红包", "value": "redpacket"},
        ],
        accountTypeOptions: [
          {label: '全部', value: ''},
          {label: '余额账户', value: 10},
          {label: '冻结账户', value: 20}
        ],
        inComeOutComeTypeOptions: TOOLS.fetchObj('commonObj').InComeOutComeType,
        tradeDetailForm: {
          id: '', // 平台流水号
          userId: '', // 交易账户
          accountType: '', // 账户类型
          businessType: '', // 交易类型
          inOrOut: [], // 收支类型
          deductSerialNo: '', // 银行流水号
          createTime: ''// 交易时间
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5
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
          if (this.getFunctionList[i].label === '查询') {
            this.searchBtnViable = true
          }
        }
      }

      this.getTableList()
    },
    methods: {
      // 账户类型转换
      formatterAccountType (val) {
        return TOOLS.valueToLabel(this.accountTypeOptions, val.accountType)
      },
      // 交易类型转换
      formatterBusinessType (val) {
        return TOOLS.valueToLabel(this.businessTypeOptions, val.businessType)
      },
      // 收支类型转换
      formatterInOrOut (val) {
        return TOOLS.valueToLabel(this.inComeOutComeTypeOptions, val.inOrOut)
      },
      // 交易资金(元)转换
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
        this.getTableList()
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageNo
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getTableList()
        console.log(`当前页: ${this.pageNo}`)
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList()
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },

      // 统一处理数据
      objFn () {
        if (this.tradeDetailForm.createTime.length) {
          if (this.tradeDetailForm.createTime[0] && this.tradeDetailForm.createTime[1]) {
            this.tradeDetailForm.createTimeStart = +this.tradeDetailForm.createTime[0]
            this.tradeDetailForm.createTimeEnd = +this.tradeDetailForm.createTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.tradeDetailForm.createTimeStart = ''
            this.tradeDetailForm.createTimeEnd = ''
          }
        } else {
          this.tradeDetailForm.createTimeStart = ''
          this.tradeDetailForm.createTimeEnd = ''
        }
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'id': this.tradeDetailForm.id, // 平台流水号
          'userId': this.tradeDetailForm.userId, // 交易账户
          'accountType': this.tradeDetailForm.accountType, // 账户类型
          'businessType': this.tradeDetailForm.businessType, // 交易类型
          'inOrOut': this.tradeDetailForm.inOrOut, // 收支类型
          'deductSerialNo': this.tradeDetailForm.deductSerialNo, // 银行流水号
          'createTimeStart': this.tradeDetailForm.createTimeStart, // 交易时间开始
          'createTimeEnd': this.tradeDetailForm.createTimeEnd// 交易时间结束

        }
        return obj
      },
      // 请求数据
      getTableList () {
        API.$pageQueryTradeFlow(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>
<style lang="less" scope>
</style>
