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
                <el-option v-for="x in unitTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
          <el-form-item label="审核方式：" prop="borrowerType">
            <el-select name="type"v-model="borrowerForm.borrowerType">
              <el-option v-for="x in borrowerTypeOptions" :value="x.value" :label="x.label" ></el-option>
            </el-select>
          </el-form-item>
          </el-col>


        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="信用代码："prop="businessLicenseCode">
              <el-input v-model="borrowerForm.businessLicenseCode" placeholder="请输入信用代码"@keyup.enter.native="searchForm('borrowerForm')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"><el-button type="primary" icon="search"
                                                  v-if="searchBtnViable"
                                                  @click="searchForm()">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('borrowerForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

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
     <!-- <el-table-column
        prop="legalPerson"
        label="法定代表人姓名"
        >
      </el-table-column>
      <el-table-column
        prop="legalPersonMobile"
        label="法定代表人电话"
        >
      </el-table-column>-->
      <!--<el-table-column-->
        <!--prop="mobile"-->
        <!--label="手机号"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <el-table-column
        prop="accountBalance"
        :formatter="formatterAmountBalance"
        label="最高可借金额(元)"
        >
      </el-table-column>
      <el-table-column
        prop="frozenBalance"
        :formatter="formatterFrozenBalance"
        label="剩余可借金额(元)"
        >
      </el-table-column>
      <el-table-column
      prop="borrowerType"
      :formatter="formatterborrowerType"
      label="审核方式"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDateCreateTime"
        label="创建时间"
        >
      </el-table-column>
      <el-table-column
        prop="isFreezeTime"
        :formatter="formatterDateIsFreezeTime"
        label="停用时间"
       >
      </el-table-column>
      <el-table-column
        prop="freezeCause"
        label="备注"
       >
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
        >
        <template scope="scope" >
          <span v-if="stopBtnVisable(scope.row)"> <el-button @click="stopBtn(scope.row)" v-if="stopViable"type="text">停用</el-button></span>
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
    <!-- 停用的时候提示 -->
    <el-dialog title="提示" v-model=" listDialogVisible" size="tiny">
      <span>是否确认停用借款人?</span>
      <el-form label-width="120px"  ref="freezeObj" :model="freezeObj ">
              <el-form-item label="停用原因："
                            prop="freezeCause"
                            :rules="[
                   { required: true, message: '停用原因不能为空', trigger: 'blur' },
            { min: 0, max: 50, message: '长度必须在50个字符以内', trigger: 'blur' }

    ]">
                <el-input v-model="freezeObj.freezeCause" placeholder="停用原因"></el-input>
              </el-form-item>
        <span>注:此操作不可逆,请慎行!</span>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="stopDisabled" @click="stopSubmitBtn('freezeObj')">确 定</el-button>
        <el-button type="primary" size="larger"@click="cannelBtn('freezeObj')">取 消</el-button>
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
        stopViable: false,
        stopDisabled: false,
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        totalCount: 0,
        idList: [],
        listDialogVisible: false,
        currentPage: 1,
        borrowerType: '',
        borrowerForm: {
          borrowerName: '',
          unitType: '',
          borrowerType:'',
          businessLicenseCode :''
        },
        tableData: [],
        multipleSelection: [],
        freezeObj: {
          freezeCause: ''
        },
        isFreeze: true,
        borrowerId: 0,
        unitTypeOptions: TOOLS.fetchObj('commonObj').BorrowerType,
        borrowerTypeOptions: [
          {
            label: '全部',
            value: ''
          },
          {
            label: '人工',
            value: '10'
          },
          {
            label: '系统',
            value: '20'
          }
        ]
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
          if (this.getFunctionList[i].label === '停用') {
            this.stopViable = true
          }
        }
      }
      this.getBorrowerListStop(this.pageNo, this.pageSize)
    },

    methods: {
      // 借方类型转换
      formatterUnitType (val) {
        return TOOLS.valueToLabel(this.unitTypeOptions, val.unitType)
      },
      // 可借金额(元)转换
      formatterAmountBalance (val) {
        return TOOLS.fenToYuan(val.accountBalance)
      },
      // 再借金额(元)转换
      formatterFrozenBalance (val) {
        return TOOLS.fenToYuan(val.accountBalance - val.frozenBalance)
      },
      // 审核方式类型转换
      formatterborrowerType (val) {
        return TOOLS.valueToLabel(this.borrowerTypeOptions, val.borrowerType)
      },
      // 日期转换创建时间
      formatterDateCreateTime (val) {
        return TOOLS.normalTime(val.createTime)
      },

      // 日期转换停用时间
      formatterDateIsFreezeTime (val) {
        return TOOLS.normalTime(val.isFreezeTime)
      },

      // 获取借款人列表
      getBorrowerListStop (pageNo, pageSize) {
        API.$borrowerPageQueryFreeze({
          'pageNo': pageNo,
          'pageSize': pageSize,
          'borrowerName': this.borrowerForm.borrowerName,
          'unitType': this.borrowerForm.unitType,
          'borrowerType': this.borrowerForm.borrowerType,
          'businessLicenseCode': this.borrowerForm.businessLicenseCode,
          'auditFlag': [this.borrowerForm.auditFlag]
        }, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      // 更改每页多少条
      handleSizeChange (val) {
        this.pageSize = val
        this.getBorrowerListStop(this.pageNo, this.pageSize)
      },

      // 更改页码
      handleCurrentChange (val) {
        this.pageNo = val
        this.currentPage = val
        this.getBorrowerListStop(this.pageNo, this.pageSize)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getBorrowerListStop(this.pageNo, this.pageSize)
      },

      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },

      // 停用按钮是否显示
      stopBtnVisable: function (val) {
        if ((val.isFreeze === 'false') && ((val.accountBalance - val.frozenBalance) != 0)) {
          return true
        } else {
          return false
        }
      },

      // 停用按钮
      stopBtn (row) {
        this.borrowerId = row.id
        this.listDialogVisible = true
      },

      // 停用提交按钮
      stopSubmitBtn (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
          //            TOOLS.log("this.borrowerId",this.borrowerId);
            this.stopDisabled = true
            API.$borrowerFreeze(this.borrowerId, this.freezeObj.freezeCause, this.isFreeze, res => {
              this.stopDisabled = false
              if (res.success) {
                this.listDialogVisible = false
                this.getBorrowerListStop(this.pageNo, this.pageSize)
              } else {
                alert(res.resultMsg)
              }
            })
          } else {
            return false
          }
        })
      },
      // 停用取消按钮
      cannelBtn (formName) {
        this.$refs[formName].resetFields()
        this.listDialogVisible = false
      },
      // 详情
      goDetail (row) {
        TOOLS.clearProData()
        this.$router.push({ name: 'Detailborrower', params: { borrowerId: row.id, type: 0 } })
      }
    }
  }
</script>
