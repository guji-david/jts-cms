<template>
  <div id="z-nav-tag-box">
    <div class="z-nav-tag-directe nav-tag-left" @click="goLeft"><i class="el-icon-arrow-left"></i></div>
    <ul class="z-nav-tag-ul">
      <li class="z-nav-tag-ul-li">
        <div @click="goMain()" :class="{sel:activeIndex==-1}">首页</div></li>
      <li class="z-nav-tag-ul-li" v-for="(item,index) in getMenuData":class="{sel:activeIndex==index}" >
        <div @click="goRouter(item,index)">
          {{item.label}}
        </div>
        <span @click="closeTag" :data-id="item.id" :id="'close'+item.id"></span>
      </li>
    </ul>
    <div class="z-nav-tag-directe z-nav-tag-right" @click="goRight"><i class="el-icon-arrow-right"></i></div>
  </div>
</template>
<script type="text/ecmascript-6">
  import {setTagNavWIdth, calcTagBox, getList} from '../../assets/js/tools.js'

  export default {
    name: 'tag-menu',
    data () {
      return {
        index: 0
      //        activeIndex:-1,
      }
    },
    components: {
    },
    computed: {
      activeIndex () {
        return this.$store.state.activeIndex
      },
      getMenuData () {
        if (this.$store.state.menus.length > 0) {
          return this.$store.state.menus
        } else {
          this.$store.commit('updataMenus', getList('tags'))
          return this.$store.state.menus
        }
      }
    },
    mounted () {
      setTagNavWIdth()
    //      let clac = calcTagBox()
      // 当页签打开过多时候可拖动页签
      /* let ele = document.getElementsByClassName('z-nav-tag-ul')[0]
      ele.onmousedown = function (e) {
        let left = parseInt(window.getComputedStyle(ele, null).left)
        var disX = e.clientX - this.offsetLeft
        if (ele.setCapture) ele.setCapture()
        this.style.cursor = 'move'
        document.onmousemove = function (ev) {
          var w = ev.clientX - disX
          if (clac.tagUlWidth > clac.tagBoxWidth + left) {
            ele.style.left = w + 'px'
          } else {
            ele.style.left = left + 'px'
          }
        }
        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
          if (ele.setCapture) ele.releaseCapture()
        }
        return false
      } */
    },
    updated () {
      setTagNavWIdth()
    },
    methods: {
      // 跳转主页
      goMain (item) {
        this.$store.commit('updateActiveIndex', '-1')
        this.$router.push({path: '/main'})
      },
      // 跳转路由
      goRouter (item, index) {
        this.$store.commit('updateActiveIndex', index)
        this.$store.commit('addBreadcrumb', item.id)
        this.$store.commit('addFunctionList', item.id)
        this.$router.push({path: item.router})
      },
      // 关闭页签
      closeTag (e) {
        let id = e.target.getAttribute('data-id')
        let getMenuData = this.getMenuData
        for (let i = 0, len = getMenuData.length; i < len; i++) {
        //          if(id==getMenuData[i].id&&(this.$route.path==getMenuData[i].router||this.$route.path.match(getMenuData[i].router))){
          if (id == getMenuData[i].id) {
            if (this.$store.state.activeIndex == i) {
              this.$store.commit('updateActiveIndex', '-1')
              this.$router.push({name: 'subRouterMain'})
            }
          }
        }
        this.$store.commit('closeTag', parseInt(id))
      },
      // 点击左侧箭头移动也签
      goLeft () {
        let clac = calcTagBox()
        let ele = document.getElementsByClassName('z-nav-tag-ul')[0]
        let left = parseInt(window.getComputedStyle(ele, null).left)
        if (left < 0) {
          if (clac.tagUlWidth > clac.tagBoxWidth) {
            this.index--
            ele.style.left = -this.index * 100 + 'px'
          }
        }
      },
      // 点击右侧箭头移动页签
      goRight () {
        let clac = calcTagBox()
        let ele = document.getElementsByClassName('z-nav-tag-ul')[0]
        let left = parseInt(window.getComputedStyle(ele, null).left)
        if (clac.tagUlWidth + left < 1000) {
          return
        }
        if (clac.tagUlWidth > clac.tagBoxWidth && left === 0 || left !== 0) {
          this.index++
          ele.style.left = -(this.index * 100) + 'px'
        }
      }
      // 点击页签的时候让当前页签样式改为选中
    }
  }
</script>

<style>
  #z-nav-tag-box{
    height: 67px;
    width: 100%;
    box-sizing: border-box;
    float: left;
    position:relative;
    overflow:hidden;
    box-sizing:border-box;
    padding-right:20px
  }
  .z-nav-tag-directe{
    height:45px;
    position:absolute;
    bottom:0px;
    width:20px;
    text-align:center;
    cursor:pointer;
    line-height:45px;
    z-index:1000;
    background:#fff
  }
  .z-nav-tag-directe:hover{
    background: rgba(0,170,136,1)
  }
  .z-nav-tag-left{
    left:0;
  }
  .z-nav-tag-right{
    right:0;
  }
  .z-nav-tag-ul{
    width:100%;
    display:block;
    height:45px;
    margin-top:25px;
    padding:0px 20px 0px 38px;
    position:relative;
    float:left;
  }
  .z-nav-tag-ul li{
    float:left;
    height:40px;
    max-width:160px;
    min-width:100px;
    border:1px solid #e6eeea;
    margin-left:2px;
    position:relative;
    border-bottom:1px solid rgba(0,0,0,0);
    border-radius:3px 3px 0px 0px;
    overflow:hidden
  }
  .z-nav-tag-ul li a{
    display:block;
    height:45px;
    line-height:45px;
    text-align:center;
    font-size:14px;
    padding:0px 10px;
    width:100%;
    box-sizing: border-box;
    overflow:hidden;

  }
  .z-nav-tag-ul li div{
    display:block;
    height:45px;
    line-height:45px;
    text-align:center;
    font-size:14px;
    padding:0 10px;
    width:100%;
    box-sizing: border-box;
    overflow:hidden;
    cursor: pointer;

  }
  .z-nav-tag-ul li:hover,.z-nav-tag-ul .sel {
    color:#00AA88 ;
    border-color:#edf7ff;
    background-color: #edf7ff;
    border-bottom:1px solid rgba(0,0,0,0);
    -moz-transition: border 0.3s ease-in;
    -webkit-transition: border 0.3s ease-in;
    -o-transition: border 0.3s ease-in;
    transition: border 0.3s ease-in;
  }
 /* .z-nav-tag-ul li:hover a,.z-nav-tag-ul li.sel{
    color:#00AA88;
    -moz-transition:color 0.3s ease-in;
    -webkit-transition: color 0.3s ease-in;
    -o-transition: color 0.3s ease-in;
    transition: color 0.3s ease-in;
  }*/
  .z-nav-tag-ul li span{
    position:absolute;
    top:5px;
    right:5px;
    display:block;
    width:13px;
    height:13px;
    color:#5e6d82;
    cursor:pointer
  }
  .z-nav-tag-ul li span:after{
    content:"×";
    position:relative;
    top:-4px;
    left:2px

  }
  .z-nav-tag-ul li:hover span,.z-nav-tag-ul li.sel span{
    color:#fff;
    background:#f5470a;
    -moz-transition: background 0.1s ease-in,color 0.1s ease-in;
    -webkit-transition: background 0.1s ease-in,color 0.1s ease-in;
    -o-transition: background 0.1s ease-in,color 0.1s ease-in;
    transition: background 0.1s ease-in,color 0.1s ease-in;
  }
</style>
