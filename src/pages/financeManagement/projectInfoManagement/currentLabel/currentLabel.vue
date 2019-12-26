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
                <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="id">
                <el-input v-model="form.id" placeholder="请输入项目ID"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目类型：" prop="type">
                <el-select name="type" v-model="form.type">
                  <el-option v-for='(x,index) in productTypeOptions' :value="x.value" :label="x.label" v-if="index<3"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方名称：" prop="borrowerName">
                <el-input v-model="form.borrowerName" placeholder="请输入借方名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方类型：" prop="unitType">
                <el-select name="type" v-model="form.unitType">
                  <el-option v-for='x in borrowerTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="流标时间：" prop="loanTime">
                <el-date-picker
                  v-model="form.loanTime"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="16" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="document" @click="download()" v-if="disabledArray[2] === 'true'">下载</el-button></span>
    </div>
    <!--工具栏结束-->

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
        prop="id"
        label="项目ID"
      >
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
        :formatter="dateFormatDay"
        label="起息日"
      >
      </el-table-column>
      <el-table-column
        label="到期日"
      >
        <template scope="scope">
          <span>{{endDay(scope.row.repayStartDate,scope.row.timeLimit)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="已募集金额(元)"
      >
        <template scope="scope">
          <div @click="raisedAmount(scope.row,scope.$index)" :class="{shade:!(raisedAmountClass[scope.$index])}" >
            {{raisedAmountClass[scope.$index]}}{{test}}
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="募集笔数"
      >
        <template scope="scope">
          <div @click="raisedTimes(scope.row,scope.$index)" :class="{shade:!(raisedTimesClass[scope.$index])}" >
            {{raisedTimesClass[scope.$index]}}{{test}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="loanTime"
        :formatter="dateFormat"
        label="流标时间"
      >
      </el-table-column>
      <el-table-column
        prop="notifyLoanStatus"
        :formatter="notifyLoanStatusFomat"
        label="银行处理进度"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <el-button @click="toEditPage(scope.row)" type="text" v-if="disabledArray[1] === 'true'">详情</el-button>
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
        raisedAmountClass: [], // 募集金额
        raisedTimesClass: [], // 募集金额
        updataDialogVisible: false,
        DelDialogVisible: false,
        totalCount: 0,
        currentPage: 1,
        form: {
          borrowerName: '', // 借方名称
          name: '', // 项目名称
          unitType: '',
          type: [], // 项目类型
          loanTime: [],
          id: '',
          loanDateStart: '',
          loanDateEnd: ''
        },
        tableData: [],
        hidden: true,
        pageNo: 1,
        pageSize: 5,
        test: '',
        productTypeOptions: TOOL.fetchObj('commonObj').ProductType,
        repayTypeOptions: TOOL.fetchObj('commonObj').RepayType,
        borrowerTypeOptions: TOOL.fetchObj('commonObj').BorrowerType,
        auditStatusOptions: TOOL.fetchObj('commonObj').AuditStatus,
        breadcrumName: '',
        notifyLoanStatusTrans: [
          {
            label: '',
            value: 10
          },
          {
            label: '成功',
            value: 20
          },
          {
            label: '失败',
            value: 30
          }
        ], // 银行处理进度枚举
        dateScope: [], // table中的endDay
        disabledArray: []// 权限控制\1/查询,2/详情,3/下载
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
            case '详情':
              this.disabledArray[1] = 'true'
              break
            case '下载':
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
      // 银行处理进度转换
      notifyLoanStatusFomat (row, column) {
        return TOOL.valueToLabel(this.notifyLoanStatusTrans, row[column.property])
      },
      // 项目期限
      endDay (startDay, limitDate) {
        return TOOL.timeLimitFormatDay(startDay, limitDate)
      },
      // 还款方式转换
      repayFomat (row, column) {
        return TOOL.valueToLabel(this.repayTypeOptions, row[column.property])
      },
      // 金额转换
      moneyFormat (row, column) {
        let money = row[column.property]
        return TOOL.fenToYuan(money)
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 时间格式化到日
      dateFormatDay: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTimeDay(date)
      },
      // 转换收益率
      formatterRepayType (row, column) {
        return TOOL.valueToLabel(this.repayTypeOptions, row[column.property])
      },
      formatterUnitType (row, column) {
        return TOOL.valueToLabel(this.borrowerTypeOptions, row[column.property])
      },
      // 机构类型转换
      formatterProductType (row, column) {
        return TOOL.valueToLabel(this.productTypeOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.raisedAmountClass.length = 0
        this.raisedTimesClass.length = 0
        this.pageSize = val
        this.getTableList(this.pageSize, this.pageNo)
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.raisedAmountClass.length = 0
        this.raisedTimesClass.length = 0
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
      // 使用第三方值来触发数据的更新
      triggerUpdata (val) {
        if (val) {
          this.test = ''
        }
        this.test = null
      },
      // 显示单元格内数居募集金额
      raisedAmount (row, index) {
        console.log(row.id)
        API.$tenderSumFlow(row, res => {
          console.log(res)
          if (!res.data) {
            this.raisedAmountClass[index] = '无统计结果'
          } else {
            this.raisedAmountClass[index] = TOOL.fenToYuan(res.data)
          }
          this.triggerUpdata(this.raisedAmountClass[index])
        })
      },
      // 显示单元格内数据募集笔数
      raisedTimes (row, index) {
        console.log(row.id)
        API.$tenderCountFlow(row, res => {
          console.log(res)
          if (!res.data) {
            this.raisedTimesClass[index] = '无统计结果'
          } else {
            this.raisedTimesClass[index] = res.data
          }
          this.triggerUpdata(this.raisedTimesClass[index])
        })
      },

      // 跳转详情
      toDetail (row) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        if (row.type === 'default') {
          this.$router.push({name: 'PublishDetail', params: { id: row.id, type: 'default', breadcrumName: '详情' }})
        } else if (row.type === 'bankPaper') {
          this.$router.push({name: 'BankPaperDetail', params: { id: row.id, type: 'default', breadcrumName: '详情' }})
        } else if (row.type === 'exportRebate') {
          this.$router.push({name: 'ExportRebateDetail', params: { id: row.id, type: 'default', breadcrumName: '详情' }})
        }
      },

      // 跳转借款人详情
      toBorrowerDetailPage (row) {
        this.$router.push({name: 'Detailborrower', params: { borrowerId: row.borrowerId, type: 0 }})
      },

      // 跳转去详情页
      toEditPage (row) {
        TOOL.clearProData()
        this.$router.push({name: 'CurrentLabelPage', params: { id: row.id }})
      },

      // 请求数据
      getTableList (pageSize, pageNo) {
        this.queryDateChange()
        let obj = {
          'pageSize': pageSize,
          'pageNo': pageNo,
          'borrowerName': this.form.borrowerName,
          'name': this.form.name, // 项目名称
          'unitType': this.form.unitType,
          'id': this.form.id,
          'loanDateStart': this.form.loanDateStart,
          'loanDateEnd': this.form.loanDateEnd
        }
        API.$productFlowList(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
          this.raisedTimesClass.length = 0
          this.raisedAmountClass.length = 0
        })
      },
      queryDateChange () {
        if (this.form.loanTime.length) {
          if (this.form.loanTime[0] && this.form.loanTime[1]) {
            this.form.loanDateStart = this.form.loanTime[0].getTime()
            this.form.loanDateEnd = this.form.loanTime[1].getTime() + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.loanDateStart = ''
            this.form.loanDateEnd = ''
          }
        } else {
          this.form.loanDateStart = ''
          this.form.loanDateEnd = ''
        }
      },
      // 统一处理数据
      objFn () {
        this.queryDateChange()
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'name': this.form.name,
          'type': this.form.type,
          'borrowerName': this.form.borrowerName,
          'unitType': this.form.unitType,
          'id': this.form.id,
          'loanDateStart': this.form.loanDateStart,
          'loanDateEnd': this.form.loanDateEnd
        }
        return obj
      },
      //      下载
      download () {
        API.$downloadFile('productRepayManagerPageQuery', '/gateway/repayment/product/flow/list/excel', this.objFn())
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../proStyle.less";
</style>
