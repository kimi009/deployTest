<template>
  <div class="page-first page-box Second-box">
    <bread-crumb :title="breadsData.title"></bread-crumb>
    <div>
      <my-step :stepArr="stepArr" :currentStep="currentStep"></my-step>
    </div>
    <div class="page-content">
      <select-block
        @passCode="receiveCode"
        :typeData="typeData"
        :content="content"
        :iconClass="iconClass"
      ></select-block>
    </div>
  </div>
</template>

<script>
import MyStep from "@components/MyStep";
import api from "@workerOrder/manager/services.js";
import SelectBlock from "./components/SelectBlock";
export default {
  components: {
    MyStep,
    SelectBlock
  },
  data() {
    return {
      //面包屑
      breadsData: {
        title: "新建工单"
      },
      //进度条
      stepArr: [
        {
          text: "请选择问题所属产品",
          path: "/order/manager/create"
        },
        {
          text: "请选择问题类型",
          path: "/order/manager/create/ProgressSecond"
        },
        { text: "创建工单", path: "/order/manager/create/ProgressThird" }
      ],
      currentStep: 2,
      //选择问题类型
      typeData: [],
      content: "已选择",
      iconClass: "icon-step-done",
      problemData: {
        parentId: "",
        templateCode: ""
      },
      // 问题分类
      proType: ""
    };
  },
  created() {
    // debugger;
    // let serviceTypeCode = this.$route.query.serviceTypeCode
    if(this.$route.query.serviceTypeCode!==undefined){
      sessionStorage.setItem("serviceTypeCode",this.$route.query.serviceTypeCode)
    }
    this.proType = sessionStorage.getItem("serviceTypeCode")
    this.initData();
  },
  methods: {
    //问题类型列表
    async initData() {
      let { result, obj } = await api.newJobList(this.proType);
      if (result) {
        this.typeData = obj;
      }
    },
    //跳转下级
    routerNext() {
      // let { result } = await api.newJobList(this.problemData.parentId);
      // if (result == true) {
        
      // }
      this.$router.push({
          path: "/order/manager/create/ProgressThird",
          query: {
            progressType: this.problemData.parentId,
            proType: this.proType,
            templateCode: this.problemData.templateCode
          }
        });
    },
    receiveCode(data) {
      this.problemData.parentId = data.serviceTypeCode;
      this.problemData.templateCode = data.templateCode;
      this.routerNext();
    }
  }
};
</script>

<style lang="scss" scoped>
.Second-box {
  .page-content {
    min-height: calc(100vh - 185px);
    height: calc(100vh - 185px);
  }
}
</style>
