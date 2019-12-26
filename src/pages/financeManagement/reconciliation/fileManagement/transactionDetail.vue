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
          <!-- <el-col :span="8">
             <el-form-item label="项目ID" prop="projectId">
               <el-input v-model="form.projectId"></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="8">
             <el-form-item label="项目名称" prop="projectName">
               <el-input v-model="form.projectName"></el-input>
             </el-form-item>
           </el-col>-->
          <el-col :span="8">
            <el-form-item label="账户类型：" prop="dataType">
              <el-select name="type" v-model="form.dataType">
                <el-option v-for='x in typeOptions' :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
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
      <el-table-column
        prop="dataType"
        :formatter="typeFormat"
        label="账户类型"
      >
      </el-table-column>
      <!--<el-table-column
        prop="fileName"
        label="文件名称"
      >
      </el-table-column>
      <el-table-column
        prop="projectId"
        label="项目ID"
      >
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称"
      >
      </el-table-column>
      <el-table-column
        prop=""
        label="备注"
      >
      </el-table-column>-->
      <el-table-column
        prop=""
        label="下载"
      >
        <template scope="scope">
          <!--<el-button @click="downLoadBTN(scope.row.id)" type="text" v-if="disabledArray[1] === 'true'">下载原文件</el-button>-->
          <el-button @click="downLoadDec(scope.row.id)" type="text" v-if="disabledArray[1] === 'true'">下载</el-button>
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
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        multipleSelection: [],
        totalCount: 0,
        currentPage: 1,
        form: {
          sendDateE: '',
          sendDateS: '',
          dealTime: [],
          dataType: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: [], // 权限控制\1/查询,2/下载
        /* typeOptions:[
          {"label":"全部","value":""},
          {"label":"过渡户","value":"1"},
          {"label":"营销户","value":"2"}
        ], */
        typeOptions: TOOL.fetchObj('commonObj').BIOTFDataType// 交易类型 BIOTFType
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
            case '内部户交易明细-查询':
              this.disabledArray[0] = 'true'
              break
            case '内部户交易明细-下载':
              this.disabledArray[1] = 'true'
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
        return TOOL.normalTimeDay(date)
      },
      // 类型格式化
      typeFormat: function (row, column) {
        return TOOL.valueToLabel(this.typeOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */

      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageSize, this.pageNo)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageSize, this.pageNo)
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageSize, this.pageNo)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 请求数据
      getTableList (pageSize, pageNo) {
        this.timeChange()
        var obj = {
          'pageSize': pageSize,
          'pageNo': pageNo,
          'sendDateE': this.form.sendDateE,
          'sendDateS': this.form.sendDateS,
          'dataType': this.form.dataType
        }
        API.$pageQueryINFNotify(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      downLoadBTN (id) {
        API.$download(id)
      },
      downLoadDec (id) {
        API.$downloadDec(id, '/gateway/logbank/downloadFileGetOneDecBRF')// downloadFileGetOneDecINF
      }
    }
  }
</script>
