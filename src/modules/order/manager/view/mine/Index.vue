<template>
  <div class="page-box template-box worker-order">
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
              v-model="filterParams.jobStatus"
              slot="prepend"
              clearable
              placeholder="请选择工单状态"
            >
              <el-option
                v-for="(workerStatus,index) of filterSelect.workerStatusArr"
                :key="index"
                :label="workerStatus.label"
                :value="workerStatus.value"
              ></el-option>
            </el-select>
          </div>
          <div class="filter-item searchWidth">
            <el-input
              clearable
              placeholder="输入工单编号"
              v-model="filterParams.workOrderCode"
              suffix
              class="input-with-select"
            ></el-input>
          </div>
          <div class="filter-item searchWidth">
            <el-input
              clearable
              placeholder="问题描述关键字"
              v-model="filterParams.workOrderDesc"
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
                      icon-class="icon-cuidan"
                      v-if="scope.row.jobStatus === 2"
                      @click="reminderOne(scope.row)"
                      content="催单"
                    ></table-button>
                    <table-button
                      icon-class="icon-table-edit"
                      v-if="scope.row.jobStatus === 5"
                      @click="evaluationOne(scope.row)"
                      content="评价"
                    ></table-button>
                    <table-button
                      icon-class="icon-table-del"
                      v-if="scope.row.jobStatus === 5 || scope.row.jobStatus === 6 || scope.row.jobStatus === 7"
                      @click="deleteOne(scope.row)"
                      content="删除"
                    ></table-button>
                  </template>
                </template>
                <template v-else-if="header.field ==='workOrderDesc'">
                  <a
                    @click="viewDetail(scope.$index,scope.row)"
                    class="white-space-pre"
                    :style="changeStyle"
                  >{{scope.row.workOrderDesc}}</a>
                </template>
                <!-- 如果有列需要特殊处理，此处增加v-else-if即可 -->
                <template
                  v-else-if="(header.field === 'showJobStatus') && scope.row.jobStatus=== 2"
                >
                  <img class="imgIcon" :src="require('@imgs/yfp-status.png')" alt title />
                  <span class="white-space-pre">{{scope.row.showJobStatus}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showJobStatus') && scope.row.jobStatus === 3"
                >
                  <img class="imgIcon" :src="require('@imgs/dcl-status.png')" alt title />
                  <span class="white-space-pre">{{scope.row.showJobStatus}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showJobStatus') && scope.row.jobStatus === 4"
                >
                  <img class="imgIcon" :src="require('@imgs/dqr-status.png')" alt title />
                  <span class="white-space-pre">{{scope.row.showJobStatus}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showJobStatus') && scope.row.jobStatus === 5"
                >
                  <img class="imgIcon" :src="require('@imgs/pj-status.png')" alt title />
                  <span class="white-space-pre">{{scope.row.showJobStatus}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showJobStatus') && scope.row.jobStatus === 6"
                >
                  <table-button class="icon-right" icon-class="icon-table-review1" disabled></table-button>
                  <span class="white-space-pre">{{scope.row.showJobStatus}}</span>
                </template>
                <template
                  v-else-if="(header.field === 'showJobStatus') && scope.row.jobStatus === 7"
                >
                  <table-button class="icon-right" icon-class="icon-table-review0" disabled></table-button>
                  <span class="white-space-pre">{{scope.row.showJobStatus}}</span>
                </template>
                <template v-else-if="header.formatter">
                  <span class="white-space-pre">{{ header.formatter(scope.row[header.field])}}</span>
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
    <reminder-dialog v-if="isReminder" @ReminderPost="ReminderSave"></reminder-dialog>
    <rate-dialog v-if="isEvaluation" @rateExtraction="rateReceive"></rate-dialog>
    <div class="tip-message" v-if="isShowTip">
      <table-button icon-class="icon-tip-success" disabled></table-button>
      <span class="content">催单成功！我们已经收到您的催单请求，将会尽快为您服务，请您耐心等待</span>
      <i class="el-icon-close" @click="isShowTip=false"></i>
    </div>
  </div>
</template>

<script>
import { blankPage, pageLoading, dictData } from "@common/mixins";
import TableButton from "@components/TableButton";
import MyTable from "@components/MyTable";
import RateDialog from "./RateDialog";
import api from "@workerOrder/manager/services.js";
import ReminderDialog from "./ReminderDialog";
import { mapState } from "vuex";
import { ProductIssueEnum } from "@workerOrder/manager/mixins.js";
import { utils } from "@utils/utils.js";
export default {
  components: {
    TableButton,
    MyTable,
    RateDialog,
    ReminderDialog
  },
  name: "index",
  mixins: [blankPage, pageLoading, dictData, ProductIssueEnum],
  data() {
    return {
      centerDialogVisible: false,
      //催单弹框
      isReminder: false,
      //评价弹框
      isEvaluation: false,
      //工单号
      workOrderCode: "",
      //催单成功提示信息
      isShowTip: false,
      dateValue: [],
      //工单状态处理后的显示字段
      showJobStatus: "",
      //地址栏中携带的工单状态
      jobStatusType: "",
      //定时器
      myTimer: null,
      //面包屑
      breadsData: {
        breads: [
          {
            title: "工单管理"
          },
          {
            title: "我的工单"
          }
        ],
        title: "我的工单"
      },
      changeStyle: {
        color: "#3369ff",
        cursor: "pointer"
      },
      //限制选中的时间只能是当前之前的时间
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      filterParams: {
        workOrderCode: "",
        workOrderDesc: "",
        dateValue: "",
        startTime: "",
        endTime: "",
        jobStatus: "全部工单状态"
      },
      tableReloadingFlag: true,
      // 表格
      table: {
        // 表头
        header: [
          {
            field: "workOrderCode",
            label: "工单编号"
          },
          {
            field: "workOrderDesc",
            label: "问题描述"
          },
          {
            field: "problemCode",
            label: "问题分类",
            formatter: val => {
              let item = this.issueCategoryEnumList.find(
                item => item.code === val
              );
              return item ? item.name : "";
            }
          },
          {
            field: "showJobStatus",
            label: "工单状态"
          },
          {
            field: "createUsername",
            label: "创建人"
          },
          {
            field: "createTime",
            label: "创建时间"
          },
          {
            field: "action",
            label: "操作"
          }
        ],
        // 数据
        data: [],
        loading: true
      },
      filterSelect: {
        workerStatusArr: [
          {
            value: "",
            label: "全部工单状态"
          },
          {
            value: "2",
            label: "工单已分派"
          },
          {
            value: "3",
            label: "正在为您处理"
          },
          {
            value: "4",
            label: "待您确认"
          },
          {
            value: "5",
            label: "待您评价"
          },
          {
            value: "6",
            label: "工单已关闭"
          },
          {
            value: "7",
            label: "工单已撤销"
          }
        ]
      }
    };
  },
  mounted() {
    if (this.filterParams.jobStatus === "全部工单状态") {
      this.filterParams.jobStatus = "";
    }
    this.getTableListData();
  },
  computed: {
    ...mapState({
      stateUserInfo: state => state.main.userInfo
    })
  },
  methods: {
    timeChange(time) {
      this.filterParams.startTime = time[0];
      this.filterParams.endTime = time[1];
    },
    //获取工单列表
    async getTableListData() {
      this.tableReloadingFlag = true;
      this.table.loading = true;
      let reqParams = Object.assign(
        {},
        { customerAccount: this.stateUserInfo.userCode },
        { pageConfig: this.pageParams },
        this.filterParams
      );
      try {
        let { result, obj } = await api.getTableList(reqParams);
        if (result) {
          let { total, data } = obj;
          this.workerStatusChange(result, obj);
        }
      } finally {
        this.table.loading = false;
      }
    },
    //催单
    async ReminderSave(text) {
      text = text.trim();
      if (text == "" || text.length == 0) {
        this.$message({
          message: "请输入催单说明",
          type: "error"
        });
      } else {
        let { result } = await api.createReminder({
          remindContent: text,
          workOrderCode: this.workOrderCode
        });
        if (result) {
          this.isReminder = false;
          this.isShowTip = true;
          //关闭自定义消息
          this.myTimer = setTimeout(() => {
            this.isShowTip = false;
          }, 2000);
        } else {
          this.getTableListData();
          this.isReminder = false;
        }
      }
    },
    //评价
    async rateReceive(rateValue, evaluationTextarea) {
      evaluationTextarea = evaluationTextarea.trim();
      if (rateValue == 0) {
        this.$message({
          message: "请为我们的服务打个星吧",
          type: "error"
        });
      } else {
        let { result } = await api.appraiseWorkOrder({
          appraiseDesc: evaluationTextarea,
          score: rateValue,
          workOrderCode: this.workOrderCode
        });
        if (result) {
          this.getTableListData();
          this.isEvaluation = false;
        }
      }
    },
    //判断工单状态
    workerStatusChange(result, obj) {
      if (result && obj) {
        //数据处理
        obj.data.forEach((item, index) => {
          let filtersStatus = this.filterSelect.workerStatusArr[
            parseInt(item.jobStatus) - 1
          ];
          if (filtersStatus) {
            this.showJobStatus = filtersStatus.label;
          }
          //处理问题描述的换行问题
          if (item.workOrderDesc.indexOf("/\n")) {
            item.workOrderDesc = item.workOrderDesc.replace(/\n/g, " ");
          }
          Object.assign(item, {
            showJobStatus: this.showJobStatus
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
    //删除单行
    async deleteHttp(deleteIds) {
      this.showFullLoading();
      let { result } = await api.deleteWorkerOrder(deleteIds);
      if (result) {
        this.$message.success("删除成功");
        this.getTableListData();
      }
      this.closeFullLoading();
    },
    //操作-删除当前行
    deleteOne(row) {
      const MyMessageBox = this.$MyMessageBox({
        type: "error",
        content: "确认删除该工单吗？",
        btn: [
          {
            text: "取消",
            fn: () => {
              MyMessageBox.visible = false;
            }
          },
          {
            type: "primary",
            text: "确认",
            fn: () => {
              MyMessageBox.visible = false;
              this.deleteHttp([row.workOrderCode]);
            }
          }
        ]
      });
    },
    //操作-催单（工单已分派）
    reminderOne(row) {
      this.isReminder = !this.isReminder;
      this.workOrderCode = row.workOrderCode;
    },
    //操作-评价工单
    evaluationOne(row) {
      this.isEvaluation = !this.isEvaluation;
      this.workOrderCode = row.workOrderCode;
    },
    //操作-查看详情   ---点击问题描述跳转工单详情
    viewOne(row) {
      this.$router.push({
        name: "Detail",
        query: {
          workOrderCode: row.workOrderCode
        }
      });
    },
    //点击问题描述查看详情
    viewDetail(index, row) {
      this.$router.push({
        name: "Detail",
        query: {
          workOrderCode: row.workOrderCode
        }
      });
    }
  },
  beforeDestroy() {
    clearTimeout(this.myTimer);
    this.myTimer = null;
  }
};
</script>


<style lang="scss" scope>
.worker-order {
  .page-filter {
    white-space: nowrap !important;
    min-width: 1220px;
    .filter-item-box {
      white-space: nowrap !important;
      .searchWidth {
        width: 170px !important;
      }
      .largeWidth {
        width: 355px !important;
      }
    }
  }
  .filter-delate {
    position: absolute;
    right: 40px;
  }
  .el-dialog__footer {
    text-align: center !important;
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
  .tip-message {
    min-width: 505px;
    height: 36px;
    line-height: 36px;
    background: rgba(230, 255, 249, 1);
    box-shadow: 0px 2px 8px 0px rgba(9, 216, 206, 0.2);
    border: 1px solid rgba(9, 216, 206, 1);
    position: absolute;
    top: 62px;
    left: 40%;
    white-space: nowrap;
    .icon-tip-success {
      width: 16px;
      height: 16px;
      margin: 10px 10px;
    }
    .content {
      color: rgba(33, 42, 64, 1);
    }
    .el-icon-close {
      float: right;
      font-size: 18px;
      color: #09d8ce;
      float: right;
      margin: 8px 10px;
      cursor: pointer;
    }
  }
  .icon-table-review0,
  .icon-table-review1 {
    font-size: 13px;
    display: inline-block;
    margin-top: 2px;
  }
  .page-table .imgIcon {
    width: 14px !important;
    height: 14px !important;
    cursor: pointer;
    margin-right: 5px;
  }
  .icon-right {
    margin-right: 3px !important;
  }
  .icon-table-review1 {
    color: #dbdeea;
  }
  .page-table tr td:nth-child(2) {
    color: #3369ff !important;
    cursor: pointer;
  }
  .el-picker-panel {
    background: olive;
  }
}
</style>
