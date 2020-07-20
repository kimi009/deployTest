<template>
  <el-table
    ref="myTableRef"
    v-loading="$attrs.loading"
    v-bind="$attrs"
    v-on="$listeners"
    empty-text=" "
  >
    <slot></slot>
    <slot name="myEmpty">
      <template slot="empty" v-if="!$attrs.loading">
        <img :style="{'margin-top':emptyTop+'px'}" src="@/assets/imgs/no-data-table.png">
        <p>暂无数据</p>
      </template>
    </slot>
  </el-table>
</template>

<script>
  export default {
    name: "my-table",
    props: {
      emptyTop: {
        type: Number,
        default: () => 120
      },
    },
    methods: {}
  }
</script>