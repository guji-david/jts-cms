<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="bankForm" label-width="120px"  ref="bankForm">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="银行名称：" prop="name">
                <el-input v-model="bankForm.name"
                          placeholder="请输入银行名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="status">
                <el-select name="status" v-model="bankForm.status">
                  <el-option v-for="x in stateType" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div >
              <span class="z-btn-span"><el-button type="primary" icon="search"@click="searchForm()" v-if="disabledArray[0] === 'true'">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('bankForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
      <span  class="z-btn-span">
        <el-button type="default" icon="document":disabled="loadingDisabled" @click="loading" v-if="disabledArray[3] === 'true'">下载限额文件</el-button>
      </span>
    </div>
    <!-- 工具栏结束 -->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column
        prop="name"
        label="银行名称"
        >
      </el-table-column>
      <el-table-column
        prop="quotaSingle"
        :formatter="formatterQuotaSingle"
        label="单笔限额(元)"
        >
      </el-table-column>
      <el-table-column
        prop="quotaDaily"
        :formatter="formatterQuotaDaily"
        label="单日限额(元)"
        >
      </el-table-column>
      <el-table-column
        prop="status"
        label="状态"
        :formatter="formatterStatus"
       >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="支行信息最后更新时间"
        :formatter="formatterDate"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatterDate"
        >
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200">
        <template scope="scope">
          <el-row>
            <span v-if="scope.row.status==0"> <el-button @click="toggleChangeStatus(scope.row,1)" type="text" v-if="disabledArray[1] === 'true'">启用</el-button></span>
            <span v-if="scope.row.status==1"> <el-button @click="toggleChangeStatus(scope.row,0)"type="text" v-if="disabledArray[1] === 'true'">停用</el-button></span>
            <span> <el-button @click="updateBank(scope.row.id)" type="text" v-if="disabledArray[4] === 'true'">修改</el-button></span>
            <!--<span v-if="scope.row.status=='enable'"> <el-button @click="delbank(scope.$index,scope.row)" type="text" v-if="disabledArray[2] === 'true'">更新支行信息</el-button></span>
            <span v-else="scope.row.status!='enable'"> <el-button :disabled="true" type="text">更新支行信息中</el-button></span>-->
          </el-row>
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
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span >{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toggleChangeStatusBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 -->

  </div>
</template>
<style lang="less" scope>
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
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        updataDialogVisible: false,
        delDialogVisible: false,
        bankForm: {
          name: '',
          status: ''
        },
        stateType: [
          {
            label: '启用',
            value: 1
          },
          {
            label: '停用',
            value: 0
          }
        ],
        tableData: [],
        currentId: 0,
        currentIndex: 0,
        disabledArray: [], // 权限控制\1/查询,2/启用/停用,3/更新支行信息,4/下载限额文件,5/修改
        loadingDisabled: false,
        dialogVisible: false,
        msg: '',
        activeId: '',
        activeStatus: ''
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
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '启用/停用':
              this.disabledArray[1] = 'true'
              break
            case '更新支行信息':
              this.disabledArray[2] = 'true'
              break
            case '下载限额文件':
              this.disabledArray[3] = 'true'
              break
            case '修改':
              this.disabledArray[4] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getbankList()
    },

    methods: {
    //      单笔限额(元)转换
      formatterQuotaSingle (val) {
        return TOOLS.fenToYuan(val.quotaSingle)
      },
      //      单日限额(元)转换
      formatterQuotaDaily (val) {
        return TOOLS.fenToYuan(val.quotaDaily)
      },
      //      状态文字转换
      formatterStatus (val) {
        return TOOLS.valueToLabel(this.stateType, val.status)
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },

      // 获取列表
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getbankList()
      },
      getbankList () {
        API.$searchBankList(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getbankList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getbankList()
        TOOLS.log(`当前页: ${val}`)
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 增加和修改银行
      updateBank (id) {
        TOOLS.clearProData()
        this.$router.push({name: 'EditBank', params: { bankId: id }})
      },
      // 切换是否停用
      toggleChangeStatus (row, status) {
        this.activeId = row.id
        this.activeStatus = status
        this.msg = status ? '您确定 启用 此银行名称？' : '您确定 停用 此银行名称？'
        this.dialogVisible = true
      },
      //      切换是否停用 二次确认按钮
      toggleChangeStatusBtn () {
        API.$changeBankStatus(this.activeId, this.activeStatus, res => {
          this.dialogVisible = false
          this.getbankList()
        })
      },
      // 统一处理数据
      objFn () {
        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'name': this.bankForm.name,
          'status': this.bankForm.status
        }
        return obj
      },
      // 下载限额文件
      loading () {
        this.loadingDisabled = true
        API.$downloadFile('productRepayManagerPageQuery', '/gateway/bank/updateBankLimitation', this.objFn())
        var _this = this
        setTimeout(function () {
          _this.loadingDisabled = false
        }, 1000)
      },
      open1 () {
        this.$alert('请上传银行图片或完成更新支行信息操作', '启用银行失败', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      },
      open2 () {
        this.$alert('说明：由于更新时间较长，请耐心等候。', '银行支行信息更新中！', {
          confirmButtonText: '关闭',
          callback: action => {
          //            this.$message({
          //              type: 'info',
          //              message: `aion: ${ action }`
          //            });
          }
        })
      }
    }
  }
</script>
