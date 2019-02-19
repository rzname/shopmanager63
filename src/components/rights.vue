<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb> -->
        <!-- 封装 希望用法 -->
        <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
    <!-- 表格 -->
    <el-table height="450" :data="list" style="width: 100%">
            <el-table-column type="index" label="#" width="80">
            </el-table-column>
            <el-table-column prop="authName" label="角色名称" width="160">
            </el-table-column>
            <el-table-column prop="path" label="路径" width="140">
            </el-table-column>
            <el-table-column label="层级" width="140">
                <template slot-scope="scope">
                  <span v-if="scope.row.level==='0'">一级</span>
                  <span v-if="scope.row.level==='1'">二级</span>
                  <span v-if="scope.row.level==='2'">三级</span>
                </template>
            </el-table-column>
    </el-table>
    </el-card>

</template>

<script>
export default {
  data () {
    return {
      list: []
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    async getTableData () {
      const res = await this.$http.get(`rights/list`)
      console.log(res)
      const {data, meta: {status}} = res.data
      if (status === 200) {
        this.list = data
      }
    },
    setRights () {}
  }
}
</script>

<style>
.box{
    height: 100%;
}
.btn{
    margin-top: 20px;
}
</style>
