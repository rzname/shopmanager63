<template>
    <!-- 用户列表完成 -->
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
                    <el-switch @change="changeState(scope.row)" v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="showDiaEditUser(scope.row)" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button @click="showMsgBox(scope.row)" type="primary" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button @click="showDiaSetRole(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
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
          <el-button type="primary" @click="addUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 对话框  编辑代码 -->
      <el-dialog title="收货地址" :visible.sync="dialogFormVisibleEdit">
        <el-form label-position="left" label-width="80px" :model="formdata">
            <el-form-item label="用户名">
              <el-input disabled v-model="formdata.username"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="formdata.email"></el-input>
            </el-form-item>
            <el-form-item label="电话">
              <el-input v-model="formdata.mobile"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 对话框 分配角色 -->
      <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
        <el-form :model="formdata" label-position="left" label-width="80px">
          <el-form-item label="用户名">
            {{currUsername}}
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="selectVal" placeholder="请选择角色名称">
              <el-option label="请选择" :value="-1"></el-option>
              <!-- 其余5个动态生成 -->
              <el-option :label="item.roleName" :value="item.id" v-for="(item) in roles" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
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
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      formdata: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 下拉框使用数据
      selectVal: -1,
      // 保存角色的数组
      roles: [],
      currUsername: '',
      currUserid: -1
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 分配角色 - 发请求
    async setRole () {
      const res = await this.$http.put(`users/${this.currUserid}/role`, {
        rid: this.selectVal
      })
      console.log(res)
      const {meta: {msg, status}} = res.data
      if (status === 200) {
        this.dialogFormVisibleRole = false
        this.$message.success(msg)
      }
    },
    // 分配角色 - 显示对话框
    async showDiaSetRole (user) {
      this.currUserid = user.id
      console.log(this.currUserid)
      this.currUsername = user.username
      this.dialogFormVisibleRole = true
      // 获取所有角色名称
      const res = await this.$http.get(`roles`)
      // console.log(res);
      const {meta: {status}, data} = res.data
      if (status === 200) {
        this.roles = data
        console.log(this.roles)
      }
      // 获取当前用户角色id
      const res2 = await this.$http.get(`users/${user.id}`)
      console.log(res2)
      //  const {meta:{msg2,status2},data2} = res2.data2
      //  if(status2===200){
      //    this.selectVal = data2.rid
      //  }
      this.selectVal = res2.data.data.rid
    },
    // 修改用户状态
    async changeState (user) {
      // users/:uId/state/:type
      const res = await this.$http.put(`users/${user.id}/state/${user.mg_state}`)
      // console.log(res);
      const {meta: {status, msg}} = res.data
      if (status === 200) {
        this.$message.success(msg)
      }
    },
    // 用户列表-编辑按钮
    async editUser () {
      const res = await this.$http.put(`users/${this.formdata.id}`, this.formdata)
      console.log(res)
      const {meta: {status}} = res.data
      if (status === 200) {
        // 关闭对话框
        this.dialogFormVisibleEdit = false
        // 跟新表格
        this.getTableData()
      }
    },
    // 编辑中的显示对话框
    showDiaEditUser (user) {
      this.formdata = user
      this.dialogFormVisibleEdit = true
    },
    // 用户列表- 删除按钮
    showMsgBox (user) {
      // console.log(user);

      this.$confirm('是否删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 发送请求
        const res = await this.$http.delete(`users/${user.id}`)
        console.log(res)
        const {meta: {msg, status}} = res.data
        if (status === 200) {
          // 提示框
          this.$message.success(msg)
          // 跟新表格
          this.pagenum = 1
          this.getTableData()
        }
      }).catch(() => {
        this.$message.success('已取消删除')
      })
    },
    // 添加用户 - 发送请求
    async addUser () {
      // 获取表单数据
      const res = await this.$http.post(`users`, this.formdata)
      console.log(res)
      // 关闭对话框
      this.dialogFormVisibleAdd = false
      // 跟新表格
      this.getTableData()
    },
    // 添加用户 - 显示对话框
    showDiaAddUser () {
      // 清空
      this.formdata = {}
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
      // console.log(`当前页: ${val}`)
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
      // console.log(AUTH_TOKEN)
      const res = await this.$http.get(`users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`)
      // console.log(res)
      const {data, meta: {status}} = res.data
      if (status === 200) {
        // 这是总条数
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
