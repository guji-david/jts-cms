<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="messageForm" label-width="120px"  ref="messageForm">
        <el-row>
          <el-col :span="8">
              <el-form-item label="批次号：" prop="batchNo">
                <el-input name="number"
                          placeholder="请输入批次号"
                          v-model="messageForm.batchNo"
                          type="text"
                          @keyup.enter.native="search()"
                ></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item label="标题：" prop="topic">
                <el-input v-model="messageForm.topic"
                          placeholder="请输入标题"
                          @keyup.enter.native="search()"
                ></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="8">
              <el-form-item label="发放状态：" prop="sendStatus">
                <el-select name="status" v-model="messageForm.sendStatus">
                  <el-option v-for="x in sendStatusOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"><el-button type="primary" icon="search"v-if="searchBtnViable" @click="searchForm()">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('messageForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="primary" icon="plus"@click="addMessage" v-if="addBtnViable">新增</el-button></span>
    </div>

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column
        prop="batchNo"
        label="批次号"
       >
      </el-table-column>
      <el-table-column
        prop="topic"
        label="标题"
       >
      </el-table-column>
      <el-table-column
        prop="sendNum"
        label="发送人数"
       >
      </el-table-column>
      <el-table-column
        prop="sendNumSuccess"
        label="成功人数"
        >
      </el-table-column>


      <el-table-column
        prop="sendStatus"
        :formatter="formatterSendStatus"
        label="发送状态"
        >
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
        >
        <template scope="scope">
          <div >
            <el-button @click="goMessageView(scope.row)"type="text" v-if="goViewBtnViable">查看</el-button>
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




  </div>
</template>
<style lang="less" scoped>
  .table-line{
    width:100%;
    padding:0 18px ;
  li{
    width:100%;
    margin-left: -18px;
    padding:0 18px ;
    text-align: center;
    border-bottom: 1px solid #dfe6ec;
  }
  li:last-child{
    border-bottom: none;
  }

  }

</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'
  export default {
    data () {
      return {
        searchBtnViable: false,
        addBtnViable: false,
        goViewBtnViable: false,
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        updataDialogVisible: false,
        sendStatusOptions: TOOLS.fetchObj('commonObj').MessageSendStatus,
        messageForm: {
          batchNo: '',
          topic: '',
          sendStatus: ''
        },
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
          if (this.getFunctionList[i].label === '查看') {
            this.goViewBtnViable = true
          }
        }
      }
      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {

      // 产品类型转换
      formatterSendStatus (val) {
        return TOOLS.valueToLabel(this.sendStatusOptions, val.sendStatus)
      },

      // 获取红包列表
      getTableList (pageNo, pageSize) {
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'batchNo': this.messageForm.batchNo,
          'topic': this.messageForm.topic,
          'sendStatus': this.messageForm.sendStatus
        }
        API.$queryMessage(obj, res => {
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
        this.getTableList(val, this.pageSize)
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
      //  新增红包
      addMessage () {
        this.$router.push({name: 'AddMessage'})
      },
      // 查看
      goMessageView (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'MessageView', params: {batchNo: row.batchNo}})
      }
    }
  }
</script>
