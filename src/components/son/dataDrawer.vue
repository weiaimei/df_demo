<template>
  <el-drawer
    class="data-drawer"
    title="边坡查巡"
    :visible.sync="drawer"
    :direction="direction"
    :modal="false"
    :before-close="handleClose"
    :wrapperClosable="false"
    size="53%"
  >
    <div class="inspect-data">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane name="photo">
          <div class="photo">
            <el-image
              class="show-imgae"
              v-for="(item, index) in photoList"
              :key="index"
              style="width: 150px; height: 150px"
              :src="item.smallThumbnail"
              fit="fill"
              :preview-src-list="srcList"
            ></el-image>
          </div>
          <div class="video">
            <el-image
              class="show-imgae"
              v-for="(item, index) in videoList"
              :key="index"
              style="width: 150px; height: 150px"
              :src="item.smallThumbnail"
              fit="fill"
              @click="playVideo(item)"
            ></el-image>
            <i class="el-icon-video-play"></i>
          </div>
        </el-tab-pane>
        <el-tab-pane label="视频" name="video">
          <div class="photo">
            <el-image
              class="show-imgae"
              v-for="(item, index) in photoList"
              :key="index"
              style="width: 150px; height: 150px"
              :src="item.smallThumbnail"
              fit="fill"
              :preview-src-list="srcList"
            ></el-image>
          </div>
          <div class="video">
            <el-image
              class="show-imgae"
              v-for="(item, index) in videoList"
              :key="index"
              style="width: 150px; height: 150px"
              :src="item.smallThumbnail"
              fit="fill"
              @click="playVideo(item)"
            ></el-image>
            <i class="el-icon-video-play"></i>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-if="videoDialog">
      <Video
        :dialogVisible="videoDialog"
        :videoInfo="videoInfo"
        @closeDialog="closeDialog"
      />
    </div>
  </el-drawer>
</template>

<script>
import { photoList, videoList } from "@/data/sideSlope.js";
import Video from "./video.vue";
let srcList = photoList.map((item) => {
  return item.origin;
});
export default {
  components: {
    Video,
  },
  props: {
    drawer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      direction: "rtl",
      activeName: "photo",
      photoList: photoList,
      videoList: videoList,
      srcList: srcList,
      videoDialog: false,
      videoInfo: null,
    };
  },

  mounted() {},
  destroyed() {},
  methods: {
    handleClose() {
      this.$emit("closeDrawer");
    },
    handleClick(tab) {
      this.activeName = tab.name;
    },
    setActiveName(name) {
      this.activeName = name;
    },
    closeDialog() {
      this.videoDialog = false;
    },
    playVideo(item) {
      this.videoInfo = item;
      this.videoDialog = true;
    },
  },
};
</script>

<style scoped>
.road-head {
  margin-left: -18px;
  margin-bottom: 5px;
}
.data-show,
.device-show,
.measure-file {
  margin-bottom: 5px;
}
.tool-item-bt {
  width: 100px;
  height: 32px;
  margin: 8px;
}
.show-imgae {
  margin: 5px;
}
.data-drawer {
  width: 60%;
  top: 238px;
  height: 388px;
  right: 335px;
  /* // z-index: 2003; */
  /* background-color: rgba(3, 78, 145, 0.81) !important; */
}
.el-drawer__header,
.el-tabs__item {
  color: #fff;
}
</style>
