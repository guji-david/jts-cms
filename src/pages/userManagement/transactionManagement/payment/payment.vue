<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <div class="z-search-box">
      <el-form ref="form" :model="form" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="平台流水号：" prop="orderNo">
                <el-input  v-model="form.orderNo"  type="tel" placeholder="请输入平台流水号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="手机号：" prop="mobile">
                <el-input  v-model="form.mobile" type="tel" placeholder="请输入手机号"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="姓名：" prop="name">
                <el-input v-model="form.name" type="text" placeholder="请输入姓名"></el-input>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="计划回款日期：" prop="planDate">
                <el-date-picker
                  v-model="form.planDate"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="项目名称：" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入项目名称"></el-input>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="z-span-20" >
              <el-form-item label="回款状态：" prop="businessRepayStatus">
                <!--这个下拉款的数据也是错的-->
                <el-select v-model="form.businessRepayStatus">
                  <el-option v-for="x in businessRepayStatusOptions" :value="x.value" :label="x.label"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="z-span-20">
              <el-form-item label="实际回款日期：" prop="realDate">
                <el-date-picker
                  v-model="form.realDate"
                  type="daterange"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8" :push="1" >
            <div class="z-span-20" >
                <span class="z-btn-span"><el-button type="primary" icon="search" @click="searchForm" v-if="disabledArray[0] === 'true'">查询</el-button></span>
                <span class="z-btn-span"><el-button  @click="resetForm('form')">重置</el-button></span>
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
        label="平台流水号"
      >
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="手机号"
      >
        <template scope="scope">
          <div @click="toTelDetail(scope.row)" class="detailSpan">{{scope.row.mobile}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
      >
      </el-table-column>

      <el-table-column
        prop="planDate"
        :formatter="dateFormatDay"
        label="预计回款日期"
      >
      </el-table-column>
      <el-table-column
        label="项目名称"
      >
        <template scope="scope">
          <span @click="toDetail(scope.row)" class="detailSpan">{{scope.row.productName}}</span>
        </template>
      </el-table-column>
      <!--<el-table-column-->
        <!--label="当前期/总期次"-->
      <!--&gt;-->
        <!--<template scope="a">-->
          <!--<span >{{a.row.atIndex}}/{{a.row.countIndex}}</span>-->
        <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="type"
        label="回款类型"
      >
      </el-table-column>

      <!--回款总额(元)预计还款金额(元)-->
      <el-table-column
        prop="repayAmount"
        :formatter='moneyFormat'
        label="预计还款金额(元)"
      >
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="principalAmount"-->
        <!--:formatter='moneyFormat'-->
        <!--label="本金(元)"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="interestAmount"-->
        <!--:formatter='moneyFormat'-->
        <!--label="利息(元)"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="couponAmount"-->
        <!--:formatter='moneyFormat'-->
        <!--label="加息金额(元)"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <!--<el-table-column-->
        <!--prop="fee"-->
        <!--:formatter='moneyFormat'-->
        <!--label="手续费(元)"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <el-table-column
        prop="businessRepayStatus"
        label="回款状态"
      >
      </el-table-column>

      <el-table-column
        prop="repayAmount"
        :formatter='moneyFormat'
        label="实际还款金额(元)"
      >
        <!--prop="repayPlanAmount"-->
      </el-table-column>

      <!--<el-table-column-->
        <!--prop="repayTime"-->
        <!--:formatter="dateFormat"-->
        <!--label="实际回款时间"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <el-table-column
        prop="repayTime"
        :formatter="dateFormatDay"
        label="实际回款时间"
      >
      </el-table-column>
      <el-table-column
        prop="serialNo"
        label="银行流水号"
      >
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="instSettleDate"-->
        <!--:formatter="dateFormat"-->
        <!--label="机构清算日期"-->
      <!--&gt;-->
      <!--</el-table-column>-->
      <el-table-column
        prop="repayStatus"
        :formatter="formatterRepayStatus"
        label="受理状态"
      >
      </el-table-column>
      <el-table-column
        prop="treatmentSchedule"
        label="银行处理进度"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template scope="scope">
          <el-row>
            <span v-if="disabledArray[2] === 'true'"> <el-button @click="payDetail(scope.row.orderNo)" type="text">详情</el-button></span>
          </el-row>


        </template>
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
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'

  export default {
    data () {
      return {
      //        businessRepayStatusOptions:TOOL.fetchObj('commonObj').businessRepayStatus,//这里是不对的,但是没有对应的数据使用
        businessRepayStatusOptions: [
          {'label': '全部', 'value': ''},
          {'label': '未还款', 'value': '10'},
          {'label': '已还款', 'value': '20'}
        ],
        repayStatusOptions: [
          {'label': '全部', 'value': ''},
          {'label': '未受理', 'value': 'unrepay'},
          {'label': '已受理', 'value': 'repay'}
        ],
        breadcrumName: '',
        totalCount: 0,
        currentPage: 1,
        form: {
          orderNo: '',
          mobile: '',
          name: '',
          productName: '',
          realDate: [],
          realDateEnd: '',
          realDateStart: '',
          businessRepayStatus: '', // 回款状态
          planDate: [], // 计划还款日期
          planDateEnd: '',
          planDateStart: '',
          repayAmount: '', // 回款总额
          repayTime: '', // 实际还款日期
          repayPlanAmount: ''// 预计 还款金额还款本金+还款利息(分) ,
        },
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        disabledArray: []// 权限控制\1/查询,2/下载,3/详情
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
            case '详情':
              this.disabledArray[2] = 'true'
              break
          }
        }
      } else {
        this.disabledArray = []
      }
    },
    methods: {
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
      // 受理状态转换
      formatterRepayStatus: function (val) {
        return TOOL.valueToLabel(this.repayStatusOptions, val.repayStatus)
        /* var date = row[column.property];
        return TOOL.normalTime(date); */
      },

      /* --------------------------------------------分页,查询---------------------------------------------------------- */
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
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTablelist()
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */

      // 跳转详情--手机号
      toTelDetail (row) {
        TOOL.clearProData()
        this.$router.push({name: 'AccountInfoDetail', params: { mobile: row.mobile }})
      },

      // 跳转详情--项目名称
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
          this.$router.push({name: 'TBDPayProDetail', params: {id: row.productId, type: row.repayStatus}})
        }
      },

      // 统一处理数据
      objFn () {
        if (this.form.planDate.length) {
          if (this.form.planDate[0] && this.form.planDate[1]) {
            this.form.planDateStart = +this.form.planDate[0]
            this.form.planDateEnd = +this.form.planDate[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.planDateStart = ''
            this.form.planDateEnd = ''
          }
        } else {
          this.form.planDateStart = ''
          this.form.planDateEnd = ''
        }
        if (this.form.realDate.length) {
          if (this.form.realDate[0] && this.form.realDate[1]) {
            this.form.realDateStart = +this.form.realDate[0]
            this.form.realDateEnd = +this.form.realDate[1] + 86400000 - 1// 86400000为一天的毫秒量
          } else {
            this.form.realDateStart = ''
            this.form.realDateEnd = ''
          }
        } else {
          this.form.realDateStart = ''
          this.form.realDateEnd = ''
        }

        let obj = {
          'pageNo': this.pageNo,
          'pageSize': this.pageSize,
          'orderNo': this.form.orderNo,
          'mobile': this.form.mobile,
          'name': this.form.name,
          'productName': this.form.productName,
          'realDateEnd': this.form.realDateEnd,
          'realDateStart': this.form.realDateStart,
          'businessRepayStatus': this.form.businessRepayStatus,
          'planDateEnd': this.form.planDateEnd,
          'planDateStart': this.form.planDateStart
        }
        return obj
      },

      getTablelist () {
        API.$Payment(this.objFn(), res => {
          this.tableData = res.list
          this.totalCount = res.totalCount
        })
      },
      download () {
        API.$downloadFile('repaymentPageQuery', '/gateway/repayment/getRepaymentExport', this.objFn())
      },
      // 跳转详情
      payDetail (orderNo) {
        this.$router.push({name: 'PayDetail', params: { orderNo: orderNo }})
      }
    }
  }
</script>

