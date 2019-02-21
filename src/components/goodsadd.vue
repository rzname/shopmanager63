<template>
    <el-card class="box">
        <cus-bread level1='商品管理' level2='商品列表'></cus-bread>
        <el-alert class="alert" title="添加商品信息" type="info" center show-icon></el-alert>
        <el-steps :active="active*1" align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
        </el-steps>
        <!-- 标签页tab -->
        <el-form label-position="top" label-width="80px" :model="form">
            <el-tabs v-model="active" tab-position="left" @tab-click="changeTab()">
                <el-tab-pane label="基本信息" name="1" class="form">
                    <el-form-item label="商品名称">
                        <el-input v-model="form.goods_name"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格">
                        <el-input v-model="form.goods_price"></el-input>
                    </el-form-item>
                    <el-form-item label="商品重量">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品数量">
                        <el-input v-model="form.goods_number"></el-input>
                    </el-form-item>
                    <el-form-item label="商品分类">
                        {{selectedOptions}}
                        <el-cascader clearable :props="defaultProp" expand-trigger="hover" :options="options" v-model="selectedOptions" @change="handleChange">
                        </el-cascader>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="2" class="form">
                    <el-form-item :label="item1.attr_name" v-for="(item1) in arrDy" :key="item1.attr_id">
                        <el-checkbox-group v-model="item1.attr_vals">
                            <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i">
                              
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品属性" name="3" class="form">
                  <el-form-item :label="item.attr_name" v-for="(item) in arrStatic" :key="item.attr_id">
                    <el-input v-model="item.attr_vals"></el-input>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="4">
                  <el-form-item label="添加图片">
                    <!-- headers 设置请求头
                    1，必须全路径（）
                    2，必须授权
                     -->
                    <el-upload
                      :headers="headers"
                      action="http://localhost:8888/api/private/v1/upload"
                      :on-remove="handleRemove"
                      :on-success="handleSuccess"
                      list-type="picture">
                      <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                  </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="5">
                    <el-form-item>
                      <el-button @click="addGoods()">添加商品</el-button>
                      <quill-editor class="quill" v-model="form.goods_introduce"></quill-editor> 
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import { quillEditor } from "vue-quill-editor";

export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: "1",
      // 添加商品请求时的请求体
      form: {
        // 名称
        goods_name: "",
        // 分类
        goods_cat: "",
        // 价格
        goods_price: "",
        // 数量
        goods_number: "",
        // 重量
        goods_weight: "",
        // 介绍
        goods_introduce: "",
        // 图片
        pics: [],
        // 商品属性
        attrs: []
      },
      // 级联配置
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id"
        // children: "children"
      },
      // 动态参数的数组
      arrDy: [],
      // checkList:[]
      // 动态静态的数组
      arrStatic: [],
      headers: {
        Authorization: localStorage.getItem("token")
      }
    };
  },
  created() {
    this.getGoodsCate();
  },
  methods: {
    // 商品内容
    async addGoods() {
      //  goods_cat
      this.form.goods_cat = this.selectedOptions.join(",");
      this.pics;
      // 处理动态
      const arr1 = this.arrDy.map((item)=>{
        return {attr_id:item.attr_id , attr_value:item.attr_vals};
      })
      const arr2 = this.arrDy.map((item)=>{
        return {attr_id:item.attr_id , attr_value:item.attr_vals};
      })
      // const obj1 = { arr_id: "", attr_value: "" };
      // const arr1 = [];
      // this.arrDy.forEach(item => {
      //   obj1.attr_id = item.attr_id;
      //   obj1.attr_value = item.attr_vals;
      //   arr1.push(obj1);
      // });
      // 处理静态
      // const obj2 = { arr_id: "", attr_value: "" };
      // const arr2 = [];
      // this.arrDy.forEach(item => {
      //   obj2.attr_id = item.attr_id;
      //   obj2.attr_value = item.attr_vals;
      //   arr2.push(obj2);
      // });
      this.form.attrs = [...arr1, ...arr2];
      // console.log(this.form);
      const res = await this.$http.post(`goods`, this.form);
      console.log(res);
      const { meta: { msg, status } } = res.data;
      if (status === 201) {
        this.$message.success(msg)
        // 列表
        this.$router.push({
          name: "goods"
        })
      } else {
        this.$message.error(msg);
      }
    },
    // 图片上传
    // 移除x
    handleRemove(file, fileList) {
      // console.log(file);
      // 找数组中符合条件的索引
      // 找下标第二种方法
      const Index = this.form.pics.findIndex(item=>{
        return item.pic === file.response.data.tmp_path;
      })
      // 第一种方法找下标
      // const Index = this.form.pics.map(item => {
      //   return item.pic === file.response.data.tmp_path;
      // });
      this.form.pics.splice(Index, 1);
    },
    // 假上传成功
    handleSuccess(res, file, fileList) {
      // console.log(res);
      const tmpPath = res.data.tmp_path;
      this.form.pics.push({
        pic: tmpPath
      });
      // console.log(this.form.pics);
    },
    // 点击任何tab触发
    async changeTab() {
      // 前提  点击第二个
      if (this.active === "2" || this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.error("请先选中三级分类");
          // 清空
          if (this.active === "2") {
            this.arrDy = [];
          } else {
            this.arrStatic = [];
          }
          return;
        }

        // 获取动态数据
        if (this.active === "2") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=many`
          );
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrDy = data;
            console.log("静态动态数据");
            this.arrDy.forEach(item => {
              item.attr_vals =
                item.attr_vals.trim().length === 0
                  ? []
                  : item.attr_vals.trim().split(",");
              // item.attr_vals = item.attr_vals.trim().split(",")
            });
          }
        }
        // 获取静态数据
        if (this.active === "3") {
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          const { meta: { msg, status }, data } = res.data;
          if (status === 200) {
            this.arrStatic = data;
            console.log("静态参数数据");
          }
        }
      }
    },
    //  获取三级分类的数据
    handleChange() {},
    async getGoodsCate() {
      // type 的值【123】
      const res = await this.$http.get(`categories?type=3`);
      // console.log(res);
      const { meta: { msg, status }, data } = res.data;
      if (status === 200) {
        this.options = data;
        // console.log(this.options);
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.alert {
  margin-bottom: 20px;
  margin-top: 20px;
}
.form {
  height: 400px;
  overflow: auto;
}
.ql-editor,
.ql-blank {
  min-height: 200px;
}
</style>
