<template>
  <div class="rate-dialog">
    <el-dialog
      title="待您评价"
      :visible.sync="$parent.isEvaluation"
      :close-on-click-modal="false"
      width="408px"
      class="reset-style"
    >
      <p class="rateBox">
        为我们的服务打个星吧
        <el-rate class="rateIcon" v-model="rateValue"></el-rate>
      </p>
      <el-input
        type="textarea"
        placeholder="您的反馈意见将会让服务做得更好"
        v-model="evaluationTextarea"
        maxlength="200"
        innerWidth="360px"
        :rows="4"
        resize="none"
        show-word-limit
        clearable
      ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="$parent.isEvaluation = false">取 消</el-button>
        <el-button type="primary" @click="reteDialogBtn">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  props: {
    isEvaluation: {
      type: Boolean
    }
  },
  data() {
    return {
      rateValue: null,
      evaluationTextarea: ""
    };
  },
  methods: {
    reteDialogBtn() {
      this.$emit("rateExtraction", this.rateValue, this.evaluationTextarea);
    }
  }
};
</script>

<style lang="scss" scope >
.rate-dialog {
  .rateBox {
    margin-bottom: 5px;
    line-height: 1;
    white-space: nowrap;
    .rateIcon {
      display: inline-block !important;
      margin-left: 10px;
    }
  }
  .el-dialog__footer {
    text-align: center !important;
  }
  .el-dialog {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto !important;
    height: 294px;
  }
}
</style>