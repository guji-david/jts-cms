<template>
  <div id="content-body" class="content-body">
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="手机号：" prop="mobile">
                <el-input  v-model="form.mobile"placeholder="请输入手机号" type="tel"></el-input>
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
              <el-form-item label="来源：" prop="source">
                <el-select name="proName" v-model="form.source">
                  <el-option v-for="x in ActivityRulesOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="发放时间：" prop="sendTime">
                <el-date-picker
                  v-model="form.sendTime"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="批次号：" prop="batchNo">
                <el-input v-model="form.batchNo" placeholder="请输入批次号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="useStatus">
                <el-select name="type" v-model="form.useStatus">
                  <el-option v-for="x in UseStatusOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="使用时间：" prop="useTime">
                <el-date-picker
                  v-model="form.useTime"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16" >
            <div class="z-span-20" >
              <el-form-item>
                <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
                <span class="z-btn-span"><el-button  @click="resetForm('form')">重置</el-button></span>
              </el-form-item>
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
          <div @click="toTelDetail(scope.row)" class="linkColor">{{scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        label="额度(%)"
      >
      </el-table-column>
      <el-table-column
        prop="source"
        :formatter='formatterActivityRules'
        label="来源"
      >
      </el-table-column>
      <el-table-column
        prop="sendTime"
        :formatter="dateFormat"
        label="发放时间"
      >
      </el-table-column>
      <el-table-column
        prop="validLimit"
        label="有效期(天)"
      >
      </el-table-column>
      <el-table-column
        prop="batchNo"
        label="批次号"
      >
      </el-table-column>
      <el-table-column
        prop="useStatus"
        :formatter="formatterUseStatus"
        label="状态"
      >
      </el-table-column>
      <el-table-column
        prop="useTime"
        :formatter="dateFormat"
        label="使用时间"
      >
      </el-table-column>
      <el-table-column
        prop="productName"
        label="项目名称"
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
  import * as API from '../../../../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'

  export default {
    data () {
      return {
        totalCount: 0,
        currentPage: 1,
        ActivityRulesOptions: TOOL.fetchObj('commonObj').ActivityRules,
        UseStatusOptions: TOOL.fetchObj('commonObj').UseStatus,
        form: {
          mobile: '',
          name: '',
          source: '',
          sendTime: [], // 发放时间
          batchNo: '', // 批次号
          useTime: [], // 使用时间
          useStatus: '', // 这里是状态
          sendTimeEnd: '',
          sendTimeStart: '',
          useTimeEnd: '',
          useTimeStrat: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: []// 权限控制\1/加息劵查询-查询,2/加息劵查询-下载
      }
    },
    beforeMount () {
      if (this.getFunctionList.length > 0) {
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '加息劵查询-查询':
              this.disabledArray[0] = 'true'
              break
            case '加息劵查询-下载':
              this.disabledArray[1] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
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
    methods: {
      // 跳转详情
      toTelDetail (row) {
        TOOL.clearProData()
        this.$router.push({name: 'AccountInfoDetail', params: { mobile: row.mobile }})
      },
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      sendTimeChange () {
        if (this.form.sendTime.length) {
          if (this.form.sendTime[0] && this.form.sendTime[1]) {
            this.form.sendTimeStart = +this.form.sendTime[0]
            this.form.sendTimeEnd = +this.form.sendTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.sendTimeStart = ''
            this.form.sendTimeEnd = ''
          }
        } else {
          this.form.sendTimeStart = ''
          this.form.sendTimeEnd = ''
        }
      },
      useTimeChange () {
        if (this.form.useTime.length) {
          if (this.form.useTime[0] && this.form.useTime[1]) {
            this.form.useTimeStrat = +this.form.useTime[0]
            this.form.useTimeEnd = +this.form.useTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.useTimeStrat = ''
            this.form.useTimeEnd = ''
          }
        } else {
          this.form.useTimeStrat = ''
          this.form.useTimeEnd = ''
        }
      },
      // 机构类型转换
      formatterActivityRules (row, column) {
        return TOOL.valueToLabel(this.ActivityRulesOptions, row[column.property])
      },
      // 机构类型转换
      formatterUseStatus (row, column) {
        return TOOL.valueToLabel(this.UseStatusOptions, row[column.property])
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
      // 统一处理数据
      objFn () {
        this.sendTimeChange()
        this.useTimeChange()
        let obj = {
          'batchNo': this.form.batchNo,
          'useStatus': this.form.useStatus,
          'mobile': this.form.mobile,
          'name': this.form.name,
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'sendTimeEnd': this.form.sendTimeEnd,
          'sendTimeStart': this.form.sendTimeStart,
          'source': this.form.source,
          'useTimeEnd': this.form.useTimeEnd,
          'useTimeStrat': this.form.useTimeStrat
        }
        return obj
      },

      getTablelist () {
        API.$couponSeach(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      download () {
        API.$downloadFile('userGiftQuery', '/gateway/userGift/getUserCouponExport', this.objFn())
      }
    }
  }
</script>

<style lang="less" scope>

</style>
