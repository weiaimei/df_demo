<template>
  <div>
    <el-row>
      <el-col>
        <el-menu
          default-active="2"
          class="el-menu-vertical"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <span>测量功能</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                index="1-1"
                v-for="(item, index) in toolList"
                :key="index"
                @click="apply(item)"
                >{{ item.name }}</el-menu-item
              >
              <el-menu-item @click="removeAll" index="1-2">清除</el-menu-item>
              <el-menu-item @click="exportImg" index="1-3"
                >导出图片</el-menu-item
              >
              <el-menu-item index="1-5">
                <UpFile @addJson="importMeasuring"></UpFile>
              </el-menu-item>
              <el-menu-item index="1-4">
                <export-file></export-file
              ></el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import measureToolList from "@/data/measure.js";
import UpFile from "./son/UpFile.vue";
import exportFile from "./son/exportFile.vue";
let measureTool;
let platting;
let toolList = measureToolList.map((item) => {
  return {
    name: item.name,
    type: item.type,
  };
});
export default {
  components: {
    UpFile,
    exportFile,
  },
  data() {
    return {
      type: "",
      volume: {
        digVolumes: "",
        fillVolumes: "",
        minHeight: "",
        maxHeight: "",
        projectionArea: "",
        surfaceAreas: "",
        perimeter: "",
        standardHeight: null,
        progress: 0,
      },
      areaSurface: {
        projectionArea: "",
        surfaceAreas: "",
        perimeter: "",
        progress: 0,
      },
      toolList: toolList,
    };
  },
  mounted() {
    this.$nextTick(() => {
      platting = new tqsdk.widgets.Plotting(window.viewer);
      measureTool = new tqsdk.widgets.MeasureTool(window.viewer);
    });
  },
  destroyed() {
    measureTool.destroy();
  },
  methods: {
    async apply(v) {
      let type = v.type;
      this.type = type;
      let res;
      let indexOb = measureToolList.find((item) => item.type === type);
      if (type === "volume") {
        res = await this.applyVolume(indexOb.style);
      } else if (type === "areaSurface") {
        res = await this.applyMeasurementAreaSurface(indexOb.style);
      } else if (
        measureTool &&
        measureTool[type] &&
        typeof measureTool[type] === "function" &&
        type !== "volume"
      ) {
        res = await measureTool[type](indexOb.style);
      }
    },
    //表面积测量
    async applyMeasurementAreaSurface(style) {
      let res = await measureTool.areaSurface(style, true, (data) => {
        this.areaSurface.progress = data.progress;
      });
      this.areaSurface.surfaceAreas = res.surfaceAreas || "";
      this.areaSurface.projectionArea = res.projectionArea || "";
      this.areaSurface.perimeter = res.perimeter || "";
    },

    //体积测量
    async applyVolume(style) {
      this.volume.progress = 0;
      let volumeRes = await measureTool.volume({
        // positions: res.positions,
        style,
        standardHeight: this.volume.standardHeight,
        isCopy: true,
        callBack: (data) => {
          console.log(data);
          this.volume.progress = data.progress;
        },
        id: undefined,
      });

      this.volume.digVolumes = volumeRes.digVolumes;
      this.volume.fillVolumes = volumeRes.fillVolumes;
      this.volume.minHeight = volumeRes.minHeight;
      this.volume.maxHeight = volumeRes.maxHeight;
      this.volume.projectionArea = volumeRes.projectionArea;
      this.volume.surfaceAreas = volumeRes.surfaceAreas;
      this.volume.perimeter = volumeRes.perimeter;
      this.volume.standardHeight = volumeRes.standardHeight;
    },
    removeAll() {
      measureTool.removeAll();
      if (this.volume.progress) {
        this.volume.progress = 0;
      }
      this.type = "";
    },
    // //下载所有
    // downloadAll() {
    //   // measureTool.downloadAll();

    // },
    //导出图片
    async exportImg() {
      let thumbnailBase64 = await tqsdk.utils.screenShot.canvasToBase64(
        viewer.scene.canvas
      );
      tqsdk.utils.download.downloadIamge(thumbnailBase64);
    },
    //导出
    importMeasuring(v) {
      platting.importJson(v).then((data) => {
        data.flyTo();
      });
    },
  },
};
</script>
<style>
.design-btn {
  margin: 5px;
}
</style>
