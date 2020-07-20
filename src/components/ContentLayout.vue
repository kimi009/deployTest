<template>
  <div class="page-content-layout page-box">
    <div class="left page-content" :style="leftStyle">
      <slot name="left" />
    </div>
    <div class="right page-content">
      <slot name="right" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ContentLayout",
  props: {
    leftWidth: {
      type: Number | String,
      default: () => 286
    }
  },
  data() {
    return {};
  },
  computed: {
    leftStyle() {
      return {
        width: `${this.leftWidth}px`
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.page-content-layout {
  width: 100%;
  display: flex;
  .left {
    width: 286px;
    min-width: 286px;
    padding: 0;
    margin: 20px 0 20px 20px;
  }
  .right {
    width: calc(100% - 286px);
    margin: 20px 20px 20px 12px;
    padding: 20px;
  }
}
</style>
