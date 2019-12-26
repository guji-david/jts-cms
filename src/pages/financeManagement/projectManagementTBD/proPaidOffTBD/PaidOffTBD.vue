<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box marBottom20">
      <el-form ref="form" :model="form" label-width="150px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="申请ID：" prop="loanNo">
                <el-input v-model="form.loanNo" placeholder="请输入申请ID"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="productId">
                <el-input v-model="form.productId" placeholder="请输入项目ID"></el-input>
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
              <el-form-item label="类型：" prop="loanResult">
                <el-select name="type" v-model="form.loanResult">
                  <el-option v-for='x in loanResultOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="时间：" prop="createTime">
                <el-date-picker
                  type="daterange"
                  placeholder="选择日期"
                  v-model="form.createTime">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="银行资金处理进度：" prop="loanStatus">
                <el-select name="type" v-model="form.loanStatus">
                  <el-option v-for='x in loanStatusOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm"
                                                v-if="disabledArray[0] === 'true'">查询</el-button></span>
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
        prop="loanNo"
        label="申请ID"
      >
      </el-table-column>
      <el-table-column
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetailPage(scope.row)" class="detailSpan">{{scope.row.productName}}</span>
        </template>
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
        prop="loanResult"
        :formatter="formatterLoanResult"
        label="类型"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="dateFormat"
        label="时间"
      >
      </el-table-column>
      <el-table-column
        prop="loanStatus"
        :formatter="formatterLoanStatus"
        label="银行资金处理进度"
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
  </div>
</template>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../.././../store/api'
  import * as TOOL from '../../../../assets/js/tools'

export default {
    data () {
      return {
        searchBtnViable: false,
        totalCount: 0,
        currentPage: 1,
        loanResultOptions: TOOL.fetchObj('commonObj').FinshProductType, // 类型
        loanStatusOptions: TOOL.fetchObj('commonObj').TradeBankStatus, // 资金处理进度
        form: {
          loanNo: '', // 申请ID
          productName: '', // 项目名称
          productId: '', // 项目ID
          borrowerName: '', // 借方名称
          loanResult: '', // 类型
          createTime: [], // 时间
          loanStatus: ''// 资金处理进度
        },
        tableData: [],
        hidden: true,
        pageNo: 1,
        pageSize: 5,
        test: '',
        breadcrumName: '',
        disabledArray: []// 权限控制\1/查询,2/取消借款
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
        let i// 测试如果没问题删掉这行
        for (i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }

      this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 类型转换
      formatterLoanResult (row, column) {
        return TOOL.valueToLabel(this.loanResultOptions, row[column.property])
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 资金处理进度转换
      formatterLoanStatus (row, column) {
        if (row[column.property]) {
          return TOOL.valueToLabel(this.loanStatusOptions, row[column.property]) + (row['notifyLoanTime'] ? `(${TOOL.normalTime(row['notifyLoanTime'])} )` : '')
        } else {
          return ''
        }
      },

      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      },

      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 时间转换
      queryDateChange () {
        if (this.form.createTime.length) {
          if (this.form.createTime[0] && this.form.createTime[1]) {
            this.form.startTime = +this.form.createTime[0]
            this.form.endTime = +this.form.createTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.startTime = ''
            this.form.endTime = ''
          }
        } else {
          this.form.startTime = ''
          this.form.endTime = ''
        }
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 跳转去详情页
      toDetailPage (row, type) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        this.$router.push({
          name: 'TBDPayProDetail',
          params: {id: row.productId, type: row.loanResult == 20 ? 'success' : 'fail'}
        })
      },
      // 请求数据
      getTableList (obj) {
        API.$paidOffList(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 统一处理数据
      objFn () {
        this.queryDateChange()
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'loanNo': this.form.loanNo, // 申请ID
          'productName': this.form.productName, // 项目名称
          'productId': this.form.productId, // 项目ID
          'borrowerName': this.form.borrowerName, // 借方名称
          'loanResult': this.form.loanResult, // 类型
          'startTime': this.form.startTime, // 发起时间
          'endTime': this.form.endTime, // 结束时间
          'loanStatus': this.form.loanStatus// 资金处理进度
        }
        return obj
      }
    }
  }
</script>

