<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="pointForm" label-width="120px"ref="pointForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="合作方式：" prop="workType" >
              <el-select name="type"v-model="pointForm.workType">
                <el-option v-for="x in workTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="渠道结算方式：" prop="balanceType">
              <el-select name="type"v-model="pointForm.balanceType">
                <el-option v-for="x in balanceTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="status">
              <el-select name="type"v-model="pointForm.status">
                <el-option v-for="x in statusOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span">
                <el-button type="primary" icon="search"@click="searchForm()"v-if="disabledArray[0] === 'true'">查询</el-button>
              </span>
              <span class="z-btn-span"><el-button @click="resetForm('pointForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="plus" @click="addAndEditPoint(0)" v-if="disabledArray[1] === 'true'">新增规则</el-button></span>
    </div>
    <!-- 工具栏结束 -->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="workType"
        :formatter="formatterWorkType"
        label="合作方式"
       >
      </el-table-column>
      <el-table-column
        prop="balanceType"
        :formatter="formatterBalanceType"
        label="渠道结算方式"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="formatterstatus"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatterDateCreateTime"
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="最后修改时间"
        :formatter="formatterDateCreateTime"
        >
      </el-table-column>

      <el-table-column
        prop="id"
        label="操作"
       >
        <template scope="scope">
            <el-row>
              <!--<span v-if="disabledArray[2] === 'true'"> <el-button @click="addAndEditPoint(scope.row)" type="text">编辑</el-button></span>-->
              <span v-if="disabledArray[3] === 'true'&&scope.row.status=='10'"> <el-button :disabled="(scope.row.id==activeId)&&statusDisabled"@click="toggleStatus(scope.row,20)"type="text">启用</el-button></span>
              <span v-if="disabledArray[3] === 'true'&&scope.row.status=='20'" > <el-button :disabled="(scope.row.id==activeId)&&statusDisabled"@click="toggleStatus(scope.row,10)"type="text">停用</el-button></span>
            </el-row>

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
        :page-sizes="[5, 10, 20, 40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页结束 -->

    <!-- 对话框 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span >{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="dialogVisible = false;statusDisabled=false;">取 消</el-button>
        <el-button type="primary" @click="toggleStatusBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->

  </div>
</template>
<style lang="less" scope>
  .el-date-editor--daterange.el-input {
    width: 100%;
  }
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        pointForm: {
          name: '',
          status: '',
          workType: '',
          balanceType: ''
        },
        statusOptions: [
          {label: '全部', value: ''},
          {label: '已启用', value: '20'},
          {label: '已停用', value: '10'}], // 规则状态
        workTypeOptions: TOOLS.fetchObj('commonObj').WorkType, // 合作方式
        balanceTypeOptions: TOOLS.fetchObj('commonObj').BalanceType, // 结算方式
        tableData: [],
        activeId: 0,
        activeStatus: '',
        statusDisabled: false,
        currentIndex: 0,
        disabledArray: [], // 权限控制\1/查询 2/新增规则3/编辑4/启用 停用
        dialogVisible: false,
        msg: ''

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
        let i// 测试如果没问题删掉这行
        for (i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '新增规则':
              this.disabledArray[1] = 'true'
              break
            case '编辑':
              this.disabledArray[2] = 'true'
              break
            case '启用/停用':
              this.disabledArray[3] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {

      // 合作方式转换
      formatterWorkType (val) {
        return TOOLS.valueToLabel(this.workTypeOptions, val.workType)
      },
      // 结算方式转换
      formatterBalanceType (val) {
        return TOOLS.valueToLabel(this.balanceTypeOptions, val.balanceType)
      },
      // 状态转换
      formatterstatus (val) {
        return TOOLS.valueToLabel(this.statusOptions, val.status)
      },

      // 格式化日期-创建时间
      formatterDateCreateTime (val) {
        return TOOLS.normalTime(val.createTime)
      },
      // 获取规则列表
      getTableList (pageNo, pageSize) {
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'status': this.pointForm.status,
          'workType': this.pointForm.workType,
          'balanceType': this.pointForm.balanceType,
          'type': this.pointForm.type
        }

        API.$pointChannelConfigList(obj, res => { //
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageNo, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageNo, this.pageSize)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //  新增规则
      addAndEditPoint (row) {
        let ponitObj = ''
        if (row) {
          let { id, balanceType, outType, workType } = row
          ponitObj = { id, balanceType, outType, workType }
        } else {
          ponitObj = ''
        }
        this.$router.push({name: 'PointRuleAdd', params: {pointObj: ponitObj}})
      },
      // 切换状态
      toggleStatus (row, status) {
        this.activeId = row.id
        this.activeStatus = status
        this.statusDisabled = true
        this.msg = status == 20 ? '您确定 启用 此合作方式？' : '您确定 停用 此合作方式？'
        this.dialogVisible = true
      },

      // 切换状态 二次确认按钮
      toggleStatusBtn () {
        API.$pointChannelConfigChange(this.activeId, this.activeStatus, res => {
          let _this = this
          setTimeout(function () {
            _this.statusDisabled = false
            _this.dialogVisible = false
            if (res.success) {
              _this.getTableList(_this.pageNo, _this.pageSize)
            }
          }, 100)
        })
      }

    }
  }
</script>
