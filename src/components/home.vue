<template>

        <el-container class="container">
            <el-row>
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
                <el-col :span="8"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
        <el-container>
         <el-aside class="aside" width="200px">Aside</el-aside>
         <el-main class="main">Main</el-main>
        </el-container>
</el-container>
</template>

<script>
export default {}
</script>

<style>
.container {
  height: 100%;
  background: yellow;
}
.aside {
  background: red;
}
.main {
  background: rgb(0, 255, 55);
}
</style>
