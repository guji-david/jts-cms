<template>
<div style="text-align: center">
  <div style="font-size: 5em;margin-top: 80px;color: #ff4949">页面找不到了!!!</div>
  <div style="font-size: 2em;margin: 30px 0;color: #00aa88;cursor: pointer" @click="goIndex()">返回首页</div>
  <img src="../assets/images/404.png" alt="">
</div>

</template>

<script>
  import * as TOOLS from '../assets/js/tools.js'
  export default {
    methods: {
      goIndex () {
        if (!TOOLS.getUser()) {
          this.$router.push({name: 'Login'})
        } else {
          this.$router.push({name: 'subRouterMain'})
        }
      }
    }
  }
</script>


