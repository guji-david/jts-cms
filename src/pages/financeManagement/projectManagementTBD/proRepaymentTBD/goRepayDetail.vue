<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 列表开始 -->
    <div id="z-edit">
      <el-form label-width="160px">
        <el-collapse v-model="activeNames" >
          <!--折叠栏1-->
          <el-collapse-item title="还款信息" name="1">
            <el-button @click="repaymentBtn" style="padding: 8px 25px;" :disabled="repayBtn===activeId">还款</el-button>
            <el-form-item v-show="isOverdue!=10">
              <div class="isOverTime">
                该项目逾期还款（请注意逾期利息的支付情况）
              </div>
            </el-form-item>

            <el-form-item label="应还总额(元)：">
              {{totalAmount}}
            </el-form-item>
            <el-form-item label="应还总本金(元)：" >
              {{totalPrincipalAmount}}
            </el-form-item>
            <!--<el-form-item label="应还总利息(元)：" class="isFocus">-->
              <!--{{totalInterestAmount}}-->
            <!--</el-form-item>-->
            <div class="my-el-form-item " :class="{isFocusW:isOverdue!=10}">
              <label class="my-el-form-item__label " :class="{isFocus:isOverdue!=10}" style="width: 160px;">应还总利息(元)：</label>
              <div  class="my-el-form-item__content" style="margin-left: 160px;">{{totalInterestAmount}}</div>
            </div>

            <el-form-item label="应还总加息(元)：" >
              {{totalCouponInterestAmount}}
            </el-form-item>
          </el-collapse-item>
          <!--折叠栏1end-->
        </el-collapse>
      </el-form>
    </div>

    <!-- 列表开始 -->
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column prop="repayAmount" :formatter="moneyFormat" label="应还金额(元)"></el-table-column>
      <el-table-column prop="principalAmount" :formatter="moneyFormat" label="应还本金(元)"></el-table-column>
      <el-table-column prop="interestAmount" :formatter="moneyFormat" label="应还利息(元)"></el-table-column>
      <el-table-column prop="couponAmount" :formatter="moneyFormat" label="应还加息(元)"></el-table-column>
    </el-table>
    <!-- 列表结束 分页开始 -->
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
     <!--分页结束 -->
    <!-- 批量操作审核的时候提示 -->
    <el-dialog title="提示" v-model="isOverdueVisible" size="tiny">
      <div style="color: #FB4B45 ;text-align: center;line-height: 30px">该项目逾期还款</div>
      <div style="text-align: center;line-height: 30px" >请确认应支付的逾期利息 <span>{{overdueAmount}}</span>元已到还款账户！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="default" @click="isOverdueVisible = false">取 消</el-button>
        <el-button type="primary" @click="invokeAjax":disabled="isOverdueDisabled">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<style lang="less" scoped>
  .isOverTime{
    margin-left: -160px;
    padding-left: 10px;
    margin-top: 20px;
    font-size: 16px;
    width: 340px;
    color: #FB4B45;
    /*border: 1px dashed #FB4B45;*/
  }
  .isFocusW{
    /*width: 350px;*/
    /*border: 1px dashed #FB4B45;*/
    color: #FB4B45 ;
  }

  .my-el-form-item{
    margin-bottom: 22px;
    .my-el-form-item__label{
      text-align: right;
      vertical-align: middle;
      float: left;
      font-size: 14px;
      color: #48576a;
      line-height: 1;
      padding: 11px 12px 11px 0;
      box-sizing: border-box;
    }
    .isFocus{
      color: #FB4B45 ;
    }
    .my-el-form-item__content{
      line-height: 36px;
      position: relative;
      font-size: 14px;
    }
    .my-el-form-item__content::before{
      display: table;
      content: "";
    }
    .my-el-form-item__content::after{
      clear: both;
    }

  }

</style>
<script>
  import * as API from '../../../../store/api'
  import * as TOOL from '../../../../assets/js/tools'
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import { Loading } from 'element-ui'
export default {
    data () {
      return {
        breadcrumName: '详情',
        activeNames: ['1'],
        id: TOOL.getProID(this.$route.params.id),
        totalCount: 0,
        isOverdue: '',//10 存在逾期 20不存在逾期
        overdueAmount:'',
        currentPage: 1,
        tableData: [],
        pageNo: 1,
        pageSize: 5,
        totalAmount: 0,
        totalPrincipalAmount: 0,
        totalInterestAmount: 0,
        totalCouponInterestAmount: 0,
        repayBtn: 0,
        activeId: 1,
        isOverdueDisabled:false,
        isOverdueVisible:false
      }
    },
    components: {
      breadcrumbNav
    },
    mounted () {
      this.getTablelist()
    },
    methods: {
      /* --------------------------------------------格式转换----------------------------------------------------------- */
      // 金额转换
      moneyFormat (row, column) {
        return TOOL.fenToYuan(row[column.property])
      },
      /* --------------------------------------------分页,查询---------------------------------------------------------- */
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
      getTablelist () {
        let obj = {
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          id: this.id
        }
        API.$repayInfo(obj, res => {
          this.tableData = res.data.repaymentPage.list
          this.totalCount = res.data.repaymentPage.totalCount;
          this.isOverdue=res.data.isOverdue;
          this.overdueAmount= TOOL.fenToYuan(res.data.overdueAmount);
          this.totalAmount = TOOL.fenToYuan(res.data.totalAmount)
          this.totalPrincipalAmount = TOOL.fenToYuan(res.data.totalPrincipalAmount)
          this.totalInterestAmount = TOOL.fenToYuan(res.data.totalInterestAmount)
          this.totalCouponInterestAmount = TOOL.fenToYuan(res.data.totalCouponInterestAmount)
        })
      },
      repaymentBtn () {
        if(this.isOverdue!=10&&this.overdueAmount>0){
            this.isOverdueVisible=true
        }else{
          this.invokeAjax();
        }
      },
      invokeAjax(){
        this.isOverdueVisible=false;
        this.repayBtn = 1
        let loadingInstance = Loading.service({fullscreen: true, lock: true})
        API.$repaymentButton('1', this.id, '1', res => {
          loadingInstance.close()
          if (res.success) { // 如果成功的话
            TOOL.alertConfirm(this, '', `还款成功`, '', '确定', '', 'success', false)
          } else {
            this.repayBtn = 0
            TOOL.alertConfirm(this, '', `${res.resultMsg} 还款失败`, '', '确定', '', 'warning', false)
          }
        })
      }
    }
  }
</script>
