import axios from "axios";
import { baseUrl } from "@common/url-conf";
import { Message, MessageBox } from "element-ui";
import { utils } from "@/utils/utils";
import router from "../router";

// 超时时间
axios.defaults.timeout = 250000;
axios.defaults.baseURL = baseUrl;
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.withCredentials = true;

// // http请求拦截器
// const CancelToken = axios.CancelToken;
// const pending = [];

axios.interceptors.request.use(
  config => {
    let jsessionId = utils.getUrlParams("JSESSIONID");
    if (jsessionId != undefined) {
      utils.setCookie("JSESSIONID", jsessionId, 1);
    }
    config.headers["Content-Type"] = "application/json";
    config.headers["systemCode"] = localStorage.getItem("currentMenuCode");
    if (config.method == "get") {
      config.params = {
        _: Date.now(),
        ...config.params
      };
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// http响应拦截器
axios.interceptors.response.use(
  response => {
    switch (response.data.retCode) {
      case "0101":
        utils.setLogin();
        break;
      case "0184":
        if (document.getElementsByClassName("el-message-box").length === 0) {
          MessageBox.alert(
            "您的账号已在别处登录，如非本人操作，建议尽快修改密码",
            "提示",
            {
              confirmButtonText: "确定",
              showClose: false,
              type: "warning",
              callback: () => {
                utils.setLogout();
              }
            }
          );
        }
        break;
      case "0146":
        if (document.getElementsByClassName("el-message-box").length === 0) {
          MessageBox.alert("登录信息已过期，请重新登录", "提示", {
            confirmButtonText: "确定",
            showClose: false,
            type: "warning",
            callback: () => {
              utils.setLogout(response.data.obj);
            }
          });
        }
        break;
      default:
        return response;
    }
    return response;
  },
  error => {
    if (error && error.response) {
      // console.log("response status is", error.response.status);
      switch (error.response.status) {
        case 401:
          //返回 401 清除token信息并跳转到登录页面
          router.push({
            path: "/notAllow"
          });
      }
    }
    return Promise.reject(error);
  }
);

function showErrorMessage({ retCode, info }) {
  if (document.getElementsByClassName("el-message").length === 0) {
    if (retCode !== "0101" && retCode !== "BAM020007") {
      Message.error(info || "系统错误，请稍后重试");
    }
  }
}

async function getRepeatToken(serviceName) {
  let res = await axios({
    url: `${serviceName}/notRepeat/getNotRepeatToken?key=${Date.now()}`,
    method: "GET"
  });
  return res.data;
}

async function postFn(url, data, headers, option, repeatToken) {
  let reqHeader = headers;
  if (repeatToken) {
    reqHeader = Object.assign(reqHeader, { notRepeat: repeatToken });
  }
  let res = await axios({
    url,
    method: "POST",
    headers: reqHeader,
    data,
    ...option
  });
  return res.data;
}

export async function post(url, data = {}, headers = {}, option = {}) {
  try {
    let res = {};
    if (headers.notRepeatService) {
      let { obj } = await getRepeatToken(headers.notRepeatService);
      res = await postFn(url, data, headers, option, obj);
    } else {
      res = await postFn(url, data, headers, option);
    }
    if (res.result !== undefined && !res.result) {
      showErrorMessage(res);
    }
    return res;
  } catch (error) {
    if (error.response && error.response.status == 401) {
      console.log("您当前权限不足,请联系管理员！");
    }
    return { result: false, obj: null };
  }
}

export async function get(url, params = {}, headers = {}, option = {}) {
  try {
    let res = await axios({
      url,
      method: "GET",
      headers,
      params,
      ...option
    });
    if (!res.data.result) {
      showErrorMessage(res.data);
    }
    return res.data;
  } catch (error) {
    if (error.response && error.response.status == 401) {
      console.log("您当前权限不足,请联系管理员！");
    }
    return { result: false, obj: null };
  }
}
export default axios;
