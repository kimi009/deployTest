import { Message } from "element-ui";
import { casLoginUrl } from "@common/url-conf";
import { IS_LOGIN_IN, CHANNELTYPE, ENTRYSOURCE } from "@common/constant";
export default class Utils {
  /**
   * 通过传入的children字段名，将多层级的对象打平为一个数组
   * @param {T} source
   * @param {string} children
   * @returns {T[]}
   * 例如  [{id: 1, children: [{id: 2}]}] => [{id: 1}, {id: 2}]
   */
  flatObject(source, children = "children") {
    const re = [];
    const clone = JSON.parse(JSON.stringify(source));
    this.flatObjectDo(clone, children, re);
    return re;
  }

  /**
   * 数组转树
   * @param source
   * @param parentIdVal
   * @param id
   * @param parentId
   * @returns {*}
   */
  list2Tree(
    source,
    parentIdVal = undefined,
    id = "id",
    parentId = "parentId",
    max = 3,
    currentLevel = 1
  ) {
    const target = source.filter(s => s[parentId] === parentIdVal);
    target.forEach(t => {
      if (currentLevel < max) {
        const children = this.list2Tree(
          source,
          t[id],
          id,
          parentId,
          max,
          currentLevel + 1
        );
        if (children.length) {
          t.children = children;
        }
      }
    });
    return target;
  }

  treeDataTranslate(data, id = "id", pid = "parentId") {
    var res = [];
    var temp = {};
    for (var i = 0; i < data.length; i++) {
      temp[data[i][id]] = data[i];
    }
    for (var k = 0; k < data.length; k++) {
      if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
        if (!temp[data[k][pid]]["children"]) {
          temp[data[k][pid]]["children"] = [];
        }
        if (!temp[data[k][pid]]["_level"]) {
          temp[data[k][pid]]["_level"] = 1;
        }
        data[k]["_level"] = temp[data[k][pid]]._level + 1;
        temp[data[k][pid]]["children"].push(data[k]);
      } else {
        res.push(data[k]);
      }
    }
    return res;
  }

  // 日期判断
  isDate(obj) {
    return Object.prototype.toString.call(obj) === "[object Date]";
  }

  isObj(obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
  }

  // 空对象判断
  isEmptyObject(obj) {
    return Object.keys(obj).length <= 0;
  }

  //
  delEmptyProp(obj = {}) {
    for (const key of Object.keys(obj)) {
      if (this.isObj(obj[key])) {
        this.delEmptyProp(obj[key]);
      }
      if (
        obj[key] === null ||
        obj[key] === undefined ||
        obj[key] === "" ||
        (this.isObj(obj[key]) && this.isEmptyObject(obj[key]))
      ) {
        delete obj[key];
      }
    }
    return obj;
  }

  // 对象转为数组
  objToArr(obj = {}, labelField = "label", valueField = "value") {
    const arr = [];
    for (const key of Object.keys(obj)) {
      arr.push({
        [labelField]: key,
        [valueField]: obj[key]
      });
    }
    return arr;
  }

  // 反转对象的key-value
  reverse(source) {
    const re = {};
    for (const key of Object.keys(source)) {
      re[source[key]] = key;
    }
    return re;
  }

  flatObjectDo(source, children, re, parentId) {
    source.forEach(s => {
      if (parentId) {
        s.parentId = parentId;
      }
      re.push(s);
      if (s[children]) {
        this.flatObjectDo(s[children], children, re, s.id);
        delete s[children];
      }
    });
  }

  /**
   * 分组
   * @param array
   * @param f
   * @returns [[],[]]
   */
  groupBy(array, f) {
    let groups = {};
    array.forEach(function(o) {
      let group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function(group) {
      return groups[group];
    });
  }

  deepCopy(obj) {
    // 只拷贝对象
    if (typeof obj !== "object") return obj;
    // 根据obj的类型判断是新建一个数组还是一个对象
    let newObj = obj instanceof Array ? [] : {};
    for (let key in obj) {
      // 遍历obj,并且判断是obj的属性才拷贝
      // eslint-disable-next-line
      if (obj.hasOwnProperty(key)) {
        // 判断属性值的类型，如果是对象递归调用深拷贝
        newObj[key] =
          typeof obj[key] === "object" ? this.deepCopy(obj[key]) : obj[key];
      }
    }
    return newObj;
  }

  getUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
      return (c === "x" ? (Math.random() * 16) | 0 : "r&0x3" | "0x8").toString(
        16
      );
    });
  }

  _webDownLoadFileConfirm(fileName, blob) {
    if ("download" in document.createElement("a")) {
      // 非IE下载
      const elink = document.createElement("a");
      elink.download = fileName;
      elink.style.display = "none";
      elink.href = URL.createObjectURL(blob);
      document.body.appendChild(elink);
      elink.click();
      URL.revokeObjectURL(elink.href); // 释放URL 对象
      document.body.removeChild(elink);
    } else {
      // IE10+下载
      navigator.msSaveBlob(blob, fileName);
    }
  }

  // 下载文件
  webDownLoadFile(fileName, blob) {
    if (!fileName || !blob) {
      return false;
    }
    if (!blob.type) {
      Message.error("下载失败");
      return false;
    }
    if (blob.type === "application/json") {
      let reader = new FileReader();
      reader.readAsText(blob, "utf-8");
      reader.onload = () => {
        let result = JSON.parse(reader.result);
        if (result.result) {
          this._webDownLoadFileConfirm(fileName, blob);
        } else {
          Message.error(result.info || "下载失败");
        }
      };
    } else {
      this._webDownLoadFileConfirm(fileName, blob);
    }
  }

  setCookie(c_name, value, expiredays) {
    // expiredays为天数
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays * 24 * 60 * 60 * 1000);
    document.cookie =
      c_name +
      "=" +
      escape(value) +
      (expiredays == null
        ? ""
        : ";expires=" + exdate.toGMTString() + "; path=/");
  }

  // cookie存取删
  getCookie(name) {
    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if ((arr = document.cookie.match(reg))) return arr[2];
    else return null;
  }

  getIsLogin() {
    return localStorage.getItem(IS_LOGIN_IN);
  }
  setLoginSuccess() {
    localStorage.setItem(IS_LOGIN_IN, "TRUE");
  }
  //判断是否是数字
  isNumber(val) {
    if (val === "" || val == null) {
      return false;
    }
    if (!isNaN(Number(val))) {
      return true;
    }
    return false;
  }
  resetLocalStorage() {
    localStorage.setItem(IS_LOGIN_IN, "FALSE");
    let channelType = localStorage.getItem(CHANNELTYPE);
    let entrySource = localStorage.getItem(ENTRYSOURCE);
    localStorage.removeItem(ENTRYSOURCE);
    localStorage.removeItem(CHANNELTYPE);
    return { channelType, entrySource };
  }
  setLogin() {
    let { channelType, entrySource } = this.resetLocalStorage();
    if (entrySource === "2") {
      //客户
      if (channelType === "3") {
        window.location.href = casLoginUrl + "/login/bam";
      } else {
        window.location.href = casLoginUrl + "/login/custom";
      }
    } else {
      //渠道
      if (channelType === "4") {
        window.location.href = casLoginUrl + "/login/partnerbam";
      } else {
        window.location.href = casLoginUrl + "/login/partner";
      }
    }
  }
  setLogout(targetUrl) {
    let { channelType, entrySource } = this.resetLocalStorage();
    if (targetUrl) {
      window.location.href = targetUrl;
    } else {
      if (entrySource === "2") {
        //客户
        if (channelType === "3") {
          window.location.href = casLoginUrl + "/logout/bam";
        } else {
          window.location.href = casLoginUrl + "/logout/custom";
        }
      } else {
        //渠道
        if (channelType === "4") {
          window.location.href = casLoginUrl + "/logout/partnerbam";
        } else {
          window.location.href = casLoginUrl + "/logout/partner";
        }
      }
    }
  }

  setItem(k, v) {
    localStorage.setItem(k, v);
  }
  getItem(item) {
    let val = localStorage.getItem(item);
    return val;
  }
  deleteItem(item) {
    localStorage.removeItem(item);
  }
  clearItems() {
    localStorage.clear();
  }

  getUrlParams(queryName) {
    var reg = new RegExp("(^|&)" + queryName + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return decodeURI(r[2]);
    } else {
      return null;
    }
  }
}
export const utils = new Utils();
