<template>
  <div>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="adForm" label-width="120px" :rules="rules" ref="adForm">
        <el-col :span="4">
          <div class="z-span-20" style="padding-left:20px">
            <span class="z-btn-span"><el-button type="primary" icon="plus"@click="addAndUpdateQuestionClass('0')" v-if="disabledArray[0] === 'true'">新增问题分类</el-button></span>
          </div>
        </el-col>
      </el-form>
    </div>
    <!-- 搜索结束 -->
    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
      style="width: 100%">

      <el-table-column
        prop="name"
        label="分类名称"
        width="260">
      </el-table-column>
      <el-table-column
        prop="description"
        label="分类描述"
        width="260">
      </el-table-column>
      <el-table-column
        prop="seqnum"
        label="显示顺序"
        width="200">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="创建人"
        width="180">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatterDate"
        width="280">
      </el-table-column>

      <el-table-column
        fixed="right"
        prop="id"
        label="操作"
        width="200">
        <template scope="scope">
          <el-row >
            <span> <el-button @click="addAndUpdateQuestionClass(scope.row.id)" type="text" v-if="disabledArray[1] === 'true'">修改</el-button></span>
            <span> <el-button @click="delQuestionClass(scope.$index,scope.row)"type="text" v-if="disabledArray[2] === 'true'">删除</el-button></span>
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
    <!-- 搜索结束 -->


    <!--工具栏结束-->
    <!-- 删除的时候提示 -->
    <el-dialog title="提示" v-model="delDialogVisible" size="tiny">
      <span>确定要删除选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dodelQuestionClass">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import {$searchQuestionClass, $delQuestionClass} from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'
  export default {
    data () {
      return {
        activeName: 'first',
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        updataDialogVisible: false,
        delDialogVisible: false,
        queryDate: '',
        adForm: {
          name: '',
          channel: '',
          platform: '',
          status: '',
          queryDateEnd: '',
          queryDateStart: ''

        },
        rules: {
          name: [
            {min: 0, max: 20, message: '长度在20个字符以内', trigger: 'blur'}
          ]
        },
        stateType: TOOLS.fetchObj('commonObj').BulletinTypes,
        plateType: TOOLS.fetchObj('commonObj').BulletinPlatformType,
        status: TOOLS.fetchObj('commonObj').BulletinPublishStatus,
        tableData: [],
        currentId: 0,
        currentIndex: 0,
        disabledArray: []// 权限控制\1/问题分类—新增,2/问题分类—修改,3/问题分类—删除,4/问题分类—查询
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
            case '问题分类—新增':
              this.disabledArray[0] = 'true'
              break
            case '问题分类—修改':
              this.disabledArray[1] = 'true'
              break
            case '问题分类—删除':
              this.disabledArray[2] = 'true'
              break
            case '问题分类—查询':
              this.disabledArray[3] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }

      this.getQuestionClassList(this.pageNo, this.pageSize, this.adForm)
    },

    methods: {
      formatterPublishStatus (val) {
      //        return TOOLS.valueToLabel(TOOLS.fetchObj("commonObj").StatusType,val.dataStatus)
      },
      sendTimeChange (val) {
        this.adForm.queryDateEnd = new Date(val.split(' ')[2]).getTime()
        this.adForm.queryDateStart = new Date(val.split(' ')[0]).getTime()
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 获取列表
      getQuestionClassList (pageNo, pageSize, form) {
        $searchQuestionClass(pageNo, pageSize, form, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getQuestionClassList(this.pageNo, this.pageSize, this.adForm)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getQuestionClassList(val, this.pageSize, this.adForm)
        TOOLS.log(`当前页: ${val}`)
      },
      /* //搜索
      searchForm(formName){
          this.pageNo=1;
        this.currentPage = 1;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.getQuestionClassList(this.pageNo,this.pageSize,this.adForm);
          } else {
            TOOLS.log('error submit!!');
        return false;
      }
      })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }, */
      //  新增和修改问题分类
      addAndUpdateQuestionClass (id) {
        TOOLS.clearProData()
        this.$router.push({name: 'EditQuestionClass', params: {questionClassId: id}})
      },
      // 删除
      delQuestionClass (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
      },
      // 删除确定按钮
      dodelQuestionClass () {
        $delQuestionClass(this.currentId, res => {
          this.tableData.splice(this.currentIndex, 1)
          this.delDialogVisible = false
        })
      }
    }
  }
</script>

<style lang="less" scope>

</style>
