<template>
  <div class="footer" :style="{left:unfould[1]}">
    <span>Copyright © 2014-2017 金投手金融信息服务（北京）有限公司版权所有。保留所有权利。 </span>
  </div>
</template>
<style lang="less">
  .footer{
    background:#fff;
    height:35px;
    line-height:35px;
    position:fixed;
    bottom:0px;
    border-top:1px solid #eee;
    text-align:center;
    font-size:12px;
    right:0px;
    z-index:9;
    left:251px;
    span{
      padding-right: 10px;
      color: #cccccc;
    }
  }
</style>
<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  },
  computed: {
    unfould () {
      return [
        this.$store.state.unfold,
        this.$store.state.mWidth,
        this.$store.state.menuClass
      ]
    }
  }
}
</script>
