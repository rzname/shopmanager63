<template>
        <el-container class="container" >
            <!-- 顶部 -->
            <el-header>
                <el-row>
                    <el-col :span="4">
                        <div class="grid-content bg-purple">
                            <img src="../assets/logo.png" alt="">
                        </div></el-col>
                    <el-col :span="19" class="maddle">
                        <div class="grid-content bg-purple-light">
                            <h2>电商后台管理系统</h2>
                        </div>
                    </el-col>
                    <el-col :span="1">
                        <div class="grid-content bg-purple">
                            <a href="#" class="loginout" @click.prevent="handleLoginout()">退出</a>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
        <el-container>
            <el-aside class="aside" width="200px">
             <!-- 导航 -->
                <el-menu default-active="1" :router="true" :unique-opened="true">
                    <!-- 用户管理 -->
                    <el-submenu :index="item1.order+''" v-for="(item1) in menus" :key="item1.id">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{item1.authName}}</span>
                        </template>
                        <el-menu-item :index="item2.path+''" v-for="(item2) in item1.children" :key="item2.id">
                            <i class="el-icon-menu">{{item2.authName}}</i></el-menu-item>
                    </el-submenu>
                    <!-- 权限管理 -->
                    <!-- <el-submenu index="2">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>权限管理</span>
                        </template>
                        <el-menu-item index="roles"><i class="el-icon-menu"></i>角色列表</el-menu-item>
                        <el-menu-item index="rights"><i class="el-icon-menu"></i>权限列表</el-menu-item>
                    </el-submenu> -->
                    <!-- 商品 -->
                    <!-- <el-submenu index="3">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>商品管理</span>
                        </template>
                        <el-menu-item index="1-1"><i class="el-icon-menu"></i>商品列表</el-menu-item>
                        <el-menu-item index="1-1"><i class="el-icon-menu"></i>分类列表</el-menu-item>
                        <el-menu-item index="1-1"><i class="el-icon-menu"></i>商品分类</el-menu-item>
                    </el-submenu> -->
                    <!-- 订单 -->
                    <!-- <el-submenu index="4">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>订单管理</span>
                        </template>
                        <el-menu-item index="1-1"><i class="el-icon-menu"></i>订单列表</el-menu-item>
                    </el-submenu> -->
                    <!-- 数据统计 -->
                    <!-- <el-submenu index="5">
                        <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>数据统计</span>
                        </template>
                        <el-menu-item index="1-1"><i class="el-icon-menu"></i>数据报表</el-menu-item>
                    </el-submenu> -->
                </el-menu>
            </el-aside>
            <el-main class="main"><router-view></router-view></el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
  data () {
    return {
      menus: []
    }
  },
  // 付过用户没有登录，/标识匹配是，不能进入home。vue -》显示login。vue
  // if(有没有正确的token){渲染}
  // if（没有token）{改login ， 显示login}
  beforeMount () {
    // console.log('beforeMount-----')
    if (!localStorage.getItem('token')) {
      this.$router.push({
        name: 'login'
      })
    }
  },
  created () {
    this.getMenus()
  },
  methods: {
    async getMenus () {
      // 角色超级管理->超管的token -> 请求菜单
      // admin登录 -> 主管-> 所有权限 -> 主管的token
      const res = await this.$http.get(`menus`)
      //   console.log(res)
      const {meta: {status}, data} = res.data
      if (status === 200) {
        this.menus = data
        // console.log(this.menus)
      }
    },
    handleLoginout () {
      // 1，清楚token、
      localStorage.clear('token')
      this.$router.push({
        name: 'login'
      })
      this.$message.warning('退出登录')
    }
  }
}
</script>

<style>
.container{
    height: 100%;
    background: #b3c0d1;
}
.main{
    background: gray;
}
.maddle{
    line-height: 60px;
    text-align: center;
}
.loginout{
    text-decoration: none;
    line-height: 60px;
    text-align: center;
}
</style>
