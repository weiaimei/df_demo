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
              <span>地理数据功能</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                index="1-1"
                @click="addGisData(item)"
                class="design-btn"
                v-for="(item, index) in gisDataList"
                :key="index"
                >{{ item.name }}
              </el-menu-item>
              <img src="../assets/hide.png" alt="" @click="changeDataVisible" />
              <!-- <el-menu-item @click="changeDataVisible" index="1-2"
                >隐藏</el-menu-item
              > -->
              <!-- <el-menu-item @click="locateData" index="1-3">定位</el-menu-item> -->
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
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
    if (init) {
      init && init.destroyed();
    }
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
              126.61217,
              43.7744,
              1000
            ),
          });
        } else if (this.selectLayer.datatype === "designRaster") {
          viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(
              112.872307732,
              22.02814342,
              20000
            ),
          });
        }
      }
    },
  },
};
</script>
<style></style>
