let plottingList = [
  {
    type: "drawPoint",
    name: "点",
    style: {
      point: {
        pixelSize: 12,
        color: "red",
        outlineColor: "#ffffff",
        outlineWidth: 2,
        disableDepthTestDistance: 1e11,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
      },
      label: {
        text: "点",
        font: "14px sans-serif",
        outlineColor: "#ffffff",
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(0, 0),
        disableDepthTestDistance: 1e11,
        showBackground: true,
        backgroundColor: "#04A4B4",
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
        show: false,
      },
    },
  },
  {
    type: "drawLineString",
    name: "线",
    style: {
      endpoint: {
        pixelSize: 12,
        color: "green",
        outlineColor: "#ffffff",
        outlineWidth: 2,
        disableDepthTestDistance: 1e11,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
        show: true,
      },
      polyline: {
        // material: "#EEE06C",
        width: 5,
        // depthFailMaterial: "#EEE06C",
        color: "#EEE06C",
        depthFailColor: "#EEE06C",
        clampToGround: true, //贴地
        close: false,
        type: "Color", //材质类型
        // type:"PolylineDashMaterialProperty",
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
        alpha: 1,
      },
    },
  },
  {
    type: "drawPolygon",
    name: "多边形",
    style: {
      polygon: {
        color: "red",
        type: "Color",
        // image: "/img/Fire.gif",
        // type: "Gif",
        fill: true,
        show: true,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
        alpha: 0.5,
      },
      endpoint: {
        pixelSize: 12,
        color: "red",
        outlineColor: "#ffffff",
        outlineWidth: 2,
        disableDepthTestDistance: 1e11,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
        show: true,
        heightReference: 1,
      },
      polyline: {
        width: 5,
        color: "#EEE06C",
        depthFailColor: "#EEE06C",
        clampToGround: true, //贴地
        close: false,
        type: "Color", //材质类型
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
        show: true,
      },
      label: {
        text: "测量",
        font: "14px sans-serif",
        pixelOffset: new Cesium.Cartesian2(0, -30),
        disableDepthTestDistance: Number.MAX_VALUE,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString("#04A4B4"),
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
        show: false,
      },
    },
  },
  {
    type: "drawBillboard",
    name: "图标",
    style: {
      billboard: {
        color: "#ffffff",
        image: require("../assets/fire4.png"),
        disableDepthTestDistance: 1e11,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
        width: 64,
        height: 70,
        pixelOffset: new Cesium.Cartesian2(-5, 0),
        type: "Image",
      },
      label: {
        text: "火焰",
        color: "#000000",
        style: 0,
        font: "14px sans-serif",
        outlineColor: "#ffffff",
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(0, -50),
        disableDepthTestDistance: 1e11,
        showBackground: true,
        backgroundColor: "#04A4B4",
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
        show: true,
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
      },
    },
  },
];
export default plottingList;