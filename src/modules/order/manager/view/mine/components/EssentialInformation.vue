<template>
  <div class="page-content">
    <p class="page-content-font">基本信息</p>
    <div class="page-content-list">
      <el-row>
        <el-col :span="9">
          <div class="content-list-information">
            <el-col :span="9">
              <span>工单编号</span>
            </el-col>
            <el-col :span="11">
              <span>{{ workOrderCode }}</span>
            </el-col>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="content-list-information">
            <el-col :span="9">
              <span>工单状态</span>
            </el-col>
            <el-col v-if="jobStatus == 5" :span="11">
              <span><img src="@imgs/pj-status.png" />待您评价</span>
            </el-col>
            <el-col v-if="jobStatus == 2" :span="11">
              <span><img src="@imgs/yfp-status.png" />工单已分派</span>
            </el-col>
            <el-col v-if="jobStatus == 4" :span="11">
              <span><img src="@imgs/dqr-status.png" />待您确认</span>
            </el-col>
            <el-col v-if="jobStatus == 3" :span="11">
              <span><img src="@imgs/dcl-status.png" />正在为您处理</span>
            </el-col>
            <el-col v-if="jobStatus == 7" :span="11">
              <span
                ><table-button
                  content="工单已撤销"
                  icon-class="icon-table-review0"
                ></table-button
                >工单已撤销</span
              >
            </el-col>
            <el-col v-if="jobStatus == 6" :span="11">
              <span
                ><table-button
                  content="已关闭"
                  icon-class="icon-table-review1"
                ></table-button
                >已关闭</span
              >
            </el-col>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="content-list-information">
            <el-col :span="9">
              <span>创建人</span>
            </el-col>
            <el-col :span="11">
              <span>{{ reporterName }}</span>
            </el-col>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="content-list-information">
            <el-col :span="9">
              <span>创建时间</span>
            </el-col>
            <el-col :span="11">
              <span>{{ createTime }}</span>
            </el-col>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="content-list-information">
            <el-col :span="9">
              <span>手机号</span>
            </el-col>
            <el-col :span="11">
              <span>{{ reporterPhone }}</span>
            </el-col>
          </div>
        </el-col>
        <el-col :span="9">
          <div class="content-list-information">
            <el-col :span="9">
              <span>邮箱</span>
            </el-col>
            <el-col :span="11">
              <span>{{ reporterEmail }}</span>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import TableButton from "@components/TableButton";
export default {
  components: {
    TableButton
  },
  props: {
    informationData: {
      type: Object
    }
  },
  data() {
    return {
      createTime: "",
      workOrderCode: "",
      jobStatus: "",
      reporterName: "",
      reporterPhone: "",
      reporterEmail: ""
    };
  },
  watch: {
    informationData(newValue, oldValue) {
      let {
        createTime,
        workOrderCode,
        jobStatus,
        reporterName,
        reporterPhone,
        reporterEmail
      } = newValue;
      Object.assign(this, {
        createTime,
        workOrderCode,
        jobStatus,
        reporterName,
        reporterPhone,
        reporterEmail
      });
    },
  }
};
</script>

<style lang="scss" scoped>
.page-content-font {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 600;
  color: rgba(33, 42, 64, 1);
  line-height: 20px;
  margin-bottom: 20px;
}
.page-content-list {
  width: 100%;
  .content-list-information {
    display: flex;
    margin-bottom: 20px;
    .el-col-9 {
      span {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(109, 115, 131, 1);
        margin-right: 56px;
        white-space: nowrap;
      }
    }
    .el-col-11 {
      span {
        font-size: 13px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(33, 42, 64, 1);
        display: flex;
        align-items: flex-start;
        img {
          width: 14px;
          height: 14px;
          float: left;
          margin-right: 8px;
        }
        .el-button {
          padding: 0;
          margin-right: 8px;
          margin-top: -7px;
        }
      }
    }
    .el-icon-loading {
      margin-right: 8px;
    }
  }
}
</style>
