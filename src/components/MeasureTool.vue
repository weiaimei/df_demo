<template>
  <div>
    <a-button
      type="primary"
      class="design-btn"
      v-for="(item, index) in toolList"
      :key="index"
      @click="apply(item)"
      >{{ item.name }}</a-button
    >
    <a-button type="danger" class="design" @click="removeAll">清除</a-button>
  </div>
</template>
<script>
import measureToolList from "@/data/measure.js";
let measureTool;
let toolList = measureToolList.map((item) => {
  return {
    name: item.name,
    type: item.type,
  };
});
export default {
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
  },
};
</script>
<style>
.design-btn {
  margin: 5px;
}
</style>
