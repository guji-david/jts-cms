<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div><h2>网站公告信息列表</h2></div>
    <div class="z-search-box">
      <el-form :model="noticeForm" label-width="120px"  ref="noticeForm">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="发布时间：" prop="publishTime">
                <el-date-picker
                  v-model="noticeForm.publishTime"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="z-span-20">
              <el-form-item label="标题：" prop="topic">
                <el-input v-model="noticeForm.topic"
                          placeholder=""></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="z-span-20">
              <el-form-item label="类型：" prop="types">
                <el-select topic="status" v-model="noticeForm.types">
                  <el-option v-for="x in stateType" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <!--<el-col :span="4">-->
            <!--<div class="z-span-20">-->
              <!--<el-form-item label="发布平台类型：" prop="platformType">-->
                <!--<el-select topic="status" v-model="noticeForm.platformType">-->
                  <!--<el-option v-for="x in plate" :value="x.value" :label="x.label"></el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
            <!--</div>-->
          <!--</el-col>-->
          <el-col :span="6">
            <div class="z-span-20">
              <el-form-item label="发布状态：" prop="publishStatus">
                <el-select topic="status" v-model="noticeForm.publishStatus">
                  <el-option v-for="x in status" :value="x.value" :label="x.label"></el-option>
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
              <span class="z-btn-span"><el-button @click="resetForm('noticeForm')">重置</el-button> </span>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"><el-button type="primary" icon="plus"@click="addAndUpdateAd('0')" v-if="disabledArray[0] === 'true'">新增</el-button></span>
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
        width="280">
      </el-table-column>
      <el-table-column
        prop="types"
        label="类别"
        :formatter="formatterType"
        width="220">
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="platformType"-->
        <!--label="发布平台类型"-->
        <!--:formatter="formatterPlate"-->
        <!--width="200">-->
      <!--</el-table-column>-->
      <el-table-column
        prop="views"
        label="浏览数"
        width="200">
      </el-table-column>
      <el-table-column
        prop="publishStatus"
        label="发布状态"
        :formatter="formatterPublishStatus"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="发布时间"
        :formatter="formatterDate"
        width="270">
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="id"
        label="操作"
        width="220">
        <template scope="scope">
          <el-row >
            <span> <el-button @click="addAndUpdateAd(scope.row.id)" type="text" v-if="disabledArray[1] === 'true'">修改</el-button></span>
            <span> <el-button @click="delNotice(scope.$index,scope.row)"type="text" v-if="disabledArray[3] === 'true'">删除</el-button></span>
            <span v-if="scope.row.isTop=='true'"> <el-button @click="toggleTotop(scope.row)"type="text" v-if="disabledArray[4] === 'true'">取消置顶</el-button></span>
            <span v-else> <el-button @click="toggleTotop(scope.row)"type="text" v-if="disabledArray[4] === 'true'">置顶</el-button></span>
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
    border-bottom: none;//
  }

  }

</style>
<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import {$searchNotice, $delNotice, $noticeTop} from '../../../../store/api'
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
        noticeForm: {
          publishTime: '',
          topic: '',
          isTop: '',
          types: '',
          platformType: '',
          publishStatus: '',
          endPublishTime: '',
          startPublishTime: ''
        },
        stateType: TOOLS.fetchObj('commonObj').BulletinTypes,
        plate: TOOLS.fetchObj('commonObj').Platform,
        status: [
          {value: 'isUse', label: '发布'},
          {value: 'noUse', label: '暂不发布'},
          {value: '', label: '全部'}
        ],
        tableData: [],
        currentId: 0,
        currentIndex: 0,
        disabledArray: []// 权限控制\1/新增,2/修改,3/查询,4/删除,5/取消置顶/置顶
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
            case '新增':
              this.disabledArray[0] = 'true'
              break
            case '修改':
              this.disabledArray[1] = 'true'
              break
            case '查询':
              this.disabledArray[2] = 'true'
              break
            case '删除':
              this.disabledArray[3] = 'true'
              break
            case '取消置顶/置顶':
              this.disabledArray[4] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getNoticeList(this.pageNo, this.pageSize)
    },
    methods: {
      // 类型转换
      formatterPlate (val) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').Platform, val.platformType)
      },
      //      状态文字转换
      formatterType (val) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').BulletinTypes, val.types)
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
      // 获取列表
      getNoticeList (pageNo, pageSize) {
        if (this.noticeForm.publishTime.length) {
          if (this.noticeForm.publishTime[0] && this.noticeForm.publishTime[1]) {
            this.noticeForm.startPublishTime = this.noticeForm.publishTime[0].getTime()
            this.noticeForm.endPublishTime = this.noticeForm.publishTime[1].getTime() + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.noticeForm.startPublishTime = ''
            this.noticeForm.endPublishTime = ''
          }
        } else {
          this.noticeForm.startPublishTime = ''
          this.noticeForm.endPublishTime = ''
        }
        let obj = {
          'pageNo': pageNo,
          'pageSize': pageSize,
          'topic': this.noticeForm.topic,
          'isTop': this.noticeForm.isTop,
          'platformType': this.noticeForm.platformType,
          'types': this.noticeForm.types,
          'publishStatus': this.noticeForm.publishStatus,
          'endPublishTime': this.noticeForm.endPublishTime,
          'startPublishTime': this.noticeForm.startPublishTime
        }
        $searchNotice(obj, res => {
          this.tableData = res.list

          this.totalCount = res.totalCount
        })
      },
      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getNoticeList(this.pageNo, this.pageSize)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.pageNo = val
        this.getNoticeList(this.pageNo, this.pageSize)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getNoticeList(this.pageNo, this.pageSize)
      },
      resetForm (formtopic) {
        this.$refs[formtopic].resetFields()
      },
      //  新增和修改广告位
      addAndUpdateAd (id) {
        TOOLS.clearProData()
        this.$router.push({name: 'EditNotice', params: {noticeId: id}})
      },
      // 是否置顶
      toggleTotop (row) {
        $noticeTop(row.id, res => {
          this.getNoticeList(this.pageNo, this.pageSize)
        })
      },
      // 删除
      delNotice (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        this.delDialogVisible = true
      },
      // 删除确定按钮
      dodelAd () {
        $delNotice(this.currentId, res => {
          this.tableData.splice(this.currentIndex, 1)
          this.delDialogVisible = false
        })
      }
    }
  }
</script>
