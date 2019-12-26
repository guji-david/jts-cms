<template>
  <div id="app">
    <keep-alive>
      <transition name="bounce">
        <router-view></router-view>
      </transition>
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  },
  computed: {

  },
  mounted () {
  }
}
</script>

<style lang="less">
  html, body, #app{
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .el-collapse{
    border: none !important;
    border-radius: 0;
  }
  .el-message-box{
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }
  input[type="number"]{
    -moz-appearance:textfield;
  }
  .el-table{
    th>.cell{
      text-align: center;
    }
    .cell{
      text-align: center;
    }
  }
</style>
