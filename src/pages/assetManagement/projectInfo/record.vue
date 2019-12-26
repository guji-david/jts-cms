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

          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="auditStatus">
                <el-select name="status" v-model="form.auditStatus">
                  <el-option v-for='x in auditStatusOptions' :value="x.value" :label="x.label" v-if="x.value == 'refuse' || x.value == 'init'"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="plus" @click="addBorrower">新增项目</el-button></span>
      <span class="z-btn-span"><el-button type="default" icon="circle-check" @click="multipleUpdateBtn" v-if="disabledArray[3] === 'true'" :disabled="approvalVisible">批量提交审核</el-button></span>
      <span class="z-btn-span"><el-button type="default" icon="delete2" @click="multipleDelBtn" v-if="disabledArray[6] === 'true'" :disabled="delVisible">批量删除</el-button></span>
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        fit="true"
        type="selection"
        width="50%">
      </el-table-column>
      <el-table-column
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetailPage(scope.row)" class="detailSpan">{{scope.row.name}}</span>
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
        :formatter="dateFormat"
        label="项目起息日"
        >
      </el-table-column>
      <el-table-column
        :formatter="dateFormat"
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
        :formatter="dateFormat"
        label="创建时间"
        >
      </el-table-column>
      <el-table-column
        prop="auditDesc"
        label="备注"
        >
      </el-table-column>
      <el-table-column
        label="操作"
        >
        <template scope="scope">
          <el-button @click="toEditPage(scope.row)" type="text" v-if="disabledArray[4] === 'true' && scope.row.type === 'bankPaper'">修改</el-button>
          <el-button @click="toEditPage(scope.row)" type="text" v-if="disabledArray[5] === 'true'&& scope.row.type === 'exportRebate'">修改</el-button>
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

    <!-- 对话框 -->
    <!-- 批量操作没有选择任何列的时候提示 -->
    <el-dialog title="提示" v-model="updataDialogVisible" size="tiny">
      <span>请选择需要操作的数据列表</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updataDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量操作删除的时候提示 -->
    <el-dialog title="提示" v-model="DelDialogVisible" size="tiny">
      <span>确定要删除选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="DelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delMultipleBorrower">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量操作审核的时候提示 -->
    <el-dialog title="提示" v-model="appDialogVisible" size="tiny">
      <span>确定要审核选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="appDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="approvalMultipleBorrower">确 定</el-button>
      </span>
    </el-dialog>
    <!--选择产品-->
    <el-dialog
      title="请选择产品"
      :visible.sync="chiocePro"
      size="small"
      >
      <div class="chiocePro">
        <!--<el-button type="primary" @click="toAdd(proItem[0].value)">{{proItem[0].label}}</el-button>-->
        <div class="primary"></div>
        <el-button type="primary" @click="toAdd(proItem[1].value)" v-if="disabledArray[2] === 'true'">{{proItem[1].label}}</el-button>
        <div class="primary"></div>
        <el-button type="primary" @click="toAdd(proItem[2].value)" v-if="disabledArray[1] === 'true'">{{proItem[2].label}}</el-button>
      </div>
    </el-dialog>
  </div>
</template>



<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOL from '../../../assets/js/tools'
//  import { Loading } from 'element-ui'

export default {
    data () {
      return {
        updataDialogVisible: false,
        DelDialogVisible: false,
        appDialogVisible: false,
        totalCount: 0,
        currentPage: 1,
        chiocePro: false, // 选择产品类型弹出框
        borrowerTypeOptions: TOOL.fetchObj('commonObj').BorrowerType,
        repayTypeOptions: TOOL.fetchObj('commonObj').RepayType,
        form: {
          borrowerName: '', // 借方名称
          name: '', // 项目名称
          unitType: '',
          type: [], // 项目类型
          auditStatus: ''// 状态
        },
        tableData: [],
        multipleSelection: [],
        hidden: true,
        pageNo: 1,
        pageSize: 5,
        auditStatusOptions: TOOL.fetchObj('commonObj').AuditStatus,
        productTypeOptions: TOOL.fetchObj('commonObj').ProductType,
        breadcrumName: '',
        dateScope: [], // table中的endDay
        proItem: [
          {
            label: '金保理',
            value: 'default'
          },
          {
            label: '票据贷',
            value: 'bankPaper'
          },
          {
            label: '经营贷',
            value: 'exportRebate'
          },
          {
            label: '全部',
            value: ''
          }
        ], // 产品类型
        //        disabledArray:new Array(7)//1/查询,2/新增-出口退税,3/新增-银行票据,4/提交审核,5/修改-票据贷,6/修改-出口退税,7/删除
        disabledArray: [], // 权限控制\1/查询,2/新增-出口退税,3/新增-银行票据,4/提交审核,5/修改-票据贷,6/修改-出口退税,7/删除
        approvalVisible: false,
        delVisible: false
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
        let i
        for (i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '新增—出口退税':
              this.disabledArray[1] = 'true'
              break
            case '新增—票据贷':
              this.disabledArray[2] = 'true'
              break
            case '提交审核':
              this.disabledArray[3] = 'true'
              break
            case '修改—票据贷':
              this.disabledArray[4] = 'true'
              break
            case '修改—出口退税':
              this.disabledArray[5] = 'true'
              break
            case '删除':
              this.disabledArray[6] = 'true'
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
      // 项目期限
      endDay (startDay, limitDate) {
        return TOOL.timeLimitFormat(startDay, limitDate)
      },
      // 还款方式转换
      repayFomat (row, column) {
        return TOOL.valueToLabel(this.repayTypeOptions, row[column.property])
      },
      // 金额转换
      moneyFormat (val) {
        return TOOL.fenToYuan(val.amount)
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 机构类型转换
      formatterProductType (row, column) {
        return TOOL.valueToLabel(this.proItem, row[column.property])
      },
      // 借款人类型转换
      formatterUnitType (row, column) {
        return TOOL.valueToLabel(this.borrowerTypeOptions, row[column.property])
      },
      // 状态转换
      formatterAuditFlag (row, column) {
        return TOOL.valueToLabel(this.auditStatusOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是多选的
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        API.postRequest('/gateway/product/list', TOOL.noEmety(this.form, this.pageSize, this.pageNo), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 跳转详情
      toPCDetailPage (row) {
        API.$toPC(row.type, row.id)
      },

      // 跳转修改页
      toEditPage (row) {
        TOOL.clearProData()
        if (row.type === 'default') {
          this.$router.push({ name: 'DetailsPro', params: { type: row.type, id: row.id } })
        } else if (row.type === 'bankPaper') {
          this.$router.push({ name: 'BankProEdit', params: { type: row.type, id: row.id } })
        } else if (row.type === 'exportRebate') {
          this.$router.push({ name: 'ExportRebate', params: { type: row.type, id: row.id } })
        }
      },

      // 跳转详情
      toDetailPage (row) {
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

      // 跳转到不同的新增页面
      toAdd (val) {
        TOOL.clearProData()
        if (val === 'default') {
          this.$router.push({ name: 'DetailsPro', params: { type: val } })
        } else if (val === 'bankPaper') {
          this.$router.push({ name: 'BankProEdit', params: { type: val } })
        } else if (val === 'exportRebate') {
          this.$router.push({ name: 'ExportRebate', params: { type: val } })
        }
      },

      //  新增借款人
      addBorrower () {
        this.chiocePro = true
      },

      // 批量提交审核
      approvalMultipleBorrower () {
        this.approvalVisible = true
        if (this.multipleSelection.length === 0) {
          this.updataDialogVisible = true
        } else {
          // 提交选中数据
          API.postRequest('/gateway/product/submitAudit', {'ids': this.idsFn(this.multipleSelection)}, res => {
            this.approvalVisible = false
            this.getTableList(this.pageNo, this.pageSize)
          })
          this.appDialogVisible = false
        }
      },

      //  批量提交审核弹窗
      multipleUpdateBtn () {
        if (this.multipleSelection.length === 0) {
          this.updataDialogVisible = true
        } else {
          this.appDialogVisible = true
        }
      },

      //  批量删除借款人弹窗
      multipleDelBtn () {
        if (this.multipleSelection.length === 0) {
          this.updataDialogVisible = true
        } else {
          this.DelDialogVisible = true
        }
      },

      //  批量删除
      delMultipleBorrower () {
        this.delVisible = true
        API.postRequest('/gateway/product/del', {'ids': this.idsFn(this.multipleSelection)}, res => {
          this.delVisible = false
          // 重新请求；再次渲染
          this.getTableList(this.pageNo, this.pageSize)
        })
        // 隐藏弹出框
        this.DelDialogVisible = false
      },

      // 请求数据
      getTableList (pageNo, pageSize) {
        API.postRequest('/gateway/product/list', TOOL.noEmety(this.form, pageSize, pageNo), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      //      将数据批量提交使用的ids对象
      idsFn () {
        var delArr = []
        for (var x of this.multipleSelection) {
          delArr.push(x.id)
        }
        return delArr
      }
    }
  }
</script>
<style lang="less" scope>
  @import "./proStyle.less";
</style>
