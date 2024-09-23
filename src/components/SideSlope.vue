<template>
  <div>
    <div>
      <el-button
        type="primary"
        @click="apply(item)"
        class="design-btn"
        v-for="(item, index) in dataList"
        :key="index"
        >{{ item.name }}</el-button
      >
      <el-button type="primary" @click="mapProject(1)" class="design-btn"
        >照片投射</el-button
      >
      <el-button type="primary" @click="mapProject(0)" class="design-btn">
        视频投射
      </el-button>
      <el-button type="danger" @click="remove('data')" class="design-btn">
        清除
      </el-button>
    </div>
    <div>
      <el-button type="primary" @click="addDeviceIcon" class="design-btn"
        >设备分布</el-button
      >
      <el-button type="danger" @click="remove('device')" class="design-btn">
        清除
      </el-button>
    </div>
    <div>
      <el-button type="primary" @click="showProblem('icon')" class="design-btn">
        图标
      </el-button>
      <el-button
        type="primary"
        @click="showProblem('heatmap')"
        class="design-btn"
      >
        热力图
      </el-button>
      <el-button type="primary" class="design-btn"> 导出word </el-button>
      <el-button type="danger" @click="remove('problem')" class="design-btn">
        清除
      </el-button>
    </div>
    <DataDrawer
      ref="drawer"
      :drawer="drawerVisible"
      @closeDrawer="closeDrawer"
    />
  </div>
</template>
<script>
let init, draw, picking, popup, heatmap;
import { saveAs } from "file-saver";
import DataDrawer from "./son/dataDrawer.vue";
import {
  dataList,
  deviceList,
  problemList,
  heatmapoptions,
} from "@/data/sideSlope.js";
export default {
  components: { DataDrawer },

  data() {
    return {
      dataList: dataList,
      selectLayer: "",
      drawerVisible: false,
      entities: {
        device: [],
        problem: [],
      },
      videoMerge: "",
    };
  },
  mounted() {
    this.$nextTick(() => {
      init = new tqsdk.widgets.BackgroundData(window.viewer);
    });
  },
  methods: {
    async apply(v) {
      let type = v.type;
      if (type === "photo" || type === "video") {
        this.showDrawer(type);
      } else if (type === "panorama") {
        this.showPanorama(v);
      } else if (type === "dom") {
        this.showDom(v);
      } else if (type === "threeDTile") {
        this.showThreeDTile(v);
      }
    },
    closeDrawer() {
      this.drawerVisible = false;
    },
    showDrawer(item) {
      this.drawerVisible = true;
      this.$refs.drawer.setActiveName(item);
    },
    async showDom(item) {
      let layer = await init.addCustomTileLayer(item, true);
      this.selectLayer = layer;
      this.locateData();
    },
    async showThreeDTile(item) {
      try {
        let layer = await init.add3dtiles(item, true);
        this.selectLayer = layer;
        this.locateData();
      } catch (error) {
        console.log(`Error loading tileset: ${error}`);
      }
    },
    locateData() {
      if (this.selectLayer.datatype === "threeDTile") {
        window.viewer.flyTo(this.selectLayer.ly);
      } else if (this.selectLayer.datatype === "dom") {
        window.viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            111.376399,
            22.496896,
            300
          ),
        });
      }
    },
    mapProject(type) {
      let params = null;
      if (type == 1) {
        params = {
          url: require("../assets/image/1.jpg"),
          id: "1",
          alpha: 0.7,
          heading: Number.parseFloat(-136.1),
          pitch: Number.parseFloat(-89.9),
          roll: Number.parseFloat(+180),
          showFrustum: true,
          horizontal: 30,
          isEclosion: true,
          vertical: (Number.parseFloat(5460) / Number.parseFloat(8192)) * 100,
          far: 1000,
          type: type,
          coor: {
            lng: 111 + 22 / 60 + 31.43 / 3600,
            lat: 22 + 29 / 60 + 44.74 / 3600,
            alt: 559.8,
          },
          focalLength: 35,
          with: 8192,
          height: 5460,
        };
      } else {
        params = {
          url: require("../assets/image/8.mp4"),
          id: "2",
          alpha: 0.7,
          heading: Number.parseFloat(145),
          pitch: Number.parseFloat(-60),
          roll: Number.parseFloat(0),
          showFrustum: true,
          horizontal: 20,
          isEclosion: true,
          vertical: (Number.parseFloat(2160) / Number.parseFloat(3840)) * 100,
          far: 1000,
          type: type,
          coor: {
            lng: 111.37654163,
            lat: 22.49628785,
            alt: 283.9,
          },
          focalLength: 8.8,
          with: 3840,
          height: 2160,
        };
      }
      this.removeVideoMerge();
      this.videoMerge = new tqsdk.common.videoMerge.VideoMerge(
        window.viewer,
        params
      );
      this.videoMerge.setView();
      setTimeout(() => {
        this.videoMerge.play = true;
      }, 1000);
    },
    removeVideoMerge() {
      if (this.videoMerge) {
        this.videoMerge.destroy();
        this.videoMerge = undefined;
        return;
      }
    },
    remove(type) {
      if (type === "data") {
        init && init.removeAll();
        this.removeVideoMerge();
      } else if (type === "device") {
        if (this.entities.device.length) {
          this.entities.device.forEach((item) => {
            window.viewer.entities.remove(item);
            this.entities.device = [];
          });
          this.clearPop();
        }
      } else if (type === "problem") {
        if (this.entities.problem.length) {
          this.entities.problem.forEach((item) => {
            window.viewer.entities.remove(item);
          });
          this.entities.problem = [];
        }
        heatmap && heatmap.clear();
        heatmap.destroy();
      }
    },
    removeAll() {
      this.remove("data");
      this.remove("device");
      this.remove("problem");
      picking.destroy();
    },
    addDeviceIcon() {
      if (this.entities.device.length) return;
      let item = {
        name: "2.5维地形",
        type: "terrain",
        id: "64d6de1a-9761-4dc7-a6wwwf9sss-b71dd17771f4",
        isBaseMap: true,
        isShow: false,
        userId: "a4785bfe-7498-4a40-8f70-fadbad304729",
        thumbnail: undefined,
        extent: [113.1, 22.1, 113.9, 23.1],
        info: {
          url: "http://data.marsgis.cn/terrain",
          requestVertexNormals: true,
        },
        markLayer: [],
        colorAdjust: undefined,
      };
      init.addTerrain(item);
      deviceList.forEach((item) => {
        let entity = window.viewer.entities.add({
          position: new Cesium.Cartesian3.fromDegrees(
            item.position[0],
            item.position[1],
            item.position[2]
          ),
          billboard: item.style.billboard,
          label: item.style.label,
        });
        entity.type = item.type;
        entity.info = item.info;
        this.entities.device.push(entity);
      });
    },
    mapClick() {
      if (!picking) {
        picking = new Picking(window.viewer);
      }
      //左键单击
      picking.on("LEFT_CLICK", (e) => {
        let ob = picking.getObject(e);
        if (ob && ob.id && ob.id instanceof Cesium.Entity && ob.id.type) {
          let options = ob.id.info;
          this.initPop(options, e.position);
        } else {
          this.clearPop();
        }
      });
    },
    initPop(options, screenPosition) {
      let innerHTML = `
      <div><span class="title-t">名称：</span><span class="title-content">${options.name}</span></div>
      <div><span class="title-t">编号：</span><span class="title-content">${options.number}</span></div>
      <div><span class="title-t">状态：</span><span class="title-content">${options.state}</span></div>
      <div><span class="title-t">组织：</span><span class="title-content">${options.organize}</span></div>
      <div><span class="title-t">类型：</span><span class="title-content">${options.type}</span></div>
      <div><span class="title-t">生产厂商：</span><span class="title-content">${options.mader}</span></div>
      <div><span class="title-t">安装时间：</span><span class="title-content">${options.time}</span></div>
      <div><span class="title-t">位置：</span><span class="title-content">${options.position}</span></div>
      `;
      popup.add(innerHTML, screenPosition);
    },
    clearPop() {
      popup.show = false;
    },
    canvasToBase64(canvas, targetWidth, targetHeight) {
      if (!canvas) {
        return undefined;
      }
      return new Promise((resolve) => {
        let copyCanvas = document.createElement("canvas");
        var img = new Image();
        img.onload = () => {
          copyCanvas.width = targetWidth;
          copyCanvas.height = targetHeight;
          copyCanvas
            .getContext("2d")
            .drawImage(img, 0, 0, targetWidth, targetHeight);
          resolve(copyCanvas.toDataURL());
        };
        img.src = canvas.toDataURL();
      });
    },
    showProblem(type) {
      if (type === "icon") {
        if (this.entities.problem.length) return;
        problemList.forEach((item) => {
          let entity = window.viewer.entities.add({
            position: new Cesium.Cartesian3.fromDegrees(
              item.position[0],
              item.position[1],
              item.position[2]
            ),
            billboard: {
              color: Cesium.Color.fromCssColorString("#ffffff"),
              image: require("../assets/image/problem.png"),
              disableDepthTestDistance: 1e11,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0,
                1e7
              ),
              scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
              width: 64,
              height: 70,
              pixelOffset: new Cesium.Cartesian2(-5, 0),
              type: "Image",
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            },
          });
          this.entities.problem.push(entity);
        });
      } else if (type === "heatmap") {
        heatmap = new tqsdk.common.heatmap.Heatmap2D(
          window.viewer,
          heatmapoptions
        );
      }
    },
    exportHtmlToWord(htmlContent) {
      // 将 HTML 内容转换为 Blob 对象
      const blob = htmlDocx.asBlob(htmlContent);
      saveAs(blob, "边坡巡检问题报告.docx");
    },
  },
};
</script>
<style>
.design-btn {
  margin: 5px 8px;
}
</style>
