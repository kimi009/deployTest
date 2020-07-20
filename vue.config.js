const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  // pwa: {
  //   iconPaths: {
  //     favicon32: "favicon.ico",
  //     favicon16: "favicon.ico",
  //     appleTouchIcon: "favicon.ico",
  //     maskIcon: "favicon.ico",
  //     msTileImage: "favicon.ico"
  //   }
  // },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@components", resolve("src/components"))
      .set("@utils", resolve("src/utils"))
      .set("@common", resolve("src/common"))
      .set("@client", resolve("src/modules/client"))
      .set("@main", resolve("src/modules/main"))
      .set("@workerOrder", resolve("src/modules/order"))
      .set("@imgs", resolve("src/assets/imgs"));
  },
  configureWebpack: config => {
    if (process.env.NODE_ENV === "production") {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
  devServer: {
    proxy: {
      "/broker": {
        // target: 'http://devbrokerzuul.test.huaxiacloud.com', // 接口地址
        target: "http://devbrokerzuul.newtest.huaxiacloud.com", // 接口地址
        changeOrigin: true, // 是否允许跨域
        pathRewrite: {
          // '^/messageMgt': '/broker-message-manage' // 路径重写，为匹配后端的接口路径
          "^/broker": "/broker" // 路径重写，为匹配后端的接口路径
        }
      }
    }
  }
};
