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
              <span>标绘功能</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                index="1-1"
                v-for="(item, index) in plottingList"
                :key="index"
                @click="drawPlottiing(item)"
                >{{ item.name }}</el-menu-item
              >
              <el-menu-item @click="removeAllPlotting" index="1-2"
                >清除</el-menu-item
              >
              <el-menu-item @click="exportImg" index="1-3"
                >导出图片</el-menu-item
              >
              <el-menu-item index="1-5">
                <UpFile @addJson="importMeasuring" index="1-6"></UpFile>
              </el-menu-item>
              <el-menu-item index="1-4">
                <export-file></export-file>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import configData from "@/data/draw.js";
import zhuangData from "@/data/zhuang.js";
import UpFile from "./son/UpFile.vue";
import exportFile from "./son/exportFile.vue";
let platting;
let measureToolDown;
export default {
  components: { UpFile, exportFile },
  data() {
    return {
      plottingList: configData,
    };
  },
  beforeCreate() {
    this.ZDsID = [];
  },
  mounted() {
    this.$nextTick(() => {
      platting = new tqsdk.widgets.Plotting(window.viewer);
      measureToolDown = new tqsdk.widgets.MeasureTool(window.viewer);
      this.showZD(zhuangData);
    });
  },
  methods: {
    //点线多边形
    async drawPlottiing(item) {
      let { style, type } = item;
      if (platting[type] && typeof platting[type] === "function") {
        let re = await platting[type](style);
      }
    },
    //清除
    removeAllPlotting() {
      platting.removeAll();
    },
    //导出图片
    async exportImg() {
      let thumbnailBase64 = await tqsdk.utils.screenShot.canvasToBase64(
        viewer.scene.canvas
      );
      tqsdk.utils.download.downloadIamge(thumbnailBase64);
    },
    //桩号
    showZD(ZD) {
      //清空已有的桩点数据
      for (let k = 0; k < this.ZDsID.length; k++) {
        window.viewer.entities.removeById(this.ZDsID[k]);
      }
      this.ZDsID = [];
      let arr = ZD;
      //循环遍历每一个桩点对象
      for (let l = 0; l < arr.length; l++) {
        //初始化
        //判断是否无几何数据
        let anchor = arr[l].anchor;
        let str_1 = anchor.substring(6, anchor.length - 2);
        let str_2 = str_1.split(" ");
        let lon = parseFloat(str_2[0]);
        let lat = parseFloat(str_2[1]);
        let point = Cesium.Cartesian3.fromDegrees(lon, lat, 2);
        let ID = "ZD_" + arr[l].id.toString();
        let poi_zd = window.viewer.entities.add({
          id: ID,
          name: "ZD",
          position: point,
          // point: {
          //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, //贴地
          //   show: true,
          //   color: Cesium.Color.YELLOW,
          //   disableDepthTestDistance: 1e11,
          //   pixelSize: 10,
          //   outlineColor: Cesium.Color.YELLOW,
          //   outlineWidth: 1,
          // },
          billboard: {
            // 图像地址，URI或Canvas的属性
            image: require("@/assets/zhuanghao.png"),
            // 高度（以像素为单位）
            height: 30,
            // 宽度（以像素为单位）
            width: 200,
            // 逆时针旋转
            rotation: 0,
            // 大小是否以米为单位
            sizeInMeters: false,
            // 相对于坐标的垂直位置
            heightReference: Cesium.HeightReference.NONE,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            // 相对于坐标的水平位置
            horizontalOrigin: Cesium.HorizontalOrigin.TOP,
            // 该属性指定标签在屏幕空间中距此标签原点的像素偏移量
            pixelOffset: new Cesium.Cartesian2(10, -25),
            // 应用于图像的统一比例。比例大于会1.0放大标签，而比例小于会1.0缩小标签。
            scale: 1.5,
            // 是否显示
            show: true,
          },
          label: {
            text: arr[l].name,
            font: "20pt monospace",
            fillcolor: Cesium.Color.YELLOW,
            backgroundColor: Cesium.Color.YELLOW,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            //垂直位置
            heightReference: Cesium.HeightReference.NONE,
            verticalOrigin: Cesium.VerticalOrigin.TOP,
            pixelOffset: new Cesium.Cartesian2(10, -25),
          },
        });
        //存入管理数据
        this.ZDsID.push(ID);
        window.viewer.flyTo(poi_zd);
      }
    },
    removeAll() {
      for (let k = 0; k < this.ZDsID.length; k++) {
        window.viewer.entities.removeById(this.ZDsID[k]);
      }
    },
    //导入
    importMeasuring(v) {
      console.log(v, "原始数据");
      platting.importJson(v).then((data) => {
        data.flyTo();
      });
    },

    // //全部下載
    // downloadAll() {
    //   console.log("aaaa");
    //   // measureToolDown.downloadAll();
    // },
  },
  destroyed() {
    this.removeAll();
    platting.destroy();
  },
};
</script>
<style>
.design-btn {
  margin: 5px;
}
</style>
