export default [
  {
    // 工单管理
    path: "/order/manager",
    component: resolve => require(["./Index.vue"], resolve),
    redirect: "/order/manager/mine",
    children: [
      {
        // 我的工单
        path: "mine",
        component: resolve => require(["./view/mine/Index.vue"], resolve)
      },
      {
        // 工单详情
        path: "mine/detail",
        name: "Detail",
        component: resolve => require(["./view/mine/Detail.vue"], resolve)
      },
      {
        // 新建工单
        path: "create",
        component: resolve => require(["./view/create/Index.vue"], resolve)
      },
      {
        // 新建工单第二步
        path: "create/ProgressSecond",
        name: "ProgressSecond",
        component: resolve =>
          require(["./view/create/WorkOrderProgressSecond.vue"], resolve),
        meta: {
          parent: "/order/manager/create"
        }
      },
      {
        // 新建工单第三步
        path: "create/ProgressThird",
        name: "ProgressThird",
        component: resolve =>
          require(["./view/create/WorkOrderProgressThird.vue"], resolve),
        meta: {
          parent: "/order/manager/create"
        }
      },
      {
        // 我的授权
        path: "authorize",
        component: resolve => require(["./view/authorize/Index.vue"], resolve)
      },
      {
        // 待授权
        path: "authorize/PendingGrant",
        component: resolve =>
          require(["./view/authorize/PendingGrant.vue"], resolve)
      },
      {
        // 授权详情
        path: "authorize/AuthorizeDetail",
        component: resolve =>
          require(["./view/authorize/AuthorizeDetail.vue"], resolve)
      },
      {
        // 用户授权书
        path: "authorize/AuthorizeBook",
        component: resolve =>
          require(["./view/authorize/AuthorizeBook.vue"], resolve)
      }
    ]
  }
];
