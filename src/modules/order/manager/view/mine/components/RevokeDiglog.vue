<template>
  <div class="revoke-diglog">
    <el-dialog
      :title="$parent.CloseTitle"
      :visible.sync="$parent.revokeType"
      width="300px"
      class="revoke-box"
      :close-on-click-modal='false'
    >
      <table-button class="tip-button" content="撤销" icon-class="icon-tip-error"></table-button>
      <span>{{$parent.CloseContent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="revokeTransmission">确 定</el-button>
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
    CloseTitle:{
      type:String
    }
  },
  data() {
    return {
      CloseTitle1:''
    };
  },
  created() {
    this.CloseTitle1=this.CloseTitle
  },
  methods: {
    handleClose() {
      this.$parent.revokeType = false
    },
    revokeTransmission() {
      this.$emit("revokeReceive",this.CloseTitle1);
    }
  }
};
</script>

<style lang="scss" scoped>
.revoke-box /deep/ .el-dialog__body {
  display: flex;
  .tip-button{
      margin-right: 8px;
      margin-top: -7px;
  }
}
.revoke-box /deep/ .el-dialog__footer {
  text-align: center;
}
</style>
