<template>
    <div>
        <el-container class="container">
            <el-header>Header</el-header>
            <el-container>
         <el-aside class="aside" width="200px">Aside</el-aside>
         <el-main class="main">Main</el-main>
        </el-container>
</el-container>
    </div>
</template>

<script>
export default {

}
</script>

<style>
.container{
    height: 100%;
    background: yellow;
}
.aside{
     background: red;
}
.main{
    background: rgb(0, 255, 55);
}
</style>
