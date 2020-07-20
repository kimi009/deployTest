<template>
  <div class="step-item">
    <span v-if="isDone" class="step-item-icon active-icon">
      <i class="iconfont icon-done"></i>
    </span>
    <span v-else :class="['step-item-icon',isActive ? 'active-icon' : 'disable-icon']">
      <i :class="[ isActive ? 'icon-step-right' : 'icon-step-left']" class="iconfont"></i>
    </span>

    <span class="item-text">{{text}}</span>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String
    },
    isDone: {
      type: Boolean,
      default: () => false
    },
    isActive: {
      type: Boolean,
      default: () => false
    }
  }
};
</script>

<style lang="scss" scoped>
.step-item {
  .step-item-icon {
    display: inline-block;
    height: 26px;
    width: 26px;
    line-height: 26px;
    text-align: center;
    border-radius: 50%;
  }
  .item-text {
    margin-left: 3px;
    // font-weight: bold;
    // color: #212a40;
  }
  i {
    font-size: 12px;
  }
  .active-icon {
    background: #3369ff;
    i {
      color: #ffffff;
    }
  }
  .disable-icon {
    background: #f4f7fc;
    border: 1px solid #dbdeea;
    i {
      color: #a3a9b7;
    }
  }
}
</style>