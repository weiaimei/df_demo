<template>
  <div>
    <a-button type="primary" class="design-btn" @click="openCarRoad"
      >行车信息</a-button
    >
    <a-button type="primary" class="design-btn" @click="drawCarRoute"
      >绘制路线</a-button
    >
    <a-button type="primary" class="design-btn" @click="firstCarView">
      第一视角</a-button
    >
    <a-button type="primary" class="design-btn" @click="threeCarView"
      >第三视角</a-button
    >
    <a-button type="primary" class="design-btn" @click="removeAll"
      >清空</a-button
    >
  </div>
</template>
<script>
import linString from "@/data/line.js";

let init;
export default {
  data() {
    return {
      roadDialog: false,
      lineData: linString,
    };
  },
  mounted() {
    this.$nextTick(() => {
      init = new tqsdk.widgets.DroneRoaming(window.viewer);
    });
  },
  beforeCreate() {
    this.ZDsID = [];
  },
  methods: {
    //路线
    openCarRoad() {
      let positions = this.lineData.map((item) =>
        Cesium.Cartesian3.fromDegrees(item[0], item[1], item[2])
      );
      const line = viewer.entities.add({
        polyline: {
          positions: positions,
          material: Cesium.Color.YELLOW,
          width: 5,
        },
      });
      viewer.zoomTo(line);

      const lableData = [
        {
          id: 100,
          name: "起点",
          anchor: "POINT(112.8793658969 22.0180811407)",
        },
        {
          id: 101,
          name: "终点",
          anchor: "POINT(113.0311272839 22.0002253674)",
        },
      ];
      this.ZDsID = [];
      let entityArr = [];
      //循环遍历每一个桩点对象
      for (let l = 0; l < lableData.length; l++) {
        //初始化
        //判断是否无几何数据
        let anchor = lableData[l].anchor;
        let point = tqsdk.utils.wktTransition.toCartesian3Point(anchor);
        let ID = "ZD_" + lableData[l].id.toString();
        let popup = new tqsdk.popup.HeightPopup(
          { position: point, height: 180, id: ID },
          {
            label: {
              text: lableData[l].name,
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
    },
    async drawCarRoute() {
      let positions = await init.addLines();
      this.addAnimation(positions);
    },
    addAnimation(positions) {
      let params = {
        id: Cesium.createGuid(),
        url: "static/xiaofangche.gltf",
        positions: positions,
        animationType: 1,
        speedType: 0,
        speed: 5, //速度
        name: "小汽车", //车牌
        hpr: {
          heading: 0,
          pitch: 0,
          roll: 0,
        },
        viewAngle: {
          // type: 1, //无视角0-无视角，1-锁定视角，2-第一视角,
          type: 1,
          offset: new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(90), //水平角度
            Cesium.Math.toRadians(-10), //倾斜角度
            10
          ),
        },
      };
      init.add(params);
      init.path.featureLayer.flyToEntitys();
    },
    firstCarView() {
      if (init) {
        init.animation._viewAngle = {
          type: 1,
          offset: new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(90), //水平角度
            Cesium.Math.toRadians(-10), //倾斜角度
            10
          ),
        };
      }
    },
    threeCarView() {
      if (init) {
        init.animation._viewAngle = {
          type: 1,
          offset: new Cesium.HeadingPitchRange(
            Cesium.Math.toRadians(180), //水平角度
            Cesium.Math.toRadians(-45), //倾斜角度
            50
          ),
        };
      }
    },
    removeAll() {
      init && init.removeAll();
    },
  },
};
</script>
<style>
.design-btn {
  margin: 5px 8px;
}
</style>
