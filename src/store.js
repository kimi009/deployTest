import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

import mainStore from "@main/vuex";
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    main: mainStore
  },
  plugins: [
    createPersistedState({
      storage: window.localStorage,
      reducer: () => ({
        default: {}
      })
    })
  ]
});

export default store;
