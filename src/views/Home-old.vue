<template>
  <div class="container">
    <div id="cesiumContainer"></div>
    <div class="left">
      <div class="text">标会工具</div>
      <draw-tool></draw-tool>
      <UpFile @addJson="importMeasuring"></UpFile>
      <a-button type="primary" @click="downloadAll" class="design-btn"
        >导出</a-button
      >
      <div class="text">测量工具</div>
      <measure-tool></measure-tool>
      <div class="text">路径还原</div>
      <reset-road></reset-road>
      <div class="text">二、三维数据</div>
      <background-data></background-data>
    </div>
    <div class="right">
      <div class="text">边坡</div>
      <side-slope></side-slope>
    </div>
  </div>
</template>
<script>
import drawTool from "@/components/drawTool.vue";
import MeasureTool from "@/components/MeasureTool.vue";
import UpFile from "@/components/UpFile.vue";
import resetRoad from "@/components/resetRoad.vue";
import backgroundData from "@/components/BackgroundData.vue";
import SideSlope from "@/components/SideSlope.vue";
let measureToolDown;
export default {
  name: "Home",
  components: {
    drawTool,
    MeasureTool,
    UpFile,
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
      layer.add(tqsdk.layer.syBingLayer.addImage());
      //window.viewer.scene.screenSpaceCameraController.enableTilt = false; //禁止相机倾斜
    },
    importMeasuring(v) {
      measureTool.importJson(v).then((data) => {
        data.flyTo();
      });
    },
    //全部下載
    downloadAll() {
      measureToolDown.downloadAll();
    },
  },
  mounted() {
    this.initCesium();
    measureToolDown = new tqsdk.widgets.MeasureTool(window.viewer);
  },
  beforeDestroy() {
    viewer.destroyed();
  },
};
</script>
<style>
.container {
  width: 100vw;
  height: 100vh;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.left {
  position: absolute;
  width: 300px;
  left: 25px;
  top: 60px;
  border: 1px solid rgba((128, 128, 0.5), green, blue, alpha);
  background: rgba(29, 30, 31, 0.356);
  box-shadow: 0 4px 8px rgb(128, 128, 128, 128/50%);
}
.right {
  position: absolute;
  width: 300px;
  left: 350px;
  top: 60px;
  background: rgba(29, 30, 31, 0.356);
  box-shadow: 0 4px 8px rgb(128, 128, 128, 128/50%);
}
.text {
  margin: 10px;
  color: white;
}
.design-btn {
  width: 100px;
  height: 32px;
  margin: 8px;
}
</style>
