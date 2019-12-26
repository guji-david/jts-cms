<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form :model="activityForm" label-width="120px"  ref="activityForm">
        <el-row>
          <el-col :span="8">
            <el-form-item label="名称：" prop="name">
              <el-input v-model.trim="activityForm.name" placeholder="请输入活动名称" @keyup.enter.native="searchForm()"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="类型：" prop="type">
              <el-select  name="type"v-model="activityForm.type">
                <el-option v-for="x in activityTypeOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="开始时间：" prop="onlineTime">
              <el-date-picker
                v-model="activityForm.onlineTime"
                type="daterange"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="结束时间：" prop="offlineTime">
              <el-date-picker
                v-model="activityForm.offlineTime"
                type="daterange"
                placeholder="选择日期"
                >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态：" prop="activityStatus">
              <el-select name="type"v-model="activityForm.activityStatus">
                <el-option v-for="x in activityStatusOptions" :value="x.value" :label="x.label" ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span">
                <el-button type="primary" icon="search"@click="searchForm()"v-if="searchBtnViable">查询</el-button>
              </span>
              <span class="z-btn-span"><el-button @click="resetForm('activityForm')">重置</el-button> </span>
            </div>
          </el-col>
        </el-row>

      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!-- 工具栏开始 -->
    <div class="z-tool-bar">
      <span class="z-btn-span"><el-button type="default" icon="plus" @click="addActivity" v-if="addBtnViable">新增活动</el-button></span>
    </div>
    <!-- 工具栏结束 -->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        >
      </el-table-column>
      <el-table-column
        prop="type"
        :formatter="formatterActivityType"
        label="类型"
       >
      </el-table-column>
      <el-table-column
        prop="onlineTime"
        label="开始时间"
        :formatter="formatterDateOnlineTime"
        >
      </el-table-column>
      <el-table-column
        prop="offlineTime"
        label="结束时间"
        :formatter="formatterDateOfflineTime"
        >
      </el-table-column>
      <el-table-column
        prop="productScope "
        :formatter="formatterProductType"
        label="支持项目类型"
      >
      </el-table-column>
      <el-table-column
        :formatter="formatterOSName"
        label="推广平台"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="上架时间"
        :formatter="formatterDateShelfTime"
        >
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatterDateCreateTime"
        >
      </el-table-column>
      <el-table-column
        prop="activityStatus"
        label="状态"
        :formatter="formatterActivityStatus"
        >
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
       >
        <template scope="scope">
          <div id="cellActivity">
            <el-button @click="editActivity(scope.row)"type="text" v-if="updateBtnViable">编辑</el-button>
            <el-button @click="delActivity(scope.$index,scope.row)"type="text" v-if="delBtnViable">删除</el-button>
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
        <el-button type="primary" @click="delActivityBtn" :disabled="delDisabled">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scope>
  .el-date-editor--daterange.el-input {
    width: 100%;
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
        updateBtnViable: false,
        delBtnViable: false,
        delDisabled: false,
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        currentPage: 1,
        totalCount: 0,
        updataDialogVisible: false,
        delDialogVisible: false,
        activityForm: {
          name: '',
          onlineTime: [],
          offlineTime: [],
          activityStatus: '',
          type: ''
        },
        activityTypeOptions: TOOLS.fetchObj('commonObj').ActivityType, // 活动类型
        activityStatusOptions: TOOLS.fetchObj('commonObj').ActivityStatus, // 活动状态
        productTypeOptions: TOOLS.fetchObj('commonObj').ProductType, // 产品类型
        OSNameOptions: TOOLS.fetchObj('commonObj').OSName, // 平台类型
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
          if (this.getFunctionList[i].label === '编辑') {
            this.updateBtnViable = true
          }
          if (this.getFunctionList[i].label === '删除') {
            this.delBtnViable = true
          }
        }
      }
      this.getActivityList(this.pageNo, this.pageSize)
    },
    methods: {
      // 活动类型转换
      formatterActivityType (val) {
        return TOOLS.valueToLabel(this.activityTypeOptions, val.type)
      },
      // 产品类型转换
      formatterProductType (val) {
        return TOOLS.valueToLabelListStr(TOOLS.fetchObj('commonObj').ProductType, JSON.parse(val.productScope))
      },
      // 状态转换
      formatterActivityStatus (val) {
        return TOOLS.valueToLabel(this.activityStatusOptions, val.activityStatus)
      },
      // 推广平台转换
      formatterOSName (val) {
        let OSNameList = []
        if (val.isShowApp === 'true') {
          OSNameList.push('App')
        }
        if (val.isShowPc === 'true') {
          OSNameList.push('Pc')
        }
        if (val.isShowWechat === 'true') {
          OSNameList.push('h5')
        }
        return OSNameList.toString()
      },
      // 格式化日期-开始时间
      formatterDateOnlineTime (val) {
        return TOOLS.normalTime(val.onlineTime)
      },
      // 格式化日期-结束时间
      formatterDateOfflineTime (val) {
        return TOOLS.normalTime(val.offlineTime)
      },
      // 格式化日期-上架时间
      formatterDateShelfTime (val) {
        return TOOLS.normalTime(val.shelfTime)
      },
      // 格式化日期-创建时间
      formatterDateCreateTime (val) {
        return TOOLS.normalTime(val.createTime)
      },
      // 获取活动列表
      getActivityList (pageNo, pageSize) {
        var obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'name': this.activityForm.name,
          'activityStatus': [this.activityForm.activityStatus],
          'onlineTimeE': '',
          'onlineTimeS': '',
          'offlineTimeE': '',
          'offlineTimeS': '',
          'type': this.activityForm.type
        }
        if (this.activityForm.onlineTime.length) {
          if (this.activityForm.onlineTime[0] && this.activityForm.onlineTime[1]) {
            obj.onlineTimeS = +this.activityForm.onlineTime[0]
            obj.onlineTimeE = +this.activityForm.onlineTime[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            obj.onlineTimeS = ''
            obj.onlineTimeE = ''
          }
        } else {
          obj.onlineTimeS = ''
          obj.onlineTimeE = ''
        }
        if (this.activityForm.offlineTime.length) {
          if (this.activityForm.offlineTime[0] && this.activityForm.offlineTime[1]) {
            obj.offlineTimeS = this.activityForm.offlineTime[0].getTime()
            obj.offlineTimeE = this.activityForm.offlineTime[1].getTime() + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            obj.offlineTimeS = ''
            obj.offlineTimeE = ''
          }
        } else {
          obj.offlineTimeS = ''
          obj.offlineTimeE = ''
        }
        API.$queryActivity(obj, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getActivityList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getActivityList(this.pageNo, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getActivityList(this.pageNo, this.pageSize)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      //  新增活动
      addActivity () {
        TOOLS.clearProData()
        this.$router.push({name: 'AddActivityInfo', params: { activityId: 0 }})
      },
      // 编辑
      editActivity (row) {
        TOOLS.clearProData()
        this.$router.push({name: 'AddActivityInfo', params: { activityId: row.id }})
        /* TOOLS.clearProData();
          if(row.activityStatus=='init'){
            this.$router.push({ name: 'AddActivityInfo', params: { activityId: row.id }})
          }else{
            this.$router.push({ name: 'EditActivityInfo', params: { activityId: row.id,activityStatus:row.activityStatus}})
          } */
      },
      // 删除
      delActivity (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
      },
      // 删除确定按钮
      delActivityBtn () {
        this.delDisabled = true
        API.$delActivityById(this.currentId, res => {
          this.delDisabled = false
          this.tableData.splice(this.currentIndex, 1)
          this.delDialogVisible = false
          this.getActivityList(this.pageNo, this.pageSize)
        })
      }
    }
  }
</script>
