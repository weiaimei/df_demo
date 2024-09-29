let measureToolList = [
  {
    name: "距离测量",
    type: "distance",
    style: {
      endpoint: {
        pixelSize: 1,
        color: Cesium.Color.BLUE,
        outlineColor: Cesium.Color.BLUE,
        outlineWidth: 1,
        disableDepthTestDistance: 1e11,
      },
      polyline: {
        material: Cesium.Color.fromCssColorString("BLUE"),
        width: 5,
        depthFailMaterial: Cesium.Color.fromCssColorString("BLUE"),
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
        // backgroundColor: Cesium.Color.RED,
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.3),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5e4),
      },
    },
  },

  {
    name: "表面积测量",
    type: "areaSurface",
    style: {
      endpoint: {
        pixelSize: 1,
        color: Cesium.Color.BLUE,
        outlineColor: Cesium.Color.BLUE,
        outlineWidth: 1,
        disableDepthTestDistance: 1e11,
      },
      label: {
        text: "测量",
        font: "14px sans-serif",
        pixelOffset: new Cesium.Cartesian2(0, -30),
        disableDepthTestDistance: Number.MAX_VALUE,
        showBackground: true,
        // backgroundColor: Cesium.Color.RED,
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5e4),
      },
      polygon: {
        material: Cesium.Color.BLUE.withAlpha(0.8),
        outline: true,
        outlineWidth: 10,
        fill: true,
        outlineColor: Cesium.Color.BLUE,
      },
      polyline: {
        width: 1,
        material: Cesium.Color.BLUE,
        depthFailMaterial: Cesium.Color.fromCssColorString("BLUE"),
        clampToGround: true, //贴地
        show: true,
      },
    },
  },
  {
    name: "体积测量",
    type: "volume",
    style: {
      endpoint: {
        pixelSize: 1,
        color: Cesium.Color.BLUE,
        outlineColor: Cesium.Color.BLUE,
        outlineWidth: 1,
        disableDepthTestDistance: 1e11,
      },
      label: {
        show: false,
        text: "测量",
        font: "14px sans-serif",
        pixelOffset: new Cesium.Cartesian2(0, -20),
        disableDepthTestDistance: Number.MAX_VALUE,
        showBackground: true,
        backgroundColor: Cesium.Color.RED,
        scaleByDistance: new Cesium.NearFarScalar(0, 1, 1e6, 0.5),
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5e4),
      },
      polygon: {
        material: Cesium.Color.BLUE.withAlpha(0.7),
        outline: true,
        outlineWidth: 10,
        fill: true,
        outlineColor: Cesium.Color.BLUE,
      },
      polyline: {
        width: 5,
        material: Cesium.Color.fromCssColorString("BLUE"),
        depthFailMaterial: Cesium.Color.fromCssColorString("BLUE"),
        clampToGround: true, //贴地
        show: true,
      },
    },
  },
];
export default measureToolList;
