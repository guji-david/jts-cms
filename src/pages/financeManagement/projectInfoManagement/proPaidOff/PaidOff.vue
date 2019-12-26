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
              <el-form-item label="项目类型：" prop="type">
                <el-select name="type" v-model="form.type">
                  <el-option v-for='(x,index) in productTypeOptions' :value="x.value" :label="x.label" v-if="index<3"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方名称：" prop="borrowerName">
                <el-input v-model="form.borrowerName" placeholder="请输入借方名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方类型：" prop="unitType">
                <el-select name="type" v-model="form.unitType">
                  <el-option v-for='x in unitTypeOptions' :value="x.value" :label="x.label"></el-option>
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
        prop="accountName"
        label="借款人银行卡户名"
      >
      </el-table-column>
      <el-table-column
        prop="virtualAcc"
        label="还款账户"
      >
      </el-table-column>
      <el-table-column
        prop="virtualAccname"
        label="还款账户户名"
      >
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
        label="应还总金额(元)"
      >
        <template scope="scope">
          <div @click="showShouldData(scope.row,scope.$index)" :class="{shade:!(shouldDataClass[scope.$index])}">
            {{shouldDataClass[scope.$index]}}{{test}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="已还总金额(元)"
      >
        <template scope="scope">
          <div @click="showAlreadyData(scope.row,scope.$index)" :class="{shade:!(alreadyDataClass[scope.$index])}">
            {{alreadyDataClass[scope.$index]}}{{test}}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
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
        productTypeOptions: TOOL.fetchObj('commonObj').ProductType,
        alreadyDataClass: [], // 判断应还的样式
        shouldDataClass: [], // 判断已还的样式
        raisedAmountClass: [], // 募集金额
        raisedTimesClass: [], // 募集笔数
        updataDialogVisible: false,
        DelDialogVisible: false,
        totalCount: 0,
        currentPage: 1,
        auditStatusOptions: TOOL.fetchObj('commonObj').AuditStatus,
        unitTypeOptions: TOOL.fetchObj('commonObj').BorrowerType,
        repayTypeOptions: TOOL.fetchObj('commonObj').RepayType,
        form: {
          borrowerName: '', // 借方名称
          name: '', // 项目名称
          unitType: '',
          type: []// 项目类型
        },
        tableData: [],
        hidden: true,
        pageNo: 1,
        pageSize: 5,
        test: '',
        breadcrumName: '',
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

      this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 借款人类型转换
      formatterUnitType (row, column) {
        return TOOL.valueToLabel(this.unitTypeOptions, row[column.property])
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
      // 项目类型转换
      formatterProductType (row, column) {
        return TOOL.valueToLabel(this.productTypeOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.raisedAmountClass.length = 0
        this.raisedTimesClass.length = 0
        this.pageSize = val
        this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      },

      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.raisedAmountClass.length = 0
        this.raisedTimesClass.length = 0
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
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 使用第三方值来触发数据的更新
      triggerUpdata (val) {
        if (val) {
          this.test = ''
        }
        this.test = null
      },
      // 显示单元格内数据-已还总金额
      showAlreadyData (row, index) {
        API.$showAlreadyData(row, res => {
          if (!res.data) {
            this.alreadyDataClass[index] = '无统计结果'
          } else {
            this.alreadyDataClass[index] = TOOL.fenToYuan(res.data)
          }
          this.triggerUpdata(this.alreadyDataClass[index])
        })
      },
      // 显示单元格内数据-应还总金额
      showShouldData (row, index) {
        API.$showShouldData(row, res => {
          if (!res.data) {
            this.shouldDataClass[index] = '无统计结果'
          } else {
            this.shouldDataClass[index] = TOOL.fenToYuan(res.data)
          }
          this.triggerUpdata(this.shouldDataClass[index])
        })
      },
      // 显示单元格内数居募集金额
      raisedAmount (row, index) {
        API.$tenderSum(row, res => {
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
        API.$tenderCount(row, res => {
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
        this.$router.push({ name: 'Detailborrower', params: { borrowerId: row.borrowerId, type: 0 } })
      },

      // 跳转去还款页
      toEditPage (row) {
        TOOL.clearProData()
        this.$router.push({ name: 'PaidOffDetail', params: { id: row.id } })
      },

      // 请求数据
      getTableList (obj) {
        API.$repayList(obj, 'repay', res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 统一处理数据
      objFn () {
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'name': this.form.name,
          'type': this.form.type,
          'borrowerName': this.form.borrowerName,
          'unitType': this.form.unitType
        }
        return obj
      },
      //      下载
      download () {
        API.$downloadFile('productRepayManagerPageQuery', '/gateway/repayment/product/repay/list/excel', this.objFn())
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "../proStyle.less";
</style>
