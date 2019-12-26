
<template>
  <div id="content-body" class="content-body">
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
              <el-form-item label="交易类型：" prop="source">
                <el-select name="type" v-model="form.source">
                  <el-option v-for="x in IsSourceOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="收支类型：" prop="type">
                <el-select name="type" v-model="form.type">
                  <el-option v-for="x in typeOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="平台：" prop="osType">
                <el-select name="type" v-model="form.osType">
                  <el-option v-for="x in IsPlatformOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="时间：" prop="time">
                <el-date-picker
                  v-model="form.time"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
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
        prop="id"
        label="订单号"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号码"
      >
      </el-table-column>
      <el-table-column
        prop="userName"
        label="客户姓名"
      >
      </el-table-column>

      <el-table-column
        prop="source"
        :formatter="sourceFomatter"
        label="交易类型"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        :formatter="typeFomatter"
        label="收支类型"
      >
      </el-table-column>

      <el-table-column
        prop="point"
        label="积分"
      >
      </el-table-column>

      <el-table-column
        prop="osType"
        :formatter="trueOrFalseFomatter"
        label="平台"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="dateFormat"
        label="获取时间"
      >
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
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
        IsSourceOptions: TOOL.fetchObj('commonObj').PointOutType, // 交易类型下拉列表
        IsPlatformOptions: TOOL.fetchObj('commonObj').OsType, // 平台类型下拉列表
        //        typeOptions:TOOL.fetchObj('commonObj').InComeOutComeType,//收支类型下拉列表
        typeOptions: [
          {label: '全部', value: ''},
          {label: '收入', value: 10},
          {label: '支出', value: 20}
        ], // 收支类型下拉列表
        totalCount: 0,
        currentPage: 1,
        form: {
          mobile: '', // 手机号
          userName: '', // 姓名
          source: '', // 交易类型
          type: '', // 收支类型
          osType: '', // 平台类型
          time: [], // 发放时间
          queryStart: '',
          queryEnd: ''
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
      // 平台类型转换
      trueOrFalseFomatter (row, column) {
        return TOOL.valueToLabel(this.IsPlatformOptions, row[column.property])
      },
      // 交易类型转换
      sourceFomatter (row, column) {
        return TOOL.valueToLabel(this.IsSourceOptions, row[column.property])
      },
      // 收支类型转换
      typeFomatter (row, column) {
        return TOOL.valueToLabel(this.typeOptions, row[column.property])
      },
      // 时间格式化
      dateFormat: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTime(date)
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
      // 时间范围处理
      timeChange () {
        if (this.form.time.length) {
          if (this.form.time[0] && this.form.time[1]) {
            this.form.queryStart = +this.form.time[0]
            this.form.queryEnd = +this.form.time[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.queryStart = ''
            this.form.queryEnd = ''
          }
        } else {
          this.form.queryStart = ''
          this.form.queryEnd = ''
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
          'queryStart': this.form.queryStart,
          'queryEnd': this.form.queryEnd,
          'source': this.form.source,
          'type': this.form.type,
          'osType': this.form.osType
        }
        return obj
      },
      // 获取列表
      getTablelist () {
        API.$pointList(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 下载
      download () {
        API.$downloadFile('pointQuery', '/gateway/point/list/export', this.objFn())
      },
      // 跳转详情
      cashDetail (id) {
        this.$router.push({name: 'CashDetail', params: { id: id }})
      }
    }
  }
</script>
