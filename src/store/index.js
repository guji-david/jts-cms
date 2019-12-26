import Vue from 'vue'
import Vuex from 'vuex'

import * as TOOLS from '../assets/js/tools'
Vue.use(Vuex)
const state = {

  // 存放左侧导航的数据,为面包屑导航和页签提供数据
  navData: [],
  // 左侧导航拖动框是否显示
  dragerShow: true,
  // 是否显示左侧导航
  unfold: true,
  // 初始化时候左侧导航宽度
  mWidth: '170px',
  // 关闭和打开左侧导航按钮的样式
  menuClass: 'icon-tabulation',
  // 面包屑导航数据,
  breadcrumb: [],
  // 最终节点的功能list,
  functionList: [],
  // 页签导航数据
  menus: [],
  /**
   * 页签导航数据和面包屑导航数据要经过两处理,
   * 1.在点击导航的时候触发添加页签和面包屑
   * 2.数据都要存储到store.state里,有路由改变的时候从state里面读取数据
   * 3.state数据是临时保存在内存里的,一旦刷新,数据就会丢失,所以要把改变后的数据也要存到本地的存储环境里,具体是sessionstorage还是sessionstorage可视情况而定
   * 4.这里已经实现了页签的管理,面包屑的管理可以参考页签管理的处理方法,另外已知树结构里某一个节点的id,查找这个节点的所有父辈节点,这是处理面包屑导航的关键算法,已经
   * 在/Users/zhouqiansheng/Desktop/ztheme/src/assets/js/tools.js里面实现,如果需要的话可以直接调用,先调用getNavDateToSimpleJson方法把多层嵌套的json
   * 数据转成单层的json,让后调用getParentsById就可以获取所有父辈节点
   */

  // 送礼物页面的详情显示
  giftDetail: false,
  // 送礼物页面的新增显示
  giftDetalAdd: false,
  // 登陆框的显示隐藏
  loginHide: true,
  // 是否
  activeIndex: -1
}
const mutations = {
  /**
   * 点击logo旁边的列表按钮,展开活关闭左侧导航
   * @param state
   */
  unfoldSubNav (state) {
    state.unfold = !state.unfold
    state.dragerShow = !state.dragerShow
    if (state.unfold) {
      state.mWidth = '180px'
      state.menuClass = 'icon-tabulation'
    } else {
      state.mWidth = '0px'
      state.menuClass = 'icon-liebiao2'
    }
  },
  /**
   * 关闭页签
   * @param state
   * @param id
     */
  closeTag (state, id) {
    let arr = state.menus
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id == id) {
        arr.splice(i, 1)
        break
      }
    }
    TOOLS.setList('tags', arr)
  },
  /**
   * 点击左侧导航的时候添加页签
   * @param state
   * @param n
     */
  addTag (state, n) {
    let arrStr = ''
    var arr = []
    state.menus.forEach(function (item) {
      arrStr += JSON.stringify(item) + '|'
    })
    arr = arrStr.split('|')
    if (!arr.includes(JSON.stringify(n))) {
      state.menus.push(n)
      TOOLS.setList('tags', state.menus.reverse())
      state.activeIndex = 0
    } else {
      state.activeIndex = arr.indexOf(JSON.stringify(n))
    }
  },

  /**
   * 通过sessionstorage更新state.menus数据
   */
  updataMenus (state, n) {
    state.menus = [].concat(n)
  },

  /**
   * 点击左侧导航的时候添加breadcrumb
   * @param state
   * @param n
   */

  addBreadcrumb (state, n) {
    state.breadcrumb = []
    let getBreadcrumbObjList = TOOLS.getParentsById(TOOLS.getList('simpleJsonSubnavData'), n)
    state.breadcrumb = getBreadcrumbObjList.reverse()
    TOOLS.setList('breadcrumb', state.breadcrumb)
  },
  /**
   * 通过sessionstorage更新state.menus数据
   */
  updataBreadcrumb (state, n) {
    state.breadcrumb = [].concat(n)
  },

  /**
   * 点击左侧导航的时候添加当前节点的功能function按钮list
   * @param state
   * @param n
   */

  addFunctionList (state, n) {
    state.functionList = TOOLS.getFunctionListById(TOOLS.getList('simpleJsonSubnavData'), n)
    console.log(' state.functionList 当前页面的功能按钮list--------->' + JSON.stringify(state.functionList))
    TOOLS.setList('functionList', state.functionList)
  },
  /**
   * 通过sessionstorage更新state.functionList数据
   */
  updataFunctionList (state, n) {
    state.functionList = [].concat(n)
  },
  /**
  * 修改选中导航栏的下标
  */
  updateActiveIndex (state, index) {
    state.activeIndex = index
  },

  // 手动送礼品页面详情的显示操作
  giftDetailShow (state, index) {
    state.giftDetail = !state.giftDetail
  },
  // 送礼物页面的新增显示操作
  giftDetailAdd (state, index) {
    state.giftDetalAdd = !state.giftDetalAdd
  }
}
const actions = {
}
export default new Vuex.Store({
  state,
  mutations,
  actions
})
