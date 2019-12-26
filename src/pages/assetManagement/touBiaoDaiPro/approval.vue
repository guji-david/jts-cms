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
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="loanNo"
        label="申请ID">
      </el-table-column>
      <el-table-column
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetailPage(scope.row,'approvalInfo')" class="detailSpan">{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="productId"
        label="项目ID"
      >
      </el-table-column>
      <el-table-column
        prop="borrowerName"
        label="借方名称"
      >
      </el-table-column>
      <el-table-column
        prop="contactName"
        label="项目联系人"
      >
      </el-table-column>
      <el-table-column
        prop="contactPhone"
        label="项目联系人电话"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="dateFormat"
        label="提交时间"
      >
      </el-table-column>
      <el-table-column
        prop="endTime"
        :formatter="endDay"
        label="过期时间"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <el-button @click="toDetailPage(scope.row,'approval')" type="text" v-if="disabledArray[1] === 'true' ">审核</el-button>
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

  </div>
</template>


<script>
  import * as API from '../../../store/api'
  import breadcrumbNav from '../../../components/nav/breadcrumb-nav.vue'
  import * as TOOL from '../../../assets/js/tools'

  export default {
    data () {
      return {
        totalCount: 0,
        currentPage: 1,
        form: {
          borrowerName: '', // 借方名称
          name: '', // 项目名称
          productId: '', // 项目id
          loanNo: ''// 申请id
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        breadcrumName: '',
        disabledArray: []// 权限控制\1/查询,2/备案
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
            case '审核':
              this.disabledArray[1] = 'true'
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
      dateFormat: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 项目期限
      endDay (row, column) {
        return TOOL.normalTimeDay(row[column.property])
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
      // 跳转详情
      toDetailPage (row, type) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        this.$router.push({ name: 'TBDPayProDetail', params: { id: row.productId, type: type } })
      },

      // 请求数据
      getTableList (pageNo, pageSize) {
        API.$noauditList(TOOL.noEmety(this.form, pageSize, pageNo), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "./proStyle.less";
</style>
