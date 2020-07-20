let baseUrl = "/broker";
let msgUrl = "/broker-message-manage";
let userUrl = "/broker-auth-service";
let customUrl = "/broker-customer-client";
let workerOrderUrl = "/broker-workorder-service";
const bpServiceUrl = "/broker-partner-service";

const origin = location.origin;
let hostURL = "",
  casLoginUrl = "",
  casUrl = "",
  clientUrl = "",
  portalWebUrl = "",
  bpUrl = "";
/**
 * 开发环境
 */
const DevEnv = {
  origin: "http://workorderui-dev.newtest.huaxiacloud.com",
  casUrl: "http://devbrokercas.newtest.huaxiacloud.com", // 获取验证码地址
  casLoginUrl: "http://devbrokerzuul.newtest.huaxiacloud.com",
  clientUrl: "http://clientui-dev.newtest.huaxiacloud.com",
  bpUrl: "http://partner-ui-dev.newtest.huaxiacloud.com",
  portalWebUrl: "http://portal-ui-dev.newtest.huaxiacloud.com"
};
/**
 * 测试环境
 */
const TestEnv = {
  origin: "http://workorderui-test.newtest.huaxiacloud.com",
  casUrl: "http://testcas.newtest.huaxiacloud.com",
  casLoginUrl: "http://testzuul.newtest.huaxiacloud.com",
  clientUrl: "http://clientui-test.newtest.huaxiacloud.com",
  bpUrl: "http://partnerui-test.newtest.huaxiacloud.com",
  portalWebUrl: "http://portalui-test.newtest.huaxiacloud.com"
};
/**
 * 生成环境
 */
const ProdEnv = {
  origin: "https://workorderui.huaxiacloud.com",
  casUrl: "https://prodbrokercas.huaxiacloud.com",
  casLoginUrl: "https://prodbrokerzuul.huaxiacloud.com",
  clientUrl: "https://portalui.huaxiacloud.com/clientui",
  bpUrl: "https://portalui.huaxiacloud.com/partner",
  portalWebUrl: "https://portalui.huaxiacloud.com"
};

if (origin == DevEnv.origin || origin.includes("localhost")) {
  hostURL = DevEnv.origin;
  casLoginUrl = DevEnv.casLoginUrl;
  casUrl = DevEnv.casUrl;
  clientUrl = DevEnv.clientUrl;
  bpUrl = DevEnv.bpUrl;
  portalWebUrl = DevEnv.portalWebUrl;
} else if (origin == TestEnv.origin) {
  hostURL = TestEnv.origin;
  casLoginUrl = TestEnv.casLoginUrl;
  casUrl = TestEnv.casUrl;
  clientUrl = TestEnv.clientUrl;
  bpUrl = TestEnv.bpUrl;
  portalWebUrl = TestEnv.portalWebUrl;
} else if (origin == ProdEnv.origin) {
  hostURL = ProdEnv.origin;
  casLoginUrl = ProdEnv.casLoginUrl;
  casUrl = ProdEnv.casUrl;
  clientUrl = ProdEnv.clientUrl;
  bpUrl = ProdEnv.bpUrl;
  portalWebUrl = TestEnv.portalWebUrl;
}

export {
  baseUrl,
  msgUrl,
  customUrl,
  bpServiceUrl,
  portalWebUrl,
  bpUrl,
  userUrl,
  hostURL,
  casUrl,
  clientUrl,
  casLoginUrl,
  workerOrderUrl
};
