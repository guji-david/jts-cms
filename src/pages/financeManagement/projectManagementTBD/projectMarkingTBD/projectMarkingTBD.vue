<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <el-tabs v-model="tabName" @tab-click="handleClick('','','form')">
      <el-tab-pane label="募集成功" name="1"></el-tab-pane>
      <el-tab-pane label="募集失败" name="2"></el-tab-pane>
      <el-tab-pane label="募集中" name="4"></el-tab-pane>
      <el-tab-pane label="未开始募集" name="3"></el-tab-pane>
    </el-tabs>
    <!-- tab结束 -->

    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="申请ID：" prop="loanNo">
                <el-input v-model="form.loanNo" placeholder="请输入申请ID"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="name">
                <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="productId">
                <el-input v-model="form.productId" placeholder="请输入项目ID"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方名称：" prop="borrowerName">
                <el-input v-model="form.borrowerName" placeholder="请输入借方名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" v-show="tabName==1">
            <div class="z-span-20">
              <el-form-item label="起息日：" prop="dateStart">
                <el-date-picker type="daterange" placeholder="选择日期" v-model="form.dateStart"></el-date-picker>
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
    <!-- 列表开始 -->
    <el-table :data="tableData[tabName]" border style="width: 100%" :key='tabName' >
      <el-table-column
        prop="loanNo"
        label="申请ID">
        {{test}}
      </el-table-column>
      <el-table-column
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetail(scope.row,'noloan')" class="detailSpan">{{scope.row.name}}</span>
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
        prop="amount"
        :formatter="moneyFormat"
        label="借款金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="tenderStartTime"
        :formatter="dateFormatDay"
        label="募集开始时间"
      >
      </el-table-column>
      <el-table-column
        prop="tenderEndTime"
        :formatter="dateFormatDay"
        label="募集结束时间"
      >
      </el-table-column>
      <el-table-column
        prop="repayStartDate"
        :formatter="dateFormatDay"
        label="起息日"
        v-if="tabName==1"
      >
      </el-table-column>
      <el-table-column
        v-if="tabName!=3"
        label="募集金额(元)"
        prop="tenderAmount"
        :formatter="moneyFormat"
      >
      </el-table-column>
      <el-table-column
        prop="tenderUser"
        label="募集笔数"
        v-if="tabName!=3"
      >
      </el-table-column>
      <el-table-column
        prop="fullTime"
        :formatter="dateFormat"
        label="满标时间"
        v-if="tabName==1"
      >
      </el-table-column>
      <el-table-column
        label="操作"
        v-if="tabName==1 || tabName ==2"
      >
        <template scope="scope">
          <el-button @click="toDetailPage(scope.row,tabName)" type="text" v-if="disabledArray[1] === 'true'">去结标</el-button>
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
  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../.././../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        test: '',
        tabName: '1',
        totalCount: 0,
        currentPage: 1,
        form: {
          loanNo: '', // 申请id
          name: '', // 项目名称
          productId: '', // 项目id
          borrowerName: '', // 借方名称
          dateStart: [] // 起息日
        },
        tableData: {},
        pageNo: 1,
        pageSize: 5,
        breadcrumName: '',
        disabledArray: []// 权限控制\1/查询,2/去结标,3/下载
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
      // 权限控制
      if (this.getFunctionList.length > 0) {
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '去结标':
              this.disabledArray[1] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 募集金额转化
      moneyFormat (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },
      // 时间格式化
      dateFormat: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 时间格式化到日
      dateFormatDay: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTimeDay(date)
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(TOOL.noEmety(this.form, this.pageSize, this.pageNo))
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // tab切换重置
      handleClick (tab, event, formName) {
        this.pageNo = 1
        this.currentPage = 1
        this.$refs[formName].resetFields()
        this.getTableList()
      },
      // 时间转换
      queryDateChange () {
        if (this.form.dateStart.length) {
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
      // 跳转去详情
      toDetail (row, type) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        this.$router.push({name: 'TBDPayProDetail', params: {id: row.productId, type: type}})
      },
      // 跳转去结标页
      toDetailPage (row, type) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        this.$router.push({name: 'TBDProMarkingDetail', params: {id: row.productId, type: type == 1 ? 'success' : 'fail'}})
      },
      // 请求数据
      getTableList () {
        this.tableData[this.tabName] = []
        API.$noloanList(this.objFn(), res => {
          this.tableData[this.tabName] = res.list
          this.totalCount = res.totalCount
          this.triggerUpdata(this.tabName)
        })
      },
      // 统一处理数据
      objFn () {
        this.queryDateChange()
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'loanNo': this.form.loanNo, // 申请id
          'name': this.form.name, // 项目名称
          'productId': this.form.productId, // 项目id
          'borrowerName': this.form.borrowerName, // 借方名称
          'tenderStatus': this.form.tenderStatus,
          'dateStart': this.form.startTime, // 发起时间
          'dateEnd': this.form.endTime, // 结束时间
          'type': this.tabName * 10// 类型
        }
        return obj
      },
      // 使用第三方值来触发数据的更新
      triggerUpdata (val) {
        if (val) {
          this.test = ''
        }
        this.test = null
      }
    }
  }
</script>

