// import {json} from "body-parser";
import { mainApi } from "@main/services";
import { pageParams } from "@common/constant";
import { utils } from "@utils/utils";

// 表格空白页面混入，集成功能：分页/过滤/查询/重置/排序
const blankPage = {
  data() {
    return {
      // 筛选参数，此处只是预留，需要在自己的业务页面进行处理
      filterParams: {},
      // 分页参数
      pageParams: JSON.parse(JSON.stringify(pageParams)),
      // 排序参数
      sortParams: {
        sort: "",
        order: ""
      },
      // 其他业务参数，此处只是预留，需要在自己的业务页面进行处理
      otherParams: {},
      table: {
        header: [],
        data: [],
        loading: true
      }
    };
  },
  methods: {
    searchDataMixins(fn, page) {
      if (page) {
        page.pageNum = 1;
      } else {
        this.pageParams.pageNum = 1;
      }
      fn();
    },
    // 重置参数
    resetParams() {
      this.initPageParams();
      this.getTableListData();
    },
    // 获取请求参数
    groupParams(
      dataArr = ["filterParams", "pageParams", "sortParams", "otherParams"]
    ) {
      let params = {};
      dataArr.forEach(key => {
        if (this[key].pageSizes) {
          // 分页参数
          Object.assign(params, {
            pageConfig: {
              pageSize: this[key].pageSize,
              pageNum: this[key].pageNum
            }
          });
        } else {
          Object.assign(params, this[key]);
        }
      });
      // 前后端一致性沟通后，后端确保null和空字符串相同
      // for (let key in params) {
      //   params[key] = params[key] === "" ? null : params[key];
      // }
      return params;
    },
    // 初始化页面
    initPageData() {
      this.initPageParams();
    },
    // 初始化页面参数
    initPageParams(dataArr = ["filterParams", "pageParams", "sortParams"]) {
      dataArr.forEach(dataKey => {
        if (dataKey === "pageParams") {
          this["pageParams"].pageNum = 1;
        } else {
          Object.keys(this[dataKey]).forEach(key => {
            this[dataKey][key] = "";
          });
        }
      });
    },
    // 每页条数改变事件
    handleSizeChange(
      size,
      pageConstant = "pageParams",
      getFn = "getTableListData"
    ) {
      this[pageConstant].pageNum = 1;
      this[pageConstant].pageSize = size;
      // 获取数据
      this[getFn]();
    },
    // 当前页改变事件
    handleCurrentPageChange(
      page,
      pageConstant = "pageParams",
      getFn = "getTableListData"
    ) {
      this[pageConstant].pageNum = page;
      // 获取数据
      this[getFn]();
    },
    // 排序改变事件
    sortChange({ column, prop, order }) {
      // order=descending 降序 DESC
      // order=ascending 升序 DESC
      if (order) {
        this.sortParams.sort = prop;
        this.sortParams.order = order === "descending" ? "DESC" : "ASC";
      } else {
        this.sortParams.sort = "";
        this.sortParams.order = "";
      }
      this.getTableListData();
    },
    // 获取列表数据，此处只是预留，需要在自己的业务页面进行处理
    getTableListData() {
      console.log("请求参数:", this.groupParams());
      console.log("请在业务页面自行编写业务逻辑");
    }
  }
};
// 货币转千位
const unitFormatMix = {
  methods: {
    unitFormat(num = 0, precision = 2, separator = ",") {
      return utils.formatNumber(num, precision, separator);
    }
  }
};
// 中间显示星号
const secretStarMix = {
  methods: {
    secretShowStar(showText = "", keepPrev = 0, keepAfter = 0) {
      return utils.secretShowStar(showText, keepPrev, keepAfter);
    }
  }
};
// 保存时后端的重复校验token获取
const notRepeat = {
  data() {
    return {
      notRepeatFlag: ""
    };
  },
  mounted() {},
  methods: {
    getNotRepeatToken(service) {
      return new Promise((resolve, reject) => {
        mainApi
          .mainGetNotRepeatToken(
            {
              key: Date.now()
            },
            service
          )
          .then(res => {
            if (res && res.result) {
              this.notRepeatFlag = res.obj;
              resolve(true);
            } else {
              resolve(false);
            }
          })
          .catch(err => {
            resolve(false);
          });
      });
    }
  }
};
// 页面loading遮罩方法
const pageLoading = {
  data() {
    return {
      fullLoading: null
    };
  },
  methods: {
    showFullLoading(loadingText = "Loading") {
      if (this.fullLoading) {
        return;
      }
      this.fullLoading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    },
    closeFullLoading() {
      if (this.fullLoading) {
        this.fullLoading.close();
        this.fullLoading = null;
      }
    }
  }
};
// 数据字典请求和解析并返回
const dictData = {
  methods: {
    queryDictListByCode(service, code) {
      return new Promise((resolve, reject) => {
        mainApi
          .mainGetDict(service, code)
          .then(res => {
            if (res && res.result) {
              let tmpObj = res.obj || [];
              let tempList = [];
              let tempMap = {};
              tmpObj.forEach((o, index) => {
                tempList.push({
                  label: o.dictLable,
                  value: o.dictValue
                });
                tempMap[o.dictValue] = o.dictLable;
              });
              resolve({
                list: tempList,
                map: tempMap
              });
            } else {
              resolve(null);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    queryDictTreeByCode(service, code) {
      return new Promise((resolve, reject) => {
        mainApi
          .mainGetDictTree(service, code)
          .then(res => {
            if (res && res.result) {
              let tempTree = res.obj || [];
              resolve({
                tree: tempTree
              });
            } else {
              resolve(null);
            }
          })
          .catch(err => {
            reject(err);
          });
      });
    }
  }
};

export {
  blankPage,
  unitFormatMix,
  secretStarMix,
  notRepeat,
  pageLoading,
  dictData
};
