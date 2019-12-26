<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="日期：" prop="dealDate">
                <el-date-picker
                  v-model="form.dealDate"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="8">
            <el-form-item label="类型：" prop="type">
              <el-select name="type" v-model="form.type">
                <el-option v-for='x in typeOptions' :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="订单号" prop="customerId">
              <el-input v-model="form.customerId" placeholder="请输入订单号"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="流水号" prop="serialNo">
              <el-input v-model="form.serialNo" placeholder="请输入流水号"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="sttOne">
              <el-select name="type" v-model="form.sttOne">
                <el-option v-for='x in sttOneOptions' :value="x.value" :label="x.label"></el-option>
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
      <span class="z-btn-span">
        <el-button type="default" icon="document" v-if="disabledArray[1] === 'true'"@click="downLoad()">下载</el-button>
      </span>
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="dealDate"
        label="日期"
      > <!--:formatter="dateFormat"-->
      </el-table-column>
      <el-table-column
        prop="type"
        :formatter="typeFormat"
        label="类型"
      >
      </el-table-column>
      <el-table-column
        prop="customerId"
        label="订单号"
      >
      </el-table-column>
      <el-table-column
        prop="serialNo"
        label="流水号"
      >
      </el-table-column>
      <el-table-column
        prop="amountOne"
        :formatter="amountFormat"
        label="金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="sttOne"
        :formatter="statusFormat"
        label="状态"
      >
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
      >
      </el-table-column>
    <!--  <el-table-column
        prop=""
        label="下载"
      >
        <template scope="scope">
          &lt;!&ndash;<el-button @click="downLoadBTN(scope.row.id)" type="text" v-if="disabledArray[1] === 'true'">下载原文件</el-button>&ndash;&gt;
          &lt;!&ndash;<el-button @click="downLoadDec(scope.row.id)" type="text" v-if="disabledArray[1] === 'true'">下载</el-button>&ndash;&gt;
        </template>
      </el-table-column>-->
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
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOL from '../../../assets/js/tools'

  export default {
    data () {
      return {
        multipleSelection: [],
        totalCount: 0,
        currentPage: 1,
        typeOptions: TOOL.fetchObj('commonObj').BIOTFType, // 交易类型 BIOTFType
        sttOneOptions: TOOL.fetchObj('commonObj').BIOTFStatus, // 交易状态  BIOTFStatus
        form: {
          sendDateE: '',
          sendDateS: '',
          dealDate: [],
          type: '',
          serialNo: '',
          customerId: '',
          sttOne: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        test: '',
        breadcrumName: '',
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
    mounted () {
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
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      timeChange () {
        if (this.form.dealDate.length) {
          if (this.form.dealDate[0] && this.form.dealDate[1]) {
            this.form.sendDateS = +this.form.dealDate[0]
            this.form.sendDateE = +this.form.dealDate[1] + 86400000 - 1// 86400000为一天的毫秒量
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
        let date = Date.parse(row[column.property])
        return date
      },
      // 类型格式化
      typeFormat: function (row, column) {
        return TOOL.valueToLabel(this.typeOptions, row[column.property])
      },
      // 金额格式化
      amountFormat: function (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },
      // 状态格式化
      statusFormat: function (row, column) {
        if (row[column.property] == 0) {
          return '初始化'
        } else {
          return TOOL.valueToLabel(this.sttOneOptions, row[column.property])
        }
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是多选的
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
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
        this.getTableList()
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 统一处理数据
      objFn () {
        this.timeChange()
        let obj = {
          'pageSize': this.pageSize,
          'pageNo': this.pageNo,
          'sendDateE': this.form.sendDateE,
          'sendDateS': this.form.sendDateS,
          'type': this.form.type,
          'serialNo': this.form.serialNo,
          'customerId': this.form.customerId,
          'sttOne': this.form.sttOne
        }
        return obj
      },
      // 请求数据
      getTableList () {
        API.$pageQueryBIOTFNotifyData(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      /* downLoadBTN(id){
        API.$download(id)
      },
      downLoadDec(id){
        API.$downloadDec(id,'/gateway/logbank/pageQueryBIOTFNotifyData/download')
      }, */
      downLoad () {
        API.$downloadFile('logBankBIOTFNotifyQueryDTO', '/gateway/logbank/pageQueryBIOTFNotifyData/download', this.objFn())
      }
    }
  }
</script>
