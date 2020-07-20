<template>
  <div class="page-box template-box authorize-content-box">
    <bread-crumb :breads="breadsData.breads" :title="breadsData.title"></bread-crumb>
    <div class="page-content">
      <div class="page-filter">
        <div class="filter-item-box">
          <div class="filter-item largeWidth">
            <el-date-picker
              v-model="filterParams.dateValue"
              @change="timeChange"
              type="datetimerange"
              range-separator="~"
              format="yyyy/MM/dd HH:mm:ss"
              value-format="yyyy/MM/dd HH:mm:ss"
              start-placeholder="请选择开始时间"
              end-placeholder="请选择结束时间"
              :default-time="['00:00:00', '12:00:00']"
              :picker-options="pickerOptions0"
            ></el-date-picker>
          </div>
          <div class="filter-item">
            <el-select
              v-model="filterParams.authorizeStatus"
              slot="prepend"
              @change="searchKeyChangeEvent"
              clearable
              placeholder="请输入授权状态"
            >
              <el-option
                v-for="(authorizeStatus,index) of filterSelect.authorizeStatusArr"
                :key="index"
                :label="authorizeStatus.label"
                :value="authorizeStatus.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-item">
            <el-select
              v-model="filterParams.authorizeType"
              slot="prepend"
              @change="searchKeyChangeEvent"
              clearable
              placeholder="请输入授权类型"
            >
              <el-option
                v-for="(authorizeType,index) of filterSelect.authorizeTypeArr"
                :key="index"
                :label="authorizeType.label"
                :value="authorizeType.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-item searchWidth">
            <el-input
              clearable
              placeholder="请输入工单编号"
              v-model="filterParams.workOrderCode"
              suffix
              class="input-with-select"
            ></el-input>
          </div>
          <div class="filter-item searchWidth">
            <el-input
              clearable
              placeholder="请输入申请说明"
              v-model="filterParams.authorizeDesc"
              suffix
              class="input-with-select"
            ></el-input>
          </div>
          <div class="filter-item filter-search">
            <el-button @click="searchDataMixins(getTableListData)">查询</el-button>
            <el-button @click="resetParams">重置</el-button>
          </div>
        </div>
      </div>
      <div class="page-table" v-if="tableReloadingFlag">
        <my-table
          v-loading="table.loading"
          class="blank-table"
          :data="table.data"
          style="width: 100%"
        >
          <template v-for="(header, index) in table.header">
            <el-table-column
              :prop="header.field"
              :key="index"
              :label="header.label"
              :width="header.width || ''"
              :align="header.align || 'left'"
              :sortable="header.sortable"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <template v-if="header.field === 'action'">
                  <template>
                    <table-button
                      icon-class="icon-table-view"
                      @click="viewOne(scope.row)"
                      content="查看"
                    ></table-button>
                    <table-button
                      icon-class="icon-shouquan"
                      v-if="scope.row.authorizeStatus === '1'"
                      @click="authorizeOne(scope.row)"
                      content="授权"
                    ></table-button>
                  </template>
                </template>
                <!-- 如果有列需要特殊处理，此处增加v-else-if即可 -->
                <template
                  v-else-if="(header.field === 'showAuthorizeType') && scope.row.authorizeType=== '1'"
                >
                  <span class="white-space-pre">{{scope.row.showAuthorizeType}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showAuthorizeType') && scope.row.authorizeType === '2'"
                >
                  <span class="white-space-pre">{{scope.row.showAuthorizeType}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showAuthorizeStatus') && scope.row.authorizeStatus === '1'"
                >
                  <img class="imgIcon" :src="require('@imgs/yfp-status.png')" alt title />
                  <span class="white-space-pre">{{scope.row.showAuthorizeStatus}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showAuthorizeStatus') && scope.row.authorizeStatus === '2'"
                >
                  <table-button icon-class="icon-table-review1" disabled></table-button>
                  <span class="white-space-pre">{{scope.row.showAuthorizeStatus}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showAuthorizeStatus') && scope.row.authorizeStatus === '3'"
                >
                  <table-button icon-class="icon-table-review0" disabled></table-button>
                  <span class="white-space-pre">{{scope.row.showAuthorizeStatus}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showAuthorizeStatus') && scope.row.authorizeStatus === '4'"
                >
                  <table-button icon-class="icon-table-review0 icon-reset-color" disabled></table-button>
                  <span class="white-space-pre">{{scope.row.showAuthorizeStatus}}</span>
                </template>
                <template v-else>
                  <span class="white-space-pre">{{scope.row[header.field] || ''}}</span>
                </template>
              </template>
            </el-table-column>
          </template>
        </my-table>
      </div>
      <div class="page-paging" v-if="pageParams.total && pageParams.total > 0">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentPageChange"
          :current-page="pageParams.pageNum"
          :page-sizes="pageParams.pageSizes"
          :page-size="pageParams.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageParams.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { blankPage, pageLoading, dictData } from "@common/mixins";
import TableButton from "@components/TableButton";
import MyTable from "@components/MyTable";
import api from "@workerOrder/manager/services.js";
import formatDate from "@common/utils.js";
import { mapState } from "vuex";
export default {
  components: {
    TableButton,
    MyTable
  },
  name: "index",
  mixins: [blankPage, pageLoading, dictData],
  data() {
    return {
      dateValue: [],
      showAuthorizeStatus: "",
      showAuthorizeType: "",
      //限制选中的时间只能是当前之前的时间
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      //面包屑
      breadsData: {
        breads: [
          {
            title: "工单管理"
          },
          {
            title: "我的授权"
          }
        ],
        title: "我的授权"
      },
      filterParams: {
        workOrderCode: "", //工单号
        authorizeDesc: "", //申请说明
        dateValue: "",
        startTime: "",
        endTime: "",
        authorizeStatus: "全部授权状态",
        authorizeType: "全部授权类型"
      },
      tableReloadingFlag: true,
      // 表格
      table: {
        // 表头
        header: [
          {
            field: "authorizationCode",
            label: "授权ID"
          },
          {
            field: "showAuthorizeType",
            label: "授权类型"
          },
          {
            field: "workOrderCode",
            label: "关联工单"
          },
          {
            field: "showAuthorizeStatus",
            label: "授权状态"
          },
          {
            field: "createTime",
            label: "申请时间"
          },
          {
            field: "authorizeTime",
            label: "授权时间"
          },
          {
            field: "action",
            label: "操作"
          }
        ],
        // 数据
        data: [],
        loading: false
      },
      filterSelect: {
        authorizeStatusArr: [
          {
            value: "",
            label: "全部授权状态"
          },
          {
            value: "1",
            label: "待授权"
          },
          {
            value: "2",
            label: "已授权"
          },
          {
            value: "3",
            label: "拒绝授权"
          },
          {
            value: "4",
            label: "已撤销"
          }
        ],
        authorizeTypeArr: [
          {
            value: "",
            label: "全部授权类型"
          },
          {
            value: "1",
            label: "账号密码"
          },
          {
            value: "2",
            label: "委托操作"
          }
        ]
      }
    };
  },
  computed: {
    ...mapState({
      stateUserInfo: state => state.main.userInfo
    })
  },
  mounted() {
    this.getTableListData();
  },
  methods: {
    searchKeyChangeEvent() {
      this.filterParams.workOrderCode = "";
    },
    timeChange(time) {
      this.filterParams.startTime = time[0];
      this.filterParams.endTime = time[1];
    },
    //获取授权列表
    async getTableListData() {
      this.tableReloadingFlag = true;
      this.table.loading = true;
      if (
        this.filterParams.authorizeStatus === "全部授权状态" ||
        this.filterParams.authorizeType === "全部授权类型"
      ) {
        this.filterParams.authorizeStatus = "";
        this.filterParams.authorizeType = "";
      }
      let reqParams = Object.assign(
        {},
        { userCode: this.stateUserInfo.userCode },
        { pageConfig: this.pageParams },
        this.filterParams
      );
      try {
        let { result, obj } = await api.getAuthorizationList(reqParams);
        if (result) {
          let { total, data } = obj;
          this.authorizeStatusChange(result, obj);
        }
      } finally {
        this.table.loading = false;
      }
    },
    //判断授权状态
    authorizeStatusChange(result, obj) {
      if (result && obj) {
        this.tableReloadingFlag = true;
        this.table.loading = false;
        //授权状态数据处理
        obj.data.forEach((item, index) => {
          let filtersStatus = this.filterSelect.authorizeStatusArr[
            parseInt(item.authorizeStatus)
          ];
          if (filtersStatus) {
            this.showAuthorizeStatus = filtersStatus.label;
          }
          Object.assign(item, {
            showAuthorizeStatus: this.showAuthorizeStatus
          });
        });
        //授权类型数据处理
        obj.data.forEach((item, index) => {
          let filtersType = this.filterSelect.authorizeTypeArr[
            parseInt(item.authorizeType)
          ];
          if (filtersType) {
            this.showAuthorizeType = filtersType.label;
          }
          Object.assign(item, {
            showAuthorizeType: this.showAuthorizeType
          });
        });
        this.table.data = obj.data || [];
        this.pageParams.total = obj.total;
      } else {
        this.tableReloadingFlag = false;
        this.table.loading = true;
        this.pageParams.total = 0;
      }
    },
    //操作-授权（待授权）
    authorizeOne(row) {
      this.$router.push({
        path: "/order/manager/authorize/PendingGrant",
        query: {
          authorizationCode: row.authorizationCode
        }
      });
    },
    //操作-授权详情
    viewOne(row) {
      this.$router.push({
        path: "/order/manager/authorize/AuthorizeDetail",
        query: {
          authorizationCode: row.authorizationCode
        }
      });
    }
  }
};
</script>

<style lang="scss" scope>
.authorize-content-box {
  .page-filter {
    white-space: nowrap !important;
    min-width: 1220px;
    .filter-item-box {
      white-space: nowrap !important;
      .filter-item.searchWidth {
        width: 170px !important;
      }
      .filter-item.largeWidth {
        width: 355px !important;
      }
    }
  }
  .filter-delate {
    position: absolute;
    right: 40px;
  }
  .el-range-editor--mini.el-input__inner {
    padding-left: 0 !important;
  }
  .el-range-editor--mini .el-range__icon {
    position: absolute !important;
    right: 8px !important;
    top: 1px;
  }
  .el-range-editor--mini .el-range__close-icon {
    position: absolute !important;
    right: 35px !important;
    top: 2px;
  }
  .el-pagination__total {
    padding-top: 2px;
  }
  .el-pagination__editor.el-input .el-input__inner {
    height: 26px;
    margin-top: -3px;
  }
  .el-table::before {
    height: 0 !important;
  }
  .icon-table-review0,
  .icon-table-review1,
  .icon-reset-color {
    font-size: 13px;
    display: inline-block;
    margin-top: 2px;
  }
  .icon-reset-color {
    color: #dbdeea !important;
  }
  .page-table .imgIcon {
    width: 14px !important;
    height: 14px !important;
    cursor: pointer;
    margin-right: 5px;
  }
}
</style>
