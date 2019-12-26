<template>
  <div id="content-body" class="content-body">
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">

          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="手机号：" prop="mobile">
                <el-input v-model="form.mobile"  type="text" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="客户姓名：" prop="userName">
                <el-input v-model="form.userName"  type="text" placeholder="请输入客户姓名"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="银行交易时间：" prop="transferTime">
                <el-date-picker
                  v-model="form.transferTime"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="流水号：" prop="serialNo">
                <el-input v-model="form.serialNo"  type="text" placeholder="请输入流水号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="系统处理时间：" prop="createTime">
                <el-date-picker
                  v-model="form.createTime"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button></span>
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
        label="手机号"
      >
        <template scope="scope">
          <div @click="toDetail(scope.row)" class="linkColor">{{scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="客户姓名"
      >
      </el-table-column>
      <el-table-column
        prop="transferAmount"
        :formatter='moneyFormat'
        label="金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="transferDate"
        :formatter="formatDate"
        label="银行交易时间"
      >
      </el-table-column>
      <el-table-column
        prop="serialNo"
        label="流水号"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatDate"
        label="系统处理时间"
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

  export default {
    data () {
      return {
        tradeStatusOptions: TOOL.fetchObj('commonObj').TradeStatus,
        totalCount: 0,
        currentPage: 1,
        form: {
          mobile: '',
          userName: '',
          serialNo: '', // 流水号
          transferTime: [], // 银行交易时间
          transferTimeStart: '', // 银行交易开始时间
          transferTimeEnd: '', // 银行交易结束时间
          createTime: [], // 系统处理时间
          createTimeStart: '', // 系统处理开始时间
          createTimeEnd: ''// 系统处理结束时间
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: []// 权限控制\1/查询,2/下载
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
            case '查询-网银转账':
              this.disabledArray[0] = 'true'
              break
            case '下载-网银转账':
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
      toDetail (row) {
        TOOL.clearProData()
        this.$router.push({name: 'AccountInfoDetail', params: { mobile: row.mobile }})
      },
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 金额转换
      moneyFormat (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },
      // 状态转换
      formatterTenderStatus (val) {
        return TOOL.valueToLabel(this.tradeStatusOptions, val.tradeStatus)
      },
      // 时间转换
      formatDate (row, column) {
        return TOOL.normalTime(row[column.property])
      },
      queryDateChange () {
        if (this.form.transferTime.length) {
          if (this.form.transferTime[0] && this.form.transferTime[1]) {
            this.form.transferTimeStart = +this.form.transferTime[0]
            this.form.transferTimeEnd = +this.form.transferTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.transferTimeStart = ''
            this.form.transferTimeEnd = ''
          }
        } else {
          this.form.transferTimeStart = ''
          this.form.transferTimeEnd = ''
        }
        if (this.form.createTime.length) {
          if (this.form.createTime[0] && this.form.createTime[1]) {
            this.form.createTimeStart = +this.form.createTime[0]
            this.form.createTimeEnd = +this.form.createTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.createTimeStart = ''
            this.form.createTimeEnd = ''
          }
        } else {
          this.form.createTimeStart = ''
          this.form.createTimeEnd = ''
        }
      },
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
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTablelist()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 统一处理数据
      objFn () {
        this.queryDateChange()
        let obj = {
          'mobile': this.form.mobile,
          'userName': this.form.userName,
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'serialNo': this.form.serialNo,
          'transferTimeStart': this.form.transferTimeStart,
          'transferTimeEnd': this.form.transferTimeEnd,
          'createTimeStart': this.form.createTimeStart,
          'createTimeEnd': this.form.createTimeEnd
        }
        return obj
      },

      getTablelist () {
        API.$pageQueryTransferInNotify(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 下载
      download () {
        API.$downloadFile('transferInNotifyQuery', '/gateway/logbank/pageQueryTransferInNotify/download', this.objFn())
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
