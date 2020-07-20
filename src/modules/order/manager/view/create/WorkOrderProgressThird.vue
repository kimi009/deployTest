<template>
  <div class="page-first page-box Third-box">
    <ValidationObserver ref="observer" v-slot="{ passes }">
      <bread-crumb :title="breadsData.title">
        <template slot="action">
          <el-button type="primary" :disabled='disabled' size="mini" @click="passes(saveWorkorder)"
            >提交</el-button
          >
        </template>
      </bread-crumb>
      <my-step :stepArr="stepArr" :currentStep="currentStep"></my-step>
      <div class="page-content">
        <el-form label-position="left" ref="form" label-width="150px">
          <div>
            <vee-input
              require="true"
              type="textarea"
              placeholder="请填写问题详细信息"
              v-model="submitData.workOrderDesc"
              rules="required"
              label="问题描述"
              innerWidth="730px"
              maxlength="1500"
              show-word-limit
              resize="none"
              :rows="7"
            />
          </div>
          <el-form-item>
            <el-checkbox-group v-model="checkTrue">
              <el-checkbox label="添加机密信息"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item>
            <el-input
              style="width: 730px;"
              v-model="submitData.secretMessage"
              maxlength="200"
              placeholder="请填写您的实例名、账号、密码等机密信息，提交后，机密信息将会做机密处理，关单后机密信息清除"
            ></el-input>
          </el-form-item> -->
          <vee-input
            class="no-label"
            v-if="checkTrue"
            require="true"
            placeholder="请填写您的实例名、账号、密码等机密信息，提交后，机密信息将会做机密处理，关单后机密信息清除"
            v-model="submitData.secretMessage"
            rules="required"
            innerWidth="730px"
            label="机密信息"
            maxlength="200"
          />
          <vee-select
            require="true"
            rules="required"
            label="紧急度"
            v-model="submitData.emergencyCode"
            value-key="value"
            placeholder="请选择紧急度"
          >
            <el-option
              v-for="i in UrgencySelectList"
              :key="i.emergencyCode"
              :label="i.emergencyName"
              :value="i.emergencyCode"
            ></el-option>
          </vee-select>
          <!-- 第一种测试----------- -->
          <div v-for="(i, index) in DynamicData" :key="index">
            <vee-input
              v-if="i.workOrderFieldType == 1"
              :require="i.requiredFlag=='0'?true:''"
              :placeholder="'请填写'+i.workOrderFieldName"
              v-model="customAttributes[i.workOrderFieldName+'_'+index]"
              :rules="i.requiredFlag=='0'?'required':''"
              maxlength="200"
              @input="fieldExceeds(i,index)"
              :label="i.workOrderFieldName"
              innerWidth="480px"
            />
            <vee-select
              v-if="i.workOrderFieldType == 2"
              :require="i.requiredFlag=='0'?true:''"
              :rules="i.requiredFlag=='0'?'required':''"
              v-model="customAttributes[i.workOrderFieldName+'_'+index]"
              :label="i.workOrderFieldName"
              :placeholder="'请选择'+i.workOrderFieldName"
            >
              <el-option
                v-for="item in i.customizeFieldOptions"
                :key="item.workOrderOptionCode"
                :label="item.workOrderOptionValue"
                :value="item.workOrderOptionValue"
              ></el-option>
            </vee-select>
          </div>
          <!-- 第一种测试----------- -->
          <el-form-item label="附件">
            <upload-file
              v-model="submitData.fileDtoList"
              class="uploadFile uploadDemo"
            ></upload-file>
          </el-form-item>
          <div class="tipBox">
            <vee-input
              require="true"
              placeholder="请填写手机号"
              v-model="reporterPhone"
              rules="required|mobile"
              innerWidth="178px"
              label="手机号"
            />
            <span class="tip">
              手机号用来接收工单进展提醒，必要情况时，中软工程师会与您电话联系，
              请填写正确手机号 !
            </span>
          </div>
          <div class="tipBox">
            <vee-input
              require="true"
              placeholder="请填写邮箱"
              v-model="reporterEmail"
              rules="required|email"
              label="邮箱"
            />
            <span class="tip"
              >邮箱用来接受工单进展提醒，以及必要情况下，需要通过邮件获取授权信息，请填写正确邮件！</span
            >
          </div>
        </el-form>
      </div>
    </ValidationObserver>
  </div>
</template>

<script>
import MyStep from "@components/MyStep";
import { ValidationObserver } from "vee-validate";
import api from "@workerOrder/manager/services.js";
import { mapState } from "vuex";
import UploadFile from "@components/UploadFile";
export default {
  components: {
    MyStep,
    ValidationObserver,
    UploadFile
  },
  data() {
    // .length>=200?fieldExceeds(i):customAttributes[i.workOrderFieldName]
    return {
      //面包屑
      breadsData: {
        title: "新建工单"
      },
      reporterPhone: "",
      reporterEmail: "",
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
      currentStep: 3,
      customAttributes: {},
      submitData: {
        problemCode: "",
        productCode: "",
        emergencyCode: "",
        workOrderDesc: "",
        displayFlag: "0",
        orderSource: "0",
        customerAccount: "",
        priorityCode: "1",
        secretMessage: "",
        fileDtoList: []
      },
      UrgencySelectList: [],
      checkTrue: false,
      //测试渲染组件------------
      DynamicData: [],
      DynamicType: "",
      templateCode: "",
      //测试渲染组件------------
      reporterCode: "",
      customerCode:'',
      reporterAccount: "",
      customerName: "",
      reporterName: "",
      WorkOrderPaperType: false,
      // fileList: [],
      // filePath: ""
      disabled:false
    };
  },
  mounted() {
    const { progressType, proType, templateCode } = this.$route.query;
    this.submitData.problemCode = progressType;
    this.submitData.productCode = proType;
    this.templateCode = templateCode;
    this.queryTemplateList();
    this.urgencyList();
    this.getInfo();
  },
  computed: {
    ...mapState({
      userInfo: state => state.main.userInfo
    })
  },
  watch: {
    "submitData.fileDtoList": {
      handler(newName, oldName) {
        newName.forEach((i, index) => {
          i.fileSource = i.uid;
        });
      },
      immediate: true
    },
    "submitData.secretMessage": {
      handler(n, o) {
        if (n.length == 200) {
          this.$message({
            message: "长度不能超过200个字符",
            type: "error"
          });
        }
      }
    }
  },
  methods: {
    //判断字段超200
    fieldExceeds(i,index) {
      if (this.customAttributes[i.workOrderFieldName+'_'+index].length == 200) {
        this.$message({
          message: "长度不能超过200个字符",
          type: "error"
        });
      }
    },
    //获取自定义模板
    async queryTemplateList() {
      let { obj, result } = await api.queryTemplateList(this.templateCode);
      if (result) {
        this.DynamicData = obj.templateDetails;
        this.DynamicData.map((i, index, arr) => {
          this.$set(
            this.customAttributes,
            i.workOrderFieldName+'_'+index,
            i.workorderFieldDefaultValue == null
              ? ""
              : i.workorderFieldDefaultValue
          );
        });
      }
    },
    // 拿取用户
    getInfo() {
      console.log(this.userInfo)
      let { userName, mobile, email, userCode } = this.userInfo;
      this.submitData.customerAccount = userCode;
      this.customerName = userName;
      this.reporterName = userName;
      this.reporterPhone = mobile;
      this.reporterEmail = email;
      this.reporterCode = userCode;
      this.customerCode = userName
      this.reporterAccount = userCode;
    },
    // 紧急度下拉框列表
    async urgencyList() {
      let { obj, result } = await api.urgencyList();
      if (result) {
        this.UrgencySelectList = obj;
        this.submitData.emergencyCode=obj[0].emergencyCode
      }
    },
    // 提交
    async saveWorkorder() {
      this.disabled=true
      let {
        reporterEmail,
        reporterPhone,
        reporterCode,
        reporterAccount,
        customerName,
        reporterName,
        customerCode
      } = this;
      Object.assign(this.submitData, {
        customAttributes: JSON.stringify(this.customAttributes),
        reporterEmail,
        reporterPhone,
        reporterCode,
        reporterAccount,
        customerName,
        reporterName,
        customerCode,
        templateCode: this.templateCode
      });
      // this.submitData.displayFlag = this.checkTrue ? "0" : "1";
      let { result } = await api.saveWorkorder(this.submitData);
      // this.fileList = [];
      if (result) {
        this.$message({
          message: "恭喜你，提交成功",
          type: "success"
        });
        this.$router.push({ path: "/order/manager/mine" });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.Third-box {
  .tipBox {
    width: 100%;
    display: flex;
    .tip {
      font-size: 12px;
      margin-top: 10px;
      margin-left: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(163, 169, 183, 1);
    }
  }
  .special-input /deep/ .el-form-item__label {
    text-indent: -100px;
  }
  .uploadFile /deep/ ul {
    width: 700px;
  }
  .page-content {
    min-height: calc(100vh - 185px);
    height: calc(100vh - 185px);
  }
  .no-label >>> .el-form-item__label {
    display: none;
  }
  .uploadDemo{
    display: inline-block;
  }
}
</style>
