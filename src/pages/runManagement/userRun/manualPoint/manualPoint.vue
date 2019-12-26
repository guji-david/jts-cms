<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="批次号：" prop="batchNo">
                <el-input name="number" v-model="form.batchNo" type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="发放状态：" prop="sendStatus">
                <el-select name="status" v-model="form.sendStatus">
                  <el-option v-for="x in MessageSendStatusOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="发放时间：" prop="time">
                <el-date-picker
                  v-model="form.time"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20" >
              <el-form-item label=" " >
                <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm()" v-if="disabledArray[0] === 'true'">查询</el-button></span>
                <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button></span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar" >
      <span class="z-btn-span"><el-button type="default" icon="plus" @click="AddManualPointBtn" v-if="disabledArray[1] === 'true'">新增</el-button></span>
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      style="width: 100%">
      <el-table-column
        prop="batchNo"
        label="批次号"
      >
      </el-table-column>
      <el-table-column
        prop="sendTotal"
        label="应发数量"
      >
      </el-table-column>
      <el-table-column
        prop="sendReal"
        label="实发数量"
      >
      </el-table-column>
      <el-table-column
        prop="sendStatus"
        :formatter="sendStatusFomat"
        label="发放状态"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDate"
        label="发放时间"
      >
      </el-table-column>
      <el-table-column
        prop="sendReason"
        label="发放原因"
      >
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
      >
        <template scope="scope">
          <el-button @click="manualPointDetailBtn(scope.row.id)" type="text" v-if="disabledArray[2] === 'true'">详情</el-button>
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

<style lang="less" scoped>
</style>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        breadcrumName: '',
        disabledArray: [], // 权限控制\1/查询2/新增3/详情
        currentPage: 1,
        totalCount: 0,
        pageNo: 1,
        pageSize: 5,
        MessageSendStatusOptions: TOOLS.fetchObj('commonObj').MessageSendStatus,
        form: {
          batchNo: '',
          sendStatus: '',
          timeEnd: '', // 结束时间
          timeStart: '', // 开始时间
          time: []// 范围时间
        },
        tableData: []

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
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '新增':
              this.disabledArray[1] = 'true'
              break
            case '详情':
              this.disabledArray[2] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }

      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {

      // 时间转化
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },
      // 发送状态转化
      sendStatusFomat (row, column) {
        return TOOLS.valueToLabel(this.MessageSendStatusOptions, row[column.property])
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 新增
      AddManualPointBtn () {
        this.$router.push({name: 'ManualPointAdd'})
      },
      // 详情
      manualPointDetailBtn (id) {
        this.$router.push({name: 'ManualPointDetail', params: { id: id }})
      },
      // 分页
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.pageNo = val
        this.currentPage = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      queryDateChange () {
        if (this.form.time.length) {
          if (this.form.time[0] && this.form.time[1]) {
            this.form.timeStart = this.form.time[0].getTime()
            this.form.timeEnd = this.form.time[1].getTime() + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.timeStart = ''
            this.form.timeEnd = ''
          }
        } else {
          this.form.timeStart = ''
          this.form.timeEnd = ''
        }
      },
      //     获取列表
      getTableList (pageNo, pageSize) {
        this.queryDateChange()
        let obj = {
          pageNo: pageNo,
          pageSize: pageSize,
          batchNo: this.form.batchNo,
          sendStatus: this.form.sendStatus,
          timeEnd: this.form.timeEnd, // 结束时间
          timeStart: this.form.timeStart// 开始时间
        }
        API.$pointBatchList(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageNo, this.pageSize)
      }
    }
  }
</script>
