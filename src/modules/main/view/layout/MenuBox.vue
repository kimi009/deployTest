<template>
  <div class="menuBox">
    <div class="boxLayout">
      <div class="menu_left">
        <div>
          <div class="menuTitle">
            <span class="menuText">菜单</span>
          </div>
          <div class="menuList">
            <div class="menu-item" v-for="(item,index) in menuList" :key="index">
              <span :title="item.name">
                <i class="iconfont iconClass icon-menu-appid"></i>
                <span class="menu-text">{{item.name}}</span>
              </span>
              <i class="iconfont icon-menu-delete" title="取消" @click="cancleSelect(item,index)"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="menu_right">
        <div class="rightHeader">
          <el-input placeholder="请输入搜索关键词" v-model="searchModel" style="width:300px;">
            <i class="el-icon-search el-input__icon" slot="suffix"></i>
          </el-input>
          <div class="closeParent">
            <span class="close" @click="closeBox"></span>
          </div>
        </div>
        <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
          <el-menu-item
            v-for="(item,index) in menuFirstList "
            :index="''+index"
            :key="index"
          >{{item}}</el-menu-item>
        </el-menu>
        <div class="waterfall-container" ref="menuRef">
          <div class="waterfall-item" v-for="(item,index) in tempLevelMenu" :key="index">
            <div class="secContent">{{item.name}}</div>
            <div
              class="thirdContent"
              v-for="(content,i) in item.children"
              :key="i"
              @mouseover="changeActive($event)"
              @mouseout="removeActive($event)"
            >
              <span class="thirdText">{{content.name}}</span>
              <i
                :ref="content.id"
                :class="content.check?'iconfont icon-menu-selected-copy':'iconfont'"
                @click="changeMenuState($event,content)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "menubox",
  data() {
    return {
      menuList: [
        { name: "第一个菜单" },
        { name: "第一个菜单" },
        { name: "第一个菜单" },
        { name: "第一个菜单" }
      ],
      tempLevelMenu: [],
      levelMenu: [
        {
          name: "二级目录",
          children: [
            {
              id: "1",
              name: "三级目录",
              check: true
            },
            {
              id: "2",
              name: "三级aa目录",
              check: false
            },
            {
              id: "3",
              name: "三dd级目录",
              check: false
            },
            {
              id: "4",
              name: "三级vv目录",
              check: false
            }
          ]
        },
        {
          name: "二级目录",
          children: [
            {
              id: "5",
              name: "三级目bb录",
              check: false
            }
          ]
        },
        {
          name: "二级目录",
          children: [
            {
              id: "6",
              name: "三级目录",
              check: false
            }
          ]
        },
        {
          name: "二级目录",
          children: [
            {
              id: "7",
              name: "三级目hh录",
              check: false
            }
          ]
        },
        {
          name: "二级目录",
          children: [
            {
              id: "8",
              name: "三级目录",
              check: false
            }
          ]
        },
        {
          name: "二级目录",
          children: [
            {
              id: "9",
              name: "三级目录",
              check: false
            }
          ]
        },
        {
          name: "二级目录",
          children: [
            {
              id: "10",
              name: "三级目录",
              check: false
            }
          ]
        },
        {
          name: "二级目录",
          children: [
            {
              id: "11",
              name: "三级目录",
              check: false
            }
          ]
        },
        {
          name: "二级目录",
          children: [
            {
              id: "12",
              name: "三级目录",
              check: false
            }
          ]
        },

        {
          name: "二级目录",
          children: [
            {
              id: "13",
              name: "三级目录",
              check: false
            },
            {
              id: "14",
              name: "三级目录",
              check: false
            },
            {
              id: "15",
              name: "三级目录",
              check: true
            },
            {
              id: "16",
              name: "三级目录",
              check: false
            }
          ]
        }
      ],
      activeIndex: "0",
      menuFirstList: [], //["客户","订单","运营","产品","账务","营销","伙伴","系统"],
      searchModel: ""
    };
  },
  watch: {
    //监听搜索输入框并进行数据过滤
    searchModel(obj) {
      if (obj) {
        this.tempLevelMenu = [];
        for (let i = 0; i < this.levelMenu.length; i++) {
          let objT = {};
          objT.name = this.levelMenu[i].name;
          objT.id = this.levelMenu[i].id;
          objT.children = [];
          for (let j = 0; j < this.levelMenu[i].children.length; j++) {
            if (
              this.levelMenu[i].children[j].name
                .toLowerCase()
                .includes(this.searchModel.toLowerCase())
            ) {
              objT.children.push(this.levelMenu[i].children[j]);
            }
          }
          if (objT.children.length > 0) {
            this.tempLevelMenu.push(objT);
          }
        }
      } else {
        this.tempLevelMenu = [];
        for (let i = 0; i < this.levelMenu.length; i++) {
          this.tempLevelMenu.push(this.levelMenu[i]);
        }
        return;
      }
    }
  },
  mounted() {
    this.initGetData();
  },
  methods: {
    //取消选中的菜单
    cancleSelect(param, index) {
      //移除左边菜单
      this.menuList.splice(index, 1);
      //取消右边选中样式
      this.$refs[param.id][0].className = "iconfont";
    },
    //初始化获取菜单信息
    initGetData() {
      //this.levelMenu =
      for (let i = 0; i < this.levelMenu.length; i++) {
        this.tempLevelMenu.push(this.levelMenu[i]);
      }
    },
    //关闭弹框
    closeBox(event) {
      this.$parent.showMenu();
    },
    //一级菜单选中事件
    handleSelect() {},
    //鼠标移入事件加入相应的图标
    changeActive(event) {
      let getClass = event.currentTarget.lastChild.className;
      if (getClass.indexOf("icon-menu-selected-copy") == -1) {
        event.currentTarget.lastChild.className = "iconfont icon-shuqian";
      }
    },
    //鼠标移除事件
    removeActive(event) {
      let getClass = event.currentTarget.lastChild.className;
      if (getClass.indexOf("icon-shuqian") > -1) {
        event.currentTarget.lastChild.className = "iconfont";
      }
    },
    //选中右边菜单更改样式，并在左边加入相应的菜单
    changeMenuState(event, data) {
      let getClass = event.currentTarget.className;
      if (getClass.indexOf("icon-shuqian") > -1) {
        event.currentTarget.className = "iconfont icon-menu-selected-copy";
        //获取此项并加入左边菜单
        this.menuList.push(data);
      }
    }
  }
};
</script>

<style scoped lang="scss">
.menuBox {
  position: absolute;
  width: 100%;
  z-index: 111;
  background: rgba(0, 0, 0, 0.4);
  height: calc(100% - 50px);
  top: 50px;
  .boxLayout {
    position: releative;
    display: flex;
    background: #fff;
    width: 1200px;
    height: 100%;
    .menu_left {
      width: 300px;
      height: 100%;
      border-right: solid 1px #dbdeea;
      .menuTitle {
        color: #1e2b4d;
        font-size: 14px;
        font-weight: bold;
        padding: 20px;
        .menuText {
          display: block;
          height: 100%;
          border-bottom: solid 1px #e6eaf5;
          padding-bottom: 20px;
        }
      }
      .menuList {
        .menu-item {
          height: 40px;
          line-height: 40px;
          padding-left: 20px;
          position: relative;
          .menu-text {
            display: inline-block;
            font-size: 12px;
          }
          &:hover {
            background: #ecf3ff;
            border-left: 3px solid #3369ff;
            padding-left: 17px;
            cursor: pointer;

            .icon-menu-delete {
              display: inline-block;
            }
            .menu-text {
              color: #3369ff;
            }
          }
          .iconClass {
            padding-right: 10px;
            &:hover {
              display: inline-block;
            }
          }
          .icon-menu-delete {
            display: none;
            position: absolute;
            right: 20px;
          }
        }
      }
    }
    .menu_right {
      width: 100%;
      overflow: auto;
      padding: 20px;
      .el-menu .el-menu-item.is-active {
        background: white;
        border-left: 0px;
        color: #1e2b4d;
      }
      .el-menu .el-menu-item {
        border-left: 0px;
        border-right: 0px;
        color: #a3a9b7;
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: bold;
      }
      .rightHeader {
        padding-bottom: 20px;
        display: flex;
        justify-content: space-between;
        .closeParent {
          display: flex;
          justify-content: space-between;
          .close::before {
            content: "\2716";
          }
          .close {
            cursor: pointer;
          }
        }
      }
      .waterfall-container {
        /*分几列*/
        column-count: 4;
        width: 100%;
        /* 列间距 */
        column-gap: 30px;
        overflow: auto;
      }
      .waterfall-item {
        break-inside: avoid;
        width: 100%;
        margin-bottom: 10px;
        column-gap: 0;
        padding-top: 20px;
        .secContent {
          font-size: 14px;
          color: #1e2b4d;
          line-height: 50px;
          font-weight: bold;
        }
        .thirdContent {
          color: #1e2b4d;
          font-size: 12px;
          font-weight: 400;
          line-height: 40px;
          position: relative;
          .iconfont {
            right: 24px;
            position: absolute;
            color: #3369ff;
          }
          &:hover {
            cursor: pointer;
            .thirdText {
              color: #3369ff;
            }
          }
          .thirdText {
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>