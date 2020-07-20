import Vue from "vue";
import { extend, ValidationProvider, localize } from "vee-validate";
import { required } from "vee-validate/dist/rules";
import * as rules from "vee-validate/dist/rules";
import en from "vee-validate/dist/locale/en.json";

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});
localize("en", en);

// 邮箱
extend("email", value => {
  let reg = /^[A-Za-z0-9]+([-_\.][A-Za-z0-9]+)*@([A-Za-z0-9\-]+\.)+[A-Za-z]{2,6}$/;
  if (reg.test(value)) {
    return true;
  }
  return "请输入正确的{_field_}";
});

//输入框不为空
extend("required", {
  ...required,
  message: "请输入{_field_}"
});

//下拉框不为空
extend("selected", {
  ...required,
  message: "请选择{_field_}"
});

//数字和字母
extend("alpha_num", {
  ...required,
  message: "只能输入数字和字母"
});

//最大
extend("max", {
  validate(value, args) {
    return value.length <= args.length;
  },
  params: ["length"],
  message: "最多输入 {length} 个字符"
});
// 字段最大字符，提示里面还有字段label，maxHasLabel:20
extend("maxHasLabel", {
  validate(value, args) {
    return value.length <= args.length;
  },
  params: ["length"],
  message: "{_field_}不能超过{length}个字符"
});

// 区间范围 只能输入区间的字母或数字
extend("section", {
  validate(value, args) {
    let temp = args.section.split("-");
    if (value.length >= temp[0] && value.length <= temp[1]) {
      return /^[0-9a-zA-Z]*$/g.test(value);
    }
    return false;
  },
  params: ["section"],
  message: "请输入{section}位数字或字母"
});

//3.自定义
extend("num", value => {
  let re = /^[0-9]+$/;
  if (re.test(value)) {
    return true;
  }
  return "只能输入数字";
});
//大于1的正整数
extend("nums", value => {
  let re = /^\+?[1-9]\d*$/;
  if (re.test(value)) {
    return true;
  }
  return "只能输入大于0的正整数";
});
//手机号
extend("mobile", value => {
  let re = /^1[3456789]\d{9}$/;
  if (re.test(value)) {
    return true;
  }
  return "请输入正确的手机号码";
});

//菜单编码,MENU+6位数字
extend("menuCode", value => {
  let re = /^MENU\d{6}$/;
  if (re.test(value)) {
    return true;
  }
  return "{_field_}格式错误";
});

//菜单顺序，仅1-8位正整数
extend("menuOrder", value => {
  let re = /^[1-9]\d{0,7}$/;
  if (re.test(value)) {
    return true;
  }
  return "{_field_}格式错误";
});

//连接地址:http://* | https://*
extend("httpUrl", value => {
  let re = /^(http|https):\/\/([\w.]+\/?)\S/;
  if (re.test(value)) {
    return true;
  }
  return "{_field_}格式错误";
});

//由中文字符、英文字母、数字、中划线、下划线/.
extend("mixedInput", value => {
  let re = /^[\u4e00-\u9fa5_a-zA-Z0-9-_.]+$/;
  if (re.test(value)) {
    return true;
  }
  return "请输入正确的{_field_}(由中文字符、英文字母、数字、中划线、下划线和点组成)";
});
Vue.component("ValidationProvider", ValidationProvider);
