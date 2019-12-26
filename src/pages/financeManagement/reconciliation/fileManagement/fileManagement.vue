<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="结标" name="first">
        <BatchRepayment></BatchRepayment>
      </el-tab-pane>
      <el-tab-pane label="还款" name="second">
        <Batch></Batch>
      </el-tab-pane>
      <el-tab-pane label="分账" name="third">
        <Platform></Platform>
      </el-tab-pane>
      <el-tab-pane label="出入账" name="forth">
        <MerchantReconciliation></MerchantReconciliation>
      </el-tab-pane>
      <el-tab-pane label="开销户" name="fifth">
        <CustomerExpense></CustomerExpense>
      </el-tab-pane>
      <el-tab-pane label="内部户交易明细" name="sixth">
        <transactionDetail></transactionDetail>
      </el-tab-pane>
    </el-tabs>
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
      border-bottom: none;
    }
  }

</style>
<script>
  import TransactionDetail from './transactionDetail.vue'
  import Batch from './batch.vue'
  import Platform from './platform.vue'
  import MerchantReconciliation from './merchantReconciliation.vue'
  import CustomerExpense from './customerExpense.vue'
  import BatchRepayment from './batchRepayment.vue'

  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  export default {
    data () {
      return {
        activeName: 'first',
        breadcrumName: ''

      }
    },
    components: {
      breadcrumbNav,
      BatchRepayment,
      Batch,
      Platform,
      MerchantReconciliation,
      CustomerExpense,
      TransactionDetail
    }

  }
</script>
