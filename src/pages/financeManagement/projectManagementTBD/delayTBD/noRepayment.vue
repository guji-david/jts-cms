<template>
    <div id="content-body" class="content-body">
        <!-- 搜索开始 -->
        <div class="z-search-box marBottom20" style="margin-bottom:20px">
        <el-form ref="form" :model="form" label-width="165px">
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
                        <el-input v-model="form.borrowerName" placeholder="请输入借方名称" ></el-input>
                    </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <el-form-item>
                        <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0]">查询</el-button></span>
                        <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
                    </el-form-item>
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
            prop="notifyTime"
            label="还款时间"
            :formatter="dateFormat"
        >
        </el-table-column>

        <el-table-column
            prop="loanNo"
            label="申请ID"
        >
        </el-table-column>
        <el-table-column
            label="项目名称"
        >
            <template scope="scope">
                <span @click="toDetailPage(scope.row,'delayNoRepayInfo')" class="detailSpan">{{scope.row.productName}}</span>
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
            prop="repaymentAccount"
            label="还款账户"
        >
        </el-table-column>

        <el-table-column
            prop="type"
            label="类型"
        >
        </el-table-column>
        <el-table-column
            prop="isNotify"
            label="是否已通知还款"
            :formatter="formatterNotify"
        >
        </el-table-column>
        <el-table-column
            label="操作"
        >
            <template scope="scope" v-if="scope.row.isNotify == '20'">
                <el-button
                @click="goRepay(scope.row)"
                v-if="disabledArray[1]"
                type="text"
                ><span>去还款</span></el-button>
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
import * as API from "../../.././../store/api";
import * as TOOLS from "../../../../assets/js/tools";

export default {
  data() {
    return {
        totalCount: 0,
        currentPage: 1,
        pageNo: 1,
        pageSize: 5,
        form: {
            loanNo: "", // 申请id
            productName: "", // 项目名称
            productId: "", // 项目id
            borrowerName: ""// 借方名称
        },
        tableData: [],
        notifyOption: TOOLS.fetchObj('commonObj').ProductOverdueIsNotify,
      disabledArray:[] //权限配置
    };
  },
  computed: {
    getFunctionList() {
      if (this.$store.state.functionList.length > 0) {
        return this.$store.state.functionList;
      } else {
        this.$store.commit("updataFunctionList", TOOLS.getList("functionList"));
        return this.$store.state.functionList;
      }
    }
  },
  beforeMount() {
    if (this.getFunctionList.length > 0) {
      let len = this.getFunctionList.length
      for (let i = 0; i < len; i++) {
        switch (this.getFunctionList[i].label) {
          case '待还款-查询':
            this.disabledArray[0] = true
            break
          case '去还款':
            this.disabledArray[1] = true
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
    // 借方类型转换
    formatterNotify (val) {
    return TOOLS.valueToLabel(this.notifyOption, val.isNotify)
    },
    // 时间格式化
    dateFormat: function(row, column) {
      var date = row[column.property];
      return TOOLS.normalTime(date);
    },

    /* --------------------------------------------分页,查询-------------------------------------------------------- */
    // 这个是pageSize
    handleSizeChange(val) {
      this.pageSize = val;
      this.getTableList(this.pageSize, this.pageNo);
      console.log(`每页 ${this.pageSize} 条`);
    },
    // 这个是pageSize
    handleCurrentChange(val) {
      // 这个是pageNo
      this.currentPage = val;
      this.pageNo = val;
      this.getTableList(this.pageSize, this.pageNo);
      console.log(`当前页: ${this.pageNo}`);
    },
    // 查询
    searchForm() {
      this.pageNo = 1;
      this.currentPage = 1;
      this.getTableList(this.pageSize, this.pageNo);
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /* --------------------------------------------页面事件----------------------------------------------------------- */
    // 请求数据
    getTableList(pageSize, pageNo) {
        let {loanNo, productName, productId, borrowerName} = this.form;
        let obj = {
            pageSize,
            pageNo,
            loanNo, // 申请id
            productName, // 项目名称
            productId, // 项目id
            borrowerName,// 借方名称
        };
        API.$overdueUnrepayList(obj, res => {
            this.tableData = res.list
            this.totalCount = res.totalCount
        })
    },
    // 项目详情页
    toDetailPage(row,type){
        TOOLS.clearProData()
        TOOLS.clearBreadcrumName()
        this.$router.push({name: 'TBDPayProDetail', params: {id: row.productId, type: type}})
    },
    // 去还款
    goRepay(row){
        this.$router.push({name: 'GoRepaymentInfo',params:{id: row.productId}})
    }

  }
};
</script>
