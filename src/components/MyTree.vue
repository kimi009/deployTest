<template>
  <div class="organization-tree-comp" :style="oStyle">
    <el-input v-if="showSearch" class="search" placeholder="请输入组织名称" v-model="searchKey"></el-input>
    <el-tree
      v-if="treeData.length"
      :node-key="treeDescription.uniqueId"
      :props="treeDescription"
      :data="treeData"
      :indent="indent"
      :load="loadTreeData"
      :lazy="isLazy"
      :show-checkbox="showCheckbox"
      :expand-on-click-node="clickExpand"
      :default-expanded-keys="defaultExpandedKeys"
      :current-node-key="currentNodeKey"
      highlight-current
      check-on-click-node
      :filter-node-method="filterNodeByKey"
      @node-click="nodeClick"
      @current-change="currentChange"
      ref="myCustomTree"
      class="org-tree-content"
    >
      <span class="custom-tree-node" :style="customTreeStyle(node)" slot-scope="{ node, data }">
        <span v-if="searchKey" v-html="formatSearchValue(node.label)"></span>
        <span v-else class="node-name" :style="nodeNameStyle(node)">{{node.label }}</span>
        <el-button
          v-if="showAddBtn && data.parentCount < maxLevel"
          class="add"
          type="text"
          size="mini"
          @click.stop="addOrg(data, node)"
        >
          <i class="iconfont icon-add"></i>
        </el-button>
      </span>
    </el-tree>
  </div>
</template>

<script>
/**
 * 层与层之间的缩进
 */
const LEVELINDENT = 12;
export default {
  name: "MyCustomTree",
  props: {
    treeDescription: {
      type: Object,
      required: true
    },
    filterKey: {
      type: String
    },
    /**
     * 是否懒加载子节点
     */
    isLazy: {
      type: Boolean,
      default: () => false
    },
    treeData: {
      type: Array
    },
    /**
     * 是否显示checkbox
     */
    showCheckbox: {
      type: Boolean,
      default: () => false
    },
    clickExpand: {
      type: Boolean,
      default: () => true
    },
    /**
     * 是否显示搜索框
     */
    showSearch: {
      type: Boolean,
      default: () => false
    },
    /**
     * 是否显示添加按钮
     */
    showAddBtn: {
      type: Boolean,
      default: () => false
    },
    /**
     * 加载子节点下面的数据
     */
    loadChildData: {
      type: Function
    },
    /**
     * 该值大于0会覆盖最大层级设置
     */
    residueLevelCount: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      /**
       * 最大层级
       */
      maxLevel: 5,
      //搜索关键字
      searchKey: "",
      indent: LEVELINDENT,
      oStyle: {},
      data: [],
      treeStyle: {},
      parentData: [],
      currentNodeKey: ""
    };
  },
  created() {
    if (this.residueLevelCount) {
      this.maxLevel = this.residueLevelCount;
    }
    // console.log("当前树最大层级", this.maxLevel);
    this.data = this.treeData || [];
  },
  watch: {
    treeData(newVal, oldVal) {
      console.log("treeData changed", newVal, oldVal);
      if (newVal.length && !oldVal.length) {
        //这里获取到组织树后发射树根给响应的页面
        // 第一次加载完树数据后，通知跟树相关页面刷新
        this.$emit("tree-load-complete", this.treeData[0]);
      }
    },
    searchKey(val) {
      this.canFilter = true;
      this.$refs.myCustomTree.filter(val);
    }
  },
  computed: {
    defaultExpandedKeys() {
      if (this.treeData.length) {
        let rootNodeData = this.treeData[0];
        // this.$nextTick(() => {
        //   console.log("setRootNode");
        //   this.setCurrentNode(this.getNodeByData(rootNodeData));
        // });
        let defaultExpandKey = rootNodeData[this.treeDescription.uniqueId];
        this.currentNodeKey = defaultExpandKey;
        return [defaultExpandKey];
      }
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   let ppHeight = this.$parent.$el.offsetHeight;
    //   let pHeight = this.$el.parentNode.offsetHeight;
    //   let oTreeHeight = pHeight - (ppHeight - pHeight) / 2;
    //   this.oStyle = {
    //     height: `${pHeight}px`
    //   };
    //   const top = this.showSearch ? 10 : 0;
    //   this.treeStyle = {
    //     marginTop: `${top}px`,
    //     height: `calc(100% - ${28 + top}px)`
    //   };
    // });
  },
  methods: {
    canCreate(node, data) {
      console.log(170);
      if (this.showAddBtn) {
        console.log(node.level, data.name, data.parentCount);
        return data.parentCount < 5;
      }
      return false;
      // return this.showAddBtn && ((node.level+1) < data.parentCount)
    },
    formatSearchValue(curNodeLabel) {
      let replaceReg = new RegExp(this.searchKey, "g");
      let replaceString =
        '<strong style="color:#000000;">' + this.searchKey + "</strong>";
      // 开始替换
      curNodeLabel = curNodeLabel.replace(replaceReg, replaceString);
      return `${curNodeLabel}`;
    },
    customTreeStyle(node) {
      return {
        // width: `calc(100% - ${18 * (node.level - 1) + 10}px)`
        //24是图标大小
        width: `${286 - this.indent * (node.level - 1) - 24}px`
      };
    },
    nodeNameStyle(node) {
      return {
        width: `calc(100% - 34px)`
      };
    },
    /**
     * 获取节点数据根据数据
     */
    getNodeByData(nodeData) {
      return this.$refs.myCustomTree.getNode(nodeData);
    },
    /**
     * 设置选中节点
     */
    setCurrentNode(data) {
      let node = this.getNodeByData(data);
      this.$refs.myCustomTree.setCurrentNode(node);
    },
    /**
     * 点击展开节点
     */
    nodeExpand(data, node) {
      if (node.level > this.maxLevel) {
        return;
      }
      // let node = this.$refs.myCustomTree.getNode(a);
      this.setCurrentNode(data);
    },
    /**
     * 点击收起节点
     */
    nodeCollapse(data, node) {
      this.setCurrentNode(data);
    },
    /**
     * 点击节点加载数据
     */
    async loadTreeData(node, resolve) {
      // 懒加载需要根节点
      if (this.isLazy) {
        if (!this.treeData.length) {
          return resolve([]);
        }
      }
      console.log("loadTreeData", node);
      // 首次加载也会进入，展示树的第一层
      if (node.level === 0) {
        this.parentData = this.treeData;
        //获取树的第一级结构
        return resolve(this.treeData);
      }
      if (node.level > this.maxLevel) return resolve([]);
      const {
        data: { code }
      } = node;
      //如果是懒加载点击节点会进入此方法
      if (!this.loadChildData) {
        throw new Error("懒加载子节点数据必须提供loadChildData方法实现");
        return resolve([]);
      }
      let isExecCallback = false;
      await this.loadChildData(code, childData => {
        isExecCallback = true;
        resolve(childData || []);
      });
      if (!isExecCallback) {
        throw new Error("调用loadChildData方法后需要执行回调");
      }
    },
    /**
     * 根据组织名称过滤
     */
    filterNodeByKey(value, data, node) {
      if (!value) return true;
      if (!this.filterKey) {
        throw new Error("请设置搜索关键字对应的key");
      }
      return data[this.filterKey].indexOf(value) !== -1;
    },
    /**
     * 添加节点事件
     */
    addOrg(data, node) {
      if (node.parentCount > this.maxLevel) {
        return;
      }
      this.$emit("add-child", data);
    },
    /**
     * 添加节点
     */
    insertChildNode(parentData, childData) {
      if (!parentData.children) {
        this.$set(parentData, "children", []);
      }
      let orderNum = childData.orderNum;
      let sameLevalChildren = parentData.children.filter(
        item => item.orderNum === orderNum
      );
      if (sameLevalChildren.length) {
        //找到同级节点最后一个节点插入后面
        //找到同级节点最后一个
        let lastOne = sameLevalChildren.slice(-1)[0];
        this.$refs.myCustomTree.insertAfter(childData, lastOne);
      } else {
        this.$refs.myCustomTree.append(childData, parentData);
      }
      let node = this.$refs.myCustomTree.getNode(parentData);
      node.loaded = false;
      node.expand();
    },
    /**
     * 更新节点数据
     */
    updateChildNode(parentData, childData) {
      //TODO: 更新节点数据
      console.log(parentData, childData);
      //删除旧的树旧节点
      this.removeChildNode(parentData, childData);
      //对新节点再做排序插入
      this.insertChildNode(parentData, childData);
    },
    /**
     * 删除节点
     */
    removeChildNode(parentData, childData) {
      this.$refs.myCustomTree.remove(childData);
    },
    /**
     * 获取选择的部门列表
     */
    getCheckedNodes() {
      return this.$refs.myCustomTree.getCheckedNodes();
    },
    /**
     * 节点被点击
     */
    nodeClick(data, node) {
      this.$emit("nodeClick", data, node);
    },
    // 切换选中的节点
    currentChange(data, node) {
      this.$emit("currentChange", data, node);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
/*文本格式化，超出范围，显示省略号*/
@mixin text-overflow($width: 100%) {
  width: $width;
}
.organization-tree-comp {
  width: 286px;
  padding-top: 20px;
  .search {
    padding: 0 20px;
    margin-bottom: 5px;
  }
  .org-tree-content {
    width: 286px;
  }
  /deep/ .el-tree-node {
    width: 286px;
  }
  /deep/ .el-tree-node__expand-icon {
    margin-left: 12px;
  }
  //这个展开图标不能修改
  /deep/ .el-tree-node__expand-icon {
    color: $menu-icon-arrow;
  }
  /deep/ .el-tree-node__expand-icon.is-leaf {
    color: transparent;
    cursor: default;
  }
  /deep/
    .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background-color: $active-bg-color;
    border-left: 2px solid $border-left-selected;
  }
  // /deep/ .el-tree-node__content > .el-tree-node__expand-icon {
  //   padding: 0px;
  //   margin-right: 6px;
  // }
  /deep/ .el-tree-node__content {
    height: 30px;
    line-height: 30px;
    width: 100%;
  }
  .custom-tree-node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    .node-name {
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .add {
      flex: 1 0 auto;
      display: none;
      height: 30px;
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
    }
    &:hover {
      .node-name {
        @include text-overflow(calc(100% - 30px));
      }
      .add {
        display: block;
      }
    }
  }
}
</style>
