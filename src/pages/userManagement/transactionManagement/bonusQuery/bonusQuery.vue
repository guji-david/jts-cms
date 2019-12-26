<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>

    <el-tabs v-model="seach">
      <el-tab-pane label="红包查询" name="1"></el-tab-pane>
      <el-tab-pane label="加息券查询" name="2"></el-tab-pane>
      <el-tab-pane label="投资奖励金查询" name="3"></el-tab-pane>
      <el-tab-pane label="现金查询" name="4"></el-tab-pane>
    </el-tabs>
    <redpacketSeach v-if="seach=='1'" ></redpacketSeach>
    <couponSeach v-if="seach=='2'"></couponSeach>
    <tenderInterest v-if="seach == '3'"></tenderInterest>
    <cashSeach v-if="seach == '4'"></cashSeach>

  </div>
</template>

<script>
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import redpacketSeach from './redpacketSeach/redpacketSeach.vue'
  import couponSeach from './couponSeach/couponSeach.vue'
  import tenderInterest from './tenderInterestSeach/tenderInterestSeach.vue'
  import cashSeach from './cashSeach/cashSeach.vue'

  export default {
    data () {
      return {
        breadcrumName: '',
        seach: '1'
      }
    },
    components: {
      breadcrumbNav,
      redpacketSeach,
      couponSeach,
      tenderInterest,
      cashSeach
    },
    mounted () {

    },

    methods: {

    }
  }
</script>

<style lang="less" scoped>
  .addGiftTap{
    padding:1% 5%;
    /*border: 1px gray solid;*/
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .linkColor{
    color:#FF9900;
    cursor: pointer;
  }
</style>
