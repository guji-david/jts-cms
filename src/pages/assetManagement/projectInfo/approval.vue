<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="name">
                <el-input v-model="form.name" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目类型：" prop="type">
                <el-select name="type" v-model="form.type">
                  <el-option v-for='(x,index) in productTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
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
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方类型：" prop="unitType">
                <el-select name="type" v-model="form.unitType">
                  <el-option v-for='x in borrowerTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
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
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetail(scope.row)" class="detailSpan">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        :formatter="formatterProductType"
        label="项目类型"
      >
      </el-table-column>
      <el-table-column
        label="借方名称"
      >
        <template scope="scope">
          <span @click="toBorrowerDetailPage(scope.row)" class="detailSpan" v-text="scope.row.borrowerName"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="unitType"
        :formatter="formatterUnitType"
        label="借方类型"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        :formatter="moneyFormat"
        label="借款金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="annualRate"
        label="借款利率(%)"
      >
      </el-table-column>
      <el-table-column
        prop="repayType"
        :formatter="repayFomat"
        label="还款方式"
      >
      </el-table-column>
      <el-table-column
        prop="timeLimit"
        label="借款期限(天)"
      >
      </el-table-column>
      <el-table-column
        prop="repayStartDate"
        :formatter="dateFormat2"
        label="项目起息日"
      >
      </el-table-column>
      <el-table-column
        :formatter="dateFormat2"
        label="项目到期日"
      >
        <template scope="scope">
          <span>{{endDay(scope.row.repayStartDate,scope.row.timeLimit)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="tenderStartTime"
        :formatter="dateFormat"
        label="募集开始时间"
      >
      </el-table-column>
      <el-table-column
        prop="tenderEndTime"
        :formatter="dateFormat"
        label="募集结束时间"
      >
      </el-table-column>
      <el-table-column
        prop="auditStatus"
        :formatter="formatterAuditFlag"
        label="状态"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDate"
        label="创建时间"
      >
      </el-table-column>
      <el-table-column
        prop=""
        label="备注"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <el-button @click="toDetailPage(scope.row)"type="text" v-if="disabledArray[1] === 'true'">审核</el-button>
          <el-button @click="toPCDetailPage(scope.row)" type="text">预览</el-button>
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
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOL from '../../../assets/js/tools'

  export default {
    data () {
      return {
        updataDialogVisible: false,
        DelDialogVisible: false,
        totalCount: 0,
        currentPage: 1,
        borrowerTypeOptions: TOOL.fetchObj('commonObj').BorrowerType,
        form: {
          borrowerName: '', // 借方名称
          name: '', // 项目名称
          unitType: '',
          type: '', // 项目类型
          auditStatus: ''// 状态
        },
        tableData: [],
        multipleSelection: [],
        hidden: true,
        pageNo: 1,
        pageSize: 5,
        auditStatusOptions: TOOL.fetchObj('commonObj').AuditStatus,
        repayTypeOptions: TOOL.fetchObj('commonObj').RepayType,
        productTypeOptions: TOOL.fetchObj('commonObj').ProductType,
        breadcrumName: '',
        disabledArray: []// 权限控制\1/查询,2/审核
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
            case '审核':
              this.disabledArray[1] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }

      this.getTableList()
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 金额转换
      moneyFormat (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 时间格式化(无时分秒)
      dateFormat2: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTimeDay(date)
      },
      // 项目期限
      endDay (startDay, limitDate) {
        return TOOL.timeLimitFormatDay(startDay, limitDate)
      },
      // 还款方式转换
      repayFomat (row, column) {
        return TOOL.valueToLabel(this.repayTypeOptions, row[column.property])
      },
      // 机构类型转换
      formatterProductType (row, column) {
        return TOOL.valueToLabel(this.productTypeOptions, row[column.property])
      },
      // 借款人类型转换
      formatterUnitType (row, column) {
        return TOOL.valueToLabel(this.borrowerTypeOptions, row[column.property])
      },
      // 状态转换
      formatterAuditFlag (row, column) {
        return TOOL.valueToLabel(this.auditStatusOptions, row[column.property])
      },
      // 格式化日期
      formatterDate (val) {
        return TOOL.normalTime(val.createTime)
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList()
      },
      // 这个是pageNo
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getTableList()
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList()
      },
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 跳转审核页
      toDetailPage (row) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        if (row.type === 'default') {
          this.$router.push({ name: 'PublishDetail', params: { id: row.id, type: 'approval', breadcrumName: '审核' } })
        } else if (row.type === 'bankPaper') {
          this.$router.push({ name: 'BankPaperDetail', params: { id: row.id, type: 'approval', breadcrumName: '审核' } })
        } else if (row.type === 'exportRebate') {
          this.$router.push({ name: 'ExportRebateDetail', params: { id: row.id, type: 'approval', breadcrumName: '审核' } })
        }
      },

      // 跳转详情
      toPCDetailPage (row) {
        API.$toPC(row.type, row.id)
      },

      // 跳转详情
      toDetail (row) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        if (row.type === 'default') {
          this.$router.push({ name: 'PublishDetail', params: { id: row.id, type: 'default', breadcrumName: '详情' } })
        } else if (row.type === 'bankPaper') {
          this.$router.push({ name: 'BankPaperDetail', params: { id: row.id, type: 'default', breadcrumName: '详情' } })
        } else if (row.type === 'exportRebate') {
          this.$router.push({ name: 'ExportRebateDetail', params: { id: row.id, type: 'default', breadcrumName: '详情' } })
        }
      },

      // 跳转借款人详情
      toBorrowerDetailPage (row) {
        this.$router.push({ name: 'Detailborrower', params: { borrowerId: row.borrowerId, type: 0 } })
      },

      // ajax请求
      getTableList () {
        API.postRequest('/gateway/product/list/submit', TOOL.noEmety(this.form, this.pageSize, this.pageNo), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>
<style lang="less" scope>
  @import "./proStyle.less";
</style>
