<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="borrowerForm" label-width="120px" ref="borrowerForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借方名称：" prop="borrowerName">
              <el-input v-model.trim="borrowerForm.borrowerName" placeholder="请输入借方名称" @keyup.enter.native="searchForm()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="借方类型：" prop="unitType">
              <el-select name="type"v-model="borrowerForm.unitType">
                <el-option v-for="x in borrowerTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
         <!-- <el-col :span="8">
            <el-form-item label="姓名："prop="legalPerson">
              <el-input v-model.trim="borrowerForm.legalPerson " placeholder="请输入联系人姓名"@keyup.enter.native="searchForm('borrowerForm')"></el-input>
            </el-form-item>
          </el-col>-->
          <el-col :span="8">
            <el-form-item label="电话："prop="mobile">
              <el-input v-model="borrowerForm.mobile " placeholder="请输入联系人电话" @keyup.enter.native="searchForm()"></el-input>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>

          <el-col :span="8">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"><el-button type="primary" icon="search"@click="searchForm()"v-if="searchBtnViable">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('borrowerForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <div class="z-tool-bar">
    </div>

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        label="借方名称"
        >
        <template scope="props" >
          <div class="borrowerName-link" v-text="props.row.borrowerName" @click="goDetail(props.row)"></div>
        </template>
      </el-table-column>
      <el-table-column
        prop="unitType"
        :formatter="formatterUnitType"
        label="借方类型"
       >
      </el-table-column>
      <!--<el-table-column
        prop="legalPerson"
        label="法定代表人姓名"
       >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="法定代表人电话"
       >
      </el-table-column>-->
      <el-table-column
        prop="mobile"
        label="手机号"
      >



      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDate"
        label="提交时间"
       >
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
        >
        <template scope="scope">
          <span> <el-button @click="detailBorrower(scope.row)"type="text" v-if="auditBtnViable">审核</el-button></span>
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
  </div>
</template>
<style lang="less" scope>
  @import "borrower.less";
</style>
<script>
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../store/api'
  import * as TOOLS from '../../../assets/js/tools'
  export default {
    data () {
      return {
        searchBtnViable: false,
        auditBtnViable: false,
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        totalCount: 0,
        idList: [],
        updataDialogVisible: false,
        delDialogVisible: false,
        auditDialogVisible: false,
        currentPage: 1,
        borrowerForm: {
          borrowerName: '',
          //          legalPerson:'',
          unitType: '',
          mobile: ''
        },
        tableData: [],
        multipleSelection: [],
        borrowerTypeOptions: TOOLS.fetchObj('commonObj').BorrowerType
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

//    computed: {
//      getFunctionList () {
//        if (this.$store.state.functionList.length > 0) {
//          return this.$store.state.functionList
//        } else {
//          this.$store.commit('updataFunctionList', TOOLS.getList('functionList'))
//          return this.$store.state.functionList
//        }
//      }
//    },

    mounted () {
      console.log('getFunctionList' + JSON.stringify(this.getFunctionList))
      if (this.getFunctionList.length > 0) {
        for (let i = 0, len = this.getFunctionList.length; i < len; i++) {
          if (this.getFunctionList[i].label === '查询') {
            this.searchBtnViable = true
          }

          if (this.getFunctionList[i].label === '审核') {
            this.auditBtnViable = true
          }
        }
      }
      this.getBorrowerListApp(this.pageNo, this.pageSize)
    },

    methods: {
      // 借方类型转换
      formatterUnitType (val) {
        return TOOLS.valueToLabel(this.borrowerTypeOptions, val.unitType)
      },

      // 状态转换
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },

      // 获取借款人列表
      getBorrowerListApp (pageNo, pageSize) {
        API.$borrowerPageQueryAudit({
          'pageNo': pageNo,
          'pageSize': pageSize,
          'borrowerName': this.borrowerForm.borrowerName,
          //          "legalPerson":this.borrowerForm.legalPerson,
          'unitType': this.borrowerForm.unitType,
          'mobile': this.borrowerForm.mobile
        }, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      // 更改每页多少条
      handleSizeChange (val) {
        this.pageSize = val
        this.getBorrowerListApp(this.pageNo, this.pageSize)
        TOOLS.log(`每页 ${val} 条`)
      },

      // 更改页码
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getBorrowerListApp(this.pageNo, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },

      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getBorrowerListApp(this.pageNo, this.pageSize)
      },

      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 详情
      goDetail (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'Detailborrower', params: {borrowerId: row.id, type: 0}})
      },
      // 审核
      detailBorrower (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'ApprovalDetailborrower', params: {borrowerId: row.id, type: 1}})
      }
    }
  }
</script>
