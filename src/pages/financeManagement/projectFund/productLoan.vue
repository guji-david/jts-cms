<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="loanForm" :model="loanForm" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="name">
                <el-input v-model="loanForm.name"placeholder="请输入项目名称" ></el-input>
              </el-form-item>

            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目类型：" prop="type">
                <el-select name="type" v-model="loanForm.type">
                  <el-option v-for='(x,index) in productTypeOptions' :value="x.value" :label="x.label"v-if="index<3"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方名称：" prop="borrowerName">
                <el-input v-model="loanForm.borrowerName" placeholder="请输入借方名称" ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="id">
                <el-input v-model="loanForm.id"placeholder="请输入项目ID" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方类型：" prop="unitType">
                <el-select name="type" v-model="loanForm.unitType">
                  <el-option v-for='x in unitTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="放款时间：" prop="date">
                <el-date-picker type="date" placeholder="选择日期" v-model="loanForm.date" style="width: 100%;">

                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="searchBtnViable">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('loanForm')">重置</el-button> </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

      <!--工具栏开始-->
      <div class="z-tool-bar">
        <span class="z-btn-span" v-if="loadingBtnViable"><el-button type="default" icon="document" @click="download()" >下载</el-button></span>
      </div>
      <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column
        prop="name"
        label="项目名称"
      >
        <template scope="props" >
          <div class="borrowerName-link" v-text="props.row.name" @click="goProductDetail(props.row)"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="项目ID"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        label="项目类型"
        :formatter="formatterProductType"
      >
      </el-table-column>
      <el-table-column
        label="借方名称"
      >
        <template scope="props" >
          <div class="borrowerName-link" v-text="props.row.borrowerName" @click="goBorrowerDetail(props.row)"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="unitType"
        :formatter="formatterUnitType"
        label="借方类型"
      >
      </el-table-column>
      <el-table-column
        prop="repayStartDate"
        :formatter="formatterDate"
        label="起息日"
      >
      </el-table-column>
      <el-table-column
        prop="repayEndDate"
        :formatter="formatterDate"
        label="到期日"
      >
      </el-table-column>
      <el-table-column
        prop="tenderStartTime"
        :formatter="formatterDayTime"
        label="募集开始时间"
      >
      </el-table-column>
      <el-table-column
        prop="tenderEndTime"
        :formatter="formatterDayTime"
        label="募集结束时间"
      >
      </el-table-column>
      <el-table-column
        prop="fullTime"
        :formatter="formatterDayTime"
        label="满标时间"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        :formatter="formatterAmount"
        label="借款金额（元）"
      >
      </el-table-column>
      <el-table-column
        prop="tenderAmount"
        :formatter="formatterTenderAmount"
        label="募集总金额(元)"
      >
       <!-- <template scope="scope">
          <div @click="showTenderSumAmountCellData(scope.row,scope.$index)":class="{shade:!(showTenderSumAmountList[scope.$index])}">
            {{showTenderSumAmountList[scope.$index]}}{{triggerUpdata}}
          </div>
        </template>-->
      </el-table-column>
      <el-table-column
        prop="tenderCount"
        label="募集总笔数"
      >

      </el-table-column>
      <el-table-column
        prop="payAmount"
        :formatter="formatterPayAmount"
        label="出借本金（元）"
      >
       <!-- <template scope="scope">
          <div @click="showLoanAmountCellData(scope.row,scope.$index)":class="{shade:!(showLoanAmountList[scope.$index])}">
            {{showLoanAmountList[scope.$index]}}{{triggerUpdata}}
          </div>
        </template>-->
      </el-table-column>
      <el-table-column
        prop="redPacketAmount"
        :formatter="formatterRedPacketAmount"
        label="红包金额(元)"
      >
       <!-- <template scope="scope">
          <div @click="showLoanRedpacketCellData(scope.row,scope.$index)":class="{shade:!(showLoanRedpacketList[scope.$index])}">
            {{showLoanRedpacketList[scope.$index]}}{{triggerUpdata}}
          </div>
        </template>-->
      </el-table-column>
      <el-table-column
        prop="loanCount"
        label="放款笔数"
      >
        <!--<template scope="scope">
        <div @click="showLoanCountCellData(scope.row,scope.$index)":class="{shade:!(showLoanCountList[scope.$index])}">
          {{showLoanCountList[scope.$index]}}{{triggerUpdata}}
        </div>
        </template>-->
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
        prop="loanTime"
        :formatter="formatterDayTime"
        label="放款时间"
      >
      </el-table-column>
      <el-table-column
        prop="notifyLoanStatus"
        :formatter="fomatterNotifyLoanStatus"
        label="银行处理进度"
      >
      </el-table-column>
     <!-- <el-table-column
        prop=""
        label="对账文件名称"
      >
      </el-table-column>-->
       <el-table-column
        label="操作"
        fixed="right"
      >
        <template scope="scope">
          <span>
          <el-button @click="goDetail(scope.row)" type="text" v-if="detailBtnViable">详情</el-button>
          </span>
          <span v-if="updateProgressBtnViable">
          <el-button @click="updateProgress(scope.row)"type="text" v-if="scope.row.notifyLoanStatus==10||scope.row.notifyLoanStatus==0">更新进度</el-button>
          </span>
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

    <!--提示框 (更新进度)-->
    <el-dialog
      title="提示"
      :visible.sync="updateDialogVisible"
    >
      <el-row type="flex" justify="center"  v-if="!dialogLoading">
        <i class="el-icon-loading"></i>
      </el-row>
      <el-row v-if="dialogLoading" style="text-align: center" >
        <div style="margin: 10px 0;font-size: 20px">是否确认手动执行更新银行处理进度操作?</div>
        <span style="color:#ff4949;">注意：此操作不可逆,操作之前一定要确认银行未生成对账文件</span>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="space-around">
          <el-button type="primary" @click="updateProgressBtn()" :disabled="updateBtnDisabled">确 定</el-button>
          <el-button @click="updateDialogVisible = false" >关闭</el-button>
        </el-row>
      </span>
    </el-dialog>
    <!--提示框end-->
    <el-dialog
      title="提示"
      :visible="updateDialogVisible2"
    >
      <el-row style="text-align: center" >
        <div style="margin: 10px 0;font-size: 20px">{{popMsg}}</div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="space-around">
          <el-button @click="updateDialogVisible2 = false" >确认</el-button>
        </el-row>
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
        searchBtnViable: false,
        detailBtnViable: false,
        loadingBtnViable: false,
        updateProgressBtnViable: false,
        breadcrumName: '',
        totalCount: 0,
        currentPage: 1,
        productTypeOptions: TOOLS.fetchObj('commonObj').ProductType,
        unitTypeOptions: TOOLS.fetchObj('commonObj').BorrowerType,
        loanForm: {
          id: '', // 项目ID
          name: '', // 项目名称
          unitType: '',
          borrowerName: '', // 借方名称
          type: '', // 项目类型
          date: ''// 还款时间
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        rules: {
          name: [
            { max: 20, message: '长度在20个字符以内', trigger: 'blur' }
          ],
          borrowerName: [
            { max: 20, message: '长度在20个字符以内', trigger: 'blur' }
          ]
        },
        triggerUpdata: '',
        showTenderSumAmountList: [], // 总募集金额列表
        showLoanAmountList: [], // 放款总额列表
        showLoanRedpacketList: [], // 使用红包列表
        showLoanCountList: [], // 放款成功笔数
        notifyLoanStatusOptions: [
          {
            label: '处理中',
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
        activeId: 0, // 操作产品id
        dialogVisible: false,
        dialogLoading: true, // 弹出框的读取图标
        dialogErr: false,
        dialogErrContent: '', // 返回的错误信息
        updateDialogVisible: false,
        updateDialogVisible2: false,
        updateBtnDisabled: false,
        popMsg: ''
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
          if (this.getFunctionList[i].label === '详情') {
            this.detailBtnViable = true
          }
          if (this.getFunctionList[i].label === '下载') {
            this.loadingBtnViable = true
          }
          if (this.getFunctionList[i].label === '更新进度') {
            this.updateProgressBtnViable = true
          }
        }
      }

      this.getTableList(this.pageNo, this.pageSizes)
    },
    methods: {
      // 格式化日期(年月日)
      formatterDate (row, column) {
        return TOOLS.normalTimeDay(row[column.property])
      },
      // 格式化日期
      formatterDayTime (row, column) {
        return TOOLS.normalTime(row[column.property])
      },
      // 借款金额（元）转换
      formatterAmount (val) {
        return TOOLS.fenToYuan(val.amount)
      },
      // 募集总金额（元）转换
      formatterTenderAmount (val) {
        return TOOLS.fenToYuan(val.tenderAmount)
      },
      // 出借本金（元）转换
      formatterPayAmount (val) {
        return TOOLS.fenToYuan(val.payAmount)
      },
      // 红包金额（元）转换
      formatterRedPacketAmount (val) {
        return TOOLS.fenToYuan(val.redPacketAmount)
      },
      // 借款人类型转换
      formatterUnitType (val) {
        return TOOLS.valueToLabel(this.unitTypeOptions, val.unitType)
      },
      // 产品类型转换
      formatterProductType (val) {
        return TOOLS.valueToLabel(this.productTypeOptions, val.type)
      },
      // 银行处理进度转换
      fomatterNotifyLoanStatus (val) {
        return TOOLS.valueToLabel(this.notifyLoanStatusOptions, val.notifyLoanStatus)
      },
      // 每页显示多少条
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList()
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 第几页
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
        if ((+this.loanForm.date)) {
          this.loanForm.date = +this.loanForm.date
        }
        this.getTableList()
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 跳转修改页
      goDetail (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'DetailLoan', params: { productId: row.id }})
      },
      // 跳转产品详情
      goProductDetail (row) {
        TOOLS.clearProData()
        if (row.type === 'default') {
          this.$router.push({name: 'PublishDetail', params: { id: row.id, type: 'default', breadcrumName: '详情' }})
        } else if (row.type === 'bankPaper') {
          this.$router.push({name: 'BankPaperDetail', params: { id: row.id, type: 'default', breadcrumName: '详情' }})
        } else if (row.type === 'exportRebate') {
          this.$router.push({name: 'ExportRebateDetail', params: { id: row.id, type: 'default', breadcrumName: '详情' }})
        }
      },
      // 跳转借款人详情
      goBorrowerDetail (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'Detailborrower', params: { borrowerId: row.borrowerId, type: 0 }})
      },
      // 弹出更新进度
      updateProgress (val) {
        this.activeId = val.id// 操作产品id
        this.updateDialogVisible = true
      },
      // 弹出更新进度确定按钮
      updateProgressBtn () {
        this.updateBtnDisabled = true
        this.dialogLoading = false
        API.$tradeTederFixLoan(this.activeId, res => {
          this.updateBtnDisabled = false
          this.dialogLoading = true
          this.updateDialogVisible = false
          this.updateDialogVisible2 = true
          if (res.success == true) {
            this.popMsg = '成功更新银行处理进度'
            this.getTableList()
          } else {
            this.popMsg = '更新银行处理进度失败'
          }
        })
      },
      // 统一处理数据
      objFn () {
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'id': this.loanForm.id, // 项目ID
          'name': this.loanForm.name, // 项目名称
          'unitType': this.loanForm.unitType,
          'borrowerName': this.loanForm.borrowerName, // 借方名称
          'type': this.loanForm.type, // 项目类型
          'date': this.loanForm.date// 还款时间
        }
        return obj
      },
      // 请求数据
      getTableList () {
        API.$productLoanList(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      //      下载
      download () {
        if ((+this.loanForm.date)) {
          this.loanForm.date = +this.loanForm.date
        }
        API.$downloadFile('productRepayManagerPageQuery', '/gateway/repayment/product/flow/list/excel', this.objFn())
      }
    }
  }
</script>
<style lang="less" scope>
</style>
