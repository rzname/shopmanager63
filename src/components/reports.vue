<template>
    <el-card class="box">
        <cus-bread level1="商品管理" level2="数据报表"></cus-bread>
         <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
</template>

<script>
import MyEcharts from "echarts";
export default {
  data() {
    return {};
  },
  mounted() {
    this.initEcharts();
  },
  methods: {
    async initEcharts() {
        const myChart = MyEcharts.init(document.getElementById("main"));
      // 指定图表的配置项和数据

      //   请求数据
      const res = await this.$http.get(`reports/type/1`);
      console.log(res);
      const option2 = res.data.data;
      const option1 = {
        title: {
          text: "堆叠区域图"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };
        const option = {...option2,...option1}
        myChart.setOption(option);
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
</style>
