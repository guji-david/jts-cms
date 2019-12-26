<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box marBottom20">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="申请ID：" prop="loanNo">
                <el-input v-model="form.loanNo" placeholder="请输入申请ID"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目ID：" prop="productId">
                <el-input v-model="form.productId" placeholder="请输入项目ID"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="借方名称：" prop="borrowerName">
                <el-input v-model="form.borrowerName" placeholder="请输入借方名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="关闭原因：" prop="closeFlag">
                <el-select name="type" v-model="form.closeFlag">
                  <el-option v-for='x in closeFlagOptions' :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
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
        prop="loanNo"
        label="申请ID"
      >
      </el-table-column>
      <el-table-column
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetailPage(scope.row,scope.row.status)" class="detailSpan">{{scope.row.productName}}</span>
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
        label="联系人电话"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        :formatter="formatterStatus"
        label="关闭原因"
      >
      </el-table-column>

      <el-table-column
        prop="closeTime"
        :formatter="dateFormat"
        label="关闭时间"
      >
      </el-table-column>
      <el-table-column  label="项目入账" v-if="disabledArray[1] === 'true'">
        <template scope="scope">
          <span @click="toSearchDetailPage(scope.row,'1')" class="detailSpan">查询</span>
        </template>
      </el-table-column>
      <el-table-column label="项目退款"  v-if="disabledArray[2] === 'true'">
        <template scope="scope">
          <span @click="toSearchDetailPage(scope.row,'2')" class="detailSpan">查询</span>
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

    <!-- 对话框 -->
  </div>
</template>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../.././../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        totalCount: 0,
        currentPage: 1,
        form: {
          loanNo: '', // 申请id
          productName: '', // 项目名称
          productId: '', // 项目id
          borrowerName: '', // 借方名称
          closeFlag: []// 关闭原因
        },
        tableData: [],
        hidden: true,
        pageNo: 1,
        pageSize: 5,
        test: '',
        closeFlagOptions: TOOL.fetchObj('commonObj').ProductCloseStatus, // 关闭原因
        breadcrumName: '',
        disabledArray: []// 权限控制\1/查询,2/详情,3/下载
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
            case '入账查询':
              this.disabledArray[1] = 'true'
              break
            case '退款查询':
              this.disabledArray[2] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }

      this.getTableList(this.pageSize, this.pageNo)
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */

      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 关闭原因转化
      formatterStatus (row, column) {
        return TOOL.valueToLabel(this.closeFlagOptions, row[column.property])
      },

      // 是否退款转化
      isRefundChargeFormat (row, column) {
        return TOOL.valueToLabel(this.isRefundChargeOptions, row[column.property])
      },

      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList(this.pageSize, this.pageNo)
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList(this.pageSize, this.pageNo)
        console.log(`当前页: ${this.pageNo}`)
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList(this.pageSize, this.pageNo)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */

      // 不同的关闭原因转换详情组件所需type
      statusToType (status) {
        if (status == 30) {
          return 'closeDetailApp'// 审核未通过
        } else if (status == 32) {
          return 'closeDetailCM'// 审核超时
        } else if (status == 50) {
          return 'closeDetailPub'// 发布失败
        } else if (status == 60) {
          return 'closeDetailFail'// 募集失败
        } else {
          return 'closeDetailBase'// 支付超时10/取消借款20
        }
      },

      // 跳转详情
      toDetailPage (row, type) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        this.$router.push({name: 'TBDPayProDetail', params: {id: row.productId, type: this.statusToType(type)}})
      },
      // 查询跳转详情
      toSearchDetailPage (row, type) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        this.$router.push({name: 'TBDCurrentLabelSearchDetail', params: {id: row.productId, type: type}})
      },

      // 请求数据
      getTableList (pageSize, pageNo) {
        let obj = {
          'pageSize': pageSize,
          'pageNo': pageNo,
          'loanNo': this.form.loanNo, // 申请id
          'productName': this.form.productName, // 项目名称
          'productId': this.form.productId, // 项目id
          'borrowerName': this.form.borrowerName, // 借方名称
          'closeFlag': this.form.closeFlag // 关闭原因
        }
        API.$currentLabel(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>

