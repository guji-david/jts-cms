<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="borrowerForm" label-width="120px" :rules="rules" ref="borrowerForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="借方名称：" prop="borrowerName">
              <el-input v-model.trim="borrowerForm.borrowerName"
                        placeholder="请输入借方名称"
                        @keyup.enter.native="searchForm()"></el-input>
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
            <el-form-item label="状态：" prop="auditFlag">
              <el-select v-model="borrowerForm.auditFlag">
                <el-option v-for="x in auditStatusOptionsCheck" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"v-if="searchBtnViable"><el-button type="primary" icon="search"@click="searchForm()">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('borrowerForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
      <span class="z-btn-span"v-if="addBtnViable"><el-button type="default" icon="plus" @click="addBorrower">新增借款人</el-button></span>
      <span class="z-btn-span"v-if="auditBtnViable"><el-button type="default" icon="circle-check" @click="multipleUpdateBtn">批量提交审核</el-button></span>
      <span class="z-btn-span"v-if="delBtnViable"><el-button type="default" icon="delete2" @click="multipleDelBtn">批量删除</el-button></span>
    </div>
    <!-- 工具栏结束 -->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%"
      v-loading="listLoading">
      <el-table-column
        fixed
        type="selection"
        >
      </el-table-column>
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
    <!--  <el-table-column
        prop="legalPerson"
        label="法定代表人姓名"
        >
      </el-table-column>
      <el-table-column
        prop="legalPersonMobile"
        label="法定代表人电话"
       >
      </el-table-column>-->
      <el-table-column
        prop="mobile"
        label="手机号"
       >
      </el-table-column>

      <el-table-column
        prop="auditFlag"
        :formatter="formatterAuditFlag"
        label="状态"
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDate"
        label="创建时间"
        >
      </el-table-column>
      <el-table-column
        prop="auditContent"
        label="备注"
        >
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
       >
        <template scope="scope">
          <span v-if="updateBtnViable"> <el-button @click="editBorrower(scope.row)"type="text">修改</el-button></span>
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
    <!-- 批量操作没有选择任何列的时候提示 -->
    <el-dialog title="提示" v-model="updataDialogVisible" size="tiny">
      <span>请选择至少一条数据</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updataDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 批量操作删除的时候提示 -->
    <el-dialog title="提示" v-model="delDialogVisible" size="tiny">
      <span>确定要删除选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delMultipleborrowerForm":disabled="delDisabled">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批量操作审核的时候提示 -->
    <el-dialog title="提示" v-model="auditDialogVisible" size="tiny">
      <span>确定要审核选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="auditMultipleborrowerForm":disabled="auditDisabled">确 定</el-button>
      </span>
    </el-dialog>


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
        addBtnViable: false,
        updateBtnViable: false,
        auditBtnViable: false,
        delBtnViable: false,
        delDisabled: false,
        auditDisabled: false,
        listLoading: false,
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
          mobile: '',
          auditFlag: ''
        },
        tableData: [],
        multipleSelection: [],

        rules: {
          borrowerName: [
          ],

          mobile: [
          ]

        },
        borrowerTypeOptions: TOOLS.fetchObj('commonObj').BorrowerType,
        auditStatusOptions: [],
        auditStatusOptionsCheck: []
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
      TOOLS.log('this.getFunctionList', this.getFunctionList)
      if (this.getFunctionList.length > 0) {
        for (let i = 0, len = this.getFunctionList.length; i < len; i++) {
          if (this.getFunctionList[i].label === '查询') {
            this.searchBtnViable = true
          }
          if (this.getFunctionList[i].label === '新增') {
            this.addBtnViable = true
          }
          if (this.getFunctionList[i].label === '修改') {
            this.updateBtnViable = true
          }
          if (this.getFunctionList[i].label === '提交审核') {
            this.auditBtnViable = true
          }
          if (this.getFunctionList[i].label === '删除') {
            this.delBtnViable = true
          }
        }
      }
      this.auditStatusOptions = TOOLS.fetchObj('commonObj').AuditStatus
      this.auditStatusOptionsCheck = this.auditStatusOptionsCheckFun(this.auditStatusOptions)
      this.getBorrowerList(this.pageNo, this.pageSize)
    },

    methods: {
      // 过滤状态选项
      auditStatusOptionsCheckFun (list) {
        let Arr = []
        for (let x of list) {
          if (x.value === 'init') {
            x.label = '新建'
          }

          if (x.value === 'init' || x.value === 'refuse' || x.value == '') {
            Arr.push(x)
          }
        }
        return Arr
      },

      // 机构类型转换
      formatterUnitType (val) {
        return TOOLS.valueToLabel(this.borrowerTypeOptions, val.unitType)
      },

      // 状态转换
      formatterAuditFlag (val) {
        return TOOLS.valueToLabel(this.auditStatusOptions, val.auditFlag)
      },

      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },

      // 获取借款人列表
      getBorrowerList (pageNo, pageSize) {
        this.listLoading = true
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'borrowerName': this.borrowerForm.borrowerName,
          //            "legalPerson":this.borrowerForm.legalPerson,
          'unitType': this.borrowerForm.unitType,
          'mobile': this.borrowerForm.mobile,
          'auditFlag': this.borrowerForm.auditFlag
        }
        API.$borrowerPageQueryAdd(obj, res => {
          this.listLoading = false
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      // 获取多项列表
      handleSelectionChange (val) {
        this.idList = []
        this.multipleSelection = val
        this.idList = TOOLS.getListProp('id', this.multipleSelection)
        TOOLS.log('this.idList', this.idList)
      },

      // 更改每页多少条
      handleSizeChange (val) {
        this.pageSize = val
        this.getBorrowerList(this.pageNo, this.pageSize)
        TOOLS.log(`每页 ${val} 条`)
      },

      // 更改页码
      handleCurrentChange (val) {
        this.pageNo = val
        this.currentPage = val
        this.getBorrowerList(val, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },

      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getBorrowerList(this.pageNo, this.pageSize)
      },

      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },

      //  新增借款人
      addBorrower () {
        TOOLS.clearProData()
        this.$router.push({ name: 'Editborrower', params: { borrowerId: 0 } })
      },

      //  批量提交审核弹窗
      multipleUpdateBtn () {
        if (this.multipleSelection.length === 0) {
          this.updataDialogVisible = true
        } else {
          this.auditDialogVisible = true
        }
      },

      //  批量删除借款人弹窗
      multipleDelBtn () {
        if (this.multipleSelection.length === 0) {
          this.updataDialogVisible = true
        } else {
          this.delDialogVisible = true
        }
      },
      //  批量删除借款人
      delMultipleborrowerForm () {
        this.delDisabled = true
        API.$borrowerDelete(this.idList, res => {
          this.delDialogVisible = false
          this.getBorrowerList(this.pageNo, this.pageSize)
        })
      },

      //  批量审核借款人
      auditMultipleborrowerForm () {
        this.auditDisabled = true
        API.$borrowerToAudit(this.idList, res => {
          this.auditDisabled = false
          this.auditDialogVisible = false
          this.getBorrowerList(this.pageNo, this.pageSize)
        })
      },
      // 详情
      goDetail (row) {
        TOOLS.clearProData()
        this.$router.push({ name: 'Detailborrower', params: { borrowerId: row.id, type: 0 } })
      },
      // 编辑
      editBorrower (row) {
        TOOLS.clearProData()
        this.$router.push({ name: 'Editborrower', params: { borrowerId: row.id } })
      }

    }
  }
</script>
