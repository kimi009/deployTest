<template>
  <div class="page-box template-box pending-grant-box">
    <bread-crumb :breads="breadsData.breads" :title="breadsData.title"></bread-crumb>
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
                <span>{{authorizeType}}</span>
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
            <el-col :span="24">
              <div class="content-list-information">
                <span>授权账号</span>
                <span>{{authorizeAccount}}</span>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="content-list-information">
                <span>授权密码</span>
                <span>{{authorizePassword}}</span>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="content-list-information">
                <span>授权有效期</span>
                <span>{{authorizeTime}}</span>
              </div>
            </el-col>
            <el-col :span="24">
              <div class="content-list-information">
                <span class="description">建议授权有效期至少24小时，以便中软客服人员可以足够时间处理问题，有效期到期后，请及时修改授权密码信息</span>
                <span style="width:0;"></span>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MyTooltip from "@components/MyTooltip";
import TableButton from "@components/TableButton";
import MyTable from "@components/MyTable";
import api from "@workerOrder/manager/services.js";
export default {
  beforeRouteLeave(to, from, next) {
    if (to.path == "/order/manager/authorize/PendingGrant") {
      next("/order/manager/authorize");
    } else {
      next();
    }
  },
  components: {
    MyTooltip,
    TableButton,
    MyTable
  },
  data() {
    return {
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
      dateValue: "",
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
      authorizeTime: ""
    };
  },
  created() {
    this.authorizationCode = this.$route.query.authorizationCode;
  },
  mounted() {
    this.getAuthorizationInfo();
  },
  methods: {
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
        if (obj.authorizeAccount && obj.authorizeAccount) {
          this.authorizeAccount =
            obj.authorizeAccount.substr(0, 2) +
            "***" +
            obj.authorizeAccount.substr(-2);
          this.authorizePassword =
            obj.authorizePassword.substr(0, 3) +
            "***" +
            obj.authorizePassword.substr(-2);
        } else {
          this.authorizeAccount = "";
          this.authorizePassword = "";
        }
        if (obj.authorizeStartTime && obj.authorizeEndTime) {
          this.authorizeTime =
            obj.authorizeStartTime + " ~ " + obj.authorizeEndTime;
        } else {
          this.authorizeTime = "";
        }
      }
    },
    //跳转工单详情
    viewAuthorizeDetail() {
      this.$router.push({
        path: "/order/manager/mine/Detail",
        query: {
          workOrderCode: this.workOrderCode
        }
      });
    }
  }
};
</script>

<style lang="scss" scope >
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
    padding-left: 0 !important;
  }
  .el-range-editor--mini .el-range__icon {
    position: absolute !important;
    right: 8px !important;
    top: 1px;
  }
  .el-range-editor--mini .el-range__close-icon {
    position: absolute !important;
    right: 35px !important;
    top: 2px;
  }
  .page-content-list {
    width: 100%;
    .content-list-information {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
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
    }
    .el-range-editor--mini.el-input__inner {
      width: 340px;
      border-radius: 0;
      span {
        margin-right: 0 !important;
      }
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
}
</style>