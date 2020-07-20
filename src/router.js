import Vue from "vue";
import Router from "vue-router";
import MainLayout from "@main/view/layout/MainLayout.vue";
import Page404 from "@main/view/layout/Page404.vue";
import "@main/router";

// 重写push
const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error);
};

Vue.use(Router);

var routerChildren = [];
// const path = require("path");
const files = require.context("@/modules", true, /router.js$/);
files.keys().forEach(key => {
  // const name = path.basename(key, ".vue");
  var routerOther = files(key).default || files(key);
  routerChildren.push(...routerOther);
});

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: routerChildren
    },
    {
      path: "*",
      component: Page404
    }
  ]
});
