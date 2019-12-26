<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="loanManagerForm" label-width="120px" ref="loanManagerForm">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="还款日：" prop="repayPlanDate">
                <el-date-picker
                  v-model="loanManagerForm.repayPlanDate"
                  type="date"
                  placeholder="选择日期"
                 >
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方名称：" prop="borrowerName">
                <el-input v-model="loanManagerForm.borrowerName"placeholder="请输入借方名称" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方类型：" prop="unitType">
                <el-select name="type" v-model="loanManagerForm.unitType">
                  <el-option v-for='x in unitTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="productName">
                <el-input v-model="loanManagerForm.productName"placeholder="请输入项目名称" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="productId">
                <el-input v-model="loanManagerForm.productId"placeholder="请输入项目ID" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目类型：" prop="productType">
                <el-select name="type" v-model="loanManagerForm.productType">
                  <el-option v-for='(x,index) in productTypeOptions' :value="x.value" :label="x.label"v-if="index<3"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="还款状态：" prop="businessRepayStatus">
              <el-select name="type"  v-model="loanManagerForm.businessRepayStatus">
                <el-option v-for='x in businessRepayStatusOptions' :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">

              <el-form-item label="受理状态：" prop="businessRepayStatus">
                <el-select name="type"  v-model="loanManagerForm.repayStatus">
                  <el-option v-for='x in repayStatusOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" v-if="searchBtnViable"@click="searchForm">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('loanManagerForm')">重置</el-button> </span>
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
        prop="repayPlanDate"
        :formatter="formatterDate"
        label="还款日期"
      >
      </el-table-column>
      <el-table-column
        prop="productName"
        label="项目名称"
      >
        <template scope="props">
          <div class="borrowerName-link" v-text="props.row.productName" @click="goProductDetail(props.row)"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="productId"
        label="项目ID"
      >
      </el-table-column>
      <el-table-column
        prop="productType"
        :formatter="formatterProductType"
        label="项目类型"
      >
      </el-table-column>
      <el-table-column
        prop="borrowerName"
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
        prop="atIndex"
        :formatter="formatterAtIndex"
        label="当前期/总期次"
      >
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
        prop="repayAmount"
        :formatter="formatterRepayAmount"
        label="还款总额(元)"
      >
        <!--<template scope="scope">
        <div @click="showRepayAmountCellData(scope.row,scope.$index)":class="{shade:!(showRepayAmountList[scope.$index])}">
          {{showRepayAmountList[scope.$index]}}{{triggerUpdata}}
        </div>
      </template>-->
      </el-table-column>
      <el-table-column
        prop="principalAmount"
        :formatter="formatterPrincipalAmount"
        label="还款本金(元)"
      >
       <!-- <template scope="scope">
          <div @click="showPrincipalAmountCellData(scope.row,scope.$index)":class="{shade:!(showPrincipalAmountList[scope.$index])}">
            {{showPrincipalAmountList[scope.$index]}}{{triggerUpdata}}
          </div>
        </template>-->
      </el-table-column>
      <el-table-column
        prop="interestAmount"
        :formatter="formatterInterestAmount"
        label="还款利息(元)"
      >
       <!-- <template scope="scope">
          <div @click="showInterestAmountCellData(scope.row,scope.$index)":class="{shade:!(showInterestAmountList[scope.$index])}">
            {{showInterestAmountList[scope.$index]}}{{triggerUpdata}}
          </div>
        </template>-->
      </el-table-column>
      <el-table-column
        prop="couponInterestAmount"
        :formatter="formatterCouponInterestAmount"
        label="加息总额(元)"
      >
       <!-- <template scope="scope">
          <div @click="showCouponAmountCellData(scope.row,scope.$index)":class="{shade:!(showCouponAmountList[scope.$index])}">
            {{showCouponAmountList[scope.$index]}}{{triggerUpdata}}
          </div>
        </template>-->

      </el-table-column>
      <el-table-column
        prop=""
        label="出借人手续费(元)"
      >
        <template scope="scope">
          <span>0</span>
         <!-- <div @click="showFeeAmountCellData(scope.row,scope.$index)":class="{shade:!(showFeeAmountList[scope.$index])}">
            {{showFeeAmountList[scope.$index]}}{{triggerUpdata}}
          </div>-->
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="借款人手续费(元)"
      >
        <template scope="scope">
          <span>0</span>
        </template>
      </el-table-column>
      <el-table-column
        label="受理状态"
        prop="repayStatus"
        :formatter="formatterRepayStatus"
      >

      </el-table-column>
      <el-table-column
        prop="repayPlanDate"
        label="实际还款日期"
        :formatter="formatterRepayPlanDate"
      >
      </el-table-column>
      <el-table-column
        prop="repayAccountType"
        label="还款来源"
        :formatter="formatterRepayAccountType"
      >
      </el-table-column>
      <el-table-column
        label="还款状态"
        prop="businessRepayStatus"
        :formatter="fomatterBusinessRepayStatus"
      >
      </el-table-column>
      <el-table-column
        prop="repaymentTradeStatus"
        :formatter="fomatterRepaymentTradeStatus"
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
        width="110"
      >
        <template scope="scope">

          <span> <el-button @click="goDetail(scope.row)" type="text" v-if="detailBtnViable">详情</el-button></span>
          <span v-if="innerRepaymentBtnViable">
          <el-button @click="repaymentConfirm('1',scope.row)"type="text" v-if="scope.row.repayStatus!='repay'">还款</el-button>
          </span>
          <span v-if="updateProgressBtnViable">
          <el-button @click="updateProgress(scope.row)"type="text" v-if="scope.row.repayStatus=='repay'&&scope.row.repaymentTradeStatus!=4">更新进度</el-button>
          </span>
          <!--<el-button @click="repaymentConfirm('2',scope.row)"type="text" v-if="(scope.row.repayAccountType == 2 || scope.row.repayAccountType == 'all')&&scope.row.repayStatus!='repay'">保证金账户还款</el-button>-->
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

    <!--提示框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
    >
      <el-row type="flex" justify="center" v-show="!dialogErr">

        <span class="trans">项目还款：</span>
        <i class="el-icon-loading" v-if="dialogLoading"></i>
        <span v-if="!dialogLoading" class="mRight20">已还款</span>
        <i class="el-icon-check" v-if="!dialogLoading"></i>

      </el-row>
      <el-row v-if="!dialogLoading" type="flex" justify="center" v-show="!dialogErr">
        <small style="color:#ff4949;">此时还款仅代表银行接收还款指令，实际还款由银行处理，您可实时查询银行处理进度。</small>
      </el-row>

      <el-row type="flex" justify="center">
        <h2 v-if="dialogErr">{{dialogErrContent}}</h2>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="space-around">
           <el-button @click="repaymentSending" v-if="dialogErr" type="primary">重 发</el-button>
          <el-button @click="dialogVisible = false" v-if="dialogErr">取 消</el-button>
          <el-button type="primary" @click="repaymentBtn" v-if="!dialogLoading && !dialogErr">确 定</el-button>
        </el-row>
      </span>
    </el-dialog>
    <!--提示框end-->
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
        innerRepaymentBtnViable: false,
        updateProgressBtnViable: false,
        loadingBtnViable: false,
        breadcrumName: '',
        totalCount: 0,
        currentPage: 1,
        productTypeOptions: TOOLS.fetchObj('commonObj').ProductType,
        unitTypeOptions: TOOLS.fetchObj('commonObj').BorrowerType,
        repayAccountTypeOptions: [
          {value: 1, label: '内部户还款'},
          {value: 2, label: '保证金账户'},
          {value: 'all', label: '内部户还款'}
        ],
        loanManagerForm: {
          repayPlanDate: '', // 还款日
          productName: '', // 项目名称
          productId: '', // 项目ID
          productType: '', // 项目类型
          borrowerName: '', // 借方名称
          unitType: '', // 借方类型
          businessRepayStatus: '', // 还款状态
          repayStatus: ''// 受理状态
        },
        tableData: [],
        multipleSelection: [],
        pageNo: 1,
        pageSize: 5,
        showRepayAmountList: [], // 还款总额列表
        showPrincipalAmountList: [], // 还款本金列表
        showInterestAmountList: [], // 还款利息列表
        showCouponAmountList: [], // 加息总额列表
        showFeeAmountList: [], // 投资人手续费列表
        showList: [], // 融资人手续费列表
        showStatusList: [], // 还款状态列表
        triggerUpdata: '',
        accountTypeNum: '',
        productId: '',
        atIndex: '',
        dialogVisible: false,
        dialogLoading: true, // 弹出框的读取图标
        dialogErr: false,
        dialogErrContent: '', // 返回的错误信息
        updateDialogVisible: false,
        updateDialogVisible2: false,
        updateBtnDisabled: false,
        popMsg: '',
        activeProductId: 0, // 操作产品id
        activeAtIndex: 0, // 操作产品期数
        repayStatusOptions: [
        //          {"label":"未受理","value":"unrepay"},
          {'label': '受理成功', 'value': 'repay'},
          {'label': '受理失败', 'value': 'fail'}
        ], // 受理状态枚举
        businessRepayStatusOptions: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '未还款',
            value: 10
          },
          {
            label: '已还款',
            value: 20
          },
          {
            label: '失败',
            value: '30'
          }

        ], // 还款状态枚举
        repaymentTradeStatusOptions: [
          {
            label: '',
            value: 0
          },
          {
            label: '成功',
            value: 4
          },
          {
            label: '失败',
            value: 5
          }
        ]// 银行处理进度枚举
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
          if (this.getFunctionList[i].label === '内部户还款') {
            this.innerRepaymentBtnViable = true
          }
          if (this.getFunctionList[i].label === '更新进度') {
            this.updateProgressBtnViable = true
          }
          if (this.getFunctionList[i].label === '下载') {
            this.loadingBtnViable = true
          }
        }
      }
      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {
      // 借款人类型转换
      formatterUnitType (val) {
        return TOOLS.valueToLabel(this.unitTypeOptions, val.unitType)
      },
      // 产品类型转换
      formatterProductType (val) {
        return TOOLS.valueToLabel(this.productTypeOptions, val.productType)
      },

      // 受理状态转换
      formatterRepayStatus (val) {
        /*   if(){
            {"label":"未受理","value":"unrepay"},
          } */
        return TOOLS.valueToLabel(this.repayStatusOptions, val.repayStatus)
      },
      // 实际还款日期转换
      formatterRepayPlanDate (val) {
        if (val.repayStatus !== 'repay') {
          return ''
        } else {
          return TOOLS.normalTimeDay(val.repayPlanDate)
        }
      },
      // 还款账户类型转换
      formatterRepayAccountType (val) {
        return TOOLS.valueToLabel(this.repayAccountTypeOptions, val.repayAccountType)
      },
      // 当前期/总期次
      formatterAtIndex (val) {
        return val.atIndex + '/' + val.countIndex
      },
      // 还款总额(元)转换
      formatterRepayAmount (val) {
        return TOOLS.fenToYuan(val.principalAmount + val.interestAmount + val.couponInterestAmount)
      },

      // 还款本金(元)转换
      formatterPrincipalAmount (val) {
        return TOOLS.fenToYuan(val.principalAmount)
      },
      // 还款利息(元)转换
      formatterInterestAmount (val) {
        return TOOLS.fenToYuan(val.interestAmount)
      },
      // 加息总额(元)转换
      formatterCouponInterestAmount (val) {
        return TOOLS.fenToYuan(val.couponInterestAmount)
      },
      // 格式化日期
      formatterDate (row, column) {
        return TOOLS.normalTimeDay(row[column.property])
      },
      // 还款状态转换
      fomatterBusinessRepayStatus (val) {
        return TOOLS.valueToLabel(this.businessRepayStatusOptions, val.businessRepayStatus)
      },
      // 银行处理进度转换
      fomatterRepaymentTradeStatus (val) {
        return TOOLS.valueToLabel(this.repaymentTradeStatusOptions, val.repaymentTradeStatus)
      },
      /* //使用第三方值来触发数据的更新
      triggerFn(val){
        if(val){
          this.triggerUpdata = '';
        }
        this.triggerUpdata = null;
      },
      //显示单元格内数据-还款总额
      showRepayAmountCellData(row,index){
        API.$periodRepayAmountCellData(row.productId,row.atIndex,res=>{
          if(res.success){
              if(res.data!==null){
                this.showRepayAmountList[index] = (TOOLS.fenToYuan(res.data)).toString();
                this.triggerFn(this.showRepayAmountList[index]);
              }else{
                this.showRepayAmountList[index]="无数据"
                this.triggerFn(this.showRepayAmountList[index]);
//                this.dadaIsNullVisable=true;
              }

          }

        })

      },
      //显示单元格内数据-还款本金
      showPrincipalAmountCellData(row,index){
        API.$periodPrincipalAmountCellData(row.productId,row.atIndex,res=>{
          if(res.success){
            if(res.data!==null){
              this.showPrincipalAmountList[index] = (TOOLS.fenToYuan(res.data)).toString();
              this.triggerFn(this.showPrincipalAmountList[index]);
            }else{
              this.showPrincipalAmountList[index] ="无数据";
              this.triggerFn(this.showPrincipalAmountList[index]);
//              this.dadaIsNullVisable=true;
            }

          }

        })
      },
      //显示单元格内数据-还款利息
      showInterestAmountCellData(row,index){
        API.$periodInterestAmountCellData(row.productId,row.atIndex,res=>{
          if(res.success){
            if(res.data!==null){
              this.showInterestAmountList[index] = (TOOLS.fenToYuan(res.data)).toString();
              this.triggerFn(this.showInterestAmountList[index]);
            }else{
              this.showInterestAmountList[index] = "无数据";
              this.triggerFn(this.showInterestAmountList[index]);
//              this.dadaIsNullVisable=true;
            }
          }

        })

      },
      //显示单元格内数据-加息总额
      showCouponAmountCellData(row,index){
        API.$periodCouponAmountCellData(row.productId,row.atIndex,res=>{
          if(res.success){
            if(res.data!==null){
              this.showCouponAmountList[index] = (TOOLS.fenToYuan(res.data)).toString();
              console.log("this.showCouponAmountList[index]"+this.showCouponAmountList[index]);
              console.log("this.showCouponAmountList[index] type"+typeof (this.showCouponAmountList[index]));
              console.log("this.showCouponAmountList[index] type"+this.showCouponAmountList[index]);
              this.triggerFn(this.showCouponAmountList[index]);
            }else{
              this.showCouponAmountList[index] = "无数据";
              this.triggerFn(this.showCouponAmountList[index]);
            }

          }
        })

      },
      //显示单元格内数据-投资人手续费
      showFeeAmountCellData(row,index){
        API.$periodFeeAmountCellData(row.productId,row.atIndex,res=>{
          if(res.success){
            if(res.data!==null){
              this.showFeeAmountList[index] = (TOOLS.fenToYuan(res.data)).toString();
              this.triggerFn(this.showFeeAmountList[index]);
            }else{
              this.showFeeAmountList[index] = "无数据";
              this.triggerFn(this.showFeeAmountList[index]);
//              this.dadaIsNullVisable=true;
            }

          }
        })

      },
      //显示单元格内数据-还款状态
      showStatusCellData(row,index){
        API.$periodStatusCellData(row.productId,row.atIndex,res=>{
          if(res.success){
            TOOLS.log('res',res)
            if(res.data!==null){
              this.showStatusList[index] =this.formatterRepayStatus(res.data.repaymentStatus);
              this.triggerFn(this.showStatusList[index]);
            }else{
              this.showStatusList[index] ="无数据";
              this.triggerFn(this.showStatusList[index]);

            }

          }
        })

      }, */
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
        if ((+this.loanManagerForm.repayPlanDate)) {
          this.loanManagerForm.repayPlanDate = +this.loanManagerForm.repayPlanDate
        }
        this.getTableList()
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },

      // 跳转产品详情
      goProductDetail (row) {
        TOOLS.clearProData()
        console.log('row.type' + row.productType)
        if (row.productType === 'default') {
          this.$router.push({name: 'PublishDetail', params: {id: row.productId, type: 'default', breadcrumName: '详情'}})
        } else if (row.productType === 'bankPaper') {
          this.$router.push({name: 'BankPaperDetail', params: {id: row.productId, type: 'default', breadcrumName: '详情'}})
        } else if (row.productType === 'exportRebate') {
          this.$router.push({name: 'ExportRebateDetail', params: {id: row.productId, type: 'default', breadcrumName: '详情'}})
        }
      },

      // 跳转借款人详情
      goBorrowerDetail (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'Detailborrower', params: { borrowerId: row.borrowerId, type: 0 }})
      },

      // 跳转修改页
      goDetail (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'EditFundManager', params: { productId: row.productId, repayPlanDate: row.repayPlanDate }})
      },

      // 弹出还款确认
      repaymentConfirm (num, scope) {
        this.accountTypeNum = num
        this.productId = scope.productId
        this.atIndex = scope.atIndex
        this.$confirm('您将进行还款, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.dialogVisible = true
          this.repaymentSending()
        }).catch(() => {
          this.dialogVisible = false
        }

        )
      },
      // 还款发送
      repaymentSending () {
        API.$repaymentButton(this.accountTypeNum, this.productId, this.atIndex, res => {
          console.log(res)
          if (res.success) {
            this.dialogLoading = false
          } else {
            this.dialogErrContent = res.resultMsg
            this.dialogErr = true
          }
        })
      },
      // 还款确定
      repaymentBtn () {
        this.dialogVisible = false
        this.getTableList()
      },
      // 弹出更新进度
      updateProgress (val) {
        this.activeProductId = val.productId// 操作产品id
        this.activeAtIndex = val.atIndex// 操作产品期数
        this.updateDialogVisible = true
      },
      // 弹出更新进度确定按钮
      updateProgressBtn () {
        this.updateBtnDisabled = true
        this.dialogLoading = false
        API.$repaymentFixRepayment(this.activeProductId, this.activeAtIndex, res => {
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
          'repayPlanDate': this.loanManagerForm.repayPlanDate, // 还款日
          'productName': this.loanManagerForm.productName, // 项目名称
          'productId': this.loanManagerForm.productId, // 项目ID
          'productType': this.loanManagerForm.productType, // 项目类型
          'borrowerName': this.loanManagerForm.borrowerName, // 借方名称
          'unitType': this.loanManagerForm.unitType, // 借方类型
          'businessRepayStatus': this.loanManagerForm.businessRepayStatus, // 还款状态
          'repayStatus': this.loanManagerForm.repayStatus// 受理状态
        }
        return obj
      },
      // 请求数据
      getTableList () {
        API.$repaymentPlanListManager(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 下载
      download () {
        if ((+this.loanManagerForm.repayPlanDate)) {
          this.loanManagerForm.repayPlanDate = +this.loanManagerForm.repayPlanDate
        }
        API.$downloadFile('productLoanPageQuery', '/gateway/repayment/product/period/list/excel', this.objFn())
      }

    }
  }
</script>
<style lang="less" scope>
  @import "./projectFund.less";
</style>
