<template>
    <!-- el-card小的容器 可以理解为div -->
    <el-card class="box">
        <!-- 面包屑 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 搜索框 -->
        <el-row class="searchBox">
            <el-col>
                <el-input placeholder="请输入内容" v-model="query" class="searchInput" clearable @clear="getAllUsers()">
                    <el-button @click.prevent="searchUser()" slot="append" icon="el-icon-search">
                        <!-- 搜索按钮 -->
                    </el-button>
                </el-input>
                <el-button type="primary" @click="showDiaAddUser()">添加用户</el-button>
            </el-col>
        </el-row>

        <!-- 表格 -->
        <!-- el-table-column 控制列 -->
        <!-- label 控制的是表头 -->
        <!-- prop 控制的是该列中每一行单元格内容 -->
         <el-table :data="list" style="width: 100%">
            <el-table-column prop="id" label="#" width="80">
            </el-table-column>
            <el-table-column prop="username" label="姓名" width="100">
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="140">
            </el-table-column>
            <el-table-column prop="mobile" label="电话" width="140">
            </el-table-column>
            <!-- 过滤器fmtdate -->
            <!-- v-bind: -->
            <!-- create_time | fmtdate -->
            <el-table-column prop="create_time" label="创建日期" width="200">
                <!-- 可以实现 但是error -->
                <template slot-scope="scope">
                    <!-- 内层 list.row -->
                    {{scope.row.create_time|fmtdate}}
                </template>
            </el-table-column>
            <el-table-column prop="name" label="用户状态" width="120">
                <template slot-scope="scope">
                    <!-- 开关 -->
                    <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button type="primary" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 对话框  添加用户对话框 -->
        <el-dialog title="收货地址" :visible.sync="dialogFormVisibleAdd">
            <el-form label-position="left" label-width="80px" :model="formdata">
            <el-form-item label="用户名">
            <el-input v-model="formdata.username"></el-input>
            </el-form-item>
            <el-form-item label="密码">
            <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
         <el-input v-model="formdata.email"></el-input>
        </el-form-item>
         <el-form-item label="电话">
         <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
</el-form>
        <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisibleAdd = false">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: -1,
      // 15条  每页条数pagesize=2 -> 8页
      // pagenum
      // 表格数据
      list: [],
      dialogFormVisibleAdd: false,
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 添加用户 - 显示对话框
    showDiaAddUser () {
      this.dialogFormVisibleAdd = true
    },
    // 清空时获取所有用户
    getAllUsers () {
      // 此时 query 查询参数已经是''
      this.pagenum = 1
      this.getTableData()
    },
    // 搜索用户
    searchUser () {
      // query 数据默认""
      this.getTableData()
    },
    // 分页相关方法
    // 每页2条 -> 每页4条 -> 按照4条发送请求
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.pagenum = 1
      // this.pagesize = 4
      this.getTableData()
    },
    // 当前1页-> 点击2页 -> 获取第二页数据
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      // 根据新页码发送请求
      this.pagenum = val
      this.getTableData()
    },
    async getTableData () {
      // query查询参数
      // pagenum 当前页码 不能为空
      // pagesize每页显示的条数 不能为空
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      console.log(AUTH_TOKEN)
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      console.log(res)
      const {data, meta: {status}} = res.data
      if (status === 200) {
        this.total = data.total
        this.list = data.users
      }
    }
  }
}
</script>

<style>
.searchBox {
  margin-top: 20px;
}
.searchInput {
  width: 400px;
}
</style>
