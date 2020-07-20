<template>
  <div :class="isFold ? 'side-bar' : 'side-bar fold'">
    <div class="side-bar-fold">
      <span v-if="isFold">{{title}}</span>
      <i
        :class="isFold ? 'iconfont icon-menu-close fold-line':'iconfont icon-menu-open fold-line'"
        @click="clickFold"
      ></i>
    </div>
    <div class="menu-line"></div>
    <el-menu
      :default-active="defaultActive"
      :collapse="!isFold"
      :unique-opened="true"
      class="side-menu"
    >
      <el-submenu v-for="menu in leftMenuData" :index="menu.routeIndex" :key="menu.routeIndex">
        <template slot="title">
          <i :class="'iconfont '+menu.icon"></i>
          <span slot="title">{{ menu.name }}</span>
        </template>
        <el-menu-item
          v-for="child in menu.children"
          :index="child.routeIndex"
          :key="child.routeIndex"
          @click="jumpRouter(child)"
        >
          <i class="item-icon"></i>
          <span>{{ child.name }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mainApi } from "@main/services.js";
export default {
  data() {
    return {
      defaultActive: "",
      isFold: true,
      title: "",
      leftMenuData: [],
      menuTempArr: []
    };
  },
  computed: {},
  created() {
    this.getMenuData();
  },
  watch: {
    $route: {
      handler: function(newVal, oldVal) {
        let activeMenu = this.menuTempArr.find(
          item => item.fullPath === newVal.fullPath
        );
        if (activeMenu) {
          this.defaultActive = activeMenu.routeIndex;
          localStorage.setItem("currentMenuCode", activeMenu.code);
        } else {
          //可能是静态路由里面的一个
          activeMenu = this.menuTempArr.find(item =>
            newVal.fullPath.includes(item.fullPath)
          );
          if (activeMenu) {
            this.defaultActive = activeMenu.routeIndex;
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    clickFold() {
      if (this.isFold) {
        this.isFold = false;
      } else {
        this.isFold = true;
      }
      this.$emit("fold", this.isFold);
    },
    jumpRouter(child) {
      this.$router.push(child.fullPath);
      localStorage.setItem("currentMenuCode", child.code);
    },
    async getMenuData() {
      let response = await mainApi.leftMenuWorkOrder();
      const { obj } = response;
      if (!obj || !obj[0] || !obj[0].children) {
        console.log("菜单数据返回空");
        return;
      }
      this.title = obj[0].name;
      let menuData = [...obj[0].children];
      this.formatMenuList(menuData);
      this.leftMenuData = menuData;
      if (!this.defaultActive) {
        if (
          this.leftMenuData &&
          this.leftMenuData.length &&
          this.leftMenuData.children &&
          this.leftMenuData.children.length
        ) {
          this.$router.replace(this.leftMenuData[0].children[0].fullPath);
        }
      }
    },
    formatMenuList(childrenData, parentRouteIndex, parentPath) {
      childrenData.forEach((item, index) => {
        item.routeIndex = parentRouteIndex
          ? `${parentRouteIndex}-${index}`
          : `${index}`;
        item.fullPath = parentPath
          ? `${parentPath}/${item.path}`
          : `/${item.path}`;
        if (!item.children) {
          this.menuTempArr.push(item);
        }
        if (this.$route.fullPath.includes(item.fullPath)) {
          this.defaultActive = item.routeIndex;
        }
        if (item.children && item.children.length) {
          this.formatMenuList(item.children, item.routeIndex, item.fullPath);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.side-bar {
  width: 220px;
  box-shadow: 1px 0px 4px 0px rgba(33, 76, 217, 0.17);
  background: #ffffff;
  vertical-align: top;
  color: #1e2b4d;
  float: left;
  padding-bottom: 9999vh;
  margin-bottom: -9999vh;
  .side-bar-fold {
    height: 60px;
    margin: 0 24px;
    line-height: 60px;
    font-weight: bold;
    .fold-line {
      font-weight: normal;
      vertical-align: bottom;
      cursor: pointer;
      float: right;
    }
  }
  .menu-line {
    height: 1px;
    background: #e6eaf5;
    margin: 0 24px;
    margin-bottom: 10px;
  }
  .side-menu {
    margin-bottom: 10px;
    .iconfont {
      margin-right: 16px;
    }
  }
}

.side-bar.fold {
  width: 48px;
  transition: all 0.1s ease, 0.1s ease;
  .fold-line {
    position: absolute;
    left: 17px;
  }
  .menu-line {
    margin: 0 8px;
    margin-bottom: 10px;
  }
  .side-menu {
    .iconfont {
      margin-left: -8px;
      transition: all 0.1s ease, 0.1s ease;
    }
  }
}
</style>
<style lang="scss">
/*el-cover*/
.side-bar,
.side-bar.fold {
  .el-menu--collapse {
    width: 48px;
  }
}

.side-bar.fold {
  .el-submenu.is-active .el-submenu__title {
    background-color: #ecf3ff;
  }
}
</style>