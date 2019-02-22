// 让axios变成Vue插件
// 把axios 相关代码封装成Vue插件
// 结果 在main.js可以 Vue.use（axios）
import axios from 'axios'
import { Message } from 'element-ui'
// Vue插件
const HttpServer = {}
HttpServer.install = function (Vue) {
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 请求拦截器拦截器
  axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么

    // heders 请求头
    // url 请求标识的路径
    // 如果请求时login ， 直接发送请求
    if (config.url !== 'login') {
      const AUTH_TOKEN = localStorage.getItem('token')
      // config.headers.common['Authorization'] = AUTH_TOKEN
      config.headers['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
  // 响应拦截器
  axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log('res拦截器被触发')
    console.log('response')
    const { meta: { status, msg } } = response.data
    if (status !== 200 && status !== 201) {
      Message.warning(msg)
    }
    return response
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
  )

  Vue.prototype.$http = axios
}
export default HttpServer
