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
                <el-select name="type" v-model="form.unitType" >
                  <el-option v-for='x in borrowerTypeOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="发布状态：" prop="publishStatus">
                <el-select name="type" v-model="form.publishStatus" >
                  <el-option v-for='x in publishStatusOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="是否备案：" prop="isOnRecord">
                <el-select name="type" v-model="form.isOnRecord" >
                  <el-option v-for='x in isOnRecordOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-col :span="16" :push="1">
          <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
          <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
        </el-col>
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
        prop="isOnRecord"
        :formatter="formatterIsOnRecord"
        label="是否备案"
      >
      </el-table-column>
      <el-table-column
        prop="publishStatus"
        :formatter="formatterAuditFlag"
        label="发布状态"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="dateFormat"
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
        type="flex"
        justify="center"
        align="middle"
      >
        <template scope="scope" >
          <el-button @click="toKeepOnRecord(scope.row,scope.$index)" type="text" v-if="scope.row.isOnRecord=='false' && scope.row.publishStatus!='stop' && disabledArray[3] === 'true'" :disabled="recordVisible[scope.$index]">备案{{test}}</el-button>
          <el-button @click="topublish(scope.row)" type="text" v-if="scope.row.isOnRecord=='true' && scope.row.publishStatus!='stop' && disabledArray[1] === 'true'" >发布{{test}}</el-button>
          <el-button @click="toPCDetailPage(scope.row)" type="text">预览</el-button>
          <el-button @click="multipleDelBtn(scope.row)" type="text" v-if="scope.row.publishStatus!='stop' && disabledArray[2] === 'true'" >停用</el-button>
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

    <!-- 操作停用的时候提示 -->
    <el-dialog title="提示" v-model="DelDialogVisible" size="tiny">
      <span>确定要停用选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="DelDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delMultipleBorrower" :disabled="stopVisible">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import * as API from '../../../store/api'
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as TOOL from '../../../assets/js/tools'

  export default {
    data () {
      return {
        updataDialogVisible: false,
        DelDialogVisible: false,
        scopeRow: '',
        totalCount: 0,
        currentPage: 1,
        form: {
          borrowerName: '', // 借方名称
          name: '', // 项目名称
          unitType: '',
          type: [], // 项目类型
          publishStatus: '', // 状态
          isOnRecord: ''
        },
        borrowerTypeOptions: TOOL.fetchObj('commonObj').BorrowerType,
        tableData: [],
        multipleSelection: [],
        hidden: true,
        pageNo: 1,
        pageSize: 5,
        publishStatusOptions: TOOL.fetchObj('commonObj').PublishStatus,
        productTypeOptions: TOOL.fetchObj('commonObj').ProductType,
        repayTypeOptions: TOOL.fetchObj('commonObj').RepayType,
        isOnRecordOptions: [
          {
            label: '备案',
            value: 'true'
          },
          {
            label: '未备案',
            value: 'false'
          }
        ], // 备案状态
        test: '',
        breadcrumName: '',
        stopId: '', // 用于储存被停用的id
        disabledArray: [], // 权限控制\1/查询,2/发布,3/停用,4/备案
        stopVisible: false, // 停用置灰
        recordVisible: []// 备案置灰
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
            case '发布':
              this.disabledArray[1] = 'true'
              break
            case '停用':
              this.disabledArray[2] = 'true'
              break
            case '备案':
              this.disabledArray[3] = 'true'
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
      moneyFormat (val) {
        return TOOL.fenToYuan(val.amount)
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 项目期限
      endDay (startDay, limitDate) {
        return TOOL.timeLimitFormat(startDay, limitDate)
      },
      // 还款方式转换
      repayFomat (row, column) {
        return TOOL.valueToLabel(this.repayTypeOptions, row[column.property])
      },
      // 机构类型转换
      formatterIsOnRecord (row, column) {
        return TOOL.valueToLabel(this.isOnRecordOptions, row[column.property])
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
        if (row[column.property] === 'Timer') {
          return TOOL.valueToLabel(this.publishStatusOptions, row[column.property]) + TOOL.normalTime(row.publishTime)
        } else {
          return TOOL.valueToLabel(this.publishStatusOptions, row[column.property])
        }
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList()
      },
      // 这个是pageNo
      handleCurrentChange (val) { // 这个是pageNo
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
        this.currentPage = 1
        this.pageNo = 1
        this.getTableList()
      },
      getTableList () {
        API.postRequest('/gateway/product/list/success', TOOL.noEmety(this.form, this.pageSize, this.pageNo), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 跳转发布页面
      topublish (row, index) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        if (row.type === 'default') {
          this.$router.push({ name: 'PublishDetail', params: { id: row.id, type: 'publish', breadcrumName: '发布' } })
        } else if (row.type === 'bankPaper') {
          this.$router.push({ name: 'BankPaperDetail', params: { id: row.id, type: 'publish', breadcrumName: '发布' } })
        } else if (row.type === 'exportRebate') {
          this.$router.push({ name: 'ExportRebateDetail', params: { id: row.id, type: 'publish', breadcrumName: '发布' } })
        }
      },

      // 跳转详情
      toPCDetailPage (row) {
        API.$toPC(row.type, row.id)
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

      //      //跳转详情页
      //      toDetail(row){
      //        let type = row.type;
      //        if(type === 'default'){
      //          this.$router.push({ name: 'PublishDetail', params: { id: row.id ,type:'',breadcrumName:'详情'}})
      //        }else if(type === 'bankPaper'){
      //          this.$router.push({ name: 'BankPaperDetail', params: { id: row.id ,type:'',breadcrumName:'详情'}})
      //        }else if(type === 'exportRebate'){
      //          this.$router.push({ name: 'ExportRebateDetail', params: { id: row.id ,type:'',breadcrumName:'详情'}})
      //        }
      //      },

      // 跳转备案页
      toKeepOnRecord (row, index) {
        this.recordVisible = []
        this.recordVisible[index] = true
        API.postRequest('/gateway/product/keepOnRecord', { id: row.id }, res => {
          this.recordVisible[index] = false
          if (res.success) { // 如果成功的话
            TOOL.alertConfirm(this, '', `备案成功`, '', '确定', '', 'success', false)
            this.triggerUpdata(index)
            this.getTableList()
          } else {
            TOOL.alertConfirm(this, '', `${res.resultMsg} 备案失败`, '', '确定', '', 'warning', false)
            this.triggerUpdata(index)
          }
        })
      },

      // 使用第三方值来触发数据的更新
      triggerUpdata (val) {
        if (val) {
          this.test = ''
        }
        this.test = null
      },

      //  停用弹窗
      multipleDelBtn (row) {
        this.DelDialogVisible = true
        this.stopId = row.id
      },
      // 停用窗口的确定
      delMultipleBorrower () {
        this.stopVisible = true
        API.$stopProduct(this.stopId, res => {
          console.log(res)
          this.stopVisible = false
          // 重新请求；再次渲染
          this.currentPage = 1
          this.getTableList()
        })
        // 隐藏弹出框
        this.DelDialogVisible = false
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "./proStyle.less";
</style>
