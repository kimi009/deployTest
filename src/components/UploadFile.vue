<template>
  <div class="upload-box">
    <el-upload
      class="my-upload"
      :action="uploadUrl()"
      :on-remove="handleRemove"
      :multiple="limit > 1"
      :limit="limit"
      :before-upload="beforeUpload"
      :on-success="uploadSuccess"
      :on-exceed="handleExceed"
      :file-list="fileArr"
      :accept="accept"
      :show-file-list="limit > 1"
    >
      <span class="logo-pic" v-if="limit == 1 && value">
        <img :src="value" />
      </span>
      <el-button v-else size="small">
        <i style="font-size: 12px;" class="iconfont icon-btn-plus"></i>
        <span>选择文件</span>
      </el-button>
    </el-upload>
    <span style="color:#a3a9b7;fontSize:12px;"
      >支持{{ accept }}格式，可以上传{{ limit }}个最大不超过{{
        fileSize
      }}的文件</span
    >
  </div>
</template>

<script>
import { uploadFileUrl } from "@workerOrder/manager/services";
import { utils } from "@utils/utils";
export default {
  props: {
    value: {
      type: Array | String,
      default: () => {
        return typeof this.value == "string" ? "" : [];
      }
    },
    limit: {
      //最大上传个数
      type: Number,
      default: () => 5
    },
    accept: {
      //支持上传格式
      type: String,
      default: () =>
        ".jpg, .jpeg, .png, .txt, .rar, .doc, .xls, .xlsx, .zip, .7z"
    },
    imgSize: {
      type: String,
      validator: val => {
        return val.split("x").every(item => Number(item));
      }
    },
    fileSize: {
      type: String,
      validator: val => {
        let s = val.match(/(\d+)([A-Za-z]{1,2})/);
        if (!utils.isNumber(s[1])) {
          return false;
        }
        if (!["KB", "M"].includes(s[2])) {
          return false;
        }
        return true;
      },
      default: () => "10M"
    }
  },
  data() {
    return {
      imageUrl: "",
      fileArr: [],
      maxFileSize: this.fileSize
    };
  },
  watch: {
    value(newVal) {
      this.formatFromData(newVal);
    }
  },
  created() {
    this.formatFromData(this.value);
  },
  methods: {
    formatFromData(value) {
      if (!value) return;
      if (typeof value == "string") {
      } else {
        if (value.length <= 0) {
          this.fileArr = [];
        } else {
          value.forEach(item => {
            if (
              this.fileArr.findIndex(
                o =>
                  o.name === item.fileName &&
                  o.url === item.filePath &&
                  o.size === item.fileSize &&
                  o.type === item.fileType
              ) === -1
            ) {
              this.fileArr.push({
                uid: item.uid,
                name: item.fileName,
                url: item.filePath,
                size: item.fileSize,
                type: item.fileType
              });
            }
          });
        }
      }
    },
    formatToData(dataArr) {
      let newData = dataArr.map(item => {
        return {
          uid: item.uid,
          fileName: item.name,
          filePath: item.url,
          fileSize: item.size,
          fileType: item.type || item.raw.type
        };
      });
      this.$emit("input", newData);
    },
    uploadUrl() {
      console.log(uploadFileUrl)
      return uploadFileUrl;
    },
    beforeUpload(file) {
      let s = this.fileSize.match(/(\d+)([A-Za-z]{1,2})/);
      if (file.size > Number(s[1]) * 1024 * (s[2] === "M" ? 1024 : 1)) {
        this.$message.error(`上传文件超过${this.fileSize}`);
        return false;
      }
      if (this.imgSize) {
        return new Promise((resolve, reject) => {
          try {
            var reader = new FileReader();
            reader.onload = e => {
              var data = e.target.result;
              //加载图片获取图片真实宽度和高度
              var image = new Image();
              image.onload = () => {
                var width = image.width;
                var height = image.height;
                try {
                  let imgOption = this.imgSize.split("x");
                  if (
                    width > Number(imgOption[0]) ||
                    height > Number(imgOption[1])
                  ) {
                    this.$message.error("仅支持上传一个128x128尺寸的图片");
                    reject();
                  }
                } catch (e) {
                  reject("上传图片尺寸配置必须是**x**");
                }

                resolve();
              };
              image.src = data;
            };
            reader.readAsDataURL(file);
          } catch (e) {
            this.$message.error("上传图片错误，请重试");
            reject(e);
          }
        });
      }
    },
    uploadSuccess(data, file, fileList) {
      if (data.result) {
        if (this.limit > 1) {
          let temp = [...fileList];
          let item = temp.find(item => item.uid === file.uid);
          Object.assign(item, { url: data.obj });
          this.formatToData(temp);
        } else {
          this.$emit("input", data.obj);
          this.fileArr = [];
        }
      }
    },
    handleRemove(file, fileList) {
      this.formatToData(fileList);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 ${this.limit} 个文件`);
    }
  }
};
</script>

<style lang="scss" scoped>
.upload-box {
  display: flex;
  align-items: center;
  .my-upload {
    width: 145px;
    float: left;
    .logo-pic {
      width: 80px;
      height: 80px;
      border: 1px solid #d2ccd2;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      img {
        width: 80px;
        height: 80px;
      }
    }
  }
}
</style>
