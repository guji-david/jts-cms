<template>
      <div>
        <el-form>
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item label="加息券名称：" labelWidth="100px" >
                <el-input type="text" v-model="couponSeach"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3" >
              <el-button @click="couponTap">查询</el-button>
            </el-col>
            <el-col :span="3" >
              <el-button @click="couponSeach = ''">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
        <el-table
          ref="multipleTable"
          :data="couponAlertTableData"
          type="expand"
          fit
          border
          @selection-change="handleSelectionChange3"
          style="width: 100%">
          <el-table-column
            type="selection"
            width="50%"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="加息券名称"
          >
          </el-table-column>
          <el-table-column
            prop="rate"
            label="加息额度(%)"
          >
          </el-table-column>
          <el-table-column
            prop="validLimit"
            label="有效期(天)"
          >
          </el-table-column>
          <!--需要转义一下-->
          <el-table-column
            prop="productType"
            :formatter="formatterProductType"
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
        </el-table>
        <!-- 分页开始 -->
        <div class="z-pager">
          <el-pagination
            @size-change="handleSizeChange2"
            @current-change="handleCurrentChange2"
            :current-page="currentPage2"
            :page-sizes="[5,10,20,40]"
            :page-size="pageSize2"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount2">
          </el-pagination>
        </div>
        <!-- 分页结束 -->
      </div>
</template>
<script>
  import * as API from '../../../../../store/api'
  import * as TOOL from '../../../../../assets/js/tools'

  export default {
    props: ['addSaveBtn', 'tableHide'],
    data () {
      return {
        couponAlertTableData: [],
        couponMultipleSelection: [], // 选择礼物的加息劵表
        totalCount2: 1,
        couponSeach: '',
        currentPage2: 1,
        pageNo2: 1,
        pageSize2: 5
      }
    },
    watch: {
      addSaveBtn (val) {
        this.$emit('childToFatherTransferEvent', {type: 'coupon', val: this.couponMultipleSelection})// ③组件内对myFilename变更后向外部发送事件通知
        this.couponMultipleSelection.length = 0
        this.$refs.multipleTable.clearSelection()
      },
      tableHide (val) {
        if (val) {
          this.couponTap()
        } else {
          this.couponMultipleSelection.length = 0
          this.$refs.multipleTable.clearSelection()
        }
      }
    },
    mounted () { this.couponTap() },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 产品类型转换
      formatterProductType (val) {
        return TOOL.valueToLabelListStr(TOOL.fetchObj('commonObj').ProductType, JSON.parse(val.productType))
      },
      // 金额转换
      moneyFormat (row, column) {
        let money = row[column.property]
        return TOOL.fenToYuan(money)
      },
      /* --------------------------------------------分页,查询,多选---------------------------------------------------------- */
      // 这个是pageSize2
      handleSizeChange2 (val) {
        this.pageSize2 = val
        this.couponTap()
      },
      // 这个是pageSize2
      handleCurrentChange2 (val) { // 这个是pageNo
        this.currentPage2 = val
        this.pageNo2 = val
        this.couponTap()
      },
      // 添加加息劵的多选
      handleSelectionChange3 (val) {
        if (val.length > 0) {
          this.couponMultipleSelection = val
        }
      },
      /* --------------------------------------------页面事件----------------------------------------------------------- */
      // 加息劵请求接口
      couponTap () {
        let obj = {
          'pageNo': this.pageNo2,
          'pageSize': this.pageSize2,
          'id': '',
          'name': this.couponSeach,
          'isDel': false
        }
        API.$queryCoupon(obj, res => {
          this.couponAlertTableData = res.list
          this.totalCount2 = res.totalCount
        })
      }
    }
  }
</script>
<style scoped lang="less">
  @import "./giftRecord.less";
</style>
