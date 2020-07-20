import {
  baseUrl,
  msgUrl,
  userUrl,
  customUrl,
  bpServiceUrl
} from "@/common/url-conf";
import { get, post } from "@/common/axios";
import { ENTRYSOURCE } from "@common/constant";

export const mainApi = {
  mainQueryUserInfo: () => {
    let entrySource = localStorage.getItem(ENTRYSOURCE);
    if (entrySource == 2) {
      // 来自客户
      return post(`${customUrl}/customer/information/findCustomerByHeader`);
    } else if (entrySource == 3) {
      //来自渠道
      return post(`${bpServiceUrl}/api/v1/common/queryuserinfo`);
    }
  },
  msgQueryTMsgAppManageEntityList: p =>
    post("/broker-message-manage/msg/tmsgtaskmanage/getMsgTaskList", p),
  mainGetInfo: p => post(baseUrl + "/api/user/addFormId", p),
  mainGetDict: (service, code) =>
    post(`${service || msgUrl}/dict/findByCode?dictCode=${code}`),
  // 获取重复提交token
  mainGetNotRepeatToken: (p, service) =>
    get(`${service || msgUrl}/notRepeat/getNotRepeatToken`, p),
  //获取左侧菜单
  leftMenuWorkOrder: () =>
    post(
      `${userUrl}/resource/queryCustomerSideMenuList?subSystemCode=customerWorkOder`
    )
};
