
<template>
  <div class="top-bar-site-nav">
    <div class="left">
      <a class="logo" @click="gotoIndex">
        <img src="@main/img/logo.png" />
      </a>
    </div>
    <div class="right">
      <div class="other-platform right-item">
        <span @click="toCustom">{{isFromCustom ? '客户中心' : '渠道中心'}}</span>
        <span v-if="isFromCustom" @click="toConsole">控制台</span>
      </div>
      <div v-if="userName" class="personal right-item">
        <span>{{userName}}</span>
      </div>
      <div class="right-item">
        <el-button type="primary" size="mini" @click="logout()">退出</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { utils } from "@/utils/utils";
import {
  baseUrl,
  casLoginUrl,
  clientUrl,
  bpUrl,
  portalWebUrl
} from "@common/url-conf";
import MenuBox from "./MenuBox";
import { mainApi } from "@main/services";
import { ENTRYSOURCE, CHANNELTYPE } from "@common/constant";

export default {
  name: "TopBar",
  computed: {
    ...mapGetters(["userName"]),
    isFromCustom() {
      let entrySource = localStorage.getItem(ENTRYSOURCE);
      return entrySource == 2;
    },
    getCookieAndChanndel() {
      let jsessionId = utils.getCookie("JSESSIONID");
      let channelType = localStorage.getItem(CHANNELTYPE);
      return {
        jsessionId,
        channelType
      };
    }
  },
  components: {
    MenuBox
  },
  data() {
    return {
      menuFlag: false,
      baseInfo: {}
    };
  },
  methods: {
    login() {
      utils.setLogin();
    },
    logout() {
      utils.setLogout();
    },
    showMenu() {
      this.menuFlag = !this.menuFlag;
    },
    jump(domain, pageRouter = "", targetChannelType = "") {
      let { jsessionId, channelType } = this.getCookieAndChanndel;
      return `${domain}${pageRouter}?JSESSIONID=${jsessionId}&channelType=${
        targetChannelType ? targetChannelType : channelType
      }`;
    },
    gotoIndex() {
      window.open(this.jump(portalWebUrl, "", 5));
    },
    //设置账号信息
    setAccountInfo() {
      this.$router.push({
        path: "/main/account"
      });
    },
    toCustom() {
      window.open(this.isFromCustom ? this.jump(clientUrl) : this.jump(bpUrl));
    },
    toConsole() {
      window.open(
        this.jump(this.isFromCustom ? clientUrl : bpUrl, "/console/overview")
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.top-bar-site-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  line-height: 50px;
  background: #20243d;
  .left {
    .logo {
      padding: 0 20px;
      cursor: pointer;
      img {
        height: 26px;
      }
    }
  }
  .right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-right: 10px;
    .right-item {
      margin: 10px;
    }
    .personal {
      color: #ffffff;
    }
    .other-platform {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      span {
        display: inline-block;
        margin: 0 10px;
        cursor: pointer;
        color: #d6d8df;
        &:hover,
        &:active {
          color: #fff;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.userSetting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #212a40;
  font-size: 14px;
  line-height: 50px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: bold;
  .userSettingBtn {
    font-weight: bold;
  }
}
.menuPic {
  padding-right: 20px;
}
.liUserMenu {
  font-size: 12px;
  line-height: 25px;
  .menuLabel {
    color: #6d7383;
    display: inline-block;
    width: 70px;
  }
  .menuContent {
    color: #212a40;
  }
}
.menuDetail {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .menuItem {
    width: 150px;
  }
}
</style>
