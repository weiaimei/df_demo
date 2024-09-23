<template>
  <div>
    <div class="toolMenu">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        tab-position="right"
        style="height: 400px"
      >
        <el-tab-pane label="路网信息专题" name="first"></el-tab-pane>
        <el-tab-pane label="高速公路边坡巡检专题" name="SideSlope"></el-tab-pane>
        <el-tab-pane label="路径还原专题" name="ResetRoad"></el-tab-pane>
        <el-tab-pane
          label="2，3维GIS数据展示能力"
          name="BackgroundData"
        ></el-tab-pane>
        <el-tab-pane label="标绘测量工具" name="MeasureTool"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="leftMenu">
      <div v-if="activeName == 'MeasureTool'">
        <div>标绘</div>
        <DrawTool></DrawTool>
        <div>测量</div>
        <MeasureTool></MeasureTool>
      </div>
      <div v-if="activeName == 'BackgroundData'">
        <BackgroundData></BackgroundData>
      </div>
      <div v-if="activeName == 'ResetRoad'">
        <ResetRoad></ResetRoad>
      </div>
      <div v-if="activeName == 'SideSlope'">
        <SideSlope></SideSlope>
      </div>
    </div>
  </div>
</template>

<script>
import DrawTool from "@/components/drawTool.vue";

// import UpFile from "@/components/UpFile.vue";
import ResetRoad from "@/components/resetRoad.vue";
import BackgroundData from "@/components/BackgroundData.vue";
import SideSlope from "@/components/SideSlope.vue";
import MeasureTool from "@/components/MeasureTool.vue";
export default {
  data() {
    return {
      activeName: "first",
    };
  },
  components: { MeasureTool, DrawTool, BackgroundData, ResetRoad, SideSlope },
  methods: {
    handleClick() {},
  },
};
</script>

<style scoped>
.toolMenu {
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
.leftMenu {
  position: absolute;
  top: 60px;
  left: 10px;
  z-index: 3;
  background: #fff;
  width: 300px;
  height: 500px;
}
</style>