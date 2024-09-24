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
      <el-button type="primary" class="design-btn" @click="createDocx">
        导出word
      </el-button>
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
          destination: Cesium.Cartesian3.fromDegrees(
            113.243634888,
            22.0486139,
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
      let phone = 123456789101;
      let KZhuang = "K43+914";
      let time = "2024/08/29 09:46:02";
      let reporter = "张三";
      let base64Url = await this.canvasToBase64(viewer.scene.canvas, 550, 250);

      const htmlContent = `<!DOCTYPE HTML>
<html>
  <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
      <meta http-equiv="Content-Style-Type" content="text/css">
      <meta name="generator" content="Aspose.Words for .NET 15.1.0.0">
      <title></title>
  </head>
  <body>
    <div>
      <h1 style="font-size:22pt; line-height:115%; margin:24pt 0pt 0pt; page-break-after:avoid; page-break-inside:avoid; text-align:center">
        <span style="font-family:宋体; font-size:22pt; font-weight:normal">边坡巡检问题报告</span>
      </h1>
      <p style="margin:0pt 0pt 0pt 18pt"><span style="font-family:宋体; font-size:12pt">&nbsp;</span></p>
      <table cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-left:0pt">
        <tbody>
          <tr style="height:32pt">
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:75.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">报告类型</span></p>
            </td>
            <td colspan="4" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:381.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">边坡冲刷问题报告</span></p>
            </td>
          </tr>
          <tr style="height:32pt">
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:65.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">报告名称</span></p>
            </td>
            <td colspan="4" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:381.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">K44 石窖二号桥(左侧)线外边坡巡查报告2024/08/29</span></p>
            </td>
          </tr>
          <tr style="height:20pt">
            <td rowspan="3" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:75.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">主体信息</span></p>
            </td>
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:75.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">报告人</span></p>
            </td>
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:94.2pt">
              <p style="margin:0pt">
                <span style="font-family:宋体; font-size:12pt">${reporter}</span>
              </p>
            </td>
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:75.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">联系电话</span></p>
            </td>
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:132.2pt">
              <p style="margin:0pt">
                <span style="font-family:宋体; font-size:12pt">${phone}</span>
              </p>
            </td>
          </tr>
          <tr style="height:20pt">
            <td colspan="1" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:147.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">桩号</span></p>
            </td>
            <td colspan="3" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:223.2pt">
              <p style="margin:0pt">
                <span style="font-family:宋体; font-size:12pt">${KZhuang}</span>
              </p>
            </td>
          </tr>
          <tr style="height:20pt">
            <td colspan="1" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:147.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">报告时间</span></p>
            </td>
            <td colspan="3" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:223.2pt">
              <p style="margin:0pt">
                <span style="font-family:宋体; font-size:12pt">${time}</span>
              </p>
            </td>
          </tr>
          <tr style="height:140.65pt">
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:61.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">报告内容</span></p>
            </td>
            <td colspan="4" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:381.2pt">
              <span style="font-family:宋体; font-size:12pt">边坡是山区地质灾害的重要源头，为了及时发现和解决边坡隐患，确保人民群众的生命和财产安全，对边坡的隐患进行排查。</span>
              <p style="margin:0pt 0pt 0pt 18pt"><span style="font-family:宋体; font-size:12pt">&nbsp;</span></p>
              <table cellspacing="0" cellpadding="0" style="border-collapse:collapse; margin-left:0pt">
                <tbody>
                  <tr>
                    <td style="border-bottom-color:#000000; border-bottom-style:dotted; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#bfbfbf; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:10.5pt; font-weight:bold; line-height: 14pt;">位置</span>
                      </p>
                    </td>
                    <td style="border-bottom-color:#000000; border-bottom-style:dotted; border-bottom-width:0.75pt; border-left-color:#bfbfbf; border-left-style:solid; border-left-width:0.75pt; border-right-color:#bfbfbf; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">边坡形态</span>
                      </p>
                    </td>
                    <td style="border-bottom-color:#000000; border-bottom-style:dotted; border-bottom-width:0.75pt; border-left-color:#bfbfbf; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">地质情况</span>
                      </p>
                    </td>
                    <td style="border-bottom-color:#000000; border-bottom-style:dotted; border-bottom-width:0.75pt; border-left-color:#bfbfbf; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">植被覆盖率</span>
                      </p>
                    </td>
                    <td style="border-bottom-color:#000000; border-bottom-style:dotted; border-bottom-width:0.75pt; border-left-color:#bfbfbf; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:10.5pt; font-weight:bold">隐患数量</span>
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#bfbfbf; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:dotted; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:10.5pt;">广东省茂名市云茂高速公路K43+914</span>
                      </p>
                    </td>
                    <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#bfbfbf; border-left-style:solid; border-left-width:0.75pt; border-right-color:#bfbfbf; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:dotted; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:12pt">边坡为侧斜坡，坡度较陡</span>
                      </p>
                    </td>
                    <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#bfbfbf; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:dotted; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:12pt">边坡由砂岩和粉质黏土层组成</span>
                      </p>
                    </td>
                    <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#bfbfbf; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:dotted; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:12pt">80%</span>
                      </p>
                    </td>
                    <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#bfbfbf; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:dotted; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:top; width:105.35pt">
                      <p style="margin:0pt; text-align:center">
                        <span style="font-family:宋体; font-size:12pt">8</span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p style="margin:0pt 0pt 0pt 18pt"><span style="font-family:宋体; font-size:12pt">&nbsp;</span></p>
              <img src="${base64Url}" alt="" width: "200"; height:"150">  
              <p style="margin:0pt 0pt 0pt 18pt"><span style="font-family:宋体; font-size:12pt">&nbsp;</span></p>
            </td>
          </tr>
          <tr style="height:25.15pt">
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:61.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">结论</span></p>
            </td>
            <td colspan="4" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:381.2pt">
              <p style="line-height:28.6pt; margin:0pt 0pt 1pt; text-align:left">
                <span style="font-family:宋体; font-size:12pt">斜坡面有明显的冲刷痕迹，局部表层土壤被冲刷，需要进行安全隐患的防护</span>
              </p>
            </td>
          </tr>
          <tr style="height:25.15pt">
            <td style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:61.2pt">
              <p style="margin:0pt"><span style="font-family:宋体; font-size:12pt">建议</span></p>
            </td>
            <td colspan="4" style="border-bottom-color:#000000; border-bottom-style:solid; border-bottom-width:0.75pt; border-left-color:#000000; border-left-style:solid; border-left-width:0.75pt; border-right-color:#000000; border-right-style:solid; border-right-width:0.75pt; border-top-color:#000000; border-top-style:solid; border-top-width:0.75pt; padding-left:5.03pt; padding-right:5.03pt; vertical-align:middle; width:381.2pt">
              <p style="line-height:28.6pt; margin:0pt 0pt 1pt; text-align:left">
                <span style="font-family:宋体; font-size:12pt">对边坡进行定期监测，建立监测系统；加大排水设施的建设，确保边坡能够及时排水；加强灾害知识宣传，提高防护意识</span>
              </p>
            </td>
          </tr>
          <tr style="height:0pt">
            <td style="width:72pt; border:none"></td>
          </tr>
        </tbody>
      </table>
      <p style="line-height:28.6pt; margin:0pt 0pt 1pt 180pt; text-align:justify; text-indent:36pt"><span style="font-family:宋体; font-size:15pt">&nbsp;</span></p>
    </div>
  </body>
</html>`;

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
