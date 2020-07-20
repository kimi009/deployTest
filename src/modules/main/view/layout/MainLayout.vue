<template>
  <div class="main-layout">
    <top-bar></top-bar>
    <div class="body-content">
      <div :class="isFold ? 'content-wrap' : 'content-wrap fold'">
        <router-view></router-view>
      </div>
      <side-bar @fold="changeHandle"></side-bar>
    </div>
  </div>
</template>

<script>
import TopBar from "@/modules/main/view/layout/TopBar";
import SideBar from "@/modules/main/view/layout/SideBar";

export default {
  components: { TopBar, SideBar },
  data() {
    return {
      isFold: true
    };
  },
  methods: {
    changeHandle(val) {
      this.isFold = val;
    }
  }
};
</script>

<style lang="scss" scoped>
.main-layout {
  min-width: 1356px;
  // min-width: 1366px;
  .body-content {
    width: 100%;
    overflow: hidden;
    background: #f4f7fc;
    height: calc(100vh - 51px);
    min-height: 500px;
    .content-wrap {
      float: right;
      width: calc(100% - 220px);
      height: 100%;
    }
    .content-wrap.fold {
      float: right;
      width: calc(100% - 48px);
      transition: all 0.1s ease, 0.1s ease;
    }
  }
}
</style>