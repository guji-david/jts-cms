<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div><h2>广告位管理</h2></div>
    <div class="z-search-box">
      <el-form :model="adForm" label-width="120px"  ref="adForm">
        <el-row>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="广告名称：" prop="name">
                <el-input v-model="adForm.name"
                          placeholder=""></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="z-span-20">
              <el-form-item label="平台：" prop="platform">
                <el-select name="status" v-model="adForm.platform">
                  <el-option v-for="x in plate" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="z-span-20">
              <el-form-item label="位置：" prop="channel">
                <el-select name="status" v-model="adForm.channel">
                  <el-option v-for="x in ActivityType" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="z-span-20">
              <el-form-item label="状态：" prop="dataStatus">
                <el-select name="status" v-model="adForm.dataStatus">
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
                           v-if="disabledArray[0] === 'true'"
                >查询</el-button>
              </span>
              <span class="z-btn-span"><el-button @click="resetForm('adForm')">重置</el-button> </span>
              <!--<span class="z-btn-span"><el-button type="primary" icon="plus"@click="addAd('0')">新增</el-button></span>-->
            </div>
          </el-col>
          <el-col :span="4">
            <div class="z-span-20" style="padding-left:20px">
              <span class="z-btn-span"><el-button type="primary" icon="plus"@click="addAd('0')"  v-if="disabledArray[1] === 'true'">新增</el-button></span>
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
        prop="name"
        label="名称"
        width="170">
      </el-table-column>
      <el-table-column
        prop="platform"
        label="平台"
        width="200">
      </el-table-column>
      <el-table-column
        prop="channel"
        label="位置"
        :formatter="formatterChannel"
        width="200">
      </el-table-column>

      <el-table-column
        prop="clicks"
        label="点击次数"
        width="200">
      </el-table-column>
      <el-table-column
        prop="dataStatus"
        label="状态"
        :formatter="formatterStatus"
        width="200">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        :formatter="formatterDate"
        width="240">
      </el-table-column>
      <el-table-column
        fixed="right"
        prop="id"
        label="操作"
        width="200">

        <template scope="scope">
          <el-row >
            <span> <el-button @click="addAd(scope.row.id)" type="text"  v-if="disabledArray[2] === 'true'">修改</el-button></span>
            <span> <el-button @click="delAd(scope.$index,scope.row)"type="text"  v-if="disabledArray[3] === 'true'">删除</el-button></span>
            <span v-if="scope.row.dataStatus=='invalid' && disabledArray[4] === 'true'"> <el-button @click="change(scope.row,'valid')"type="text">启用</el-button></span>
            <span v-if="scope.row.dataStatus=='valid' && disabledArray[4] === 'true'"> <el-button @click="change(scope.row,'invalid')"type="text">停用</el-button></span>
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
        <el-button type="primary" @click="dodelAd" :disabled="deldisabled">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" v-model="noDelDialogVisible" size="tiny" :show-close="false">
      <span style="color: #FF4949">启用状态下数据不能删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="noDelDialogVisible=false">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 对话框 -->
    <el-dialog title="提示" v-model="dialogVisible" size="tiny">
      <span >{{msg}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeBtn">确 定</el-button>
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
  import {$searchAd, $delAd, $changeAd} from '../../../../store/api'
  import * as TOOLS from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        breadcrumName: '',
        pageNo: 1,
        pageSize: 5,
        deldisabled: false,
        popMessage: '',
        currentPage: 1,
        totalCount: 0,
        updataDialogVisible: false,
        delDialogVisible: false,
        noDelDialogVisible: false,
        dialogVisible: false,
        adForm: {
          name: '',
          channel: '',
          platform: '',
          dataStatus: ''
        },
        stateType: [
          {
            value: 'valid',
            label: '启用'
          },
          {
            value: 'invalid',
            label: '停用'
          },
          {
            value: '',
            label: '全部'
          }
        ],
        ActivityType: TOOLS.fetchObj('commonObj').AdvertiseChannelType,
        plate: TOOLS.fetchObj('commonObj').Platform,
        tableData: [],
        currentId: 0,
        currentIndex: 0,
        disabledArray: [], // 权限控制\1/查询,2/新增,3/编辑,4/删除,5/启用/停用
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
            case '新增':
              this.disabledArray[1] = 'true'
              break
            case '编辑':
              this.disabledArray[2] = 'true'
              break
            case '删除':
              this.disabledArray[3] = 'true'
              break
            case '启用/停用':
              this.disabledArray[4] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.getAdList(this.pageNo, this.pageSize, this.adForm.name, this.adForm.platform, this.adForm.channel, this.adForm.status)
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 类型转换
      formatterChannel (val) {
        return TOOLS.valueToLabel(TOOLS.fetchObj('commonObj').AdvertiseChannelType, val.channel)
      },
      // 状态文字转换
      formatterStatus (val) {
        return TOOLS.valueToLabel(this.stateType, val.dataStatus)
      },
      // 格式化日期
      formatterDate (val) {
        return TOOLS.normalTime(val.createTime)
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      handleSelectionChange (val) {
        this.multipleSelection = val
      },
      handleSizeChange (val) {
        TOOLS.log(`每页 ${val} 条`)
        this.pageSize = val
        this.getAdList(this.pageNo, this.pageSize, this.adForm.name, this.adForm.platform, this.adForm.channel, this.adForm.dataStatus)
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.getAdList(val, this.pageSize, this.adForm.name, this.adForm.platform, this.adForm.channel, this.adForm.dataStatus)
        TOOLS.log(`当前页: ${val}`)
      },
      // 搜索
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getAdList(this.pageNo, this.pageSize, this.adForm.name, this.adForm.platform, this.adForm.channel, this.adForm.dataStatus)
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 获取列表
      getAdList (pageNo, pageSize, name, platform, channel, status) {
        $searchAd(pageNo, pageSize, name, platform, channel, status, res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },

      //  新增广告位
      addAd (id) {
        TOOLS.clearProData()
        this.$router.push({name: 'EditAd', params: {adId: id}})
      },
      // 广告位启用/停用
      change (row, status) {
        this.msg = status === 'valid' ? '您确定 启用 此条广告' : '您确定 停用 此条广告？'
        this.activeId = row.id
        this.activeStatus = status
        this.dialogVisible = true
      },
      // 广告位启用/停用 二次确认
      changeBtn () {
        $changeAd(this.activeId, this.activeStatus, res => {
          this.dialogVisible = false
          this.getAdList(this.pageNo, this.pageSize, this.adForm.name, this.adForm.platform, this.adForm.channel, this.adForm.dataStatus)
        })
      },
      // 删除
      delAd (index, row) {
        this.currentIndex = index
        this.currentId = row.id
        console.log('row----->' + JSON.stringify(row))
        if (row.dataStatus === 'valid') {
          this.noDelDialogVisible = true
        } else {
          this.delDialogVisible = true
        }
      },
      // 删除确定按钮
      dodelAd () {
        $delAd(this.currentId, res => {
          this.tableData.splice(this.currentIndex, 1)
          this.delDialogVisible = false
        })
      }
    }
  }
</script>
