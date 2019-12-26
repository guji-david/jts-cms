<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div><h2>新闻资讯数据信息列表</h2></div>
    <div class="z-search-box">
      <el-form :model="adForm" label-width="120px" ref="adForm">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="报道日期："prop="reportDate">
                <el-date-picker
                  v-model="adForm.reportDate"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="z-span-20">
              <el-form-item label="标题：" prop="topic">
                <el-input v-model="adForm.topic"
                          placeholder=""></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="z-span-20">
              <el-form-item label="分类：" prop="types">
                <el-select name="status" v-model="adForm.types">
                  <el-option v-for="x in newsTypeOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="z-span-20">
              <el-form-item label="发布状态：" prop="publishStatus">
                <el-select name="publishStatus" v-model="adForm.publishStatus">
                  <el-option v-for="x in stateType" :value="x.value" :label="x.label"></el-option>
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
                           v-if="disabledArray[2] === 'true'"
                >查询</el-button>
              </span>
              <span class="z-btn-span"><el-button @click="resetForm('adForm')">重置</el-button> </span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"><el-button type="primary" icon="plus" @click="addAndUpateAd('0')" v-if="disabledArray[0] === 'true'">新增</el-button></span>
            </div>
          </el-col>

        </el-row>

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
        >
      </el-table-column>
      <el-table-column
        prop="types"
        label="类别"
        :formatter="formatterTypes"
       >
      </el-table-column>
      <el-table-column
        prop="views"
        label="浏览数"
       >
      </el-table-column>
      <el-table-column
        prop="publishStatus"
        label="发布状态"
        :formatter="formatterPublishStatus"
        >

      </el-table-column>
      <el-table-column
        prop="recommended"
        :formatter="formatterIfTop"
        label="是否推荐"
        >
      </el-table-column>
      <el-table-column
        prop="reportDate"
        label="报道时间"
        :formatter="formatterDate"
        >
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
        width="220px"
       >
        <template scope="scope">
          <el-row >
            <span> <el-button @click="addAndUpateAd(scope.row.id)" type="text" v-if="disabledArray[3] === 'true'">修改</el-button></span>
            <span> <el-button @click="delAd(scope.$index,scope.row)"type="text" v-if="disabledArray[1] === 'true'">删除</el-button></span>
            <span v-if="scope.row.recommended=='1'"> <el-button :disabled="(scope.row.id==activeId)&&statusDisabled" @click="toggleRecommend(scope.row)"type="text" v-if="disabledArray[4] === 'true'">不推荐</el-button></span>
            <span v-else> <el-button :disabled="(scope.row.id==activeId)&&statusDisabled" @click="toggleRecommend(scope.row)"type="text" v-if="disabledArray[4] === 'true'">推荐</el-button></span>
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

    <!-- 删除的时候提示 -->
    <el-dialog title="提示" v-model="delDialogVisible" size="tiny">
      <span>确定要删除选择的数据？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dodelAd">确 定</el-button>
      </span>
    </el-dialog>


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
        newsRecommendedOptions: [
          {'label': '否', 'value': '0'},
          {'label': '是', 'value': '1'}],
        adForm: {
          reportDate: [],
          topic: '',
          types: '',
          publishStatus: '',
          endReportDate: '',
          startReportDate: ''

        },
        stateType: [
          {value: 'isUse', label: '发布'},
          {value: 'noUse', label: '暂不发布'},
          {value: '', label: '全部'}
        ],
        newsTypeOptions: [{value: '', label: '全部'}],
        tableData: [],
        currentId: 0,
        currentIndex: 0,
        disabledArray: [], // 权限控制\1/新增,2/删除,3/查询,4/编辑,5/不推荐/推荐
        statusDisabled: false,
        activeId: -1
      }
    },
    components: {
      breadcrumbNav
    },
    computed: {
      list () {
        return []
      },
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
            case '新增':
              this.disabledArray[0] = 'true'
              break
            case '删除':
              this.disabledArray[1] = 'true'
              break
            case '查询':
              this.disabledArray[2] = 'true'
              break
            case '编辑':
              this.disabledArray[3] = 'true'
              break
            case '不推荐/推荐':
              this.disabledArray[4] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getNewsCategoryOptions()
      this.getNewsList(this.pageNo, this.pageSize)
    },

    methods: {
      getNewsCategoryOptions () {
        API.$getNewsCategoryOptions(res => {
          var tempList = res.data
          if (tempList.length > 0) {
            for (let item of tempList) {
              this.newsTypeOptions.push({value: item.type, label: item.name})
            }
            TOOLS.setList('newsTypeOptions', this.newsTypeOptions)
          }
        })
      },
      formatterTypes (val) {
        return TOOLS.valueToLabel(this.newsTypeOptions, val.types)
      },
      formatterIfTop (val) {
        return TOOLS.valueToLabel(this.newsRecommendedOptions, val.recommended)
      },
      formatterPublishStatus (val) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').PublishStatus, val.publishStatus)
      },

      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.reportDate)
      },

      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      // 获取列表
      getNewsList (pageNo, pageSize) {
        if (this.adForm.reportDate.length) {
          if (this.adForm.reportDate[0] && this.adForm.reportDate[1]) {
            this.adForm.startReportDate = this.adForm.reportDate[0].getTime()
            this.adForm.endReportDate = this.adForm.reportDate[1].getTime() + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.adForm.startReportDate = ''
            this.adForm.endReportDate = ''
          }
        } else {
          this.adForm.startReportDate = ''
          this.adForm.endReportDate = ''
        }
        let obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'topic': this.adForm.topic,
          'types': this.adForm.types,
          'publishStatus': this.adForm.publishStatus,
          'endReportDate': this.adForm.endReportDate,
          'startReportDate': this.adForm.startReportDate
        }
        API.$searchNews(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getNewsList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getNewsList(this.pageNo, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getNewsList(this.pageNo, this.pageSize)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //  新增和修改广告位
      addAndUpateAd (id) {
        TOOLS.clearProData()
        this.$router.push({name: 'EditNews', params: {newsId: id}})
      },
      // 切换是否推荐
      toggleRecommend (row) {
        let recommendedToStatus = row.recommended ? 10 : 20
        this.activeId = row.id
        this.statusDisabled = true
        API.$changeNews(row.id, recommendedToStatus, res => {
          let _this = this
          setTimeout(function () {
            _this.statusDisabled = false
            _this.getNewsList(_this.pageNo, _this.pageSize)
          }, 100)
        })
      },
      // 删除
      delAd (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
      },
      // 删除确定按钮
      dodelAd () {
        API.$delNews(this.currentId, res => {
          this.tableData.splice(this.currentIndex, 1)
          this.delDialogVisible = false
        })
      }
    }
  }
</script>
