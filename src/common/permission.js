import router from "../router";
import store from "../store";
import { utils } from "@/utils/utils";
import { ENTRYSOURCE, CHANNELTYPE } from "@common/constant";

let entrySource = utils.getUrlParams(ENTRYSOURCE);
if (entrySource) {
  localStorage.setItem(ENTRYSOURCE, entrySource);
}
let channelType = utils.getUrlParams(CHANNELTYPE);
if (channelType) {
  localStorage.setItem(CHANNELTYPE, channelType);
}

router.beforeEach(async (to, from, next) => {
  const isLogin = utils.getIsLogin();

  if (isLogin !== "TRUE" || !store.state.main.userInfo.userCode) {
    await store.dispatch("getInfo");
    next();
  } else {
    next();
  }
});

router.afterEach(() => {});
