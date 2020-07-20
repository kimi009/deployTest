<template>
  <div class="page-box template-box pending-grant-box">
    <ValidationObserver ref="observer" v-slot="{ passes }">
      <bread-crumb :breads="breadsData.breads" :title="breadsData.title">
        <template slot="action">
          <el-button size="mini" @click="rejectAuthorization">拒绝</el-button>
          <el-button type="primary" size="mini" @click="agreeAuthorizationBtn">同意</el-button>
        </template>
      </bread-crumb>
      <div class="page-content" style="margin-bottom: -8px;">
        <div class="upper-content">
          <div class="page-content-font">基本信息</div>
          <div class="page-content-list">
            <el-row>
              <el-col :span="24">
                <div class="content-list-information">
                  <span>授权ID</span>
                  <span>{{authorizationCode}}</span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="content-list-information">
                  <span>授权类型</span>
                  <span>
                    {{authorizeType}}
                    <el-popover
                      class="el-popovers"
                      placement="right"
                      width="226"
                      height="186"
                      trigger="hover"
                    >
                      <div>
                        <span
                          style="font-weight:bold;color:rgba(33,42,64,1);margin-bottom:10px;display:block;"
                        >授权类型说明：</span>
                        <ul style="font-size: 12px; color: #6D7383;">
                          <li>1、账号密码，则中软工程师仅获取账号密码信息，不做任何操作</li>
                          <li>2、委托操作，则中软工程师会用账号进行问题处理所必要的操作</li>
                        </ul>
                      </div>
                      <i slot="reference" class="iconfont icon-question_b password-question"></i>
                    </el-popover>
                  </span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="content-list-information">
                  <span>授权状态</span>
                  <span>
                    <img
                      v-if="authorizeStatus === '待授权'"
                      class="imgIcon"
                      :src="require('@imgs/yfp-status.png')"
                      alt
                      title
                    />
                    <table-button
                      v-if="authorizeStatus === '已授权'"
                      icon-class="icon-table-review1"
                      disabled
                      class="icon-btn"
                    ></table-button>
                    <table-button
                      v-if="authorizeStatus === '拒绝授权'"
                      icon-class="icon-table-review0"
                      disabled
                      class="icon-btn"
                    ></table-button>
                    <table-button
                      v-if="authorizeStatus === '已撤销'"
                      icon-class="icon-table-review0 icon-reset-color"
                      disabled
                      class="icon-btn"
                    ></table-button>
                    {{authorizeStatus}}
                  </span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="content-list-information">
                  <span>授权申请说明</span>
                  <span class="authorizeDesc">{{authorizeDesc}}</span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="content-list-information">
                  <span>关联工单</span>
                  <span class="relationshipID" @click="viewAuthorizeDetail">{{workOrderCode}}</span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="content-list-information">
                  <span>问题描述</span>
                  <span class="problemDesc">{{problomDesc}}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="bottom-content">
          <div class="page-content-font">授权信息</div>
          <div class="page-content-list">
            <el-row>
              <el-form label-position="left" ref="form" label-width="128px">
                <div class="tipBox">
                  <vee-input
                    v-model="authorizeAccount"
                    rules="required"
                    innerWidth="340px"
                    label="授权账号"
                    clearable
                  />
                  <el-popover
                    class="el-popovers"
                    placement="right"
                    width="226"
                    height="186"
                    trigger="hover"
                  >
                    <div>
                      <ul style="font-size: 12px; color: #6D7383;">
                        <li>请输入需要授权的账号信息，如涉及主子用户，可填写多个账号密码</li>
                      </ul>
                    </div>
                    <i slot="reference" class="iconfont icon-question_b input-question"></i>
                  </el-popover>
                </div>
                <div class="tipBox">
                  <vee-input
                    v-model="authorizePassword"
                    rules="required"
                    innerWidth="340px"
                    label="授权密码"
                    show-password
                    clearable
                    class="authorizePassword"
                  />
                  <el-popover
                    class="el-popovers"
                    placement="right"
                    width="226"
                    height="186"
                    trigger="hover"
                  >
                    <div>
                      <ul style="font-size: 12px; color: #6D7383;">
                        <li>请输入需要授权的账号密码，如涉及主子用户，可填写多个账号密码</li>
                      </ul>
                    </div>
                    <i slot="reference" class="iconfont icon-question_b input-question"></i>
                  </el-popover>
                </div>
              </el-form>
              <el-col :span="24">
                <div class="content-list-information">
                  <span>授权有效期</span>
                  <span>
                    <el-date-picker
                      v-model="filterParams.dateValue"
                      @change="timeChange"
                      type="datetimerange"
                      range-separator="~"
                      format="yyyy/MM/dd HH:mm:ss"
                      value-format="yyyy/MM/dd HH:mm:ss"
                      start-placeholder="请选择开始时间"
                      end-placeholder="请选择结束时间"
                      :picker-options="pickerOptions0"
                    ></el-date-picker>
                  </span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="content-list-information">
                  <span class="description">建议授权有效期至少24小时，以便中软客服人员可以足够时间处理问题，有效期到期后，请及时修改授权密码信息</span>
                  <span style="width:0;"></span>
                </div>
              </el-col>
              <el-col :span="24">
                <div class="content-list-information authorizeBookChecked">
                  <template>
                    <el-checkbox v-model="isChecked">我已阅读并同意</el-checkbox>
                    <span class="authorizeBook" @click="ShowAuthorizeBook">《用户授权书》</span>
                  </template>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import MyTooltip from "@components/MyTooltip";
import TableButton from "@components/TableButton";
import MyTable from "@components/MyTable";
import { ValidationObserver } from "vee-validate";
import api from "@workerOrder/manager/services.js";
import { mapState } from "vuex";
export default {
  beforeRouteEnter(to, from, next) {
    if (from.path == "/order/manager/authorize") {
      window.localStorage.removeItem("authorizeInfo");
    }
    next();
  },
  //本地缓存用户填写的数据
  beforeRouteLeave(to, from, next) {
    if (to.path == "/order/manager/authorize/AuthorizeBook") {
      (this.authorizeInfo = {
        authorizeAccount: this.authorizeAccount,
        authorizePassword: this.authorizePassword,
        authorizeTime: this.filterParams.dateValue,
        isChecked: this.isChecked
      }),
        (this.authorizeInfo = JSON.stringify(this.authorizeInfo));
      window.localStorage.setItem("authorizeInfo", this.authorizeInfo);
    }
    next();
  },
  components: {
    MyTooltip,
    TableButton,
    MyTable,
    ValidationObserver
  },
  data() {
    return {
      dateValue: [],
      isChecked: false,
      //基本信息
      authorizationCode: "",
      authorizeType: "",
      authorizeStatus: "",
      authorizeDesc: "",
      workOrderCode: "",
      problomDesc: "",
      //授权信息
      authorizeAccount: "",
      authorizePassword: "",
      authorizeEndTime: "",
      authorizeStartTime: "",
      authorizeInfo: "", //本地缓存授权信息
      //限制选中的时间只能是当前之前的时间
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      //面包屑
      breadsData: {
        breads: [
          {
            title: "我的授权",
            path: "/order/manager/authorize"
          },
          {
            title: "授权详情"
          }
        ],
        title: "授权详情"
      },
      baseFormMap: [
        {
          label: "授权ID",
          value: "authorizationCode"
        },
        {
          label: "授权类型",
          value: "authorizeType"
        },
        {
          label: "授权状态",
          value: "authorizeStatus"
        },
        {
          label: "授权申请说明",
          value: "authorizationApplicationDescription"
        },
        {
          label: "关联工单",
          value: "associatedWorkOrder"
        },
        {
          label: "问题描述",
          value: "problomDescription"
        }
      ],
      filterParams: {
        dateValue: "",
        startTime: "",
        endTime: ""
      }
    };
  },
  created() {
    if (this.$route.query.authorizationCode !== "undefined") {
      sessionStorage.setItem(
        "authorizationCode",
        this.$route.query.authorizationCode
      );
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.main.userInfo
    })
  },
  mounted() {
    this.authorizationCode = sessionStorage.getItem("authorizationCode");
    this.getAuthorizationInfo();
    if (window.localStorage.getItem("authorizeInfo")) {
      this.authorizeInfo = JSON.parse(
        window.localStorage.getItem("authorizeInfo")
      );
    }
  },
  methods: {
    timeChange(time) {
      this.filterParams.startTime = time[0];
      this.filterParams.endTime = time[1];
    },
    //获取待授权详情
    async getAuthorizationInfo() {
      let { result, obj } = await api.getAuthorizationInfo(
        this.authorizationCode
      );
      if (result && obj) {
        this.authorizeType =
          obj.authorizeType === "1" ? "账号密码" : "委托操作";
        switch (obj.authorizeStatus) {
          case "1":
            this.authorizeStatus = "待授权";
            break;
          case "2":
            this.authorizeStatus = "已授权";
            break;
          case "3":
            this.authorizeStatus = "拒绝授权";
            break;
          case "4":
            this.authorizeStatus = "已撤销";
            break;
        }
        this.authorizeDesc = obj.authorizeDesc;
        this.workOrderCode = obj.workOrderCode;
        this.problomDesc = obj.qustionDesc;
        this.authorizationCode = obj.authorizationCode;
        this.authorizeAccount =
          obj.authorizeAccount != null ? obj.authorizeAccount : "";
        this.authorizePassword =
          obj.authorizePassword != null ? obj.authorizePassword : "";
        this.filterParams.startTime =
          obj.authorizeStartTime != null ? obj.authorizeStartTime : "";
        this.filterParams.endTime =
          obj.authorizeEndTime != null ? obj.authorizeEndTime : "";
        this.filterParams.dateValue = [
          this.filterParams.startTime,
          this.filterParams.endTime
        ];
        //获取本地保留的账户密码信息
        if (this.authorizeInfo) {
          this.authorizeAccount = this.authorizeInfo.authorizeAccount;
          this.authorizePassword = this.authorizeInfo.authorizePassword;
          this.filterParams.dateValue = this.authorizeInfo.authorizeTime;
          this.isChecked = this.authorizeInfo.isChecked;
        }
      }
    },
    //同意
    async agreeAuthorization() {
      let agreeData = Object.assign(
        {},
        { authorizationCode: this.authorizationCode },
        { authorizeDesc: this.authorizeDesc },
        { authorizeStartTime: this.filterParams.dateValue[0] },
        { authorizeEndTime: this.filterParams.dateValue[1] },
        { authorizeAccount: this.authorizeAccount },
        { authorizePassword: this.authorizePassword }
      );
      let { result } = await api.agreeAuthorization(agreeData);
      if (result) {
        this.$router.push({
          path: "/order/manager/authorize/AuthorizeDetail",
          query: {
            authorizationCode: this.authorizationCode
          }
        });
      }
    },
    //拒绝
    async rejectAuthorization() {
      let { result } = await api.rejectAuthorization({
        authorizationCode: this.authorizationCode,
        authorizeDesc: this.authorizeDesc,
        authorizeAccount: this.authorizeAccount,
        authorizePassword: this.authorizePassword
      });
      if (result) {
        const MyMessageBox = this.$MyMessageBox({
          type: "error",
          content: "拒绝授权可能会对您的工单处理解决造成影响，请您确认。",
          btn: [
            {
              text: "取消",
              fn: () => {
                MyMessageBox.visible = false;
              }
            },
            {
              type: "primary",
              text: "确认",
              fn: () => {
                MyMessageBox.visible = false;
                this.$router.push({
                  path: "/order/manager/authorize/AuthorizeDetail",
                  query: {
                    authorizationCode: this.authorizationCode
                  }
                });
              }
            }
          ]
        });
      }
    },
    agreeAuthorizationBtn() {
      if (!this.isChecked) {
        this.$message({
          message: "请勾选用户授权书",
          type: "warning"
        });
      } else if (!this.filterParams.dateValue) {
        this.$message({
          message: "请选择授权有效期",
          type: "error"
        });
      } else {
        this.agreeAuthorization();
      }
    },
    //用户授权书
    ShowAuthorizeBook() {
      this.$router.push({
        path: "/order/manager/authorize/AuthorizeBook",
        query: {
          authorizationCode: this.authorizationCode
        }
      });
    },
    viewAuthorizeDetail() {
      this.$router.push({
        path: "/order/manager/mine/Detail",
        query: {
          workOrderCode: this.workOrderCode
        }
      });
    },
    AuthorizeBookSure() {
      this.isChecked = true;
    }
  }
};
</script>

<style lang="scss"  scope>
.pending-grant-box {
  .page-content-font {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(33, 42, 64, 1);
    line-height: 20px;
    margin-bottom: 20px;
  }
  .page-content {
    min-height: auto;
    .upper-content {
      margin-bottom: 20px;
      border-bottom: 1px dashed #dbdeea;
    }
  }
  .el-range-editor--mini.el-input__inner {
    padding-left: 1 !important;
  }
  .el-range-editor--mini .el-range__icon {
    position: absolute !important;
    right: 8px !important;
    top: 1px;
  }
  .el-range-editor--mini .el-range__close-icon {
    position: absolute !important;
    right: 27px !important;
    top: 2px;
  }
  .page-content-list {
    width: 100%;
    .content-list-information {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      white-space: nowrap;
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(109, 115, 131, 1);
        margin-right: 56px;
      }
      span:first-child {
        display: inline-block;
        width: 72px;
        white-space: nowrap;
      }
      span:last-child {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(33, 42, 64, 1);
      }

      .el-icon-loading {
        margin-right: 8px;
      }
      .relationshipID {
        color: rgba(51, 105, 255, 1) !important;
        cursor: pointer;
      }
      .el-input--mini .el-input__inner {
        width: 340px;
      }
      .description {
        width: 100%;
        white-space: nowrap;
      }
      .problemDesc,
      .authorizeDesc {
        display: inline-block;
        width: 85%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .password-info {
      input {
        border-radius: 0 !important;
      }
      span:nth-child(2) {
        span {
          margin-right: -10px !important;
        }
      }
    }
    .account-info {
      span:nth-child(2) {
        span {
          margin-right: -10px !important;
        }
      }
    }
    .input-content {
      display: flex;
      align-items: center;
    }
    .authorizeBookChecked {
      span:first-child {
        width: 14px !important;
        margin-right: 0 !important;
      }
      span:nth-child(2) {
        margin-right: 0 !important;
      }
      .authorizeBook {
        color: #3369ff !important;
        cursor: pointer;
      }
    }
    .el-range-editor--mini.el-input__inner {
      width: 340px;
      border-radius: 0;
      span {
        margin-right: 0 !important;
      }
    }
    .password-question {
      margin-left: 5px;
    }
    .input-question {
      margin-left: 10px;
      display: inline-block;
      padding-top: 7px;
    }
    .icon-question_b {
      cursor: pointer;
      color: #6d7383;
    }
  }
  .icon-table-review0,
  .icon-table-review1,
  .icon-reset-color {
    font-size: 13px;
    display: inline-block;
    margin-top: 2px;
  }
  .icon-reset-color {
    color: #dbdeea !important;
  }
  .imgIcon {
    width: 14px !important;
    height: 14px !important;
    cursor: pointer;
    margin-right: 5px;
  }
  .icon-btn {
    span {
      width: 15px !important;
      margin-right: 3px !important;
    }
  }
  .tipBox {
    width: 100%;
    display: flex;
  }
  .el-form-item__label {
    padding-left: 0px !important;
    margin-top: 5px;
  }
  .authorizePassword {
    .el-input--suffix {
      .el-input__inner {
        padding-right: 56px !important;
      }
    }
  }
}
</style>  