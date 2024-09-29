<template>
  <div class="container">
    <div class="header">
      <span class="header-title">演示案例系统</span>
    </div>
    <div class="left">
      <draw-tool class="left-side"></draw-tool>
      <measure-tool class="left-side"></measure-tool>
      <reset-road class="left-side"></reset-road>
      <background-data class="left-side"></background-data>
      <side-slope class="left-side"></side-slope>
    </div>
    <div id="cesiumContainer"></div>
  </div>
</template>
<script>
import drawTool from "@/components/drawTool.vue";
import MeasureTool from "@/components/MeasureTool.vue";
import resetRoad from "@/components/resetRoad.vue";
import backgroundData from "@/components/BackgroundData.vue";
import SideSlope from "@/components/SideSlope.vue";
export default {
  name: "Home",
  components: {
    drawTool,
    MeasureTool,

    resetRoad,
    backgroundData,
    SideSlope,
  },
  data() {
    return {};
  },
  methods: {
    //加載地图
    initCesium() {
      window.viewer = tqsdk.scene.map.createMap("cesiumContainer", {
        fxaa: true,
        mouseOperation: false,
        //  fullscreenButton: true,
        requestRenderMode: false,
      });
      let layer = new tqsdk.layer.LayerCollection(window.viewer);
      layer.add(tqsdk.layer.syGDLayer.addVectorImage());
      //加载火星地形
      layer.add(tqsdk.layer.syTerrainLayer.add({
        url:"http://data.marsgis.cn/terrain",
      }));
      // window.viewer.scene.screenSpaceCameraController.enableTilt = false; //禁止相机倾斜
    },
  },
  mounted() {
    this.initCesium();
  },
  beforeDestroy() {
    viewer.destroyed();
  },
};
</script>
<style scoped>
.container {
  width: 100vw;
  height: 100vh;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.header {
  height: 50px;
  background: rgb(84, 92, 100);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header-title {
  display: inline-block;
  /* color: black; */
  /* background: rgb(84, 92, 100); */
  font-family: Arial;
  font-weight: bold;
  font-size: 24px;
  line-height: 50px;
  text-align: center;
}
.left {
  position: absolute;
  width: 300px;
  left: 25px;
  top: 60px;

  z-index: 3;
}
.left-side {
}
</style>
