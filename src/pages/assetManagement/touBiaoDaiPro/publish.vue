<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="申请ID：" prop="loanNo">
                <el-input v-model="form.loanNo" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="name">
                <el-input v-model="form.name" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="productId">
                <el-input v-model="form.productId" ></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方名称：" prop="borrowerName">
                <el-input v-model="form.borrowerName" ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="status">
                <el-select name="type" v-model="form.status">
                  <el-option v-for="x in statusOptions" :value="x.value" :label="x.label" v-if="x.value === 41 || x.value === 51 || x.value === ''"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>

          <el-col :span="8" :push="1">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar"></div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="loanNo" label="申请ID"></el-table-column>
      <el-table-column prop="name" label="项目名称">
        <template scope="scope">
          <span @click="toDetailPage(scope.row,'publish')" class="detailSpan">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="productId" label="项目ID"></el-table-column>
      <el-table-column prop="borrowerName" label="借方名称"></el-table-column>
      <el-table-column prop="contactName" label="项目联系人"></el-table-column>
      <el-table-column prop="contactPhone" label="项目联系人电话"></el-table-column>
      <el-table-column prop="tenderStartTime" :formatter="dateFormatDay" label="募集开始时间"></el-table-column>
      <el-table-column prop="tenderEndTime" :formatter="dateFormatDay" label="募集结束时间"></el-table-column>
      <el-table-column prop="status" :formatter="statusFormat" label="状态"></el-table-column>
      <el-table-column prop="abnormalTime" :formatter="dateFormatTime" label="异常时间"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
          <el-button @click="putonrecordsBtn(scope.row)" type="text" v-if="disabledArray[1] === 'true'&&scope.row.status===41 " :disabled="(scope.row.id==activeId)">备案</el-button>
          <el-button @click="publishBtn(scope.row)" type="text" v-if="disabledArray[2] === 'true' && scope.row.status===51 " :disabled="(scope.row.id==activeId)">发布</el-button>
          <el-button @click="publishRrror(scope.row)" type="text" v-if="disabledArray[3] ==='true'">发布失败</el-button>
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
        :page-sizes="[5,10,20,40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页结束 -->
    <!-- 批量操作审核的时候提示 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span>确认关闭该项目,项目关闭后已支付的保证金将退回到付款银行</span>
      <span slot="footer" class="dialog-footer">
        <!--<el-button type="default" @click="dialogVisible = false">取 消</el-button>-->
        <el-button type="primary" :disabled=errorBtnDisabled @click="publishRrrorBtn()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
  import * as API from '../../../store/api'
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as TOOL from '../../../assets/js/tools'

  export default {
    data () {
      return {
        dialogVisible:false,
        form: {
          loanNo: '', // 申请id
          name: '', // 项目名称
          productId: '', // 项目id
          borrowerName: '', // 借方名称
          status: ''
        },
        statusOptions: TOOL.fetchObj('commonObj').ProductStatusZZ,
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        totalCount: 0,
        currentPage: 1,
        breadcrumName: '',
        disabledArray: [], // 权限控制\1/查询,2/备案
        activeId: 0,
        activeErrorId: 0,
        errorBtnDisabled:false
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
    mounted () {
      if (this.getFunctionList.length > 0) {
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '备案':
              this.disabledArray[1] = 'true'
              break
            case '发布':
              this.disabledArray[2] = 'true'
              break
            case '发布失败':
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
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 时间格式化
      dateFormatTime: function (row, column) {
        return TOOL.normalTime(row[column.property])
      },
      // 项目期限
      dateFormatDay (row, column) {
        return TOOL.normalTimeDay(row[column.property])
      },
      statusFormat (row, column) {
        return TOOL.valueToLabel(this.statusOptions, row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 这个是pageNo
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageNo, this.pageSize)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 查询
      searchForm () {
        this.currentPage = 1
        this.pageNo = 1
        this.getTableList(this.pageNo, this.pageSize)
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 备案
      putonrecordsBtn (row) {
        this.activeId = row.id
        API.postRequest('/gateway/zhongzhao/product/keepOnRecord', { id: row.productId }, res => {
          this.activeId = 0
          if (res.success) { // 如果成功的话
            TOOL.alertConfirm(this, '', `备案成功`, '', '确定', '', 'success', false)
            this.getTableList(this.pageNo, this.pageSize)
          } else {
            TOOL.alertConfirm(this, '', `${res.resultMsg} 备案失败`, '', '确定', '', 'warning', false)
          }
        })
      },
      //发布
      publishBtn (row) {
        this.activeId = row.id
        API.postRequest('/gateway/zhongzhao/product/publish', {id: row.productId}, res => {
          this.activeId = 0
          if (res.success) { // 如果成功的话
            TOOL.alertConfirm(this, '', `发布成功`, '', '确定', '', 'success', false)
            this.getTableList(this.pageNo, this.pageSize)
          } else {
            TOOL.alertConfirm(this, '', `${res.resultMsg} 发布失败`, '', '确定', '', 'warning', false)
          }
        })
      },
      //发布失败
      publishRrror(row){
        this.dialogVisible=true;
        this.activeErrorId= row.productId;
      },
      publishRrrorBtn () {
        this.errorBtnDisabled=true;
        API.postRequest('/gateway/zhongzhao/product/manualPublishFail', {id:this.activeErrorId}, res => {
          this.activeErrorId = 0;
          if (res.success) { // 如果成功的话
//            TOOL.alertConfirm(this, '', `发布成功`, '', '确定', '', 'success', false)
            setTimeout(()=>{
              this.errorBtnDisabled=false;
              this.dialogVisible=false;
              this.getTableList(this.pageNo, this.pageSize)
            },300)

          } else {
            this.dialogVisible=false;
            TOOL.alertConfirm(this, '', `${res.resultMsg} 发布失败`, '', '确定', '', 'warning', false)
          }
        })
      },
      // 跳转详情
      toDetailPage (row, type) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        this.$router.push({ name: 'TBDPayProDetail', params: { id: row.productId, type: type } })
      },
      // 请求数据
      getTableList (pageNo, pageSize) {
        let obj = {
          pageNo: pageNo,
          pageSize: pageSize,
          loanNo: this.form.loanNo,
          name: this.form.name,
          productId: this.form.productId,
          borrowerName: this.form.borrowerName,
          status: this.form.status
        }
        API.$nopublishList(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>
