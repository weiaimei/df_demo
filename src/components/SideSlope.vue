<template>
  <div>
    <el-row>
      <el-col>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <span>关于边坡功能</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                index="1-1"
                @click="apply(item)"
                class="design-btn"
                v-for="(item, index) in dataList"
                :key="index"
                >{{ item.name }}</el-menu-item
              >
              <el-menu-item @click="mapProject(1)" index="1-2"
                >照片投射</el-menu-item
              >
              <el-menu-item @click="mapProject(0)" index="1-8"
                >视频投射</el-menu-item
              >
              <el-menu-item @click="remove('data')" index="1-3"
                >清除</el-menu-item
              >
              <el-menu-item @click="addDeviceIcon" index="1-4"
                >设备分布</el-menu-item
              >
              <el-menu-item @click="remove('device')" index="1-5"
                >清除</el-menu-item
              >
              <el-menu-item @click="showProblem('icon')" index="1-6"
                >图标</el-menu-item
              >
              <el-menu-item @click="showProblem('heatmap')" index="1-7"
                >热力图</el-menu-item
              >
              <el-menu-item @click="createDocx" index="1-8"
                >导出文件</el-menu-item
              >
              <el-menu-item @click="remove('problem')" index="1-9"
                >清除</el-menu-item
              >
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
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
import htmlDocx from "html-docx-js/dist/html-docx";
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
      init = new tqsdk.widgets.BackgroundData(window.viewer, "cesiumContainer");
      if (!popup) {
        popup = new tqsdk.widgets.AirRoute.Popup({
          id: "popid",
          parentNode: undefined,
          width: 100,
          height: 50,
          pixelOffset: {
            x: 15,
            y: -80,
          },
        });
      }
      draw = new tqsdk.scene.Interaction.Draw(window.viewer);
      this.mapClick();
    });
  },
  destroyed() {
    this.removeAll();
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
    async showPanorama() {
      let item = {
        name: "720全景",
        type: "panor",
        id: "64d6de1a-9761-4dc7-a6f9-b71dd17771f44747",
        isShow: false,
        userId: "a4785bfe-7498-4a40-8f70-fadbad304729",
        thumbnail: null,
        info: {
          url: require("../assets/image/全景1.jpg"),
        },
        //调节图层是色调，饱和度，亮度，对比度等
        colorAdjust: undefined,
      };
      await init.addPanorama(item);
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
          destination: Cesium.Cartesian3.fromDegrees(126.61217, 43.7744, 1000),
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
          heading: Number.parseFloat(+50),
          pitch: Number.parseFloat(-54.5),
          roll: Number.parseFloat(+0.0),
          showFrustum: false,
          horizontal: 30,
          isEclosion: true,
          vertical: (Number.parseFloat(2160) / Number.parseFloat(3840)) * 100,
          far: 1000,
          type: type,
          coor: {
            lng: 113 + 17 / 60 + 28.62 / 3600,
            lat: 24 + 3 / 60 + 31.38 / 3600,
            alt: 559.887,
          },
          focalLength: 4.4,
          with: 3840,
          height: 2160,
        };
      } else {
        params = {
          url: "http://192.168.2.85/test/%E8%A7%86%E9%A2%91/video/8.mp4",
          id: "2",
          alpha: 0.7,
          heading: Number.parseFloat(110),
          pitch: Number.parseFloat(-55),
          roll: Number.parseFloat(10),
          showFrustum: false,
          horizontal: 20,
          isEclosion: true,
          vertical: (Number.parseFloat(2160) / Number.parseFloat(3840)) * 100,
          far: 1000,
          type: type,
          coor: {
            lng: 113.29054,
            lat: 24.059176,
            alt: 113.982,
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
          // label: item.style.label,
        });
        entity.type = item.type;
        entity.info = item.info;
        this.entities.device.push(entity);
      });
      window.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          113.221263167,
          23.978080651,
          1000
        ),
      });
    },
    mapClick() {
      console.log(1111);
      if (!picking) {
        picking = new tqsdk.scene.Interaction.Picking(window.viewer);
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
      console.log(111);
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
    async createDocx() {
      let KZhuang = "K43+914";
      let time = "2024/08/29 09:46:02";
      let base64Url = await this.canvasToBase64(viewer.scene.canvas, 550, 250);

      const htmlContent = `<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta http-equiv="Content-Style-Type" content="text/css" />
    <meta name="generator" content="Aspose.Words for .NET 15.1.0.0" />
    <title></title>
  </head>
  <body>
    <div>
      <h1
        style="
          font-size: 22pt;
          line-height: 115%;
          margin: 24pt 0pt 0pt;
          page-break-after: avoid;
          page-break-inside: avoid;
          text-align: center;
        "
      >
        <span
          style="
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            line-height: 60px;
          "
          >关于路段边坡巡检发现问题</span
        >
      </h1>
      <p style="margin: 0pt 0pt 0pt 18pt">
        <span style="font-size: 20px; font-weight: bold; line-height: 60px"
          >一、名称:</span
        >
        <span style="font-family: 宋体; font-size: 12pt">
           K43+914+500_填平区_刘屋互通CK0+207~308左侧
          排水沟堵塞2024/05/24</span
        >
      </p>
      <p style="margin: 0pt 0pt 0pt 18pt">
        <span style="font-size: 20px; font-weight: bold; line-height: 60px"
          >二、问题概要</span
        >
      </p>
      <p style="margin: 0pt 0pt 0pt 18pt">
        <span style="text-indent: 2em; margin: 10px 0"
          >桩号：&nbsp;${KZhuang}</span
        >
      </p>
      <p style="margin: 0pt 0pt 0pt 18pt">
        <span style="text-indent: 2em; margin: 10px 0"
          >报告时间：&nbsp;${time}</span
        >
      </p>
      <p style="margin: 0pt 0pt 0pt 18pt">
        <span style="font-size: 20px; font-weight: bold; line-height: 60px"
          >三、报告内容</span
        >
      </p>
      <p style="margin: 0pt 0pt 0pt 18pt">
        <span style="text-indent: 2em; margin: 10px 0"
          >巡视对象： K43+914+500_填平区_刘屋互通CK0+207~308左侧
          严重程度：严重
          巡查时间：2024年09月03日
        
         </span
        >
       <p style="text-align: center;margin-bottom: 20px">
    <img src="${base64Url}" alt="" style='width:600px'></p>
      </p>
     
    </div>
  </body>
</html>
`;

      this.exportHtmlToWord(htmlContent);
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
              image: require("../assets/image/滑坡.png"),
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
        window.viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            113.29447297,
            24.06380792,
            1000
          ),
        });
      } else if (type === "heatmap") {
        heatmap = new tqsdk.common.heatmap.Heatmap2D(
          window.viewer,
          heatmapoptions
        );
        window.viewer.camera.setView({
          destination: Cesium.Cartesian3.fromDegrees(
            113.204445121,
            23.97592431,
            46.27
          ),
        });
      }
    },
    exportHtmlToWord(htmlContent) {
      // 将 HTML 内容转换为 Blob 对象
      const blob = htmlDocx.asBlob(htmlContent);
      saveAs(blob, "路段边坡巡检问题.docx");
    },
  },
};
</script>
<style></style>
