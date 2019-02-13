// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
Vue.prototype.$http = axios

// ElementUI其实vue插件，和vuerouter用法一样 vue.use（名）
// vue插件的使用
Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
