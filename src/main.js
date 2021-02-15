// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import axios from 'axios'
import VueCookies from 'vue-cookies'
import bus from 'vue-bus'

Vue.use(VueCookies)
Vue.use(ElementUI)
Vue.use(bus)
Vue.prototype.$axios = axios

Vue.config.productionTip = false

// 设置反向代理，前端请求默认发送到 http://localhost:8625/api
// var axios = require('axios')
// axios.defaults.baseURL = 'http://localhost:8625/api'
// 全局注册，之后可在其他组件中通过 this.$axios 发送数据
// Vue.prototype.$axios = axios

router.beforeEach((to, from, next) => {
  document.title = to.meta.title + ' - smallFrog 书城'
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
