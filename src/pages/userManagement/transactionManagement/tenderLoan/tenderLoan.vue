<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="平台流水号：" prop="orderNo">
                <el-input  v-model="form.orderNo"  type="tel" placeholder="请输入平台流水号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="手机号：" prop="mobile">
                <el-input  v-model="form.mobile"placeholder="请输入手机号" type="tel"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名"type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="放款时间：" prop="loanTime">
                <el-date-picker
                  v-model="form.loanTime"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" >
            <div class="z-span-20" >
              <el-form-item>
                <span class="z-btn-span"><el-button type="primary" icon="search" @click="getTablelist" v-if="disabledArray[0] === 'true'">查询</el-button></span>
                <span class="z-btn-span"><el-button  @click="resetForm('form')">重置</el-button></span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar">
      <span class="z-btn-span" v-if="totalCount>0"><el-button type="default" icon="document" @click="download" v-if="disabledArray[1] === 'true'">下载</el-button></span>
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      style="width: 100%">
      <el-table-column
        prop="orderNo"
        label="平台流水号"
      >
      </el-table-column>
      <el-table-column
        label="手机号码"
      >
        <template scope="scope">
          <div @click="toTelDetail(scope.row)" class="linkColor">{{scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="客户姓名"
      >
      </el-table-column>
      <el-table-column
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetail(scope.row)" class="detailSpan">{{scope.row.productName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="amount"
        :formatter='moneyFormat'
        label="放款金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="freezeNo"
        label="出借资金冻结流水号"
      >
      </el-table-column>
      <el-table-column
        prop="loanSerialNo"
        label="放款流水号"
      >
      </el-table-column>
      <el-table-column
        prop="loanTime"
        :formatter="dateFormat"
        label="放款时间"
      >
      </el-table-column>
      <el-table-column
        prop="instSettleDate"
        :formatter="dateFormat"
        label="清算日期"
      >
      </el-table-column>
      <el-table-column
        prop="treatmentSchedule"
        label="银行处理进度"
      >
      </el-table-column>
    </el-table>
    <!-- 列表结束 -->

    <!-- 分页开始 -->
    <div class="z-pager" v-if="totalCount>0">
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
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  export default {
    data () {
      return {
        breadcrumName: '',
        totalCount: 0,
        currentPage: 1,
        form: {
          orderNo: '',
          mobile: '',
          name: '',
          productName: '',
          loanTime: [],
          loanTimeEnd: '',
          loanTimeStart: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        freezeStatusOptions: TOOL.fetchObj('commonObj').DataStatus, // 这里是不对的,但是没有对应的数据使用
        disabledArray: []// 权限控制\1/查询,2/下载
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
    beforeMount () {
      if (this.getFunctionList.length > 0) {
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '下载':
              this.disabledArray[1] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
    },
    methods: {
      // 跳转电话详情
      toTelDetail (row) {
        TOOL.clearProData()
        this.$router.push({name: 'AccountInfoDetail', params: { mobile: row.mobile }})
      },
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
      sendTimeChange () {
        if (this.form.loanTime.length) {
          if (this.form.loanTime[0] && this.form.loanTime[1]) {
            this.form.loanTimeStart = +this.form.loanTime[0]
            this.form.loanTimeEnd = +this.form.loanTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.loanTimeStart = ''
            this.form.loanTimeEnd = ''
          }
        } else {
          this.form.loanTimeStart = ''
          this.form.loanTimeEnd = ''
        }
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTablelist()
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTablelist()
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTablelist()
        console.log(`当前页: ${this.pageNo}`)
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 跳转详情
      toDetail (row) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        if (row.productType === 'default') {
          this.$router.push({name: 'PublishDetail', params: {id: row.productId, type: 'default', breadcrumName: '详情'}})
        } else if (row.productType === 'bankPaper') {
          this.$router.push({name: 'BankPaperDetail', params: {id: row.productId, type: 'default', breadcrumName: '详情'}})
        } else if (row.productType === 'exportRebate') {
          this.$router.push({name: 'ExportRebateDetail', params: {id: row.productId, type: 'default', breadcrumName: '详情'}})
        } else if (row.productType === 'tbd') {
          this.$router.push({name: 'TBDPayProDetail', params: {id: row.productId, type: 'tenderLoan'}})
        }
      },

      // 统一处理数据
      objFn () {
        this.sendTimeChange()
        let obj = {
          'orderNo': this.form.orderNo,
          'mobile': this.form.mobile,
          'name': this.form.name,
          'productName': this.form.productName,
          'freezeStatus': this.form.freezeStatus,
          'loanTimeEnd': this.form.loanTimeEnd,
          'loanTimeStart': this.form.loanTimeStart,
          'pageNo': this.pageNo,
          'pageSize': this.pageSize
        }
        return obj
      },

      getTablelist () {
        API.$getTenderLoan(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      download () {
        API.$downloadFile('tenderPageQuery', '/gateway/tradeTeder/getTenderLoanExport', this.objFn())
      }
    }
  }
</script>

<style lang="less" scope>
  .linkColor{
    color:#FF9900;
    cursor: pointer;
  }
</style>
