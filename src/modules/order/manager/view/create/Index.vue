<template>
  <div class="page-first page-box crate-box">
    <bread-crumb :title="breadsData.title"></bread-crumb>
    <div>
      <my-step :stepArr="stepArr" :currentStep="currentStep"></my-step>
    </div>
    <div class="page-content">
      <div class="page-content-top">
        <div
          @click="customerChoice(i)"
          class="page-content-top-list"
          v-for="(i, index) in customerList"
          :key="index"
        >
          <img :src="i.logoPath" />
          <p>{{ i.serviceTypeName }}</p>
          <span>{{ i.serviceTypeDesc }}</span>
        </div>
        <no-data v-if="customerList.length === 0"></no-data>
      </div>
      <div class="page-content-center">
        <p class="page-content-center-title">常用产品分类</p>
        <div class="center-list-box">
          <div
            @click="productChoice(i)"
            class="page-content-center-list"
            v-for="(i, index) in productList"
            :key="index"
          >
            <img :src="i.logoPath" />
            <p>{{ i.serviceTypeName }}</p>
            <span>{{ i.serviceTypeDesc }}</span>
          </div>
        </div>
        <no-data v-if="productList.length === 0"></no-data>
      </div>
      <div class="card-box1">
        <el-collapse
          style="position: relative;"
          accordion
          v-model="activeNames"
        >
          <i
            style="position: absolute;top: 17px;left: 100px;"
            @click="handleClick"
            :class="[
              activeNames.length == 0
                ? 'el-icon-arrow-down'
                : 'el-icon-arrow-up'
            ]"
          ></i>
          <el-collapse-item name="1">
            <span class="collapse-title" slot="title">全部产品分类</span>
            <div
              @click="allProChoice(i)"
              class="content-footer-list"
              v-for="(i, index) in allProList"
              :key="index"
            >
              <p>{{ i.serviceTypeName }}</p>
              <span>{{ i.serviceTypeDesc }}</span>
            </div>
            <no-data v-if="allProList.length === 0"></no-data>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import MyStep from "@components/MyStep";
import TableButton from "@components/TableButton";
import Step from "@components/Step";
import api from "@workerOrder/manager/services.js";
import NoData from "./components/NoData";
import store from "@main/vuex";
export default {
  components: {
    TableButton,
    NoData,
    MyStep
  },
  data() {
    return {
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
      currentStep: 1,
      breadsData: {
        title: "新建工单"
      },
      up: true,
      down: false,
      downTrue: true,
      newJobListData: {
        parentId: "0"
      },
      // 客户产品
      customerList: [],
      //常用
      productList: [],
      //全部
      allProList: [],
      activeNames: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      let { result, obj } = await api.newJobList(this.newJobListData.parentId);
      if (result) {
        obj.forEach(item => {
          let res = item.regionCode.split(",");
          if (res.includes("1")) {
            this.customerList.push(item);
          }
          if (res.includes("2")) {
            this.productList.push(item);
          }
          if (res.includes("3")) {
            this.allProList.push(item);
          }
        });
      } else {
      }
    },
    // 第一块类型
    customerChoice(i) {
      this.$router.push({
        name: "ProgressSecond",
        query: { serviceTypeCode: i.serviceTypeCode }
      });
    },
    // 常用类型
    productChoice(i) {
      this.$router.push({
        name: "ProgressSecond",
        query: { serviceTypeCode: i.serviceTypeCode }
      });
    },
    // 全部
    allProChoice(i) {
      this.$router.push({
        name: "ProgressSecond",
        query: { serviceTypeCode: i.serviceTypeCode }
      });
    },
    //折叠面板1
    handleClick() {
      this.activeNames = this.activeNames.length > 0 ? [] : ["1"];
    }
  }
};
</script>

<style lang="scss" scoped>
.crate-box {
  .page-content {
    min-height: calc(100vh - 185px);
    height: calc(100vh - 185px);
  }
  .page-content-top {
    width: 100%;
    border-bottom: 1px #dbdeea dashed;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 19px;
    .page-content-top-list {
      width: 254px;
      margin-right: 100px;
      cursor: pointer;
      margin-bottom: 48px;
      img {
        width: 46px;
        height: 46px;
        float: left;
        margin-right: 8px;
      }
      p {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 600;
        color: rgba(33, 42, 64, 1);
        margin-bottom: 8px;
      }
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(33, 42, 64, 1);
        line-height: 18px;
        display: grid;
        word-break: break-all;
      }
    }
  }

  .page-content-center {
    width: 100%;
    .page-content-center-title {
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 600;
      color: rgba(33, 42, 64, 1);
      margin-bottom: 20px;
    }
    .center-list-box {
      display: flex;
      flex-wrap: wrap;
      .page-content-center-list {
        width: 254px;
        margin-right: 100px;
        margin-bottom: 42px;
        cursor: pointer;
        img {
          width: 46px;
          height: 46px;
          float: left;
          margin-right: 8px;
        }
        p {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 600;
          color: rgba(33, 42, 64, 1);
          margin-bottom: 8px;
        }
        span {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(33, 42, 64, 1);
          line-height: 18px;
          display: grid;
          word-break: break-all;
        }
      }
    }
  }
  /deep/ .el-collapse-item__content {
    display: flex;
    flex-wrap: wrap;
    .content-footer-list {
      margin-right: 100px;
      cursor: pointer;
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(33, 42, 64, 1);
      line-height: 18px;
      width: 300px;
      margin-bottom: 40px;
    }
  }
  .el-collapse {
    border-top: 1px dashed #ebeef5;
    border-bottom: 0px;
  }
  .collapse-title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    color: rgba(33, 42, 64, 1);
  }
  .content-footer-list{
    span{
      word-break: break-all;
    }
  }
  >>> .el-collapse-item__header {
    border-bottom: 0px;
  }
  >>> .el-textarea__inner {
    min-height: 126px !important;
  }
  >>> .el-collapse-item__arrow {
    display: none;
  }
}

// .content-footer-list{
//         list-style: none;
//         margin-right: 100px;
//         li{
//           line-height: 23px;
//         }
//         li:first-child{
//           font-size:14px;
//           font-family:PingFangSC-Medium,PingFang SC;
//           font-weight:bold;
//           color:rgba(33,42,64,1);
//           margin-bottom: 10px;
//         }
//       }
</style>
