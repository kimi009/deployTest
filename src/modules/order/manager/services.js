import { workerOrderUrl, baseUrl } from "@common/url-conf";

import { post } from "@common/axios";

export const uploadFileUrl = `${baseUrl}${workerOrderUrl}/api/v1/file/uploadfile?systemCode=${localStorage.getItem(
  "currentMenuCode"
)}`;

export default {
  /**
   * 根据父类id查询产品列表及问题类型
   */
  newJobList: data =>
    post(
      `${workerOrderUrl}/api/v1/workOrderServiceTypeController/queryworkorderservicetypebyparent/${data}`
    ),

  /**
   * 查询紧急度列表
   */
  urgencyList: () =>
    post(
      `${workerOrderUrl}/api/v1/workOrderConfigController/queryworkorderemergency`
    ),

  /**
   * 新增工单
   */
  saveWorkorder: data =>
    post(`${workerOrderUrl}/api/v1/workorder/saveworkorder`, data, {
      notRepeatService: workerOrderUrl
    }),

  /**
   * 获取自定义模板列表
   */
  queryTemplateList: data =>
    post(`${workerOrderUrl}/api/v1/template/querytemplate?code=${data}`),

  /**
   * 存储草稿
   */
  saveWorkOrderPaper: data =>
    post(`${workerOrderUrl}/api/v1/workorder/saveworkorderpaper`, data),

  /**
   * 拿取草稿
   */
  queryWorkOrderPaper: data =>
    post(`${workerOrderUrl}/api/v1/workorder/queryworkorderpaper/${data}`),

  /**
   * 上传文件
   */
  uploadFile: data => post(`${workerOrderUrl}/api/v1/file/uploadfile`, data),
  /**
   * 文件下载
   */
  // downloadfile: data => post(`${workerOrderUrl}/api/v1/file/downloadfile`, data),
  /**
   * 文件下载
   */
  downloadfile: (p, h, o) =>
    post(
      `${workerOrderUrl}/api/v1/file/downloadfile?filename=${p.filename}&filePath=${p.filePath}`,
      {},
      {},
      o
    ),
  /**
   * 我的工单列表
   */
  getTableList: data =>
    post(`${workerOrderUrl}/api/v1/workorder/queryordercustomlist`, data),

  /**
   * 我的工单列表删除
   */
  deleteWorkerOrder: data =>
    post(`${workerOrderUrl}/api/v1/workorder/deleteworkorder/${data}`),
  /**
   * 我的工单-评价工单
   */
  appraiseWorkOrder: data =>
    post(`${workerOrderUrl}/api/v1/workorder/appraiseWorkOrder`, data),
  /**
   * 我的工单-催单
   */
  createReminder: data =>
    post(`${workerOrderUrl}/api/v1/reminder/savereminder`, data, {
      notRepeatService: workerOrderUrl
    }),
  /**
   * 我的工单-关单
   */
  closeWorkOrder: data =>
    post(`${workerOrderUrl}/api/v1/workorder/closeWorkOrder`, data),
  /**
   * 我的工单详情-撤单
   */
  cancelWorkOrder: data =>
    post(`${workerOrderUrl}/api/v1/workorder/cancelWorkOrder`, data),
  /**
   * 我的工单详情-验证不通过
   */
  verifyWorkOrderFalse: data =>
    post(`${workerOrderUrl}/api/v1/workorder/verifyWorkOrderFalse`, data),
  /**
   * 我的工单详情
   */
  queryWorkOrder: data =>
    post(`${workerOrderUrl}/api/v1/workorder/queryworkorder/${data}`),
  /**
   * 保存沟通信息
   */
  saveworkordermsg: data =>
    post(`${workerOrderUrl}/api/v1/workordermsg/saveworkordermsg`, data, {
      notRepeatService: workerOrderUrl
    }),
  /**
   * 查询沟通信息列表
   */
  queryworkordermsglist: data =>
    post(`${workerOrderUrl}/api/v1/workordermsg/queryworkordermsglist`, data),
  /**
   * 我的授权列表
   */
  getAuthorizationList: data =>
    post(
      `${workerOrderUrl}/api/v1/authorization/querycustomerauthorizationlist`,
      data,
      {
        notRepeatService: workerOrderUrl
      }
    ),
  /**
   * 待授权    -- - 授权详情
   */
  getAuthorizationInfo: data =>
    post(`${workerOrderUrl}/api/v1/authorization/queryauthorization/${data}`),
  /**
   * 同意授权
   */
  agreeAuthorization: data =>
    post(
      `${workerOrderUrl}/api/v1/authorization/editagreeauthorization`,
      data,
      {
        notRepeatService: workerOrderUrl
      }
    ),
  /**
   * 拒绝授权
   */
  rejectAuthorization: data =>
    post(
      `${workerOrderUrl}/api/v1/authorization/editrejectauthorization`,
      data,
      {
        notRepeatService: workerOrderUrl
      }
    ),
  /**
   * 根据用户编码构造企业组织树结构
   */
  userGetDeptTreeByUserCode: code =>
    get(`${userUrl}/dept/get-dept-tree-by-user-code/?userCode=${code}`),
  /**
   * 获取工单自定义分类树数据
   */

  getServerCategoryTree: () =>
    post(
      `${workerOrderUrl}/api/v1/workOrderServiceTypeController/queryworkorderservicetypetreelist`
    ),
  /**
   * 查询紧急度列表数据
   */
  queryEmergency: () =>
    post(
      `${workerOrderUrl}/api/v1/workOrderConfigController/queryworkorderemergency`
    )
};
