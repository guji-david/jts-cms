<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <el-tabs v-model="point">
      <el-tab-pane label="积分记录" name="1"></el-tab-pane>
      <el-tab-pane label="兑换记录" name="2"></el-tab-pane>
    </el-tabs>
    <point v-if="point=='1'" ></point>
    <exchange v-if="point=='2'" ></exchange>

  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import point from './point.vue'
  import exchange from './exchange.vue'

  export default {
    data () {
      return {
        breadcrumName: '',
        point: '1'
      }
    },
    components: {
      breadcrumbNav,
      point,
      exchange
    }

  }
</script>

<style lang="less" scoped>

</style>
