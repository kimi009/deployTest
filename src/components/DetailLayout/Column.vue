<template>
  <div class="user-detail-row">
    <template v-for="item in rows">
      <div :key="item.label" class="row">
        <span :style="{width:`${labelWidth}px`}">{{item.label}}</span>
        <span>{{item.value || '--'}}</span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "Column",
  props: {
    labelWidth: {
      type: Number | String,
      required: true
    },
    fieldMapping: {
      type: Array,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      rows: []
    };
  },
  watch: {
    data: {
      handler(newVal) {
        if (Object.keys(newVal).length) {
          this.initData(newVal);
        }
      },
      immediate: true
    }
  },
  methods: {
    initData(data) {
      this.rows = this.fieldMapping.map(item => {
        const field = Object.keys(item)[0];
        const fieldToValue = data[field];
        const label = item[field];
        return {
          label,
          value: fieldToValue
        };
      });
    }
  }
};
</script>


<style lang="scss" scoped>
.user-detail-row {
  .row {
    span {
      color: #6d7383;
      font-size: 12px;
      &:nth-child(1) {
        display: inline-block;
        margin-bottom: 12px;
      }
      &:nth-child(2) {
        color: #212A40;
        font-weight: 400;
        margin-left: 52px;
      }
    }
  }
}
</style>