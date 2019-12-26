<template>
  <div id="main">
    <HeaderBox></HeaderBox>
    <div id="main-body" :style="{paddingLeft:unfould[1]}">
      <SubNav></SubNav>
      <div id="z-drager" v-if = "unfould[3]"></div>
      <div class="main-content" id="main-content">
        <keep-alive>
          <transition name="bounce">
            <router-view></router-view>
          </transition>
        </keep-alive>
      </div>
      <FooterBar></FooterBar>
    </div>
  </div>
</template>

<script>
  import * as TOOLS from '../assets/js/tools.js'
  import HeaderBox from '../components/header/header.vue'
  import SubNav from '../components/nav/sub-nav.vue'
  import FooterBar from '../components/footer/footer.vue'
  export default {
//    name: 'main',
    components: {
      HeaderBox,
      SubNav,
      FooterBar
    },
    computed: {
      unfould () {
        return [
          this.$store.state.unfold,
          this.$store.state.mWidth,
          this.$store.state.menuClass,
          this.$store.state.dragerShow
        ]
      }
    },
    mounted () {
      // 首页的面包屑
      TOOLS.clacScrollHeight('main-content', 70)

      /* API.$commonDataInit(res=>{
        let commonObj=this.addLabelAll(res);
        TOOLS.saveObj("commonObj",commonObj);
        TOOLS.setDomain(TOOLS.fetchObj("commonObj").domain[1].value);
        /!* Axios.get('/static/navdata.json').then(res => {
         TOOLS.setList("subnavData",res.data);
         let JSONlist=TOOLS.getNavDateToSimpleJson(TOOLS.getList("subnavData"));//将树形导航嵌套的json转换成单层json
         TOOLS.setList("simpleJsonSubnavData",JSONlist);
         this.fullscreenLoading = false;
         this.loginDiabled=false;
         this.$router.push({ name: 'subRouterMain'})
         })*!/
      }) */
    },
    methods: {
      // 处理公共数据 增加全部选项
      addLabelAll (obj) {
        let allLabelObj = {'label': '全部', 'value': ''}
        for (let key in obj) {
          obj[key].unshift(allLabelObj)
        }
        return obj
      }
    }

  }
</script>

<style lang="less">
  .active{
    border-bottom: 2px solid #00AA88;
    box-sizing: border-box;
    color:#00AA88
  }
  .el-tabs__item.is-active{
    color:#00AA88
  }
  .el-tabs__active-bar{
    background-color: #00AA88;
  }
  .el-dialog .el-dialog--small{
    top:50% !important;
  }

  .v-modal{
    display: none !important;
  }


  #spiclSelect .el-select>.el-input {
    width: 60px !important;
  }
  #main-body {
    padding-left:170px
  }
  #z-drager{
    position: absolute;
    left: 171px;
    width: 5px;
    cursor: col-resize;
    bottom: 0px;
    top: 70px;
    z-index: 99;

  }
  #z-drager:hover{
    border-right: 1px dashed #842210;
    background-color: rgba(0,0,0,.04)
  }
  .z-tool-bar{
    height:45px;
    line-height:45px;
    padding:20px 10px 20px 0px;

    border-bottom:1px solid #dfeceb
  }
  .el-button + .el-button,.el-button{
    margin-left: 0px;
    padding: 8px 10px;
    -moz-transition: background 0.5s ease-in,color 0.3s ease-out;
    -webkit-transition: background 0.5s ease-in,color 0.3s ease-out;
    -o-transition: background 0.5s ease-in,color 0.3s ease-out;
    transition: background 0.5s ease-in,color 0.3s ease-out;
  }
  .el-button:hover{
    background: #00AA88;
    color:#fff
  }
  .z-pager{
    text-align: center;
    padding: 20px 0px
  }
  .main-content{
    -moz-padding-bottom:150px
  }
</style>
