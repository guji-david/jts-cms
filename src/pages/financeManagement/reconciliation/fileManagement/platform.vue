<template>
  <div id="content-body" class="content-body">
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="交易日期：" prop="dealTime">
                <el-date-picker
                  v-model="form.dealTime"
                  type="daterange"
                  placeholder="选择交易日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item label="银行批次号" prop="batchNo">
              <el-input v-model="form.batchNo"placeholder="请输入银行批次号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8" :push="1">
            <div class="z-span-20">
            <span class="z-btn-span" v-if="disabledArray[0]"><el-button type="primary" icon="search" @click="searchForm">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
            </div>

          </el-col>

        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar">
      <!--<span class="z-btn-span"><el-button type="default" icon="document" @click="downLoadBTN">下载</el-button></span>-->
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="dealTime"
        :formatter="dateFormat"
        label="交易日期"
      >
      </el-table-column>
     <!-- <el-table-column
        prop="fileName"
        label="文件名称"
      >
      </el-table-column>-->
      <el-table-column
        prop="batchNo"
        label="银行批次号"
      >
      </el-table-column>
     <!-- <el-table-column
        prop="relationId"
        label="项目名称"
      >
      </el-table-column>-->
      <el-table-column
        prop="remark"
        label="备注"
      >
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
      >
        <template scope="scope">
          <!--<el-button @click="downLoadBTN(scope.row.id)" type="text" v-if="disabledArray[1] === 'true'">下载原文件</el-button>-->
          <el-button @click="downLoadDec(scope.row.id)" type="text" v-if="disabledArray[1] ===true">下载</el-button>
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
  </div>
</template>
<script>
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        totalCount: 0,
        currentPage: 1,
        form: {
          sendDateE: '',
          sendDateS: '',
          dealTime: [],
          batchNo: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: []// 权限控制\1/查询,2/下载,3/下载解密后文件
      }
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
            case '分账-查询':
              this.disabledArray[0] = true
              break
            case '分账-下载':
              this.disabledArray[1] = true
              break
          }
        }
      } else {
        this.disabledArray = []
      }
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      timeChange () {
        if (this.form.dealTime.length) {
          if (this.form.dealTime[0] && this.form.dealTime[1]) {
            this.form.sendDateS = +this.form.dealTime[0]
            this.form.sendDateE = +this.form.dealTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.sendDateS = ''
            this.form.sendDateE = ''
          }
        } else {
          this.form.sendDateS = ''
          this.form.sendDateE = ''
        }
      },
      // 时间格式化
      dateFormat: function (row, column) {
        let date = row[column.property]
        return TOOLS.normalTimeDay(date)
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */

      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 这个是pageNo
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        console.log('val------------------->' + val)
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 请求数据
      getTableList (pageNo, pageSize) {
        this.timeChange()
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'sendDateE': this.form.sendDateE,
          'sendDateS': this.form.sendDateS,
          'batchNo': this.form.batchNo
        }
        API.$logbankPageQueryBPFNotify(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 下载
      downLoadDec (id) {
        API.$downloadDec(id, '/gateway/logbank/downloadFileGetOneDecBPF')
      }

    }
  }
</script>
