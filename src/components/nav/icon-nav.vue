<template>
  <div id="nav-icon">
    <el-scrollbar
      tag="ul"
      wrap-class="nav_wrap"
      view-class="nav_list"
    >
      <li v-for="item in items" :class="item.sel" class="nav-icon-li" :data-id="[item.id]"  @click="changeNav($event)">
        <div class="nav-icon-font" :data-id="[item.id]"><i :class="[item.className]" :data-id="[item.id]"></i></div>
        <div class="nav-icon-txt" :data-id="[item.id]">{{item.title}}</div>
      </li>
    </el-scrollbar>
  </div>
</template>
<script>
export default{
  name: 'navIcon',
  data () {
    return {
      items: [
        { title: '整站搜索', className: 'fa fa-search', sel: '', id: 1 },
        { title: '数据仪盘', className: 'fa fa-tachometer', sel: 'sel', id: 1 },
        { title: '用户管理', className: 'fa fa-users', sel: '', id: 1 },
        { title: '数据分析', className: 'fa fa-area-chart', sel: '', id: 1 },
        { title: '网站设置', className: 'fa fa-cog', sel: '', id: 1 },
        { title: '资源管理', className: 'fa fa-database', sel: '', id: 1 },
        { title: '视频管理', className: 'fa fa-film', sel: '', id: 1 },
        { title: '运营管理', className: 'fa fa-life-buoy', sel: '', id: 1 }
      ]
    }
  },
  methods: {
    changeNav: function (env) {
      var dataId = env.target.getAttribute('data-id')
      console.log(dataId)
    }
  },
  components: {
  }
}
</script>

<style lang="less" scoped>
  #nav-icon{
    position:fixed;
    background:#005763;
    width:70px;
    left:0px;
    top:70px;
    bottom:0px;

  }
  .nav-icon-li{
    list-style:none;
    color:#fff;
    text-align:center;
    padding:10px 0px 5px 0px;
    cursor:pointer;
    border-bottom:1px solid #004a54
  }
  #nav-icon li.sel{
    background:#00AA88;
  }
  #nav-icon li:hover{
    background:rgba(41,195,69,.2);
    -moz-transition: background 0.3s ease-out;
    -webkit-transition: background 0.3s ease-out;
    -o-transition: background 0.3s ease-out;
    transition: background 0.3s ease-out;
  }
  .nav-icon-font i{
    font-size:26px
  }
  .nav-icon-txt{
    padding:5px 0px;
    font-size:12px
  }
</style>
