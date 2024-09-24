<template>
  <div class="scene-item">
    <a-upload
      :file-list="fileList"
      :remove="handleRemove"
      :before-upload="handlePreview"
      @change="previewFile"
    >
      <a-button type="primary" class="operate-btn">
        <!-- <a-icon type="upload" /> -->
        导入</a-button
      >
    </a-upload>
  </div>
</template>

<script>
export default {
  data() {
    return { fileList: [] };
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    handlePreview(file) {
      this.fileList.value = [...this.fileList, file];
      return false;
    },
    previewFile(file) {
      let that = this;
      let reader = new FileReader();
      reader.readAsText(file.file, "UTF-8");
      reader.onload = function (evt) {
        let fileString = evt.target.result;
        let data = JSON.parse(fileString);
        that.$emit("addJson", data);
        // that.$refs.upload.handleRemove();
      };
    },
  },
};
</script>

<style scoped>
.operate-btn {
  width: 100px;
  height: 32px;
  margin: 8px;
}
</style>
