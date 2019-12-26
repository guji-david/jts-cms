<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <el-tabs v-model="tabName" >
      <el-tab-pane label="入账管理" name="1"></el-tab-pane>
      <el-tab-pane label="分账管理" name="2"></el-tab-pane>
      <el-tab-pane label="退款管理" name="3"></el-tab-pane>
    </el-tabs>
    <pay v-if="tabName=='1'"></pay>
    <balance v-if="tabName=='2'" ></balance>
    <refunds v-if="tabName=='3'"></refunds>

  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import pay from './pay.vue'
  import balance from './balance.vue'
  import refunds from './refunds.vue'

  export default {
    data () {
      return {
        breadcrumName: '',
        proType: this.$route.params.proType || '',
        tabName: '1'
      }
    },
    components: {
      breadcrumbNav,
      pay,
      balance,
      refunds
    },
    mounted () {
      if (this.proType) {
        this.tabName = this.proType
      } else {
        this.tabName = '1'
      }
    }

  }
</script>

<style lang="less" scoped>
</style>
