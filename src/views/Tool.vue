<template>
  <div class="toolMunu">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      tab-position="right"
      style="height: 400px"
    >
      <el-tab-pane label="路网信息专题" name="first"></el-tab-pane>
      <el-tab-pane label="高速公路边坡巡检专题" name="second"></el-tab-pane>
      <el-tab-pane label="路径还原专题" name="third"></el-tab-pane>
      <el-tab-pane label="2，3维GIS数据展示能力" name="fourth"></el-tab-pane>
      <el-tab-pane label="标绘测量工具" name="six"></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  methods: {
    handleClick() {},
  },
};
</script>

<style scoped>
.toolMunu {
  width: 190px;
  height: 420px;
  background: #373232de;
  position: absolute;
  top: 60px;
  right: 10px;
  z-index: 3;
  border-radius: 5px;
  color: #fff;
  margin: 0 15px;
}
/deep/ .el-tabs__item {
  color: #fff;
}
</style>