<template>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{level1}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{level2}}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
// 封装函数技巧
// 1，把重复代码当成函数体
// 2，把变化的量当成函数形参
export default {
  name: 'cusBread',
  data () {
    return {
      // leve1:'权限管理',
      // leve2:'权限列表'
    }
  },
  // leve1与leve2的值来源于外部，但是data的数据的值来源于自己本身
  // 此时，要把数据的声明选项props
  // 1，props的选项
  // 2，props的值可以是字符串的数组
  // 3，leve1与leve2的用法和data数据的用法一样
  // 4,props的特点值来源于外部，声明了leve1与leve2
  // 5，leve1与leve2就是将来用组件时的标签属性<自定义标签 leve1="">
  // 6，leve1与leve2在使用组件时 赋值
  props: ['level1', 'level2']
}
</script>

<style>

</style>
