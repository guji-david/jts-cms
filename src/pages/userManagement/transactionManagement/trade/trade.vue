<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="tradeForm" :model="tradeForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="订单号：" prop="orderNo">
               <el-input name="number" v-model="tradeForm.orderNo" type="tel" placeholder="请输入订单号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="手机号：" prop="mobile">
               <el-input v-model="tradeForm.mobile"placeholder="请输入手机号" type="tel"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="tradeForm.name" placeholder="请输入姓名"type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="productName">
                <el-input name="proName" v-model="tradeForm.productName"placeholder="请输入项目名称" type="text"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目状态：" prop="productStatus">
                <el-select v-model="tradeForm.productStatus">
                  <el-option
                    v-for="x in productStatusOptions" :value="x.value" :label="x.label"
                    v-if="x.value != 'init' && x.value != 'flowFailure'"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="出借时间：" prop="queryDate">
                <el-date-picker
                  v-model="tradeForm.queryDate"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="出借状态：" prop="tradeStatus">
                <el-select name="type" v-model="tradeForm.tradeStatus">
                  <el-option v-for="x in tradeStatusOptions" :value="x.value" :label="x.label" v-if="x.value!='flow'"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
          <!--<el-col :span="8">-->
            <!--<div class="z-span-20">-->
              <!--<el-form-item label="是否流标：" prop="freezeStatus">-->
                <!--<el-select name="type" v-model="tradeForm.freezeStatus">-->
                  <!--<el-option v-for="x in TureOrFalseOptions" :value="x.value" :label="x.label" ></el-option>-->
                <!--</el-select>-->
              <!--</el-form-item>-->
            <!--</div>-->
          <!--</el-col>-->
          <el-col :span="16" >
            <div class="z-span-20" >
              <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
              <span class="z-btn-span"><el-button @click="resetForm('tradeForm')">重置</el-button></span>
            </div>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!-- 搜索结束 -->

    <!--工具栏开始-->
    <div class="z-tool-bar">
      <span class="z-btn-span" v-if="totalCount>0"><el-button type="default" icon="document" @click="download" v-if="disabledArray[1] === 'true'">下载</el-button></span>
    </div>
    <!--工具栏结束-->

    <!-- 列表开始 -->
    <el-table
      :data="tableData"
      type="expand"
      border
      style="width: 100%">
      <el-table-column
        prop="orderNo"
        label="订单号"
      >
      </el-table-column>
      <el-table-column
        label="手机号"
      >
        <template scope="scope">
          <div @click="toTelDetail(scope.row)" class="linkColor">{{scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="客户姓名"
      >
      </el-table-column>
      <el-table-column
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetail(scope.row)" class="detailSpan">{{scope.row.productName}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="productStatus"
        :formatter="formatterTenderStatus"
        label="项目状态"
      >
      </el-table-column>
      <el-table-column
        prop="amount"
        :formatter='moneyFormat'
        label="出借金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="payAmount"
        :formatter='moneyFormat'
        label="出借本金(元)"
      >
      </el-table-column>
      <el-table-column
        prop="packetAmount"
        :formatter='moneyFormat'
        label="红包金额(元)"
      >
      </el-table-column>
      <el-table-column
        prop="tenderTime"
        :formatter="dateFormat"
        label="出借时间"
      >
      </el-table-column>
      <el-table-column
        prop="tradeStatus"
        :formatter="formatterTradeTenderStatus"
        label="出借状态"
      >
      </el-table-column>
      <el-table-column
        prop="freezeNo"
        label="冻结流水号"
      >
      </el-table-column>
      <el-table-column
        prop="instSettleDate"
        :formatter="dateFormatDay"
        label="清算日期"
      >
      </el-table-column>
      <el-table-column
        prop="settlementFlag"
        :formatter="formatterTureOrFalse"
        label="是否占用未清算资金"
      >
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="isFlow"-->
        <!--:formatter="formatterTureOrFalse"-->
        <!--label="是否流标"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="loanTime"-->
        <!--:formatter="dateFormatDay"-->
        <!--label="流标时间"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <el-table-column
        prop="extension"
        label="备注"
      >
      </el-table-column>
    </el-table>
    <!-- 列表结束 -->

    <!-- 分页开始 -->
    <div class="z-pager" v-if="totalCount>0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10,20,40]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>
    <!-- 分页结束 -->

  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  export default {
    data () {
      return {
        breadcrumName: '',
        tradeStatusOptions: TOOL.fetchObj('commonObj').TradeTenderStatus,
        //        freezeStatusOptions:TOOL.fetchObj('commonObj').FreezeStatus,
        productStatusOptions: TOOL.fetchObj('commonObj').TenderStatusForConsole,
        TureOrFalseOptions: [
          {
            'label': '是',
            'value': 1
          },
          {
            'label': '否',
            'value': 0
          }
        ],
        TradeTenderStatus: [// 出借人状态流标也改为成功了
          {
            'label': '全部',
            'value': ''
          },
          {
            'label': '处理中',
            'value': 'init'
          },
          {
            'label': '投资失败',
            'value': 'fail'
          },
          {
            'label': '交易成功',
            'value': 'success'
          },
          {
            'label': '交易成功',
            'value': 'flow'
          }
        ],
        totalCount: 0,
        currentPage: 1,
        tradeForm: {
          orderNo: '',
          mobile: '',
          name: '',
          productName: '',
          productStatus: '',
          queryDate: [],
          tradeStatus: '',
          freezeStatus: '',
          queryDateEnd: '',
          queryDateStart: ''
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: []// 权限控制\1/查询,2/下载
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
          this.$store.commit('updataFunctionList', TOOL.getList('functionList'))
          return this.$store.state.functionList
        }
      }
    },
    beforeMount () {
      if (this.getFunctionList.length > 0) {
        let len = this.getFunctionList.length
        for (let i = 0; i < len; i++) {
          switch (this.getFunctionList[i].label) {
            case '查询':
              this.disabledArray[0] = 'true'
              break
            case '下载':
              this.disabledArray[1] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
    },
    methods: {
      // 跳转详情
      toTelDetail (row) {
        TOOL.clearProData()
        this.$router.push({name: 'AccountInfoDetail', params: { mobile: row.mobile }})
      },
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 金额转换
      moneyFormat (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },
      // 时间格式化
      dateFormat: function (row, column) {
        var date = row[column.property]
        return TOOL.normalTime(date)
      },
      // 时间格式化到日
      dateFormatDay: function (row, column) {
        let date = row[column.property]
        return TOOL.normalTimeDay(date)
      },
      // 出借状态
      formatterTradeTenderStatus (row, column) {
        return TOOL.valueToLabel(this.TradeTenderStatus, row[column.property])
      },
      // 项目状态
      formatterTenderStatus (row, column) {
        return TOOL.valueToLabel(this.productStatusOptions, row[column.property])
      },
      // 是否转换
      formatterTureOrFalse (row, column) {
        return TOOL.valueToLabel(this.TureOrFalseOptions, row[column.property])
      },
      // 查询
      searchForm () {
        this.pageNo = 1
        this.currentPage = 1
        this.getTablelist()
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
      },
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTablelist()
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTablelist()
        console.log(`当前页: ${this.pageNo}`)
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 跳转详情
      toDetail (row) {
        TOOL.clearProData()
        TOOL.clearBreadcrumName()
        if (row.productType === 'default') {
          this.$router.push({name: 'PublishDetail', params: {id: row.productId, type: 'default', breadcrumName: '详情'}})
        } else if (row.productType === 'bankPaper') {
          this.$router.push({name: 'BankPaperDetail', params: {id: row.productId, type: 'default', breadcrumName: '详情'}})
        } else if (row.productType === 'exportRebate') {
          this.$router.push({name: 'ExportRebateDetail', params: {id: row.productId, type: 'default', breadcrumName: '详情'}})
        } else if (row.productType === 'tbd') {
          this.$router.push({name: 'TBDPayProDetail', params: {id: row.productId, type: 'noloan'}})
        }
      },

      // 统一处理数据
      objFn () {
        if (this.tradeForm.queryDate.length) {
          if (this.tradeForm.queryDate[0] && this.tradeForm.queryDate[1]) {
            this.tradeForm.queryDateStart = +this.tradeForm.queryDate[0]
            this.tradeForm.queryDateEnd = +this.tradeForm.queryDate[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.tradeForm.queryDateStart = ''
            this.tradeForm.queryDateEnd = ''
          }
        } else {
          this.tradeForm.queryDateStart = ''
          this.tradeForm.queryDateEnd = ''
        }
        let obj = {
          orderNo: this.tradeForm.orderNo,
          mobile: this.tradeForm.mobile,
          name: this.tradeForm.name,
          productName: this.tradeForm.productName,
          productStatus: this.tradeForm.productStatus,
          tradeStatus: this.tradeForm.tradeStatus,
          freezeStatus: this.tradeForm.freezeStatus,
          queryDateEnd: this.tradeForm.queryDateEnd,
          queryDateStart: this.tradeForm.queryDateStart,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
        return obj
      },

      getTablelist () {
        API.$tradeRecord(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      download () {
        API.$downloadFile('tenderPageQuery', '/gateway/tradeTeder/getTenderExport', this.objFn())
      }
    }
  }
</script>

<style lang="less" scope>
  .linkColor{
    color:#FF9900;
    cursor: pointer;
  }
</style>
