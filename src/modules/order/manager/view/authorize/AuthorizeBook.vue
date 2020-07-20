<template>
  <div class="page-box template-box authorize-book-box">
    <bread-crumb :breads="breadsData.breads" :title="breadsData.title">
      <template slot="action">
        <el-button @click="goBack()" size="mini">返回</el-button>
      </template>
    </bread-crumb>
    <div class="page-content" style="margin-bottom: -8px;">
      <p>
        尊敬的客户 ({{userInfo.userName}})
        <br />您好！
      </p>
      <p>
        为定位您的云资源位置及状态，协助您解决问题，您同意并授权华夏云使用您在工单中提供的相关信息。
        <br />本次授权自您提交工单时生效，至报障问题处理关闭，具体以系统记录时间为准。
        <br />华夏云承诺仅在您的授权范围内进行相关操作，并在本次报障问题处理关闭后删除您提供的账号、密码信息(如有)。
        <br />对于操作过程中可能涉及的对您个人数据的收集、使用、处理等，华夏云承诺将按照华夏云 《隐私政策声明》 的规定尊重并保护您的隐私。
      </p>
      <p>为本次授权之目的，您同意并授权华夏云对您的系统进行以下操作：</p>
      <p>
        1. 邀请您远程共享桌面，查看报障问题；
        <br />2. 经您同意，使用您提供的账号和密码登录您授权的主机/华夏云官网管理控制台，在需要定位系统资源异常、网络异常、病毒及攻击等故障时，传入故障分析工具，对系统相关信息进行收集、分析；
        <br />3. 经您同意，访问并传出操作系统的系统信息(如系统日志、系统配置等)、系统进程、网络连接等信息，例如在定位病毒及攻击故障时，可能涉及访问传出您的网络连接登录日志信息（可能含个人信息）；
        <br />4. 如果涉及安全入侵，在定位出问题后，为排除故障，对相应的文件/进程进行清理，例如删除木马、病毒等；
        <br />5. 可能需要原厂协助定位问题，对于操作过程中可能涉及的对您个人数据的收集、使用、处理等，原厂承诺将按照华夏云 《隐私政策声明》 的规定尊重并保护您的隐私
        <br />6. 依据您的要求或授权而进行的其它操作，例如强制重启系统等。华夏云在操作前会再次与您确认。
      </p>
      <p>对于华夏云及其技术人员按照授权进行操作而导致的服务不可用、服务异常、数据丢失及其他一切风险和损失，华夏云及其技术人员不承担任何责任。</p>
      <p>如涉及密码操作，本公司承诺完成授权操作后会立即删除并告知您，请您及时修改密码，由于您未及时修改密码而导致的一切后果华夏云不承担任何责任。</p>
      <p>如果您有任何关于本授权的提问，请通过以下方式联系华夏云：</p>
      <p>
        Tel：400-060-0162
        <br />Add：西安市雁塔区天谷八路和云水一路交汇处
        <br />E-mail:CloudService@chinasofti.combr
        <br />
        <a href="http://www.chinasofti.com/index.shtml">http://www.chinasofti.com/index.shtml</a>
      </p>
    </div>
  </div>
</template>

<script>
import api from "@workerOrder/manager/services.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      isShowAuthorizeBook: true,
      authorizationCode: "",
      //面包屑
      breadsData: {
        breads: [
          {
            title: "授权详情",
            path: `/order/manager/authorize/PendingGrant?authorizationCode=${this.authorizationCode}`
          },
          {
            title: "用户授权书"
          }
        ],
        title: "用户授权书"
      }
    };
  },
  created() {
    this.authorizationCode = this.$route.query.authorizationCode;
  },
  computed: {
    ...mapState({
      userInfo: state => state.main.userInfo
    })
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scope >
.authorize-book-box {
  p {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    line-height: 36px;
  }
}
</style>