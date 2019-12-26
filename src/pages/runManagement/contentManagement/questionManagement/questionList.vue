<template>
  <div>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="form" label-width="120px" ref="form">
        <el-col :span="7">
          <div class="z-span-20">
            <el-form-item label="创建时间：" prop="createTime">
              <el-date-picker
                v-model="form.createTime"
                type="daterange"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="z-span-20">
            <el-form-item label="标题：" prop="topic">
              <el-input v-model="form.topic"
                        placeholder=""></el-input>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="z-span-20">
            <el-form-item label="问题分类：" prop="problemCategoryId">
              <el-select name="status" v-model="form.problemCategoryId">
                <el-option v-for="x in lists" :value="x.id" :label="x.name"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="z-span-20">
            <el-form-item label="发布状态：" prop="publishStatus">
              <el-select name="status" v-model="form.publishStatus">
                <el-option v-for="x in status" :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="7">
          <div class="z-span-20">
            <el-form-item label="热门问题：" prop="isHot">

              <el-select name="status" v-model="form.isHot">
                <el-option v-for="x in isHotList" :value="x.value" :label="x.label"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span">
                <el-button type="primary"
                           icon="search"
                           @click="searchForm()"
                           v-if="disabledArray[0] === 'true'"
                >查询</el-button>
              </span>
            <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button> </span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="z-span-20" style="padding-left:20px">
            <span class="z-btn-span"><el-button type="primary" icon="plus"@click="addAndUpdateQuestion('0')" v-if="disabledArray[1] === 'true'">新增问题</el-button></span>
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
        prop="topic"
        label="标题"
        width="170">
      </el-table-column>
      <el-table-column
        prop="name"
        label="问题分类"
        width="120">
      </el-table-column>
      <el-table-column
        prop="seqnum"
        label="显示顺序"
        width="100">
      </el-table-column>
      <el-table-column
        prop="isHot"
        label="热门问题"
        :formatter="formatterIf"
        width="100">

      </el-table-column>
      <el-table-column
        prop="hotSequence"
        label="热门顺序"
        width="100">
      </el-table-column>
      <el-table-column
        prop="clicks"
        label="问题点击次数"
        width="80">
      </el-table-column>
      <el-table-column
        prop="resolvingTime"
        label="解决次数"
        width="80">
      </el-table-column>
      <el-table-column
        prop="unresolvedTime"
        label="未解决次数"
        width="80">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        label="创建人"
        width="100">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatterDate"
        width="200">
      </el-table-column>
      <el-table-column
        prop="publishStatus"
        label="发布状态"
        :formatter="formatterPublishStatus"
        width="100">
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="id"
        label="操作"
        width="150">
        <template scope="scope">
          <el-row >
            <span> <el-button @click="addAndUpdateQuestion(scope.row.id)" type="text" v-if="disabledArray[3] === 'true'">修改</el-button></span>
            <span> <el-button @click="delQuestion(scope.$index,scope.row)"type="text" v-if="disabledArray[2] === 'true'">删除</el-button></span>
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

    <!--工具栏开始-->
    <!--<div class="z-tool-bar">-->
      <!--<span class="z-btn-span"><el-button type="default" icon="document" @click="">下载</el-button></span>-->
    <!--</div>-->
    <!--工具栏结束-->
    <!-- 删除的时候提示 -->
    <el-dialog title="提示" v-model="delDialogVisible" size="tiny">
      <span>确定要删除选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dodelQuestion">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import {$searchQuestion, $delQuestion, $questionClassList} from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'
  export default {
    data () {
      return {
        activeName: 'first',
        breadcrumName: '',
        pageNo: 1,
        lists: '',
        isHotList: [{
          value: 'true',
          label: '是'
        },
        {
          value: 'false',
          label: '否'
        },
        {
          value: '',
          label: '全部'
        }],
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        updataDialogVisible: false,
        delDialogVisible: false,
        form: {
          createTime: '',
          problemCategoryId: '',
          topic: '',
          publishStatus: '',
          isHot: '',
          createTimeEnd: '',
          createTimeStart: ''

        },
        stateType: TOOLS.fetchObj('commonObj').BulletinTypes,
        plateType: TOOLS.fetchObj('commonObj').BulletinPlatformType,
        status: [
          {value: 'isUse', label: '发布'},
          {value: 'noUse', label: '暂不发布'},
          {value: '', label: '全部'}
        ],
        tableData: [],
        currentId: 0,
        currentIndex: 0,
        disabledArray: []// 权限控制\1/问题内容—查询,2/问题内容—新增,3/问题内容—删除,4/问题内容—修改
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
            case '问题内容—查询':
              this.disabledArray[0] = 'true'
              break
            case '问题内容—新增':
              this.disabledArray[1] = 'true'
              break
            case '问题内容—删除':
              this.disabledArray[2] = 'true'
              break
            case '问题内容—修改':
              this.disabledArray[3] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }

      this.classList()
      this.getQuestionList(this.pageNo, this.pageSize, this.form)
    },

    methods: {
      formatterIf (val) {
        return TOOLS.valueToLabel(this.isHotList, val.isHot)
      },
      formatterPublishStatus (val) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').PublishStatus, val.publishStatus)
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      classList () {
        $questionClassList(res => {
          this.lists = res.data.lists
        })
      },
      // 获取列表
      getQuestionList (pageNo, pageSize) {
        if (this.form.createTime.length) {
          if (this.form.createTime[0] && this.form.createTime[1]) {
            this.form.createTimeStart = this.form.createTime[0].getTime()
            this.form.createTimeEnd = this.form.createTime[1].getTime() + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.createTimeStart = ''
            this.form.createTimeEnd = ''
          }
        } else {
          this.form.createTimeStart = ''
          this.form.createTimeEnd = ''
        }
        let obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'problemCategoryId': this.form.problemCategoryId,
          'topic': this.form.topic,
          'publishStatus': this.form.publishStatus,
          'isHot': this.form.isHot,
          'createTimeEnd': this.form.createTimeEnd,
          'createTimeStart': this.form.createTimeStart
        }
        $searchQuestion(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getQuestionList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getQuestionList(this.pageNo, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getQuestionList(this.pageNo, this.pageSize)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //  新增和修改问题
      addAndUpdateQuestion (id) {
        TOOLS.clearProData()
        this.$router.push({name: 'EditQuestion', params: {questionId: id}})
      },

      // 删除
      delQuestion (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
      },
      // 删除确定按钮
      dodelQuestion () {
        $delQuestion(this.currentId, res => {
          this.tableData.splice(this.currentIndex, 1)
          this.delDialogVisible = false
        })
      }
    }
  }
</script>

<style lang="less" scope>

</style>
