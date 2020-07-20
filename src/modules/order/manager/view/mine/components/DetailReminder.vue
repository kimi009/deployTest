<template>
  <div class="reminder-dialog">
    <el-dialog
      title="催单"
      :visible.sync="$parent.isReminder"
      :before-close="handleClose"
      width="408px"
      class="reset-style"
      :close-on-click-modal='false'
    >
      <el-input
        type="textarea"
        placeholder="请您填写催单说明"
        v-model="reminderTextarea"
        maxlength="200"
        innerWidth="360px"
        :rows="4"
        resize="none"
        show-word-limit
        clearable
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="createReminder">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TableButton from "@components/TableButton";
export default {
  components: {
    TableButton
  },
  props: {
    isReminder: {
      type: Boolean
    }
  },
  data() {
    return {
      reminderTextarea: ""
    };
  },
  created() {},
  methods: {
    handleClose() {
      this.$parent.isReminder = false;
      this.reminderTextarea=false
    },
    //催单
    createReminder() {
      this.$emit("ReminderPost", this.reminderTextarea);
    }
  }
};
</script>

<style lang="scss" scoped>
>>> .el-dialog__footer {
  text-align: center;
}
.el-dialog {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto !important;
    height: 232px;
  }
</style>
