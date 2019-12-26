<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box marBottom20">
      <el-form ref="form" :model="form" label-width="165px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="申请ID：" prop="loanNo">
                <el-input v-model="form.loanNo" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="productName">
                <el-input v-model="form.productName" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="是否已划转手续费：" prop="isBalance">
                <el-select name="type" v-model="form.isBalance">
                  <el-option v-for='x in isRefundsAndIsBalanceOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="productId">
                <el-input v-model="form.productId" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方名称：" prop="borrowerName">
                <el-input v-model="form.borrowerName" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="是否已退还剩余资金：" prop="isRefunds">
                <el-select name="type" v-model="form.isRefunds">
                  <el-option v-for='x in isRefundsAndIsBalanceOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16">
            <el-form-item>
              <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
            </el-form-item>
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
        prop="loanNo"
        label="申请ID"
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
        prop="borrowerName"
        label="借方名称"
      >
      </el-table-column>
      <el-table-column
        prop="contactName"
        label="项目联系人"
      >
      </el-table-column>
      <el-table-column
        prop="contactPhone"
        label="联系人电话"
      >
      </el-table-column>
      <el-table-column
        prop="isBalance"
        label="是否已划转手续费"
      >
      </el-table-column>

      <el-table-column
        prop="isRefunds"
        label="是否已退还剩余资金"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <el-button
            @click="transferFee(scope.row)"
            type="text"
            :disabled="(scope.row.productId==isBalancesActiveId)&&isBalancesDisabled"
            v-if="disabledArray[1] === 'true'&&scope.row.isBalance=='否'">划转手续费</el-button>
          <el-button
            @click="backMoney(scope.row)"
            type="text"
            :disabled="(scope.row.productId==isRefundsActiveId)&&isRefundsDisabled"
            v-if="disabledArray[2] === 'true'&&scope.row.isRefunds=='否'">退还剩余资金</el-button>
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

    <!-- 对话框 -->
  </div>
</template>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../.././../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        tabName: '1',
        totalCount: 0,
        currentPage: 1,
        form: {
          loanNo: '', // 申请id
          productName: '', // 项目名称
          productId: '', // 项目id
          borrowerName: '', // 借方名称
          isBalance: '', // 是否已划转手续费
          isRefunds: ''// 是否已退还剩余资金

        },
        tableData: [],
        hidden: true,
        pageNo: 1,
        pageSize: 5,
        isRefundsAndIsBalanceOptions: [
          {label: '全部', value: ''},
          {label: '否', value: false},
          {label: '是', value: true}
        ],
        breadcrumName: '',
        disabledArray: [], // 权限控制\1/查询,2/划转手续费,3/退还剩余资金
        isBalancesDisabled: false,
        isRefundsDisabled: false,
        isBalancesActiveId: 0,
        isRefundsActiveId: 0
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
          this.$store.commit('updataFunctionList', TOOL.getList('functionList'))
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
            case '划转手续费':
              this.disabledArray[1] = 'true'
              break
            case '退还剩余资金':
              this.disabledArray[2] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }

      this.getTableList(this.pageSize, this.pageNo)
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */

      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },

      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageSize, this.pageNo)
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageSize, this.pageNo)
        console.log(`当前页: ${this.pageNo}`)
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageSize, this.pageNo)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */

      // 划转手续费
      transferFee (obj) {
        this.isBalancesActiveId = obj.productId
        this.isRefundsActiveId = true
        API.$manualBalance(obj, res => {
          if (res.success) { // 如果成功的话
            let _this = this
            setTimeout(function () {
              _this.isRefundsActiveId = false
              _this.getTableList(_this.pageSize, _this.pageNo)
            }, 100)
            TOOL.alertConfirm(this, '', `划转手续费请求已发送`, '', '确定', '', 'success', false)
          } else {
            TOOL.alertConfirm(this, '', `${res.resultMsg} 退款请求已发送失败`, '', '确定', '', 'warning', false)
          }
        })
      },
      // 退还剩余资金
      backMoney (obj) {
        this.isRefundsActiveId = obj.productId
        this.isBalancesDisabled = true
        API.$manualRefunds(obj, res => {
          if (res.success) { // 如果成功的话
            let _this = this

            TOOL.alertConfirm(this, function () {
              setTimeout(function () {
                _this.isBalancesDisabled = false
                _this.getTableList(_this.pageSize, _this.pageNo)
              }, 100)
            }, `退还剩余资金请求已发送`, '', '确定', '', 'success', false)
          } else {
            TOOL.alertConfirm(this, '', `${res.resultMsg} 退款请求已发送失败`, '', '确定', '', 'warning', false)
          }
        })
      },
      // 请求数据
      getTableList (pageSize, pageNo) {
        let obj = {
          'pageSize': pageSize,
          'pageNo': pageNo,
          'loanNo': this.form.loanNo, // 申请id
          'productName': this.form.productName, // 项目名称
          'productId': this.form.productId, // 项目id
          'borrowerName': this.form.borrowerName, // 借方名称
          'isBalance': this.form.isBalance, // 是否已划转手续费
          'isRefunds': this.form.isRefunds // 是否已退还剩余资金
        }
        API.$manualList(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>

