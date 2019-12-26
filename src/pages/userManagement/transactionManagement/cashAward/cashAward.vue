<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
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
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="时间：" prop="time">
                <el-date-picker
                  v-model="form.time"
                  type="daterange"
                  :picker-options="pickerOptions"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8" >
              <el-form-item>
                <span class="z-btn-span"  v-if="disabledArray[0] === 'true'"><el-button type="primary" icon="search" @click="searchForm" >查询</el-button></span>
                <span class="z-btn-span"><el-button  @click="resetForm('form')">重置</el-button></span>
              </el-form-item>
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
          <div @click="toTelDetail(scope.row)" class="linkColor">{{scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        label="邀请人"
      >
      </el-table-column>
      <el-table-column
        prop="balanceAmount"
        :formatter='moneyFormat'
        label="好友在投总额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="rewardCoefficient"
        label="比例(%)"
      >
      </el-table-column>

      <el-table-column
        prop="amount"
        :formatter='moneyFormat'
        label="现金奖励(元)"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="dateFormat"
        label="时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <el-row>
            <span v-if="disabledArray[2] === 'true'"> <el-button @click="cashDetail(scope.row.id)" type="text">查看</el-button></span>
          </el-row>


        </template>
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
        pickerOptions: {
          disabledDate (time) {
            return time.getTime() > Date.now()
          }
        },
        totalCount: 0,
        currentPage: 1,
        form: {
          mobile: '', // 手机号
          userName: '', // 姓名
          time: [], // 发放时间
          loanTimeStart: '',
          loanTimeEnd: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
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
            case '查看':
              this.disabledArray[2] = 'true'
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
      // 比例转换
      rateFormat (row, column) {
        return TOOL.yuanToFen(row[column.property])
      },
      // 金额转换
      moneyFormat (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },

      // 时间格式化
      dateFormat: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTimeDay(date)
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

      timeChange () {
        if (this.form.time.length) {
          if (this.form.time[0] && this.form.time[1]) {
            this.form.timeStart = +this.form.time[0]
            this.form.timeEnd = +this.form.time[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.timeStart = ''
            this.form.timeEnd = ''
          }
        } else {
          this.form.timeStart = ''
          this.form.timeEnd = ''
        }
      },
      // 统一处理数据
      objFn () {
        this.timeChange()
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'mobile': this.form.mobile,
          'userName': this.form.userName,
          'timeStart': this.form.timeStart,
          'timeEnd': this.form.timeEnd
        }
        return obj
      },
      // 获取列表
      getTablelist () {
        API.$userProfitQuery(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 下载
      download () {
        API.$downloadFile('userProfitQuery', '/gateway/userProfit/query/export', this.objFn())
      },
      // 跳转详情
      cashDetail (id) {
        this.$router.push({name: 'CashDetail', params: { id: id }})
      }
    }
  }
</script>
