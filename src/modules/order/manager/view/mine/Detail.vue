<template>
  <div class="page-box mine-page-box">
    <ValidationObserver ref="observer" v-slot="{ passes }">
      <bread-crumb :breads="breadsData.breads" :title="breadsData.title">
        <template slot="action">
          <el-button
            v-if="informationData.jobStatus == 2"
            size="mini"
            @click="revokeType = true"
            >撤 单</el-button
          >
          <el-button
            v-if="informationData.jobStatus == 2"
            size="mini"
            @click="isReminder = true"
            >催 单</el-button
          >
          <el-button
            v-if="informationData.jobStatus == 3"
            size="mini"
            @click="CloseJob"
            >关闭工单</el-button
          >
          <el-button
            size="mini"
            v-if="miniSaveType"
            @click="passes(miniSave)"
            :type="primary"
            :disabled="disabled"
            >提交留言</el-button
          >
          <el-button
            size="mini"
            @click="isEvaluation = true"
            type="primary"
            v-if="informationData.jobStatus == 5"
            >评价服务</el-button
          >
          <el-button
            v-if="informationData.jobStatus == 4"
            size="mini"
            @click="NoConfirm"
            >未解决</el-button
          >
          <el-button
            v-if="informationData.jobStatus == 4"
            size="mini"
            type="primary"
            @click="YesConfirm"
            >已解决</el-button
          >
        </template>
      </bread-crumb>
      <div class="page-over-box">
        <essential-information
          :informationData="informationData"
        ></essential-information>
        <div class="page-content">
          <p class="page-content-font">沟通详情</p>
          <!-- 沟通详情模块 -->
          <message-header
            :informationData="informationData"
            :DynamicData="DynamicData"
            @downloadfileRecive="downloadfile"
          ></message-header>
          <!-- 问题回复模块 -->
          <div v-if="communicationType">
            <div
              class="communication-questions-reply"
              v-for="i in communicationData"
              :key="i.id"
            >
              <div class="details-user-portrait">
                <img src="@imgs/defaultPic.png" alt />
                <p>
                  {{
                    i.createUsername == informationData.createUsername
                      ? i.createUsername
                      : "中软工程师"
                  }}
                </p>
                <span>{{ i.createTime }}</span>
              </div>
              <p class="user-signature">{{ i.leaveContent }}</p>
              <el-row>
                <el-col :span="9" v-if="i.fileDtoList.length !== 0">
                  <div class="content-list-information">
                    <el-col :span="7">
                      <span>附件</span>
                    </el-col>
                    <el-col :span="11">
                      <span
                        v-for="(item, index) in i.fileDtoList"
                        :key="index"
                        class="fileDown"
                        @click="downloadfile(item.filePath, item.fileName)"
                        >{{ item.fileName }}</span
                      >
                    </el-col>
                  </div>
                </el-col>
                <el-col
                  :span="9"
                  v-if="
                    i.secretContent == ''
                      ? false
                      : i.secretContent == null
                      ? false
                      : true
                  "
                >
                  <div class="content-list-information">
                    <el-col :span="9">
                      <span>机密信息</span>
                    </el-col>
                    <el-col :span="11">
                      <span>*********</span>
                    </el-col>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
          <!--  回复留言模块 -->
          <div v-if="replyType" class="reply-message">
            <el-form label-position="left" ref="form" label-width="150px">
              <el-form-item label="回复留言">
                <el-input
                  type="textarea"
                  style="width: 730px;"
                  v-model="replyData.leaveContent"
                  placeholder="请输入留言信息"
                  maxlength="1500"
                  show-word-limit
                  :rows="7"
                  resize="none"
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-checkbox-group v-model="checkTrue">
                  <el-checkbox label="添加机密信息"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <!-- <el-form-item v-if="checkTrue">
                <el-input
                  style="width: 730px;"
                  v-model="replyData.secretContent"
                  maxlength="200"
                  placeholder="请填写您的实例名、账号、密码等机密信息，提交后，机密信息将会做机密处理"
                ></el-input>
              </el-form-item>-->
              <vee-input
                class="no-label"
                v-if="checkTrue"
                require="true"
                placeholder="请填写您的实例名、账号、密码等机密信息，提交后，机密信息将会做机密处理，关单后机密信息清除"
                v-model="replyData.secretContent"
                rules="required"
                innerWidth="730px"
                maxlength="200"
                label="机密信息"
              />
              <el-form-item label="附件">
                <upload-file
                  class="uploadFile uploadDemo"
                  v-model="replyData.fileDtoList"
                ></upload-file>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </ValidationObserver>
    <revoke-diglog
      v-if="revokeType"
      :revokeType="revokeType"
      @revokeReceive="revokeSend"
      :CloseTitle="CloseTitle"
    ></revoke-diglog>
    <detail-reminder
      v-if="isReminder"
      :isReminder="isReminder"
      :messageType="messageType"
      @ReminderPost="ReminderSave"
    ></detail-reminder>
    <div class="tip-message" v-if="messageType">
      <table-button icon-class="icon-tip-success"></table-button>
      <span class="content"
        >催单成功！我们已经收到您的催单请求，将会尽快为您服务，请您耐心等待</span
      >
      <i class="el-icon-close" @click="messageType = false"></i>
    </div>
    <detail-rate
      :isEvaluation="isEvaluation"
      @rateExtraction="rateReceive"
    ></detail-rate>
  </div>
</template>

<script>
import EssentialInformation from "./components/EssentialInformation";
import MessageHeader from "./components/MessageHeader";
import { ValidationObserver } from "vee-validate";
import api from "@workerOrder/manager/services.js";
import RevokeDiglog from "./components/RevokeDiglog";
import DetailReminder from "./components/DetailReminder";
import TableButton from "@components/TableButton";
import DetailRate from "./components/DetailRate";
import UploadFile from "@components/UploadFile";
import { utils } from "@utils/utils";
export default {
  components: {
    EssentialInformation,
    MessageHeader,
    ValidationObserver,
    RevokeDiglog,
    DetailReminder,
    TableButton,
    DetailRate,
    UploadFile
  },
  data() {
    return {
      breadsData: {
        breads: [
          {
            title: "我的工单",
            path: "/order/manager/mine"
          },
          {
            title: "工单详情"
          }
        ],
        title: "工单详情"
      },
      informationData: {},
      // 官方回复详情
      communicationData: [],
      // 回复留言
      replyData: {
        leaveContent: "",
        secretContent: "",
        workOrderCode: "",
        fileDtoList: []
      },
      checkTrue: false,
      // 撤单弹框
      revokeType: false,
      // 催单
      isReminder: false,
      messageType: false,
      // 待您评价
      isEvaluation: false,
      primary: "",
      miniSaveType: false,
      disabled: false,
      //关闭工单
      CloseTitle: "提示",
      CloseContent: "请您确认是否撤销此工单，工单撤销后将不再进行处理！",
      // 官方回复状态
      communicationType: true,
      replyType: false,
      status: false,
      workOrderCode: "",
      DynamicData: [],
      time1: null,
      required: "required"
    };
  },
  created() {
    let { workOrderCode } = this.$route.query;
    Object.assign(this, { workOrderCode });
    this.workinit();
    this.init();
  },
  watch: {
    "replyData.fileDtoList": {
      handler(newName, oldName) {
        newName.forEach((i, index) => {
          i.fileSource = i.uid;
        });
      },
      immediate: true
    },
    "replyData.secretContent": {
      handler(n, o) {
        if (n.length == 200) {
          this.$message({
            message: "长度不能超过200个字符",
            type: "error"
          });
        }
      }
    }
  },
  methods: {
    init() {
      this.$nextTick(() => {
        this.queryworkordermsglist();
      });
    },
    workinit() {
      this.$nextTick(() => {
        this.queryWorkOrder();
      });
    },
    //文件下载
    async downloadfile(filePath, filename) {
      let res = await api.downloadfile(
        {
          filePath: filePath,
          filename: filename
        },
        {},
        { responseType: "blob" }
      );
      utils.webDownLoadFile(filename, res);
    },
    // 获取沟通详情
    async queryworkordermsglist() {
      let msglistData = {
        pageConfig: {
          pageNum: 0,
          pageSize: 0
        },
        workOrderCode: this.workOrderCode
      };
      let { obj, result } = await api.queryworkordermsglist(msglistData);
      if (result) {
        this.communicationData = obj.data;
      }
    },
    // 请求详情接口
    async queryWorkOrder() {
      this.DynamicData = [];
      let { obj, result } = await api.queryWorkOrder(this.workOrderCode);
      if (result) {
        this.status = true;
        this.informationData = obj;
        let customAttrObj = JSON.parse(this.informationData.customAttributes);
        for (var key in customAttrObj) {
          let name, value;
          let customObj = {};
          name = key;
          value = customAttrObj[key];
          customObj = {
            name: name,
            value: value
          };
          this.DynamicData.push(customObj);
        }
        let { customerAccount, customerName } = obj;
        Object.assign(this.replyData, { customerAccount, customerName });
        switch (this.informationData.jobStatus) {
          case 3: //为您处理
            this.primary = "primary";
            this.miniSaveType = true;
            this.replyType = true;
            break;
          case 2: //已分派
            this.primary = "";
            this.miniSaveType = true;
            this.replyType = true;
            break;
          // case 7://已撤销
          //   break;
        }
      }
    },
    // 撤单弹框
    async revokeSend(data) {
      this.revokeType = false;
      if (data == "提示") {
        let { obj, result } = await api.cancelWorkOrder({
          workOrderCode: this.informationData.workOrderCode
        });
        if (result) {
          this.miniSaveType = false;
          this.replyType = false;
          this.workinit();
        } else {
          this.workinit();
        }
      } else {
        let { obj, result } = await api.closeWorkOrder({
          workOrderCode: this.informationData.workOrderCode
        });
        if (result) {
          this.miniSaveType = false;
          this.replyType = false;
          this.workinit();
        } else {
          this.workinit();
        }
      }
    },
    // 提交留言 待确认的提交留言
    async miniSave() {
      this.disabled = true;
      this.replyData.leaveContent = this.replyData.leaveContent.trim();
      if (this.replyData.leaveContent == "") {
        this.disabled = false;
        this.$message({
          message: "请输入回复留言",
          type: "error"
        });
      } else {
        this.replyData.workOrderCode = this.workOrderCode;
        let { obj, result } = await api.saveworkordermsg(this.replyData);
        if (result) {
          this.replyData.leaveContent = "";
          this.replyData.secretContent = "";
          this.replyData.fileDtoList = [];
          this.checkTrue = false;
          this.$message({
            message: "恭喜你，提交成功",
            type: "success"
          });
          this.init();
          this.disabled = false;
        }
      }
    },
    // 催单
    async ReminderSave(data) {
      data = data.trim();
      if (data == "" || data.length == 0) {
        this.$message({
          message: "请输入催单说明",
          type: "error"
        });
      } else {
        let saveData = {
          remindContent: data,
          workOrderCode: this.informationData.workOrderCode
        };
        this.isReminder = false;
        let { result } = await api.createReminder(saveData);
        if (result) {
          this.messageType = true;
          this.time1 = setTimeout(() => {
            this.messageType = false;
          }, 3000);
        } else {
          this.$nextTick(() => {
            this.workinit();
          });
        }
      }
    },
    // 待您评价 待确认的待您评价
    async rateReceive(rateValue, evaluationTextarea) {
      if (rateValue == 0) {
        this.$message({
          message: "请为我们的服务打个星吧",
          type: "error"
        });
      } else {
        let { result, obj, info } = await api.appraiseWorkOrder({
          appraiseDesc: evaluationTextarea,
          score: rateValue,
          workOrderCode: this.informationData.workOrderCode
        });
        if(result){
          this.isEvaluation = false;
          this.workinit();
        }
        
      }
    },

    // 未确认
    async NoConfirm() {
      let { obj, result } = await api.verifyWorkOrderFalse({
        workOrderCode: this.workOrderCode
      });
      if(result){
        this.$nextTick(() => {
        this.workinit();
        this.primary = "primary";
        this.replyType = true;
        this.miniSaveType = true;
        this.informationData.jobStatus = "";
        });
      }
    },
    //已解决
    YesConfirm() {
      this.isEvaluation = true;
    },
    //关闭工单
    CloseJob() {
      this.revokeType = true;
      this.CloseTitle = "关闭工单";
      this.CloseContent = "请您确认是否关闭此工单，工单关闭后将不再进行处理！";
    }
  },
  destroyed() {
    clearTimeout(this.time1);
    this.time1 = null;
  }
};
</script>

<style lang="scss" scoped>
.mine-page-box {
  .page-content {
    min-height: auto !important;
    height: auto !important;
  }
  .page-over-box {
    overflow: auto;
    height: calc(100vh - 100px);
  }

  .tip-message {
    min-width: 505px;
    height: 36px;
    line-height: 36px;
    background: rgba(230, 255, 249, 1);
    box-shadow: 0px 2px 8px 0px rgba(9, 216, 206, 0.2);
    border: 1px solid rgba(9, 216, 206, 1);
    position: absolute;
    top: 62px;
    left: 40%;
    padding: 0 15px;
    .icon-tip-success {
      width: 16px;
      height: 16px;
      margin: 10px 10px;
    }
    .content {
      color: rgba(33, 42, 64, 1);
    }
    .el-icon-close {
      float: right;
      font-size: 18px;
      color: #09d8ce;
      float: right;
      margin: 8px 10px;
      cursor: pointer;
    }
  }

  .page-content-font {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(33, 42, 64, 1);
    line-height: 20px;
    margin-bottom: 20px;
  }
  .communication-questions-reply {
    border-bottom: 1px dashed #dbdeea;
    overflow: auto;
    padding-top: 20px;
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
      margin-bottom: 20px;
    }
    .fileDown {
      color: rgba(51, 105, 255, 1);
      cursor: pointer;
      margin-bottom: 5px;
      display: block;
      font-size: 13px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
    }
    .content-list-information {
      overflow: auto;
      margin-bottom: 20px;
      .el-col-7 {
        span {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(109, 115, 131, 1);
          margin-right: 56px;
        }
      }
    }
  }
  .reply-message {
    width: 100%;
    overflow: auto;
    padding-top: 20px;
  }
  .uploadFile /deep/ ul {
    width: 700px;
  }
  .uploadDemo {
    display: inline-block;
  }
  .no-label >>> .el-form-item__label {
    display: none;
  }
}
</style>
