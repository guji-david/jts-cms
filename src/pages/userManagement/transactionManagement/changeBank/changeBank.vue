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
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="form.name" placeholder="请输入姓名"type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="status">
                <el-select v-model="form.status">
                  <el-option v-for="x in statusOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="申请时间：" prop="time">
                <el-date-picker
                  v-model="form.time"
                  type="daterange"
                  :picker-options="pickerOptions"
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

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      style="width: 100%">
      <el-table-column
        prop="mobile"
        label="手机号码"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="客户姓名"
      >
      </el-table-column>
      <el-table-column
        prop="haveCapital"
        :formatter='haveCapitalFormat'
        label="是否有在途资金"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter='statusFormat'
        label="状态"
      >
      </el-table-column>

      <el-table-column
        prop="createTime"
        :formatter="dateFormat"
        label="申请时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <el-row>
            <span v-if="disabledArray[1] === 'true'&&(scope.row.status=='10'||scope.row.status=='40')"> <el-button @click="updateStatus(scope.row.id)" type="text">同步状态</el-button></span>
            <span v-if="disabledArray[2] === 'true'&&(scope.row.status=='10'||scope.row.status=='40')"> <el-button @click="setFailurePop(scope.row.id)" type="text">置为失败</el-button></span>
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
    <!-- 同步状态的时候提示 -->
    <el-dialog title="提示" v-model="updateStatusVisible" size="tiny">
      <span>{{updateStatusMsg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="updateStatusVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 置为失败的时候提示 -->
    <el-dialog title="提示" v-model="setFailureVisible" size="tiny">
      <span>请确认此申请已失败后再执行</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="setFailureVisible = false">取 消</el-button>
        <el-button type="primary" @click="setFailureBtn":disabled="setFailureDisabled">确 定</el-button>
      </span>
    </el-dialog>
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
        haveCapitalOptions: TOOL.fetchObj('commonObj').IsXXX,
        statusOptions: TOOL.fetchObj('commonObj').UserAccountStatus,
        form: {
          mobile: '', // 手机号
          name: '', // 姓名
          status: '', // 状态
          time: [], // 发放时间
          startTime: '',
          endTime: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: [], // 权限控制\1/查询,2/同步状态，3/置为失败
        setFailureVisible: false,
        setFailureDisabled: false,
        updateStatusVisible: false,
        updateStatusMsg: false
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
            case '同步状态':
              this.disabledArray[1] = 'true'
              break
            case '置为失败':
              this.disabledArray[2] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */

      // 是否有在途资金
      haveCapitalFormat (row, column) {
        return TOOL.valueToLabel(this.haveCapitalOptions, row[column.property])
      },
      // 状态转换
      statusFormat (row, column) {
        return TOOL.valueToLabel(this.statusOptions, row[column.property])
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
      },
      // 这个是pageNo
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTablelist()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */

      timeChange () {
        if (this.form.time.length) {
          if (this.form.time[0] && this.form.time[1]) {
            this.form.startTime = +this.form.time[0]
            this.form.endTime = +this.form.time[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.startTime = ''
            this.form.endTime = ''
          }
        } else {
          this.form.startTime = ''
          this.form.endTime = ''
        }
      },
      // 统一处理数据
      objFn () {
        this.timeChange()
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'mobile': this.form.mobile,
          'name': this.form.name,
          'status': this.form.status,
          'startTime': this.form.startTime,
          'endTime': this.form.endTime
        }
        return obj
      },
      // 获取列表
      getTablelist () {
        API.$changeBankQueryList(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      // 同步状态
      updateStatus (id) {
        var _this = this
        API.$changeBankUpdateStatus(id, res => {
          if (res.success) {
            setTimeout(function () {
              _this.getTablelist()
              _this.updateStatusVisible = true
              _this.updateStatusMsg = '同步状态成功'
            }
              , 100)
          } else {
            _this.updateStatusVisible = true
            _this.updateStatusMsg = res.resultMsg
          }
        })
      },
      // 置为失败
      setFailurePop (id) {
        this.setFailureVisible = true
        this.activeId = id
      },
      // 置为失败
      setFailureBtn () {
        var _this = this
        this.setFailureDisabled = true
        API.$changeBankSetFailure(this.activeId, res => {
          if (res.success) {
            setTimeout(function () {
              _this.setFailureVisible = false
              _this.getTablelist()
            }
              , 100)
          } else {

          }
        })
        _this.setFailureDisabled = false
      }
    }
  }
</script>
