<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <el-tabs v-model="recharge">
      <el-tab-pane label="在线充值" name="1"></el-tab-pane>
      <el-tab-pane label="网银转账" name="2"></el-tab-pane>
    </el-tabs>
    <onlineRecharge v-if="recharge=='1'" ></onlineRecharge>
    <bankRecharge v-if="recharge=='2'" ></bankRecharge>

  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import onlineRecharge from './onlineRecharge.vue'
  import bankRecharge from './bankRecharge.vue'

  export default {
    data () {
      return {
        breadcrumName: '',
        recharge: '1'
      }
    },
    components: {
      breadcrumbNav,
      onlineRecharge,
      bankRecharge
    }

  }
</script>

<style lang="less" scoped>

</style>
