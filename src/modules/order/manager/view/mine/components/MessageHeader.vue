<template>
  <div class="communication-details">
    <div class="communication-details-user">
      <div class="details-user-portrait">
        <img src="@imgs/defaultPic.png" alt />
        <p>{{ reporterName }}</p>
        <span>{{ createTime }}</span>
      </div>
      <p class="user-signature">{{ workOrderDesc }}</p>
    </div>
    <el-row>
      <el-col :span="9" v-if="secretMessage==''?false:(secretMessage==null?false:true)">
        <div class="content-list-information">
          <el-col :span="9">
            <span>机密信息</span>
          </el-col>
          <el-col :span="11">
            <span>*********</span>
          </el-col>
        </div>
      </el-col>
      <el-col :span="9" v-for="i in DynamicChild" :key="i.workOrderFieldCode">
        <div class="content-list-information">
          <el-col :span="9">
            <span>{{ i.name.split('_')[0] }}</span>
          </el-col>
          <el-col :span="11">
            <span>{{ i.value }}</span>
          </el-col>
        </div>
      </el-col>
      <el-col :span="9" v-if="fileDtoList !== null">
        <div class="content-list-information">
          <el-col :span="9">
            <span>附件</span>
          </el-col>
          <el-col :span="11">
            <span
              v-for="i in fileDtoList"
              :key="i.id"
              class="fileDown"
              @click="downloadfilePost(i.filePath, i.fileName)"
            >{{ i.fileName }}</span>
          </el-col>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    informationData: {
      type: Object,
      require: true
    },
    DynamicData: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      reporterName: "",
      createTime: "",
      secretMessage: "",
      time: null,
      workOrderDesc: "",
      DynamicChild: [],
      fileDtoList: []
    };
  },
  watch: {
    informationData(newValue, oldValue) {
      let {
        secretMessage,
        reporterName,
        workOrderDesc,
        createTime,
        fileDtoList
      } = this.informationData;
      Object.assign(this, {
        secretMessage,
        reporterName,
        workOrderDesc,
        createTime,
        fileDtoList
      });
      this.DynamicChild = this.DynamicData;
    }
  },
  created() {},
  methods: {
    downloadfilePost(filePath, fileName) {
      this.$emit("downloadfileRecive", filePath, fileName);
    }
  }
};
</script>

<style lang="scss" scoped>
.communication-details {
  border-bottom: 1px dashed #dbdeea;
  overflow: auto;
  .communication-details-user {
    width: 100%;
    margin-bottom: 20px;
    .details-user-portrait {
      width: 100%;
      overflow: auto;
      margin-bottom: 20px;
      img {
        width: 44px;
        height: 44px;
        float: left;
        margin-right: 20px;
      }
      p {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(33, 42, 64, 1);
        margin-bottom: 13px;
      }
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(163, 169, 183, 1);
      }
    }
    .user-signature {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(33, 42, 64, 1);
      line-height: 16px;
    }
  }
  .content-list-information {
    display: flex;
    margin-bottom: 20px;
    .el-col-9 {
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(109, 115, 131, 1);
        margin-right: 56px;
        white-space: nowrap;
      }
    }
    .el-col-11 {
      span {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        display: block;
        line-height: 16px;
        word-break: break-all;
        img {
          width: 14px;
          height: 14px;
          float: left;
          margin-right: 8px;
        }
        .el-button {
          padding: 0;
          margin-right: 8px;
          margin-top: -2px;
        }
      }
    }
    .el-icon-loading {
      margin-right: 8px;
    }
    .fileDown {
      color: rgba(51, 105, 255, 1);
      cursor: pointer;
      margin-bottom: 5px;
      display: block;
    }
  }
}
</style>
