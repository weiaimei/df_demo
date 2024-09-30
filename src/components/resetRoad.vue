<template>
  <div>
    <el-row>
      <el-col>
        <el-menu
          default-active="2"
          class="el-menu"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <span>路径还原功能</span>
            </template>
            <el-menu-item-group>
              <el-menu-item @click="openCarRoad" index="1-1"
                >行车信息</el-menu-item
              >
              <el-menu-item @click="drawCarRoute" index="1-2"
                >车辆漫游</el-menu-item
              >
              <el-menu-item @click="firstCarView" index="1-3"
                >第一视角</el-menu-item
              >
              <el-menu-item @click="threeCarView" index="1-4"
                >第三视角</el-menu-item
              >
              <el-menu-item @click="removeAll" index="1-5">清空</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import linString from "@/data/line.js";
import roadLine from "@/data/road.js";
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
        {
          id: 103,
          name: "服务区",
          anchor: "POINT(112.9081867957 22.0104903945)",
        },
        {
          id: 104,
          name: "收费站",
          anchor: "POINT(112.9579219741 22.0163717172)",
        },
        {
          id: 107,
          name: "门架",
          anchor: "POINT(112.9218949377 22.0107771537)",
        },
        {
          id: 109,
          name: "门架",
          anchor: "POINT(112.9304552195 22.0109557647)",
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
              backgroundColor: Cesium.Color.fromCssColorString("#04A4B4"),
            },
            verticalLine: {
              material: new Cesium.PolylineDashMaterialProperty({
                color: Cesium.Color.fromCssColorString("RED"),
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

    drawCarRoute() {
      // let positions = await init.addLines();

      // console.log(positions, "位置");
      // let newRoadData = [];
      // for (let i = 0; i < roadLine.length; i++) {
      //   let lon = roadLine[i].longitude;
      //   let lat = roadLine[i].latitude;
      //   let hei = roadLine[i].height;
      //   let data = Cesium.Cartesian3.fromDegrees(lon, lat, hei);
      //   newRoadData.push(data);
      //   console.log(newRoadData, "2222");
      //  }
      this.addAnimation(roadLine);
    },

    addAnimation(positions) {
      let params = {
        id: Cesium.createGuid(),
        url: "static/xiaofangche.gltf",
        positions: positions,
        animationType: 1,
        speedType: 0,
        speed: 4, //速度
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
        popupStyle: {
          label: {
            text: ``,
            font: "15px Helvetica",
            pixelOffset: new Cesium.Cartesian2(0, -50),
            scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1e4, 0),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              1e5
            ),
            showBackground: false,
            backgroundColor: Cesium.Color.GREEN.withAlpha(0.5),
            fillColor: Cesium.Color.RED,
            show: false,
          },
          billboard: {
            image: "./img/1.png",
            disableDepthTestDistance: 1e11,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              1e7
            ),
            scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
            width: 64,
            height: 70,
            pixelOffset: new Cesium.Cartesian2(-5, 0),
          },
        },
        pathStyle: {
          material: Cesium.Color.BLACK,
          width: 5,
        },
        entpointStyle: {
          polyline: {
            material: new Cesium.PolylineDashMaterialProperty({
              color: Cesium.Color.YELLOW,
              dashLength: 20,
            }),
            width: 2,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              1e4
            ),
            show: false,
          },
          point: {
            pixelSize: 10,
            color: new Cesium.Color(0 / 255, 0 / 255, 255 / 255, 1),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              1e4
            ),
            show: false,
          },
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
            Cesium.Math.toRadians(90), //水平角度
            Cesium.Math.toRadians(-45), //倾斜角度
            50
          ),
        };
      }
    },
    removeAll() {
      init && init.removeAll();
      viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);
      viewer.trackedEntity = undefined;
    },
  },
};
</script>
<style>
.design-btn {
  margin: 5px 8px;
}
</style>
