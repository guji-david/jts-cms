<template>
  <div id="content-body" class="content-body">
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="平台订单号：" prop="id">
                <el-input  v-model="form.id" placeholder="请输入平台订单号" type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="兑吧订单号：" prop="ordernum">
                <el-input  v-model="form.ordernum" placeholder="请输入兑吧订单号" type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="手机号：" prop="mobile">
                <el-input  v-model="form.mobile" placeholder="请输入手机号" type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>

        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="客户姓名：" prop="userName">
                <el-input v-model="form.userName" placeholder="请输入客户姓名"type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="奖品类型：" prop="type">
                <el-select name="type" v-model="form.type">
                  <el-option v-for="x in consumeTypeOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="status">
                <el-select name="type" v-model="form.status">
                  <el-option v-for="x in consumeStatusOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="交易时间：" prop="createTime">
                <el-date-picker
                  v-model="form.createTime"
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
        label="平台订单号"
      >
      </el-table-column>
      <el-table-column
        prop="ordernum"
        label="兑吧订单号"
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
        prop="type"
        :formatter="typeFomatter"
        label="奖品类型"
      >
      </el-table-column>

      <el-table-column
        prop="credits"
        label="消耗积分"
      >
      </el-table-column>

      <el-table-column
        prop="status"
        :formatter="statusFomatter"
        label="状态"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="dateFormat"
        label="交易时间"
      >
      </el-table-column>
      <el-table-column
        prop="description"
        label="备注"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
      >
        <template scope="scope">
          <span class="z-btn-span"v-if="disabledArray[1] === 'true'">
            <el-button type="text" v-if="!(scope.row.status==30||scope.row.status==40)"
                       @click="updateStatus(scope.row.ordernum)"
                       :disabled="(scope.row.ordernum==activeOrdernum)&&statusDialogDisabled">同步状态</el-button>
          </span>
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
    <el-dialog title="提示" v-model="statusDialogVisible" size="tiny" :show-close="false">
      <span>{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="comfirm()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        activeOrdernum: -1,
        statusDialogVisible: false,
        statusDialogDisabled: false,
        msg: '',
        consumeTypeOptions: TOOL.fetchObj('commonObj').ConsumeType, // 奖品类型下拉列表
        consumeStatusOptions: TOOL.fetchObj('commonObj').ConsumeStatus, // 状态下拉列表
        totalCount: 0,
        currentPage: 1,
        form: {
          id: '', // 平台订单号
          ordernum: '', // 兑吧订单号
          mobile: '', // 手机号
          userName: '', // 客户姓名
          type: '', // 奖品类型
          status: '', // 状态
          createTime: [], // 交易时间
          createTimeS: '',
          createTimeE: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: []// 权限控制\1/查询,2/同步状态
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
    //        console.log(this.consumeStatusOptions);
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
          }
        }
      } else {
        this.disabledArray = []
      }
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 状态转换
      statusFomatter (row, column) {
        return TOOL.valueToLabel(this.consumeStatusOptions, row[column.property])
      },
      typeFomatter (row, column) {
        return TOOL.valueToLabel(this.consumeTypeOptions, row[column.property])
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
        if (this.form.createTime.length) {
          if (this.form.createTime[0] && this.form.createTime[1]) {
            this.form.createTimeS = +this.form.createTime[0]
            this.form.createTimeE = +this.form.createTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.createTimeS = ''
            this.form.createTimeE = ''
          }
        } else {
          this.form.createTimeS = ''
          this.form.createTimeE = ''
        }
      },

      // 统一处理数据
      objFn () {
        this.timeChange()
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'id': this.form.id,
          'ordernum': this.form.ordernum,
          'mobile': this.form.mobile,
          'userName': this.form.userName,
          'type': this.form.type,
          'status': this.form.status,
          'createTimeS': this.form.createTimeS,
          'createTimeE': this.form.createTimeE

        }
        return obj
      },
      // 获取列表
      getTablelist () {
        API.$recordConsumelist(this.objFn(), res => { // $recordConsumelist
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      // 同步状态
      updateStatus (ordernum) {
        this.activeOrdernum = ordernum
        this.statusDialogVisible = true
        this.statusDialogDisabled = true
        this.msg = '状态同步中.....'
        API.$recordUpdateStatus(ordernum, res => {
          if (!res.success) {
          //              this.msg="状态同步成功";
            this.msg = res.resultMsg
          } else {
            this.msg = '状态同步成功!!'
          }
          this.getTablelist()
        })
      },
      comfirm () {
        this.statusDialogVisible = false
        this.statusDialogDisabled = false
      }
    }
  }
</script>
