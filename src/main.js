import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import regComponents from "@common/reg-components";
import "@common/permission";
import filter from "@common/filter/index.js";
import "@common/validator-rule"; //todo按需
import "element-ui/lib/theme-chalk/index.css";
import "@/assets/css/index.scss";

require("@common/directive");
Vue.use(ElementUI, { size: "mini" });
Vue.use(regComponents);
// 过滤器
for (let key in filter) {
  Vue.filter(key, filter[key]);
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
