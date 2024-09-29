<template>
  <download-excel
    class="export-excel-wrapper"
    :data="DetailsForm"
    :fields="json_fields"
    :header="title"
    name="信息.xls"
  >
    <span type="success">导出</span>
  </download-excel>
</template>
<script>
export default {
  data() {
    return {
      title: "地理信息导出",
      json_fields: {
        时间: "time",
        编号: "number",
        经度: "longitude",
        纬度: "latitude",
        高度: "height",
        桩号: "zhuanghao",
      },
      DetailsForm: [
        {
          time: "2024-10-10",
          number: "1",
          longitude: "126.62989265",
          latitude: "43.798781542",
          height: "100",
          zhuanghao: "2022-3-21",
        },
      ],
    };
  },
};
</script>
