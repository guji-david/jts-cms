<template>
  <div id="content-body" class="content-body">
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="平台流水号：" prop="id">
                <el-input  v-model="form.id"  type="tel" placeholder="请输入平台流水号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="手机号：" prop="mobile">
                <el-input  v-model="form.mobile" placeholder="请输入手机号" type="tel"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="姓名：" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入姓名"type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="发放月份：" prop="timeFlag">
                <el-input  v-model="form.timeFlag"  type="text" placeholder="请输入发放月份"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="bankStatus">
                <el-select v-model="form.bankStatus">
                  <el-option v-for="x in bankStatusOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="银行处理进度：" prop="notifyStatus">
                <el-select v-model="form.notifyStatus">
                  <el-option v-for="x in notifyStatusOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" >
            <div class="z-span-20" >
              <el-form-item>
                <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
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
        prop="id"
        label="平台流水号"
      >
      </el-table-column>
      <el-table-column
        label="手机号"
      >
        <template scope="scope">
          <div @click="toTelDetail(scope.row)" class="linkColor">{{scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="idNo"
        label="身份证号"
      >
      </el-table-column>
      <el-table-column
        prop="profitMonth"
        label="发放月份"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        :formatter='moneyFormat'
        label="税前金额"
      >
      </el-table-column>
      <el-table-column
        prop="amountTax"
        :formatter='moneyFormat'
        label="代缴税费"
      >
      </el-table-column>
      <el-table-column
        prop="amountNoTax"
        :formatter='moneyFormat'
        label="税后金额"
      >
      </el-table-column>
      <el-table-column
        prop="bankStatus"
        :formatter='bankStatusFormat'
        label="状态"
      >
      </el-table-column>
      <el-table-column
        label="银行处理进度"
        prop="notifyStatus"
        :formatter='notifyStatusFormat'
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
  import * as API from '../../../../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'

  export default {
    data () {
      return {
        totalCount: 0,
        currentPage: 1,
        bankStatusOptions: TOOL.fetchObj('commonObj').BankStatus,
        notifyStatusOptions: TOOL.fetchObj('commonObj').BankNotifyStatus,
        form: {
          id: '', // 平台流水号
          mobile: '', // 手机号
          userName: '', // 姓名
          timeFlag: '', // 发送月份
          bankStatus: '', // 状态
          notifyStatus: ''// 银行处理进度
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: []// 权限控制\1/现金奖励查询-查询,2/现金奖励查询-下载
      }
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
            case '现金奖励查询-查询':
              this.disabledArray[0] = 'true'
              break
            case '现金奖励查询-下载':
              this.disabledArray[1] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
    },
    methods: {
      // 跳转详情
      toTelDetail (row) {
        TOOL.clearProData()
        this.$router.push({name: 'AccountInfoDetail', params: { mobile: row.mobile }})
      },
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 金额转换
      moneyFormat (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },

      // 状态转换
      bankStatusFormat (row, column) {
        return TOOL.valueToLabel(this.bankStatusOptions, row[column.property])
      },
      // 银行处理进度转换
      notifyStatusFormat (row, column) {
        if (!row[column.property]) {
          return '未处理'
        } else {
          return TOOL.valueToLabel(this.notifyStatusOptions, row[column.property])
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

      // 统一处理数据
      objFn () {
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'id': this.form.id,
          'mobile': this.form.mobile,
          'userName': this.form.userName,
          'timeFlag': this.form.timeFlag,
          'bankStatus': this.form.bankStatus,
          'notifyStatus': this.form.notifyStatus
        }
        return obj
      },

      // 获取列表
      getTablelist () {
        API.$summaryQuery(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      // 下载
      download () {
        API.$downloadFile('userProfitSummaryQuery', '/gateway/userProfit/summary/query/export', this.objFn())
      }
    }
  }
</script>
