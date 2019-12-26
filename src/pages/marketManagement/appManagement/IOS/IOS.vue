<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="IOSForm" label-width="120px"  ref="IOSForm">
        <el-row>

          <el-col :span="8">
            <el-form-item label="版本号：" prop="version">
              <el-input v-model.trim="IOSForm.version" placeholder="请输入IOS版本名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="强制升级：" prop="isUpdate">
              <el-select name="type"v-model="IOSForm.isUpdate">
                <el-option v-for="x in isUpdateOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"><el-button type="primary" icon="search"@click="searchForm()"v-if="disabledArray[0]">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('IOSForm')">重置</el-button> </span>
            </div>

          </el-col>

        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="plus" @click="addIOS" v-if="disabledArray[1]">新增</el-button></span>
    </div>
    <!-- 工具栏结束 -->
    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">

      <el-table-column
        prop="version"
        label="当前版本号"
        >
      </el-table-column>
      <el-table-column
        prop="isUpdate"
        label="是否强制升级"
        :formatter="formatterIsUpdate"
        >
      </el-table-column>
      <el-table-column
        prop="updateVersion"
        label="强制升级版本"
        >
      </el-table-column>
      <el-table-column
        prop="isValid"
        :formatter="formatterIsValid"
        label="状态"
      >
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="创建时间"
        :formatter="formatterDate"
        >
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
       >
        <template scope="scope">
          <div id="cellIOS">
            <el-button @click="editIOS(scope.row)"type="text" v-if="disabledArray[2]">预览</el-button>
            <el-button @click="delIOS(scope.$index,scope.row)"type="text" v-if="disabledArray[3]">删除</el-button>
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

    <!-- 删除的时候提示 -->
    <el-dialog title="提示" v-model="delDialogVisible" size="tiny">
      <span>确定要删除选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delIOSBtn" :disabled="delDisabled">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 预览详情 -->
    <el-dialog title="预览" v-model="preDialogVisible" size="tiny">
      <div >
        <el-form  :model="IOSObj" label-width="160px" ref="IOSObj">
          <el-form-item label="当前版本号：">
            <span>{{IOSObj.version}}</span>
          </el-form-item>
          <el-form-item label="当前版本描述：" >
            <span>{{IOSObj.content}}</span>
          </el-form-item>
          <el-form-item label="是否强制升级：">
            <span>{{IOSObj.isUpdate}}</span>
          </el-form-item>


          <div style="text-align: center">

            <el-button type="primary" @click="saveForm(IOSObj.isValid)">{{confirmText}}</el-button>
            <el-button type="primary" @click="preDialogVisible=false" :plain="true" >取消</el-button>

          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        disabledArray: [],// 权限控制
        delDisabled: false,
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        delDialogVisible: false,
        preDialogVisible: false,
        isValidDisabled: false,
        confirmText:'',
        IOSForm: {
          version: '',
          isUpdate: ''
        },
        tableData: [],
        currentId: 0,
        currentIndex: 0,
        isUpdateOptions:[
          {label: '是', value: 'true'},
          {label: '否', value: 'false'}
        ],
        isValidOptions:[
          {label: '无效', value: '10'},
          {label: '有效', value: '20'}
        ],
        IOSObj:{}
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
            this.disabledArray[0] = true
          }
          if (this.getFunctionList[i].label === '新增') {
            this.disabledArray[1] = true
          }
          if (this.getFunctionList[i].label === '预览') {
            this.disabledArray[2] = true
          }
          if (this.getFunctionList[i].label === '删除') {
            this.disabledArray[3] = true
          }
        }
      }
      this.getTableList(this.pageNo, this.pageSize)
    },
    methods: {
      // 格式化日期
      formatterDate (row, column) {
        return TOOLS.normalTime( row[column.property])
      },
      //格式化是否强制更新
      formatterIsUpdate (row, column) {
        return TOOLS.valueToLabel(this.isUpdateOptions, row[column.property])

      },
      //格式化状态
      formatterIsValid (row, column) {
        return TOOLS.valueToLabel(this.isValidOptions, row[column.property])
      },

      // 获取IOS版本列表
      getTableList (pageNo, pageSize) {
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'version': this.IOSForm.version,
          'isUpdate': this.IOSForm.isUpdate
        }
        API.$iosPageQuery(obj, res => {
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
      //  新增IOS版本
      addIOS () {
        TOOLS.clearProData()
        this.$router.push({name: 'EditIOS', params: { iosId: 0 }})
      },
      // 预览
      editIOS (row) {
        this.preDialogVisible = true;
        this.currentId = row.id
        this.confirmText=row.isValid == 10?'启用':'确定';
        this.iosQueryById(this.currentId);
      },
      //通过id获取当前id的信息
      iosQueryById(id){
        API.$iosQueryById(id, res => {
          if (res.success) {
            this.IOSObj = res.data;
            this.IOSObj.isUpdate = TOOLS.valueToLabel(this.isUpdateOptions, this.IOSObj.isUpdate)

          } else {
            alert(res.resultMsg)
          }
        })
      },
      //启用
      saveForm(isValid){
        if(isValid==10){
          this.isValidDisabled=false;
          API.$iosUpdate(this.currentId, res => {
            if (res.success) {
              setTimeout(() => {
                this.getTableList(this.pageNo, this.pageSize);
                this.isValidDisabled=false;
                this.preDialogVisible=false;
              }, 1000)
            } else {
              this.isValidDisabled=false;
              this.preDialogVisible=false;
              alert(res.resultMsg)
            }
          })
        }else{
          this.preDialogVisible=false;
        }
      },
      // 删除
      delIOS (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
      },
      // 删除确定按钮
      delIOSBtn () {
        this.delDisabled = true
        API.$iosDel(this.currentId, res => {
          this.delDisabled = false
          this.tableData.splice(this.currentIndex, 1)
          this.delDialogVisible = false
          this.getTableList(this.pageNo, this.pageSize)
        })
      }
    }
  }
</script>
