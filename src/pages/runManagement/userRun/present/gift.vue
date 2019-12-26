<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="批次号：" prop="batchNo">
                <el-input name="number" v-model="form.batchNo" type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="礼品类型：" prop="type">
                <el-select name="" v-model="form.type">
                  <el-option v-for="x in option" :value="x.value" :label="x.label" :key="x.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="发放状态：" prop="sendStatus">
                <el-select name="status" v-model="form.sendStatus">
                  <el-option v-for="x in MessageSendStatusOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="发放原因：" prop="sendReason">
                <el-input name="number" v-model="form.sendReason" type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="z-span-20" >
              <el-form-item label=" " >
                <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
                <span class="z-btn-span"><el-button @click="resetForm('form')">重置</el-button></span>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar" >
      <span class="z-btn-span"><el-button type="default" icon="plus" @click="giftDetailADD" v-if="disabledArray[1] === 'true'">新增</el-button></span>
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      style="width: 100%">
      <el-table-column
        prop="batchNo"
        label="批次号"
      >
      </el-table-column>
      <el-table-column
        prop="type"
        :formatter="formatGiftType"
        label="礼品类型"
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="礼品名称"
      >
      </el-table-column>
      <el-table-column
        prop="userCount"
        label="发放人数"
      >
      </el-table-column>
      <el-table-column
        prop="sendAmount"
        label="每人发放个数"
      >
      </el-table-column>
      <el-table-column
        prop="sendTotal"
        label="应发数量"
      >
      </el-table-column>
      <el-table-column
        prop="sendReal"
        label="实发数量"
      >
      </el-table-column>
      <el-table-column
        prop="sendStatus"
        :formatter="sendStatusFomat"
        label="发放状态"
      >
      </el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="formatterDate"
        label="发放时间"
      >
      </el-table-column>
      <el-table-column
        prop="sendReason"
        label="发放原因"
      >
      </el-table-column>
      <el-table-column
        prop=""
        label="操作"
      >
        <template scope="scope">
          <el-button @click="giftDetailShow(scope.row)" type="text" v-if="disabledArray[2] === 'true'">详情</el-button>
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
        :page-sizes="[5,10,20,40]"
        :page-size="form.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页结束 -->

    <!--详情页-->
    <transition name="el-fade-in">
      <detailManual v-if="giftDetailSh[0]" :id="currentId" :type="detailType" :batchNo="batchNo"></detailManual>
    </transition>
    <!--详情结束-->

    <!--新增页-->
    <transition name="el-fade-in">
      <recordManual v-if="giftDetailA[0]"></recordManual>
    </transition>
    <!--新增页结束-->
  </div>
</template>

<style lang="less" scoped>
  @import "./gift.less";
</style>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import recordManual from './giftRecord/giftRecord.vue'
  import detailManual from './giftDetail/giftDetail.vue'
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'

  export default {
    data () {
      return {
        updataDialogVisible: false,
        DelDialogVisible: false,
        currentPage: 1,
        currentId: 0,
        detailType: '', // 详情信息类型
        batchNo: '', // 批次好
        totalCount: null,
        option: TOOL.fetchObj('commonObj').GiftType,
        //        giftType:TOOL.fetchObj('commonObj').GiftType,
        MessageSendStatusOptions: TOOL.fetchObj('commonObj').MessageSendStatus,
        form: {
          batchNo: '',
          type: '',
          sendStatus: '',
          sendReason: '',
          pageNo: 1,
          pageSize: 5,
          name: '',
          isDel: false
        },
        tableData: [],
        hidden: true,
        breadcrumName: '',
        disabledArray: []// 权限控制\1/查询2/新增3/详情
      }
    },
    components: {
      breadcrumbNav,
      recordManual,
      detailManual
    },
    computed: {
      giftDetailSh () { // 通过vuex控制详情页的显示
        return [
          this.$store.state.giftDetail
        ]
      },
      giftDetailA () { // 通过vuex控制新增页的显示
        return [
          this.$store.state.giftDetalAdd
        ]
      },
      getFunctionList () {
        if (this.$store.state.functionList.length > 0) {
          return this.$store.state.functionList
        } else {
          this.$store.commit('updataFunctionList', TOOL.getList('functionList'))
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
            case '详情':
              this.disabledArray[2] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
      this.ajaxList()
    },
    methods: {
      // 判断是红包还是加息劵
      formatGiftType (val) {
        return TOOL.formatGiftType(val.type)
      },
      // 时间转化
      formatterDate (val) {
        return TOOL.normalTime(val.createTime)
      },
      // 发送状态转化
      sendStatusFomat (row, column) {
        return TOOL.valueToLabel(this.MessageSendStatusOptions, row[column.property])
      },
      // 礼物查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTableList()
      },
      //      获取列表
      getTableList () {
        API.postRequest('/gateway/bizGift/queryBatch', TOOL.noEmety(this.form, this.form.pageSize, this.form.pageNo), res => {
          this.tableData = res.list// 对tableData赋值
          this.totalCount = res.totalCount
        })
      },
      // 弹出详情
      giftDetailShow (row) {
        this.currentId = row.id
        this.detailType = row.type
        this.batchNo = row.batchNo
        this.$store.commit('giftDetailShow')
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 新增
      giftDetailADD () {
      //        this.$store.commit('giftDetailAdd')
        this.$router.push({name: 'AddGift'})
      },
      // 分页
      handleSizeChange (val) {
        this.form.pageSize = val
        this.getTableList()
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.form.pageNo = val
        this.getTableList()
      },
      // 跳转编辑页
      toEditPage (index) {
        this.$router.push({name: 'DetailsPro', params: { borrowerId: index }})
      },
      //      首页展示请求
      ajaxList () {
        API.postRequest('/gateway/bizGift/queryBatch', {
          pageNo: this.form.pageNo,
          pageSize: this.form.pageSize,
          isDel: false
        }, res => {
          this.tableData = res.list// 对tableData赋值
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>
