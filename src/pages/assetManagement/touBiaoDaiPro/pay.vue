<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
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
              <el-form-item label="项目名称：" prop="name">
                <el-input v-model="form.name" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="productId">
                <el-input v-model="form.productId" ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
        <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方名称：" prop="borrowerName">
                <el-input v-model="form.borrowerName" ></el-input>
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
    <div class="z-tool-bar"></div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="loanNo"
        label="申请ID">
      </el-table-column>
      <el-table-column
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetailPage(scope.row,'default')" class="detailSpan">{{scope.row.name}}</span>
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
        prop="contactName"
        label="项目联系人"
      >
      </el-table-column>
      <el-table-column
        prop="contactPhone"
        label="项目联系人电话"
      >
      </el-table-column>
      <el-table-column
        prop="cashDeposit"
        :formatter="moneyFormat"
        label="保证金金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="formatterAuditFlag"
        label="支付状态"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="dateFormat"
        label="提交时间"
        >
      </el-table-column>
      <el-table-column
        prop="endTime"
        :formatter="endDay"
        label="过期时间"
        >
      </el-table-column>
      <el-table-column
        label="操作"
        >
        <template scope="scope">
          <el-button @click="cancelLoanBtn(scope.row)" type="text" v-if="disabledArray[1] === 'true' ">取消借款</el-button>
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
    <el-dialog title="" v-model="cancelLoan" size="tiny" >
      <div style="text-align: center"><br>是否确认取消该企业借款申请？<br>{{(rowStatus?pageText[rowStatus]:'')}}<br></div>
      <div slot="footer" class="dialog-footer" style="text-align: center;display: flex;justify-content: space-around">
        <el-button @click="cancelLoan = false">取 消</el-button>
        <el-button type="primary" @click="cancelLoanConform">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>



<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOL from '../../../assets/js/tools'
  import { Loading } from 'element-ui'

export default {
    data () {
      return {
        cancelLoan: false, // 取消借款弹窗
        totalCount: 0,
        currentPage: 1,
        form: {
          borrowerName: '', // 借方名称
          name: '', // 项目名称
          productId: '', // 项目id
          loanNo: ''// 申请id
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        productStatusZZOptions: TOOL.fetchObj('commonObj').ProductStatusZZ, // 支付状态
        breadcrumName: '',
        disabledArray: [], // 权限控制\1/查询,2/取消借款
        pageText: {
          10: '',
          20: '取消借款后同步执行退保证金操作。',
          30: '该项目下有处理中的支付订单，根据订单实际支付状态执行退款操作。'
        },
        rowStatus: '', // 每行的状态值
        rowId: ''// 每行的id
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
            case '取消借款':
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
      // 项目期限
      endDay (row, column) {
        return TOOL.normalTimeDay(row[column.property])
      },
      // 金额转换
      moneyFormat (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },
      // 时间格式化
      dateFormat: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 状态转换
      formatterAuditFlag (row, column) {
        return TOOL.valueToLabel(this.productStatusZZOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList()
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList()
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
      /* --------------------------------------------页面事件----------------------------------------------------------- */

      // 跳转详情
      toDetailPage (row, type) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        this.$router.push({ name: 'TBDPayProDetail', params: { id: row.productId, type: type } })
      },

      //  取消借款弹窗
      cancelLoanBtn (row) {
        this.rowId = ''// 清空id
        this.rowId = row.productId// 每行的id
        let loadingInstance = Loading.service({ fullscreen: true })
        TOOL.log(this.rowId)
        API.$cancelType({id: this.rowId}, res => {
          loadingInstance.close()
          if (res.success) {
            this.cancelLoan = true
            this.rowStatus = res.data// 接口返回状态
          } else {
            TOOL.msgBox(this, res.resultMsg)
          }
        })
      },

      cancelLoanConform () {
        this.cancelLoan = false
        let loadingInstance = Loading.service({ fullscreen: true })
        API.$nopayCancel({id: this.rowId}, res => {
          loadingInstance.close()
          TOOL.log(res)
          if (!res.success) {
            TOOL.msgBox(this, res.resultMsg)
          } else {
            this.getTableList()
          }
        })
      },

      // 请求数据
      getTableList (pageNo = this.pageNo, pageSize = this.pageSize) {
        API.$nopayList(TOOL.noEmety(this.form, pageSize, pageNo), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "./proStyle.less";
</style>
