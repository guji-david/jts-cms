<template>
  <div id="content-body" class="content-body">
    <breadcrumbNav :breadcrumName="breadcrumName"></breadcrumbNav>
    <!-- 搜索开始 -->
    <el-tabs v-model="activeName">
      <el-tab-pane label="问题内容管理" name="first">
        <div><h2>问题列表</h2></div>
        <questionList></questionList>
      </el-tab-pane>
      <el-tab-pane label="问题分类管理" name="second">
        <div><h2>问题分类列表</h2></div>
        <questionClassList></questionClassList>
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
  import breadcrumbNav from '../../../../components/nav/breadcrumb-nav.vue'
  import questionList from './questionList.vue'
  import questionClassList from './questionClassList.vue'
  export default {
    data () {
      return {
        activeName: 'first',
        breadcrumName: ''
      }
    },
    components: {
      breadcrumbNav,
      questionList,
      questionClassList
    }

  }
</script>
