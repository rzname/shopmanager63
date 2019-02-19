<template>
    <el-card class="box">
        <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
         <el-button class="btn" type="primary">添加角色</el-button>
        <!-- 表格 -->
        <el-table :data="list" style="width: 100%">
            <el-table-column type="expand">
                <template slot-scope="scope">
                    <!-- 行列 -->
                    <el-row class="level1" v-for="(item1) in scope.row.children" :key="item1.id">
                        <el-col :span="4">
                            <el-tag @close="deleRights(scope.row,item1)" closable type="danger">{{item1.authName}}</el-tag>
                            <i class="el-icon-arrow-right"></i>
                        </el-col>
                        <el-col :span="20">
                            <el-row class="level2" v-for="(item2) in item1.children" :key="item2.id">
                                <el-col :span="4">
                                    <el-tag type="info" closable @close="deleRights(scope.row,item2)">
                                        {{item2.authName}}
                                    </el-tag>
                                    <i class="el-icon-arrow-right"></i>
                                </el-col>
                            <el-col :span="20">
                                <el-tag @close="deleRights(scope.row,item3)" closable type="warning" v-for="(item3) in item2.children" :key="item3.id">
                                    {{item3.authName}}
                                </el-tag>
                            </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                    <el-row v-if="scope.row.children.length===0">
                        <el-col>
                            <span>未分配权限</span>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="140">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="160">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述" width="200">
            </el-table-column>
            <el-table-column prop="name" label="操作" width="400">
                <template slot-scope="scope">
                    <el-button @click="showDiaEdit(scope.row)" icon="el-icon-edit" circle size="mini" plain></el-button>
                    <el-button @click="showMsgdelete(scope.row)" type="primary" icon="el-icon-delete" circle size="mini" plain></el-button>
                    <el-button @click="showDiaSetRights(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
                </template>
            </el-table-column>
            <!-- 对话框删除 -->
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibledelee = false">取 消</el-button>
                <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
        </el-table>
        <!-- 对话框删编辑 -->
            <el-dialog title="编辑角色" :visible.sync="dialogFormVisibleEdit">
                <el-form label-position="left" label-width="80px" :model="formdata">
                <el-form-item label="角色名称">
                <el-input disabled v-model="formdata.roleName"></el-input>
            </el-form-item>
            <el-form-item label="角色描述">
                <el-input v-model="formdata.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
          <el-button type="primary" @click="editUser()">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 对话框 分配权限-->
        <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
            <!--  -->
            <el-tree :data="treedata"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="arrCheck"
                :props="defaultProps"
                ref="treeDom">
            </el-tree>
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
</template>

<script>
export default {
  data () {
    return {
      list: [],
      dialogFormVisibledelee: false,
      dialogFormVisibleEdit: false,
      dialogFormVisible: false,
      // 树形结构绑定数据
      treedata: [],
      // 默认选中的数据【被选中节点id】
      arrCheck: [],
      // 配置选项
      defaultProps: {
        // label 和 children 值来源于树形结构绑定数据treedata中的key名 ，“label”
        label: 'authName',
        children: 'children'
      },
      formdata: {
        roleName: '',
        roleDesc: ''
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    // 分配权限
    async setRights () {
      const arr1 = this.$refs.treeDom.getCheckedKeys()
      // console.log(arr1)
      const arr2 = this.$refs.treeDom.getHalfCheckedKeys()
      // console.log(arr2)
      const arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.currRoleId}/rights`, {
        rids: arr.join(',')
      })
      // console.log(res)
      if (res.data.meta.status === 200) {
        this.dialogFormVisible = false
        this.getTableData()
      }
    },
    // 点叉号 取消权限
    async deleRights (role, rights) {
    //   console.log(role, rights);
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${rights.id}`
      )
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        // 提示
        this.$message.success(msg)
        // 跟新
        // this.getTableData()
        // 只更新当前角色的权限
        role.children = data
      }
    },
    // 编辑操作按钮
    async showDiaSetRights (role) {
      this.currRoleId = role.id
      this.dialogFormVisible = true
      const res = await this.$http.get(`rights/tree`)
      // console.log(res)
      const {meta: {msg, status}, data} = res.data
      if (status === 200) {
        this.treedata = data
        // 取出每一行节点的id
      }
      const temp = []
      role.children.forEach(item1 => {
        // temp.push(item1.id)
        item1.children.forEach(item2 => {
          // temp.push(item2.id)
          item2.children.forEach(item3 => {
            temp.push(item3.id)
          })
        })
      })
      this.arrCheck = temp
    },

    // 编辑发送请求
    async editUser () {
      const res = await this.$http.put(
        `roles/${this.formdata.id}`,
        this.formdata
      )
      //   console.log(res);
      const { data, meta: { status, msg } } = res.data
      if (status === 200) {
        this.dialogFormVisibleEdit = false
        this.getTableData()
      }
    },

    // 编辑 - 弹出对话框
    async showDiaEdit (user) {
      // console.log(user);
      // this.formdata = user
      const res = await this.$http.get(`roles/${user.id}`)
      this.formdata = res.data.data
      //   console.log(this.formdata)
      this.formdata.id = user.id
      this.dialogFormVisibleEdit = true
    },

    // 删除 - 弹出确认框
    showMsgdelete (user) {
      // console.log(user);

      this.$confirm('是否删除用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送请求
          const res = await this.$http.delete(`roles/${user.id}`)
          //   console.log(res);
          const { meta: { msg, status } } = res.data
          if (status === 200) {
            // 提示框
            this.$message.success(msg)
            // 跟新表格
            this.pagenum = 1
            this.getTableData()
          }
        })
        .catch(() => {
          this.$message.success('取消删除')
        })
    },

    // 获取用户数据
    async getTableData () {
      const res = await this.$http.get(`roles`)
      //   console.log(res);
      const { data, meta: { status, msg } } = res.data
      if (status === 200) {
        this.list = data
      }
    }
  }
}

</script>

<style>
.box {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level1,
.level2 {
  margin-bottom: 10px;
}
</style>
