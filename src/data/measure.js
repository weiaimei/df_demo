let measureToolList = [
  {
    name: "距离测量",
    type: "distance",
    style: {
      endpoint: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        disableDepthTestDistance: 1e11,
      },
      polyline: {
        material: Cesium.Color.fromCssColorString("#EEE06C"),
        width: 5,
        depthFailMaterial: Cesium.Color.fromCssColorString("#EEE06C"),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 1e7),
        clampToGround: true, //开启贴地
      },
      label: {
        text: "测量",
        font: "14px sans-serif",
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(0, -30),
        disableDepthTestDistance: 1e11,
        // disableDepthTestDistance: Number.MAX_VALUE,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString("#04A4B4"),
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.3),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5e4),
      },
    },
  },
  // {
  //   name: "地表距离测量",
  //   type: "distanceSurface",
  //   style: {
  //     endpoint: {
  //       pixelSize: 5,
  //       color: Cesium.Color.RED,
  //       outlineColor: Cesium.Color.WHITE,
  //       outlineWidth: 2,
  //       disableDepthTestDistance: Number.POSITIVE_INFINITY,
  //     },
  //     polyline: {
  //       material: Cesium.Color.fromCssColorString("#EEE06C"),
  //       width: 5,
  //       //   depthFailMaterial: Cesium.Color.fromCssColorString("#EEE06C"),
  //       classificationType: Cesium.ClassificationType.BOTH,
  //       clampToGround: true,
  //     },
  //     label: {
  //       text: "测量",
  //       font: "14px sans-serif",
  //       outlineColor: Cesium.Color.WHITE,
  //       outlineWidth: 2,
  //       pixelOffset: new Cesium.Cartesian2(0, -30),
  //       disableDepthTestDistance: Number.MAX_VALUE,
  //       showBackground: true,
  //       backgroundColor: Cesium.Color.fromCssColorString("#04A4B4"),
  //       scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.3),
  //       distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5e4),
  //     },
  //   },
  // },
  {
    name: "表面积测量",
    type: "areaSurface",
    style: {
      label: {
        text: "测量",
        font: "14px sans-serif",
        pixelOffset: new Cesium.Cartesian2(0, -30),
        disableDepthTestDistance: Number.MAX_VALUE,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString("#04A4B4"),
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5e4),
      },
      polygon: {
        material: Cesium.Color.RED.withAlpha(0.4),
        outline: true,
        outlineWidth: 10,
        fill: true,
        outlineColor: Cesium.Color.RED,
      },
      polyline: {
        width: 5,
        material: Cesium.Color.fromCssColorString("#EEE06C"),
        depthFailMaterial: Cesium.Color.fromCssColorString("#EEE06C"),
        clampToGround: true, //贴地
        show: true,
      },
    },
  },
  {
    name: "体积测量",
    type: "volume",
    style: {
      label: {
        show: false,
        text: "测量",
        font: "14px sans-serif",
        pixelOffset: new Cesium.Cartesian2(0, -30),
        disableDepthTestDistance: Number.MAX_VALUE,
        showBackground: true,
        backgroundColor: Cesium.Color.fromCssColorString("#04A4B4"),
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5e4),
      },
      polygon: {
        material: Cesium.Color.RED.withAlpha(0.4),
        outline: true,
        outlineWidth: 10,
        fill: true,
        outlineColor: Cesium.Color.RED,
      },
      polyline: {
        width: 5,
        material: Cesium.Color.fromCssColorString("#EEE06C"),
        depthFailMaterial: Cesium.Color.fromCssColorString("#EEE06C"),
        clampToGround: true, //贴地
        show: true,
      },
    },
  },
];
export default measureToolList;
