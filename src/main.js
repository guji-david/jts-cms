// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import '../static/css/font-awesome-4.7.0/css/font-awesome.css'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import '../static/css/font/iconfont.css'
import '../static/css/base.less'
import store from './store'
import router from './router'
import VueDND from 'awe-dnd'

Vue.use(ElementUI)
Vue.use(VueDND)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
