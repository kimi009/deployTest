export default [
  {
    // 消息管理
    path: "/demo",
    component: resolve => require(["./view/Demo.vue"], resolve),
    //redirect: '/message/dashboard',
    children: [
      {
        // 消息管理-看板
        path: "/demo",
        component: resolve => require(["./view/Demo.vue"], resolve)
      }
    ]
  },
  {
    //欢迎回来
    path: "/",
    component: resolve => require(["./view/home/Index.vue"], resolve)
  },
  {
    // 401
    path: "notAllow",
    component: resolve => require(["./view/layout/Page401.vue"], resolve)
  }
];
