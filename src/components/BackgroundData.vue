<template>
  <div>
    <a-button
      type="primary"
      @click="addGisData(item)"
      class="design-btn"
      v-for="(item, index) in gisDataList"
      :key="index"
      >{{ item.name }}</a-button
    >
    <a-button type="primary" class="design-btn" @click="changeDataVisible"
      >隐藏</a-button
    >
    <a-button type="primary" class="design-btn" @click="locateData"
      >定位</a-button
    >
  </div>
</template>
<script>
let init;
import background from "@/data/background.js";
export default {
  data() {
    return {
      gisDataList: background,
    };
  },
  mounted() {
    this.$nextTick(() => {
      init = new tqsdk.widgets.BackgroundData(window.viewer);
    });
  },
  destroyed() {
    init && init.destroyed();
  },
  methods: {
    addGisData(item) {
      let type = item.type;
      switch (type) {
        case "dom":
        case "designRaster":
          this.addDomLayer(item);
          break;
        case "threeDTile":
        case "threeDPoint":
          this.add3DtilesLayer(item);
        default:
          break;
      }
    },
    async addDomLayer(item) {
      let layer = await init.addCustomTileLayer(item, true);
      this.selectLayer = layer;
      this.locateData();
    },
    async add3DtilesLayer(item) {
      try {
        let layer = await init.add3dtiles(item, true);
        let tileset = layer.ly;
        this.selectLayer = layer;
        var cartographic = Cesium.Cartographic.fromCartesian(
          tileset.boundingSphere.center
        );
        let surface = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          cartographic.height
        );
        let height = 10;
        if (item.type === "threeDTile") {
          height = 180;
        }
        let offset = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          height
        );
        let translation = Cesium.Cartesian3.subtract(
          offset,
          surface,
          new Cesium.Cartesian3()
        );
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        this.locateData();
      } catch (error) {
        console.log(`Error loading tileset: ${error}`);
      }
    },
    changeDataVisible() {
      if (this.selectLayer && this.selectLayer.ly) {
        if (
          this.selectLayer.datatype === "threeDTile" ||
          this.selectLayer.datatype === "threeDPoint"
        ) {
          this.selectLayer.ly.show = false;
        } else {
          init.removeById(this.selectLayer.id);
        }
      }
    },
    locateData() {
      if (this.selectLayer?.ly?.show) {
        if (
          this.selectLayer.datatype === "threeDTile" ||
          this.selectLayer.datatype === "threeDPoint"
        ) {
          viewer.flyTo(this.selectLayer.ly);
        } else if (this.selectLayer.datatype === "dom") {
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              111.376399,
              22.496896,
              300
            ),
          });
        } else if (this.selectLayer.datatype === "designRaster") {
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              111.64068606,
              22.70010139,
              20000
            ),
          });
        }
      }
    },
  },
};
</script>
