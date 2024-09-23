<template>
   <el-dialog
    title="巡检视频"
    :visible.sync="dialogVisible"
    width="53%"
    :modal="false"
    :close-on-click-modal="false"
    :before-close="handleClose"
   >
    <video-player
      ref="videoPlayer"
      :options="videoPlayerOptions"
      @play="handlePlay"
      @pause="handlePause"
    ></video-player>
   </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    videoInfo: {
			type: Object,
			default: () => {}
    }
  },
  data() {
    return {
       videoPlayerOptions: null
    };
  },

  mounted() {
		this.videoPlayerOptions = {
        autoplay: false, // 自动播放
        muted: true, // 静音
        fluid: true, // 自适应播放容器
        language: 'zh-CN', // 中文提示
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 倍速播放
        sources: [{
					type: 'video/mp4', // 播放视频类型 mp4
            src: this.videoInfo.video // 播放视频链接
				}],
      }
  },
  destroyed() {},
  methods: {
    handlePlay() {
      this.$refs.videoPlayer.player.play();
    },
    handlePause() {
     this.$refs.videoPlayer.player.pause();
    },
    handleClose() {
      this.$emit("closeDialog");
			this.handlePause();
    },
  },
};
</script>

<style scoped>
::v-deep .el-dialog{
	margin-right: 355px;
}
</style>