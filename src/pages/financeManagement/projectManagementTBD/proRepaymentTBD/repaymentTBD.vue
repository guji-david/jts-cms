<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="125px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="预计还款时间：" prop="dateStart">
                <el-date-picker type="daterange" placeholder="选择日期" v-model="form.dateStart"></el-date-picker>
              </el-form-item>
            </div>
          </el-col>
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
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="productId">
                <el-input v-model="form.productId" placeholder="请输入项目ID"></el-input>
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
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="是否已通知还款：" prop="isNotify">
                <el-select name="type" v-model="form.isNotify">
                  <el-option v-for='x in notifyOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="是否已划转利息：" prop="isBalance">
                <el-select name="type" v-model="form.isBalance">
                  <el-option v-for='x in transferOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目是否逾期：" prop="isOverdue">
                <el-select name="type" v-model="form.isOverdue">
                  <el-option v-for='x in isOverdueOptions' :value="x.value" :label="x.label"></el-option>
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
    <div class="z-tool-bar"></div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="repayTime" :formatter="dateFormatDay" label="预计还款时间"></el-table-column>
      <el-table-column prop="loanNo" label="申请ID"></el-table-column>
      <el-table-column label="项目名称">
        <template scope="scope">
          <span @click="toDetailPage(scope.row,'noRepayInfo')" class="detailSpan">{{scope.row.productName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productId" label="项目ID"></el-table-column>
      <el-table-column prop="borrowerName" label="借方名称"></el-table-column>

      <el-table-column prop="contactName" label="项目联系人"></el-table-column>
      <el-table-column prop="contactPhone" label="联系人电话"></el-table-column>
      <el-table-column prop="status" :formatter="dealProgressFormat" label="放款资金处理进度"></el-table-column>
      <el-table-column prop="accountName" label="还款账户"></el-table-column>
      <el-table-column prop="accountNo" label="还款账号"></el-table-column>
      <el-table-column label="是否逾期" >
        <template scope="props"  >
          <div class="pinkBg" :class="{red:props.row.isOverdue =='true'}">
            <p >{{isOverdueFormat(props.row.isOverdue)}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="isNotify" :formatter="isNotifyFormat" label="是否已通知还款"></el-table-column>
      <el-table-column prop="isBalance" :formatter="isBalanceFormat" label="是否已划转利息"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button type="text" @click="opNoticeBtn(scope.row)" v-if="disabledArray[1] === 'true' && (scope.row.isNotify==='false'||scope.row.isNotify==='') "  disabled>-</el-button>
          <el-button type="text" @click="opTransferBtn(scope.row)" v-if="disabledArray[2] === 'true' && scope.row.isNotify==='true' && (scope.row.isBalance==='false'||scope.row.isBalance==='') " :disabled="scope.row.productID===activeId">划转利息</el-button>
          <el-button type="text" @click="opRepaymentBtn(scope.row.productId)" v-if="disabledArray[3] === 'true' && scope.row.isNotify==='true' && scope.row.isBalance==='true'" :disabled="scope.row.productID===activeId">去还款</el-button>
        <!--  <el-button type="text" @click="opRepaymentBtn(scope.row.productId)" v-if="disabledArray[3] === 'true'" :disabled="scope.row.productID===activeId">去还款</el-button>-->
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
<style lang="less" scoped>
  .pinkBg{
    position:absolute;
    width: 100%;
    height: 100%;
    background: #FFE6E3;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .red{
    color: #F8564F;
  }

</style>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../.././../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        totalCount: 0,
        currentPage: 1,
        transferOptions: TOOL.fetchObj('commonObj').IsXXX,
        isOverdueOptions: TOOL.fetchObj('commonObj').IsXXX,
        notifyOptions: TOOL.fetchObj('commonObj').IsXXX,
        form: {
          dateStart: [], // 预计还款时间
          loanNo: '', // 申请ID
          productName: '', // 项目名称
          productId: '', // 项目ID
          borrowerName: '', // 借方名称

          isNotify: '', // 是否已通知还款
          isBalance: '',// 是否已划转利息
          isOverdue: ''// 是否已逾期
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        breadcrumName: '',
        disabledArray: [], // 权限控制\1/查询,2/去还款,3/下载
        activeId: 0
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
            case '-':
              this.disabledArray[1] = 'true'
              break
            case '划转利息':
              this.disabledArray[2] = 'true'
              break
            case '去还款':
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
      /* -----------------------------------------------格式转换-------------------------------------------------------- */
      // 时间格式化到日
      dateFormatDay: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTimeDay(date)
      },
      dealProgressFormat: function (row, column) {
        if (!row[column.property] || row[column.property] === 10) {
          return '处理中'
        }
        return TOOL.valueToLabel(TOOL.fetchObj('commonObj').BaseStatus, row[column.property])
      },
      isNotifyFormat: function (row, column) {
        let statusArr = [
          {
            value: 'true',
            label: '是(' + TOOL.normalTime(row['notifyTime']) + ')'
          },
          {value: 'false', label: '否'},
          {value: null, label: '否'}
        ]
        return TOOL.valueToLabel(statusArr, row[column.property])
      },
      isBalanceFormat: function (row, column) {
        let statusArr = [
          {
            value: 'true',
            label: '是(' + TOOL.normalTime(row['balanceTime']) + ')'
          },
          {value: 'false', label: '否'},
          {value: null, label: '否'}
        ]
        return TOOL.valueToLabel(statusArr, row[column.property])
      },
      isOverdueFormat: function (val) {
        let statusArr = [
          {
            value: 'true',
            label: '是'
          },
          {value: 'false', label: '否'},
          {value: null, label: '否'}
        ]
        return TOOL.valueToLabel(statusArr, val)
      },

      /* -------------------------------------------分页,查询----------------------------------------------------------- */
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
        if (this.form.repayStartDate) this.form.repayStartDate = this.form.repayStartDate.getTime()
        this.getTableList()
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* -----------------------------------------页面事件-------------------------------------------------------------- */
      opNoticeBtn (row) {
        this.activeId = row.productId
        API.postRequest('/gateway/zhongzhao/product/repay/updateZzNotify', { id: row.productId }, res => {
          this.activeId = 0
          if (res.success) { // 如果成功的话
            TOOL.alertConfirm(this, '', `同步还款通知发送成功`, '', '确定', '', 'success', false)
            this.getTableList()
          } else {
            TOOL.alertConfirm(this, '', `${res.resultMsg} 同步还款通知发送失败`, '', '确定', '', 'warning', false)
          }
        })
      },
      opTransferBtn (row) {
        this.activeId = row.productId
        API.postRequest('/gateway/zhongzhao/product/repay/transferInterest', { id: row.productId }, res => {
          this.activeId = 0
          if (res.success) { // 如果成功的话
            TOOL.alertConfirm(this, '', `划转利息成功`, '', '确定', '', 'success', false)
            this.getTableList()
          } else {
            TOOL.alertConfirm(this, '', `${res.resultMsg} 划转利息失败`, '', '确定', '', 'warning', false)
          }
        })
      },
      // 去还款
      opRepaymentBtn (id) {
        this.$router.push({name: 'GoRepayDetail', params: { id: id }})
      },
      // 时间转换
      queryDateChange () {
        if (this.form.dateStart.length !== 0) {
          if (this.form.dateStart[0] && this.form.dateStart[1]) {
            this.form.startTime = +this.form.dateStart[0]
            this.form.endTime = +this.form.dateStart[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.startTime = ''
            this.form.endTime = ''
          }
        } else {
          this.form.startTime = ''
          this.form.endTime = ''
        }
      },
      // 请求数据
      getTableList () {
        this.queryDateChange()
        let objdata = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'repayStartTime': this.form.startTime,
          'repayEndTime': this.form.endTime,
          'loanNo': this.form.loanNo,
          'productName': this.form.productName,
          'productId': this.form.productId,
          'borrowerName': this.form.borrowerName,
          'isNotify': this.form.isNotify,
          'isOverdue': this.form.isOverdue,
          'isBalance': this.form.isBalance
        }

        API.$noRepayList(objdata, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 跳转去详情页
      toDetailPage (row, type) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        this.$router.push({name: 'TBDPayProDetail', params: {id: row.productId, type: type}})
      }
    }
  }
</script>
