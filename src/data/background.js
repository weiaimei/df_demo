let dataList = [
  {
    name: "正射影像",
    type: "dom",
    id: "64d6de1a-9761-4dc7-a6f9-b71dd17771f44742",
    isShow: false,
    userId: "a4785bfe-7498-4a40-8f70-fadbad304729",
    thumbnail: null,
    extent: [113.243634888, 22.0486139, 113.266673573, 22.053641056],
    info: {
      url: window.YANSSHIURL.dom,
      maximumLevel: 20,
    },
    //调节图层是色调，饱和度，亮度，对比度等
    colorAdjust: null,
    expansion: {
      tilingScheme: "webMercator",
    },
  },
  {
    name: "CAD图纸",
    type: "designRaster",
    id: "64d6de1a-9761-4dc7-a6f9-b71dd17771f44741",
    isShow: false,
    userId: "a4785bfe-7498-4a40-8f70-fadbad304729",
    thumbnail: null,
    extent: [112.872307732, 22.02814342, 113.15425597, 22.038444698],
    info: {
      url: window.YANSSHIURL.cad,
    },
    //调节图层是色调，饱和度，亮度，对比度等
    colorAdjust: null,
    expansion: `
        {
          tilingScheme:1
        }
        `,
  },
  {
    name: "实景三维模型",
    type: "threeDTile",
    id: "64d6de1a-9761-4dc7-a6f9-b722221dd17771f44743",
    isShow: false,
    userId: "a4785bfe-7498-4a40-8f70-fadbad304729",
    thumbnail: null,
    extent: [113.401134, 22.70118805, 113.266375434, 22.053369711],
    info: {
      url: window.YANSSHIURL.tiles,
      maximumScreenSpaceError: 1,
    },
    //调节图层是色调，饱和度，亮度，对比度等
    colorAdjust: null,
  },
  {
    name: "点云",
    type: "threeDPoint",
    id: "64d6de1a-9761-4dc7-a6f9-b71dd17771f447478993222",
    isShow: false,
    userId: "a4785bfe-7498-4a40-8f70-fadbad30472955332",
    thumbnail: null,
    // extent: [113.401134, 22.70118805, 113.63540833, 22.8085079],
    info: {
      url: window.YANSSHIURL.dianyun,
      maximumScreenSpaceError: 1,
    },
    //调节图层是色调，饱和度，亮度，对比度等
    colorAdjust: undefined,
  },
];

export default dataList;
