import { utils } from "@utils/utils";
import { mainApi } from "@main/services";
import { SUPPERADMIN } from "@common/constant";
const state = {
  userInfo: {}
};
const getters = {
  userName: state => state.userInfo.userName,
  userId: state => state.userInfo.id,
  isSupperAdmin: state => {
    return state.userInfo.userCode === SUPPERADMIN;
  }
};
const mutations = {
  setUserInfo(state, obj) {
    state.userInfo = obj;
  }
};
const actions = {
  async getInfo({ commit, state }) {
    console.log(mainApi);
    let { result, obj } = await mainApi.mainQueryUserInfo(state.token);
    if (result) {
      if (obj) {
        commit("setUserInfo", obj || {});
        utils.setLoginSuccess();
      }
    }
  }
};

export default {
  state,
  actions,
  mutations,
  getters
};
