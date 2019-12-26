<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="sysForm" label-width="120px"  ref="sysForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="系统名称：" prop="bizName">
              <el-input v-model.trim="sysForm.bizName" placeholder="请输入配置名称" @keyup.enter.native="searchForm()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统key：" prop="bizKey">
              <el-input v-model="sysForm.bizKey" placeholder="请输入系统key号"@keyup.enter.native="searchForm()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="系统value：" prop="bizValue">
              <el-input v-model="sysForm.bizValue" placeholder="请输入系统value"@keyup.enter.native="searchForm()"></el-input>
            </el-form-item>
          </el-col>


        </el-row>
        <el-row>
         <!-- <el-col :span="8">
            <el-form-item label="配置类型:" prop="bizType">
              <el-select  name="type"v-model="sysForm.bizType">
                <el-option v-for="x in bizTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="8">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"><el-button type="primary" icon="search"@click="searchForm()" v-if="searchBtnViable">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('sysForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="plus" @click="addSys" v-if="addBtnViable">新增配置</el-button></span>
    </div>
    <!-- 工具栏结束 -->
    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="bizName"
        label="配置名称"
       >
      </el-table-column>
      <el-table-column
        prop="bizKey"
        label="配置key"
       >
      </el-table-column>
      <el-table-column
        prop="bizValue"
        label="配置value"
       >
      </el-table-column>
      <el-table-column
        prop="bizType"
        :formatter="formatterBizType"
        label="配置类型"
       >
      </el-table-column>
      <el-table-column
        prop="isInvalid"
        :formatter="formatterIsInvalid"
        label="是否可用"
        >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="最后修改时间"
        :formatter="formatterDate"
        width="168">
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
        >
        <template scope="scope">
          <div id="cellSys">
            <el-button @click="editSys(scope.row)"type="text" v-if="updateBtnViable">编辑</el-button>
            <el-button @click="delSys(scope.$index,scope.row)"type="text" v-if="delBtnViable">删除</el-button>
          </div>

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

    <!-- 删除的时候提示 -->
    <el-dialog title="提示" v-model="delDialogVisible" size="tiny">
      <span>确定要删除选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delSysBtn" :disabled="delDisabled">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scope>
</style>
<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'

  export default {
    data () {
      return {
        searchBtnViable: false,
        addBtnViable: false,
        updateBtnViable: false,
        delBtnViable: false,
        delDisabled: false,
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        delDialogVisible: false,
        sysForm: {
          bizName: '',
          bizKey: '',
          bizValue: ''
        //          bizType:''
        },
        bizTypeOptions: TOOLS.fetchObj('commonObj').SysType, // 配置类型
        tableData: [],
        currentId: 0,
        currentIndex: 0
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
        for (let i = 0, len = this.getFunctionList.length; i < len; i++) {
          if (this.getFunctionList[i].label === '查询') {
            this.searchBtnViable = true
          }
          if (this.getFunctionList[i].label === '新增') {
            this.addBtnViable = true
          }
          if (this.getFunctionList[i].label === '编辑') {
            this.updateBtnViable = true
          }
          if (this.getFunctionList[i].label === '删除') {
            this.delBtnViable = true
          }
        }
      }

      this.getSysList(this.pageNo, this.pageSize)
    },
    methods: {

      // 配置类型转换
      formatterBizType (val) {
        return TOOLS.valueToLabel(this.bizTypeOptions, val.bizType)
      },
      // 配置状态转换
      formatterIsInvalid (val) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').IsXXX, val.isInvalid)
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.updateTime)
      },

      // 获取系统列表
      getSysList (pageNo, pageSize) {
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'bizName': this.sysForm.bizName,
          'bizKey': this.sysForm.bizKey,
          'bizValue': this.sysForm.bizValue
        //          "bizType": this.sysForm.bizType,
        }
        API.$sysPageQuery(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getSysList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getSysList(val, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getSysList(this.pageNo, this.pageSize)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //  新增配置
      addSys () {
        TOOLS.clearProData()
        this.$router.push({name: 'Editparam', params: { paramId: 0 }})
      },
      // 编辑
      editSys (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'Editparam', params: {paramId: row.id}})
      },
      // 删除
      delSys (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
      },
      // 删除确定按钮
      delSysBtn () {
        this.delDisabled = true
        API.$sysDel(this.currentId, res => {
          this.delDisabled = false
          this.tableData.splice(this.currentIndex, 1)
          this.delDialogVisible = false
          this.getSysList(this.pageNo, this.pageSize)
        })
      }
    }
  }
</script>
