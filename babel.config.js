module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    ["import", { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }],
    ["import", { libraryName: "vxe-table", style: true }, "vxe-table"],
  ],
};
