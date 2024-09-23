<template>
  <div>
    <a-button
      type="primary"
      class="design-btn"
      v-for="(item, index) in plottingList"
      :key="index"
      @click="drawPlottiing(item)"
      >{{ item.name }}</a-button
    >
    <a-button type="danger" @click="removeAllPlotting" class="design-btn"
      >清除</a-button
    >
    <a-button type="primary" @click="exportImg" class="design-btn"
      >导出图片</a-button
    >
  </div>
</template>
<script>
import configData from "@/data/draw.js";
import zhuangData from "@/data/zhuang.js";
let platting;
export default {
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
    showZD(v) {
      if (!v || !Array.isArray(v)) {
        return;
      }
      //清空已有的桩点数据
      for (let k = 0; k < this.ZDsID.length; k++) {
        window.viewer.entities.removeById(this.ZDsID[k]);
      }
      this.ZDsID = [];
      let arr = v;
      let entityArr = [];
      //循环遍历每一个桩点对象
      for (let l = 0; l < arr.length; l++) {
        //初始化
        //判断是否无几何数据
        let anchor = arr[l].anchor;
        let point = tqsdk.utils.wktTransition.toCartesian3Point(anchor);
        let ID = "ZD_" + arr[l].id.toString();
        let popup = new tqsdk.popup.HeightPopup(
          { position: point, height: 180, id: ID },
          {
            label: {
              text: arr[l].name,
              font: "20pt monospace",
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0,
                1e6
              ),
              backgroundColor: Cesium.Color.fromCssColorString("red"),
            },
            verticalLine: {
              material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.fromCssColorString("#E27F21"),
                dashLength: 20,
              }),
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0,
                1e4
              ),
            },
          }
        );
        let entity = window.viewer.entities.add(popup.entitys[0]);
        //存入管理数据
        this.ZDsID.push(ID);
        entityArr.push(entity);
      }
      window.viewer.flyTo(entityArr);
    },
    removeAll() {
      for (let k = 0; k < this.ZDsID.length; k++) {
        window.viewer.entities.removeById(this.ZDsID[k]);
      }
    },
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
