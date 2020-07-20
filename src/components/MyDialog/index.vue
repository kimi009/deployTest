<template>
  <div class="my-dialog">
    <template v-if="isForm">
      <el-dialog v-bind="$attrs" :visible.sync="$parent[dialogControlField]" center>
        <span v-if="!$attrs.title" slot="title">
          <slot name="title"></slot>
        </span>
        <ValidationObserver v-slot="{passes}">
          <el-form ref="tmpFormRef" v-bind="$attrs">
            <slot name="content"></slot>
            <el-form-item label-width="0" style="text-align: center;marginBottom: 0;">
              <el-button @click="cancel">取消</el-button>
              <el-button type="primary" @click="passes(ok)">确定</el-button>
            </el-form-item>
          </el-form>
        </ValidationObserver>
      </el-dialog>
    </template>
    <template v-else>
      <el-dialog v-bind="$attrs" :visible.sync="$parent[dialogControlField]" center>
        <span v-if="!$attrs.title" slot="title">
          <slot name="title"></slot>
        </span>
        <slot name="content"></slot>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="ok">确定</el-button>
        </span>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import { ValidationObserver } from "vee-validate";
export default {
  name: "MyDialog",
  components: {
    ValidationObserver
  },
  props: {
    /**
     * 弹框是否含有表单
     */
    isForm: {
      type: Boolean,
      default: () => false
    },
    // 有可能一个页面会有多个弹框
    dialogControlField: {
      type: String,
      required: true
    },
    // 是否由儿子控制关闭
    isChildControl: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {};
  },
  methods: {
    cancel() {
      this.$emit("cancel");
      if (!this.isChildControl) {
        this.$parent[this.dialogControlField] = false;
      }
    },
    ok() {
      this.$emit("ok");
      if (!this.isChildControl) {
        this.$parent[this.dialogControlField] = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.my-dialog {
  /deep/ .el-dialog__header {
    display: flex;
    padding-bottom: 24px;
  }
  /deep/ .el-dialog__body {
    padding: 0 0 20px 20px;
  }
}
</style>