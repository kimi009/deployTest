<template>
  <div v-if="visible" class="my-message-box-outer">
    <div class="my-message-box-inner" :style="calcWidth()">
      <div class="my-message-tile">
        <span class="my-message-tile-text">{{ title }}</span>
        <span class="my-message-close-icon" @click="closeMe()"></span>
      </div>
      <div class="my-message-content">
        <div class="my-message-content-lev1">
          <span class="my-message-content-type iconfont" :class="setIconClass()"></span>
          {{ content }}
        </div>
        <div class="my-message-content-lev2">
          <div v-html="subContent"></div>
        </div>
      </div>
      <div class="my-message-btn">
        <template v-for="item of btn">
          <el-button
            :loading="(item.loading ? item.loading.flag : false)"
            :key="item.index"
            :type="item.type || ''"
            size="mini"
            @click="item.fn()"
          >{{ item.text }}
          </el-button>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'MyMessage',
    data() {
      return {
        visible: false,
        width: '300px',
        type: 'info', // success,warning,error,info,wait
        content: '', // 一级内容内容
        subContent: '', // 二级内容
        title: '提示', // 弹框标题
        btn: [
          {
            'type': '', // 按钮样式
            'text': '', // 按钮文本
            'loading': false,
            fn: () => { // 点击事件处理
            }
          }
        ]
      };
    },
    created() {
    },
    mounted() {
    },
    beforeDestroy() {
    },
    methods: {
      closeMe() {
        this.visible = false;
      },
      setIconClass() {
        return `icon-tip-${this.type}`;
      },
      calcWidth() {
        if (this.width) {
          return {
            width: this.width
          };
        } else {
          return null;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .my-message-box-outer {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.3);
    .my-message-box-inner {
      width: 300px;
      background: #fff;
      .my-message-tile {
        height: 48px;
        background: #fff;
        padding: 0 15px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .my-message-tile-text {
          font-size: 14px;
          color: #212A40;
          font-weight: bold;
        }
        .my-message-close-icon {
          width: 24px;
          height: 24px;
          cursor: pointer;
          background: url("../../assets/imgs/close-12.png") no-repeat center center transparent;
          &:hover {
            background: url(../../assets/imgs/close-12@hover.png) no-repeat center center transparent;
          }
        }
      }
      .my-message-content {
        margin: 20px;
        text-align: left;
        .my-message-content-lev1 {
          color: #212A40;
          font-size: 12px;
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          line-height: 24px;
          .my-message-content-type {
            width: 18px;
            height: 24px;
            margin-right: 8px;
          }
        }
        .my-message-content-lev2 {
          color: #666666;
          line-height: 20px;
          margin-top: 20px;
          font-size: 12px;
          margin-left: 24px;
        }
      }
      .my-message-btn {
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
