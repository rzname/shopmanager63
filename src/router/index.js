import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'
import Goodslist from '@/components/goodslist.vue'
import Goodsadd from '@/components/goodsadd.vue'
import Gateparams from '@/components/cateparams.vue'
import Goodscate from '@/components/goodscate.vue'
import { Message } from 'element-ui'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    }, {
      name: 'home',
      path: '/',
      component: Home,
      children: [{
        name: 'Users',
        path: '/users',
        component: Users
      }, {
        name: 'rights',
        path: '/rights',
        component: Rights
      }, {
        name: 'roles',
        path: '/roles',
        component: Roles
      }, {
        name: 'goods',
        path: '/goods',
        component: Goodslist
      }, {
        name: 'goodsadd',
        path: '/goodsadd',
        component: Goodsadd
      }, {
        // 分类参数路由
        name: 'params',
        path: '/params',
        component: Gateparams
      },
      {
        name: 'categories',
        path: '/categories',
        component: Goodscate
      }
      ]
    }
  ]
})
// 路由导航守卫（保安）
// 在路由配置生效前，代码自动来到下边
// to 要去的路由信息
// from 当前路由配置对象
router.beforeEach((to, from, next) => {
  // console.log(to)
  // 让路由配置继续生效
  // 要去的是登录
  if (to.name === 'login') {
    next()
  } else {
    // 如果要去的不是登录
    // if token 渲染home
    const token = localStorage.getItem('token')
    if (!token) {
      // 提示
      Message.warning('请登录')
      router.push({ name: 'login' })
      return
    }
    next()
  }
})

export default router
