<template>
  <div id="content-body" class="content-body">
    <div v-if="!comVisable">
      <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    </div>

    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="redpacketForm" label-width="120px"ref="redpacketForm" onsubmit="return false">
        <el-row>
          <el-col :span="8"  v-if="!comVisable">
            <div class="z-span-20">
              <el-form-item label="红包ID：" prop="id">
                <el-input v-model="redpacketForm.id"
                          placeholder="请输入准确红包ID"
                          @keyup.enter.native="searchForm()"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="红包名称：" prop="name">
                <el-input v-model="redpacketForm.name"
                          placeholder="请输入红包名称"
                          @keyup.enter.native="searchForm()"
                ></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" >
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span">
                <el-button type="primary"
                           icon="search"
                           @click="searchForm()"
                           v-if="searchBtnViable"
                >查询</el-button>
              </span>
              <span class="z-btn-span"><el-button @click="resetForm('redpacketForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <!-- 搜索结束 -->
    <div class="z-tool-bar" v-if="!comVisable">
      <span class="z-btn-span"><el-button type="primary" icon="plus"v-if="addBtnViable"@click="addRedpacket">新增</el-button></span>
    </div>
    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">
      <el-table-column
        type="selection"
        v-if="comVisable"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        label="ID"
        v-if="!comVisable"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="红包名称"
       >
      </el-table-column>
      <el-table-column
        prop="amount"
        :formatter="formatterAmount"
        label="金额(元)"
       >
      </el-table-column>
      <el-table-column
        prop="validLimit"
        label="有效期(天)"
       >
      </el-table-column>

      <el-table-column
        prop="productType"
        :formatter="formatterProductType"
        label="限投产品类型"
        width="170">
      </el-table-column>
      <el-table-column
        label="起投金额(元)"
        >
        <template scope="props" >
          <div class="table-line" >
            <ul>
              <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.minAmount/100}}</li>
            </ul>
          </div>
        </template>

      </el-table-column>
      <el-table-column
        label="投资产品最低期限(天)"
        >
        <template scope="props" >
          <div class="table-line" >
            <ul>
              <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.limit}}</li>
            </ul>

          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatterDate"
        width="200">
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
         v-if="!comVisable">
        <template scope="scope">
          <span> <el-button @click="editRedpacket(scope.row)"v-if="updateBtnViable" type="text">编辑</el-button></span>
          <span> <el-button @click="delRedpacket(scope.$index,scope.row)"v-if="delBtnViable"type="text">删除</el-button></span>
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
    <el-dialog title="提示" v-model="delDialogVisible" size="tiny" :show-close="false">
      <span>{{popMessage}} <em style="color: #ff4949;"v-if="dataIsNotDeleteVisable">此条数据不能删除</em></span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="delCancelBtn">取 消</el-button>
        <el-button type="primary" @click="delredpacketBtn" :disabled="delDisabled">确 定</el-button>
      </span>
    </el-dialog>


  </div>
</template>
<style lang="less" scoped>
  .table-line{
    width:100%;
    padding:0 18px ;
    li{
      /*background: red;*/
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
  import {$queryRedpacket, $delRedpacketById} from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'
  export default {
    props: ['comVisable'],
    data () {
      return {
        searchBtnViable: false,
        addBtnViable: false,
        updateBtnViable: false,
        delBtnViable: false,
        delDisabled: false,
        myComVisable: this.comVisable,
        dataIsNotDeleteVisable: false,
        popMessage: '',
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        updataDialogVisible: false,
        delDialogVisible: false,
        redpacketForm: {
          id: '',
          name: '',
          isDel: false
        },
        tableData: [],
        multipleSelection: [],
        currentId: 0,
        currentIndex: 0
      }
    },
    watch: {
      comVisable (val) {
        this.myComVisable = val
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
      this.getRedpacketList(this.pageNo, this.pageSize)
    },
    methods: {

      formatterRule (val) {
        return JSON.parse(val)
      },
      // 金额转换
      formatterAmount (val) {
        return TOOLS.fenToYuan(val.amount)
      },
      // 产品类型转换
      formatterProductType (val) {
        return TOOLS.valueToLabelListStr(TOOLS.fetchObj('commonObj').ProductType, JSON.parse(val.productType))
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
        TOOLS.log('this.tempMultipleSelection', TOOLS.getList())
        TOOLS.setList('multipleSelectionList', this.multipleSelection)

        this.$emit('childToFatherTransferEvent', val)
      },
      // 获取红包列表
      getRedpacketList (pageNo, pageSize) {
        let obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'id': this.redpacketForm.id,
          'name': this.redpacketForm.name,
          'isDel': this.redpacketForm.isDel
        }
        $queryRedpacket(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getRedpacketList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getRedpacketList(this.pageNo, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getRedpacketList(this.pageNo, this.pageSize)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //  新增红包
      addRedpacket () {
        TOOLS.clearProData()
        this.$router.push({name: 'EditRedpacket', params: {redpacketId: 0}})
      },
      // 编辑
      editRedpacket (row) {
        TOOLS.saveObj('redpacketObj', row)
        TOOLS.clearProData()
        this.$router.push({name: 'EditRedpacket', params: {redpacketId: row.id}})
      },
      // 删除
      delRedpacket (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
        this.popMessage = '确定要删除选择的数据？'
      },
      // 删除确定按钮
      delredpacketBtn () {
        this.delDisabled = false
        this.dataIsNotDeleteVisable = false
        $delRedpacketById(this.currentId, res => {
          if (res.success) {
            this.tableData.splice(this.currentIndex, 1)
            this.delDisabled = false
            this.delDialogVisible = false
            this.getRedpacketList(this.pageNo, this.pageSize)
          } else {
            this.delDisabled = true
            this.dataIsNotDeleteVisable = true
            this.popMessage = res.resultMsg
            this.delDialogVisible = true
          }
        })
      },
      // 删除放弃按钮
      delCancelBtn () {
        this.delDisabled = false
        this.delDialogVisible = false
        this.dataIsNotDeleteVisable = false
      }
    }
  }
</script>
