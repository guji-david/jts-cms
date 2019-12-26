<template>
  <div id="user-menu-box">
    <div class="user-menu" @mouseover="userDropOver" @mouseout="userDropOut">
      <div class="user-menu-img"><img src="../../../static/img/logo.jpg" width="40" height="40" /></div>
      <div class="user-menu-txt">
        <div class="user-info">
          <p>{{userName}}</p>
          <p>修改密码</p>
        </div>
        <div id="user-drop"  v-show="userDropVisible">
          <div id="user-info">
            <div class="user-info-li"><p>获得积分</p>10</div>
            <div class="user-info-li"><p>用户等级</p>20</div>
            <div class="user-info-li"><p>我的评论</p>123</div>
          </div>
          <ul>
            <li><a href=""><i class="el-icon-message"></i> <span>10</span>我的信息</a></li>
            <li><a href=""><i class="el-icon-menu"></i> 个人中心</a></li>
            <li><a href=""><i class="el-icon-more"></i> 用户设置</a></li>
            <li><a href=""><i class="el-icon-star-on"></i> <span>900</span>我的收藏</a></li>
          </ul>
        </div>
      </div>

    </div>
    <div class="user-out" @click="userOutBtn">
      <i class="iconfont icon-dianyuan"></i>
      <a href="javascript:;">退出</a>
    </div>
    <el-dialog title="提示" v-model="userOutVisable" size="tiny">
      <span>确定要退出系统</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="userOutVisable = false">取 消</el-button>
            <el-button type="primary" @click="confirmOut">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as TOOLS from '../../assets/js/tools'
  export default{
    data () {
      return {
        userName: TOOLS.getUser(),
        userOutVisable: false,
        userDropVisible: false
      }
    },
    methods: {
      clearCookie () {
        var keys = document.cookie.match(/[^ =;]+(?==)/g)
        var date = new Date()
        date.setTime(date.getTime() - 10000)
        if (keys) {
          for (var i = keys.length; i--;) { document.cookie = keys[i] + '=0;expires=' + date.toUTCString() }
        }
      },

      confirmOut () {
        this.clearCookie()
        this.userOutVisable = false
        //        localStorage.removeItem('userName')
        localStorage.clear()
        sessionStorage.clear()
        this.$store.commit('updataMenus', [])
        this.$store.commit('addBreadcrumb', '')
        this.$router.push({name: 'Default'})
      },
      userOutBtn () {
        this.userOutVisable = true
      },

      userDropOver () {
        this.userDropVisible = true
      },
      userDropOut () {
        this.userDropVisible = false
      }
    }
  }
</script>
<style lang="less" scoped>
  .user-menu{
    width:180px;
    height:67px;
    float:left;
    border-right:1px solid #e6eeea;
    border-left:1px solid #e6eeea;
    padding-left:10px;
    position:relative;
    cursor: pointer;

  }
  .user-out{
    width:70px;
    float:right;
    font-size:30px;
    height:70px;
    color:#5e6d82;
    text-align:center;
    padding-top:4px;
    cursor:pointer;
    &>i{
      font-size: x-large;
    }
  }
  #user-drop{
    width:260px;
    background:#fff;
    border:1px solid #e6eeea;
    position:absolute;
    right:-71px;
    top:67px;
    overflow: hidden;
    z-index:10;
    box-shadow:-2px 2px 4px 0px rgba(0,0,0,.1)
  }
  #user-drop ul{
    margin:10px 0
  }
  .user-menu-img{
    width:50px;
    height:50px;
    float:left;
  }
  .user-menu-img{
    padding-top:10px;
  }
  .user-out a{
    display:block;
    font-size:12px;
  }
  .user-out:hover{
    color:#00aa88
  }
  .user-out:hover a{
    color:#00aa88
  }
  .user-menu-txt{
    width:130px;
    float:right;
    height:60px;
    padding-top:10px;
    font-size:13px;
  }
  .user-info p{
    padding:5px 10px
  }
  #user-menu-box{
    width:262px;
    height: 70px;
    float: right;
    margin-right:-263px;
  }
  #user-drop li{
    height:35px;
    font-size:14px;

  }
  #user-drop li a{
    display: block;
    width: 100%;
    padding: 0px 20px;
    line-height: 35px;
    height: 35px;
    box-sizing: border-box;
  }
  #user-drop li a:hover{
    background: #00AA88;
    color:#fff
  }
  #user-info{
    border-bottom: 1px solid #e6eeea;
    overflow: hidden;


  }
  .user-info-li{
    height: 50px;
    width:33%;
    float: left;
    text-align: center;

  }
  .user-info-li p{
    padding: 10px 0px 0px 0px;
  }
  .user-info-li:nth-child(2){
    border-left:1px solid #e6eeea;
    border-right:1px solid #e6eeea;
  }
  #user-drop li a span{
    display: block;
    float: right;
    background: red;
    color: #fff;
    min-width:16px;
    height: 16px;
    font-size: 10px;
    text-align: center;
    line-height: 18px;
    border-radius: 10px;
    margin-top: 9px;
    padding: 2px;
  }
  #user-drop li a span:hover{
    background: red;
  }

</style>
