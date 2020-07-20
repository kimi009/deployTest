<template>
  <div class="page-box template-box">
    <ValidationObserver>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="140px"
      label-position="left"
      class="cs_userInfo"
    >
      <bread-crumb :breads="breadsData.breads" :title="breadsData.title">
        <template slot="action">
          <el-button type="primary" @click="cancleEvent">取消</el-button>
          <el-button ref="submit" type="primary" @click="submitM()">保存</el-button>
        </template>
      </bread-crumb>
      <div class="page-content" style="padding-left:40px;">
        <!-- src="@/assets/imgs/defaultPic.png" -->
        <el-form-item>
          <img
            class="cs_avatar"
            ref="imgDom"
            src="@/assets/imgs/defaultPic.png"
            style="margin-left:0px;"
          />
        </el-form-item>
        <el-form-item>
          <el-upload
            class="avatar-uploader"
            action="https://jsonplaceholder.typicode.com/posts/"
            :show-file-list="false"
            :auto-upload="false"
            accept="image/jpeg, image/gif, image/png, image/bmp"
            :on-change="imgPreview"
          >
            <el-button type="text" style="padding-left:30px;">上传头像</el-button>
          </el-upload>
        </el-form-item>
        <el-form-item required label="用户名" v-show="!ruleForm.modifyFlag && userInfo.userName!=''">
          <span>{{userInfo.userName}}</span>
          <el-button type="text" @click="modifyUserName" style="padding-left:20px;">修改</el-button>
        </el-form-item>
        <el-form-item
          label="用户名"
          v-show="ruleForm.modifyFlag || ruleForm.userName==''"
          prop="modifyName"
        >
          <el-input clearable style="width:272px;" v-model="ruleForm.modifyName"></el-input>
        </el-form-item>
        <el-form-item label="所在部门">
          <span>{{userInfo.userDepart}}</span>
        </el-form-item>
        <el-form-item label="手机号">
          <span>{{userInfo.userTel}}</span>
        </el-form-item>
        <el-form-item label="邮箱">
          <span>{{userInfo.userMail}}</span>
        </el-form-item>
        <el-form-item label="原密码" prop="oPassword">
          <el-input
            :type="ruleForm.show.old?'text':'password'"
            auto-complete="new-password"
            v-model="ruleForm.oPassword"
            style="width:272px;"
          >
            <i
              slot="suffix"
              :class="ruleForm.show.old?'iconfont icon-view':'iconfont icon-view-off'"
              style="cursor:pointer;color: #6D7383"
              @click="ruleForm.show.old=!ruleForm.show.old"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="nPassword">
          <el-input
            :type="ruleForm.show.new?'text':'password'"
            auto-complete="new-password"
            v-model="ruleForm.nPassword"
            style="width:272px;"
          >
            <i
              slot="suffix"
              :class="ruleForm.show.new?'iconfont icon-view':'iconfont icon-view-off'"
              style="cursor:pointer;color: #6D7383"
              @click="ruleForm.show.new=!ruleForm.show.new"
            ></i>
          </el-input>
        </el-form-item>
        <el-form-item label="密码确认" prop="yPassword">
          <el-input
            :type="ruleForm.show.check?'text':'password'"
            auto-complete="new-password"
            v-model="ruleForm.yPassword"
            style="width:272px;"
          >
            <i
              slot="suffix"
              :class="ruleForm.show.check?'iconfont icon-view':'iconfont icon-view-off'"
              style="cursor:pointer;color: #6D7383"
              @click="ruleForm.show.check=!ruleForm.show.check"
            ></i>
          </el-input>
        </el-form-item>
      </div>
    </el-form>
    </ValidationObserver>
  </div>
</template>

<script>
import {ValidationObserver} from "vee-validate";
import VeePasswordInput from "@components/VeePasswordInput";
import {msgUrl} from "@common/url-conf";
import { mainApi } from '@main/services'
export default {
  components: {
    ValidationObserver,
    VeePasswordInput
  },
  name: "index",
  props: ["baseInfo"],
  data() {
    //密码输入不一致校验
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.nPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    //输入框正则校验
    let validataPassWord = (rule, value, callback) => {
      const reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:'<>?,.\/]).{8,32}$/;
      if (!reg.test(value)) {
        callback(
          new Error(
            "请输入8-32个字符，至少包含大写字母、小写字母、数字和特殊字符中的两种"
          )
        );
      } else {
        callback();
      }
    };
    return {
      breadsData: {
        breads: [],
        title: "账号设置"
      },
      imageUrl: "",
      file: "",
      //创建校验规则
      rules: {
        modifyName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        oPassword: [
          //var reg = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:'<>?,.\/]).{8,32}$/  校验规则
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        nPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { required: true, validator: validataPassWord, trigger: "blur" }
        ],
        yPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { required: true, message: validataPassWord, trigger: "blur" },
          { required: true, validator: validatePass, trigger: "blur" }
        ]
      },
      ruleForm: {
        oPassword: "",
        nPassword: "",
        yPassword: "",
        show: {
          old: false,
          new: false,
          check: false
        },
        modifyFlag: false,
        modifyName: ""
      },
      userInfo: {
        userName: "张三丰",
        userDepart: "产品部",
        userTel: "13309265717",
        userMail: "xiefeng@chinasofti.com"
      }
    };
  },
  mounted() {
    //
    this.initGetInfo();
    this.ruleForm.modifyName = this.userInfo.userName;
  },

  methods: {
    //上传图片可直接预览
    imgPreview(file, fileList) {
      this.file = file;
      this.$refs.imgDom.src = URL.createObjectURL(file.raw);
    },
    //初始化获取用户信息
    initGetInfo() {
      //发请求并将结果赋值给相应的model
      
      mainApi.mainQueryUserInfo().then(res => {
        if(res.result){
          let baseInfo = res.obj
          this.userInfo.userName = baseInfo.userName
          this.ruleForm.modifyName = baseInfo.userName
          this.userInfo.userMail = baseInfo.email
          this.userInfo.userTel = baseInfo.mobile
          this.userInfo.userDepart = baseInfo.departments[0].name
        }
      });
      //获取用户头像
      //mainQueryUserInfo
    },
    //文件上传成功
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    //上传文件之前对文件格式和大小进行判断进行
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //上传头像图片
    upLoad(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      console.log(file);
      // this.$http.uploadHttp('/udb/api/v1/oss/fileUpload', formData).then((res) =>{
      //   console.log(res);
      // })
    },
    //点击修改
    modifyUserName() {
      this.ruleForm.modifyFlag = true;
    },
    //
    confirmUserName() {
      this.ruleForm.modifyFlag = false;
      this.userInfo.userName = this.ruleForm.modifyName;
    },
    confirmUserInfo() {},
    //返回首页
    cancleEvent() {
      this.$router.push({
        path: "/"
      });
    },
    //提交，保存
    submitM() {
      this.$refs.ruleForm.validate(vaild => {
        if (vaild) {
          const MyMessageBox = this.$MyMessageBox({
            type: "info",
            content: "确认修改密码?",
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
                fn: async () => {
                  MyMessageBox.visible = false;
                  //await this.saveInfo();
                }
              }
            ]
          });
        }
      });
    },
    async confrimEvent() {
      try {
        this.showFullLoading();
        //发送请求
        // let { result } = await this.$api.saveInfo([
        //   -----------
        // ]);
        let result = "";
        this.closeFullLoading();
        if (result) {
          this.$message.success("修改成功");
        } else {
          this.$message.error("修改失败");
        }
      } catch (error) {
        this.$message.error(error);
      } finally {
        this.closeFullLoading();
      }
    },
    saveInfo() {
      //确认数据无误并发送请求
      let getUserName =
        ruleForm.modifyFlag || ruleForm.userName == ""
          ? this.modifyUserName
          : this.userName;
      let password = this.ruleForm.yPassword;
      let picFile = this.file;
      //发请求
    }
  }
};
</script>

<style  lang="scss">

  .page-content {
    .cs_userInfo {
      .el-form-item__content {
        font-size: 12px;
      }
      .cs_avatar {
        position: relative;
        width: 120px;
        height: 120px;
        display: block;
        border-radius: 50%;
      }
    }
  }


</style>