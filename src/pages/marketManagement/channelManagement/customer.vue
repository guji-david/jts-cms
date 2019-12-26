<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="customerForm" label-width="120px" ref="customerForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="渠道名称：" prop="name">
              <el-input v-model.trim="customerForm.name" placeholder="请输入渠道名称" @keyup.enter.native="searchForm()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="渠道编号：" prop="source">
              <el-input v-model.trim="customerForm.source" placeholder="请输入渠道编号"@keyup.enter.native="searchForm()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="合作平台：" prop="platformType">
              <el-select  name="type"v-model="customerForm.platformType">
                <el-option v-for="x in platTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="合作方式：" prop="workType">
              <el-select name="type"v-model="customerForm.workType">
                <el-option v-for="x in workTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算方式：" prop="balanceType">
              <el-select name="type"v-model="customerForm.balanceType">
                <el-option v-for="x in balanceTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span">
                <el-button type="primary" icon="search"@click="searchForm()"v-if="searchBtnViable">查询</el-button>
              </span>
              <span class="z-btn-span"><el-button @click="resetForm('customerForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="plus" @click="addCustomer" v-if="addBtnViable">新增渠道</el-button></span>
    </div>
    <!-- 工具栏结束 -->
    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="渠道名称"
       >
      </el-table-column>
      <el-table-column
        prop="source"
        label="渠道编号"
       >
      </el-table-column>
      <el-table-column
        prop="platformType"
        :formatter="formatterPlatType"
        label="合作平台"
       >
      </el-table-column>
      <el-table-column
        prop="workType"
        label="合作方式"
        :formatter="formatterWorkType"
       >
      </el-table-column>
      <el-table-column
        prop="balanceType"
        label="结算方式"
        :formatter="formatterBalanceType"
       >
      </el-table-column>
      <el-table-column
        prop="link"
        label="链接地址"
        width="380">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="创建时间"
        :formatter="formatterDate"
        width="175">
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
        >
        <template scope="scope">
          <!--<div id="cellcustomer">
            <el-button @click="editCustomer(scope.row)"type="text" v-if="updateBtnViable">编辑</el-button>
            <el-button @click="delCustomer(scope.$index,scope.row)"type="text"  v-if="delBtnViable">删除</el-button>
          </div>-->

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
        <el-button type="primary" @click="delCustomerBtn" :disabled="delDisabled">确 定</el-button>
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
        customerForm: {
          name: '',
          source: '',
          platformType: '',
          workType: '',
          balanceType: ''
        },
        platTypeOptions: TOOLS.fetchObj('commonObj').Platform, // 平台类型
        workTypeOptions: TOOLS.fetchObj('commonObj').WorkType, // 合作方式
        balanceTypeOptions: TOOLS.fetchObj('commonObj').BalanceType, // 结算方式
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
      this.getChannelList(this.pageNo, this.pageSize)
    },
    methods: {

      // 平台类型转换
      formatterPlatType (val) {
        return TOOLS.valueToLabel(this.platTypeOptions, val.platformType)
      },
      // 合作方式转换
      formatterWorkType (val) {
        return TOOLS.valueToLabel(this.workTypeOptions, val.workType)
      },
      // 结算方式转换
      formatterBalanceType (val) {
        return TOOLS.valueToLabel(this.balanceTypeOptions, val.balanceType)
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },

      // 获取渠道列表
      getChannelList (pageNo, pageSize) {
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'name': this.customerForm.name,
          'source': this.customerForm.source,
          'platformType': this.customerForm.platformType,
          'workType': this.customerForm.workType,
          'balanceType': this.customerForm.balanceType
        }
        API.$channelPageQuery(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getChannelList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getChannelList(val, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getChannelList(this.pageNo, this.pageSize)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //  新增渠道
      addCustomer () {
        TOOLS.clearProData()
        this.$router.push({name: 'EditCustomer', params: { customerId: 0 }})
      },
      // 编辑
      editCustomer (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'EditCustomer', params: {customerId: row.id}})
      },
      // 删除
      delCustomer (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
      },
      // 删除确定按钮
      delCustomerBtn () {
        this.delDisabled = true
        API.$channelDel(this.currentId, res => {
          this.delDisabled = false
          this.tableData.splice(this.currentIndex, 1)
          this.delDialogVisible = false
          this.getChannelList(this.pageNo, this.pageSize)
        })
      }
    }
  }
</script>
