<template>
  <div class="detail-layout">
    <div class="title">{{title}}</div>
    <div class="content">
      <template v-for="(col,index) in columns">
        <column
          :key="index"
          :style="{marginLeft: index > 0 ? `${gutter}px` : '0'}"
          :labelWidth="col.labelWidth"
          :fieldMapping="col.fieldMapping"
          :data="data"
        ></column>
      </template>
    </div>
  </div>
</template>

<script>
import Column from "./Column";
export default {
  name: "DetailLayout",
  components: {
    Column
  },
  props: {
    title: {
      type: String
    },
    /**
     * 列配置项
     */
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    },
    gutter: {
      type: String | Number,
      default: () => 100
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.detail-layout {
  .title {
    color: #1e2b4d;
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .content {
    display: flex;
    justify-content: flex-start;
  }
}
</style>