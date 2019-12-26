<template>
  <div class="wrap">
    <div v-for="(x,index) in mybox" class="thisTable">
      <h1>{{x.title}}</h1>
      <hr>
      <!--头部加息劵表-->
      <el-table
        v-if="index == 0 & !tableHeadHide"
        :data= 'detailCouponHeadData'
        type="expand"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="加息券名称"
        >
        </el-table-column>
        <el-table-column
          prop="amount"
          label="加息额度(%)"
        >
        </el-table-column>
        <el-table-column
          prop="validLimit"
          label="有效期(天)"
        >
        </el-table-column>
        <el-table-column
          prop="productType"
          :formatter="formatterUnitType"
          label="限投产品类型"
        >
        </el-table-column>
        <el-table-column
          prop="maxRateAmount"
          :formatter='moneyFormat'
          label="最高加息金额(元)"
        >
        </el-table-column>
        <el-table-column
          prop="maxRateLimit"
          label="最高加息天数(天)"
        >
        </el-table-column>
        <el-table-column
          prop="minInvestAmount"
          :formatter='moneyFormat'
          label="最低投资金额(元)"
        >
        </el-table-column>
        <el-table-column
          prop="minInvestLimit"
          label="产品最低期限(天)"
        >
        </el-table-column>
      </el-table >
      <!--头部加息劵表end-->
      <!--头部红包表-->
      <el-table
        v-if="index == 0 & tableHeadHide"
        :data= 'detailRedpacketHeadData'
        type="expand"
        border
        style="width: 100%">
        <el-table-column
          prop="name"
          label="红包名称"
          >
        </el-table-column>
        <el-table-column
          label="金额(元)"
         >
          <template scope="props" >
            <div > {{props.row.amount/100}}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="validLimit"
          label="有效期"
          >
        </el-table-column>
        <el-table-column
          prop="productType"
          :formatter="formatterUnitType"
          label="限投产品类型"
          >
        </el-table-column>
        <el-table-column
          label="起投金额(元)"
          >
          <template scope="props" >
            <div class="table-line" >
              <ul>
                <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.minAmount/100}}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="投资产品最低期限(天)"
          >
          <template scope="props" >
            <div class="table-line" >
              <ul>
                <li v-for="(item,index) in formatterRule(props.row.rule)"> {{item.limit}}</li>
              </ul>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!--头部红包表end-->
      <!--下部用户表-->
      <el-table
        v-if="index >0"
        :data= 'detailFootData'
        type="expand"
        border
        style="width: 100%">
        <el-table-column
          prop="mobile"
          label="手机号"
        >
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          label="状态"
        >
          <template scope="scope">
            <span>成功</span>
          </template>
        </el-table-column>
      </el-table>
      <!--下部用户表end-->
      <!-- 分页开始 -->
      <div class="z-pager">
        <el-pagination
          v-if="index>0"
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
    <el-button type="primary" icon="close" @click="giftDetailShow" class="close"></el-button>
  </div>
</template>
<script>
  import * as API from '../../../../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'

  export default{
    props: ['id', 'type', 'batchNo'],
    data () {
      return {
        mybox: [
          {
            title: '礼品详情'
          }, {
            title: '发放详情'
          }
        ],
        totalCount: 0,
        currentPage: 1,
        pageNo: 1,
        pageSize: 5,
        detailCouponHeadData: [],
        detailRedpacketHeadData: [],
        detailFootData: [],
        tableHeadHide: false,
        productTypeOptions: TOOL.fetchObj('commonObj').ProductType
      }
    },
    computed: {
      giftDetailSh () { // 通过vuex控制详情页的显示
        return [
          this.$store.state.giftDetail
        ]
      }
    },
    mounted () {
      let ajaxTpye
      if (this.type === 'redpacket') {
        this.tableHeadHide = true
        ajaxTpye = 'detailRedpacketHeadData'
      } else if (this.type === 'coupon') {
        this.tableHeadHide = false
        ajaxTpye = 'detailCouponHeadData'
      }
      API.postRequest('/gateway/bizGift/queryBatch', {
        id: this.id
      }, res => {
        this[ajaxTpye] = res.list// 对tableData赋值
      })
      this.getTableList()
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 金额转换
      moneyFormat (row, column) {
        let money = row[column.property]
        return TOOL.fenToYuan(money)
      },
      formatterRule (val) {
        return JSON.parse(val)
      },
      formatterUnitType (val) {
        return TOOL.valueToLabelListStr(TOOL.fetchObj('commonObj').ProductType, JSON.parse(val.productType))
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
      // 这个是pageSize
      handleSizeChange (val) {
        this.pageSize = val
        this.getTableList()
        console.log(`每页 ${this.pageSize} 条`)
      },
      // 这个是pageSize
      handleCurrentChange (val) { // 这个是pageNo
        this.currentPage = val
        this.pageNo = val
        this.getTableList()
        console.log(`当前页: ${this.pageNo}这是啥?${this.currentPage}`)
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      giftDetailShow () {
        this.$store.commit('giftDetailShow')
      },
      getTableList () {
        API.$giftType(this.type, this.batchNo, this.pageNo, this.pageSize, res => {
          console.log(res)
          this.detailFootData = res.list
          this.totalCount = res.totalCount
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "giftDetail.less";
</style>
