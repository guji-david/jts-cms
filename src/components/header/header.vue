<template>
  <div class="z-header-box">
    <Logo></Logo>
    <div class="z-menu-open" @click="unfold"><i class="iconfont" :class="unfould[2]"></i></div>
     <TagMenu></TagMenu>
    <UserInfo></UserInfo>
  </div>
</template>
<script>
import Logo from './logo.vue'
import TagMenu from './tag-menu.vue'
import UserInfo from './user-info.vue'

export default {
  name: 'hello',
  data () {
    return {

    }
  },
  components: {
    Logo,
    TagMenu,
    UserInfo
  },
  computed: {
    unfould () {
      return [
        this.$store.state.unfold,
        this.$store.state.mWidth,
        this.$store.state.menuClass
      ]
    }
  },
  mounted () {

  },
  methods: {
    unfold () {
      this.$store.commit('unfoldSubNav')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  .z-header-box {
    height:70px;
    border-bottom:3px solid #00aa88;
    padding-left:130px;
    box-sizing:border-box;
    padding-right:262px;
    .z-menu-open{
      height:70px;
      width:60px;
      float:left;
      margin-left:-60px;
      font-size:24px;
      text-align:center;
      color:#00aa88;
      cursor:pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      i{
        font-size: xx-large;
      }
    }
  }

</style>
