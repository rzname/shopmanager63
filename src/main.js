// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import CusBread from './components/cusBread.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import moment from 'moment'
import HttpServer from './router/http'
// ElementUI其实vue插件，和vuerouter用法一样 vue.use（名）
// vue插件的使用
Vue.use(ElementUI)
Vue.use(HttpServer)

Vue.config.productionTip = false

// 全局过滤器
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD')
})

// 全局自定义组件
// Vue.component('CusBread', CusBread)
Vue.component(CusBread.name, CusBread)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
