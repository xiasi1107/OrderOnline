"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const api_login = require("../../api/login.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const isLoading = common_vendor.ref(false);
    const agreement = common_vendor.ref(false);
    const errorTip = common_vendor.ref("");
    const handleAgreementChange = (e) => {
      agreement.value = e.detail.value.length > 0;
      errorTip.value = "";
    };
    const handleWeChatRegister = async () => {
      if (!agreement.value) {
        errorTip.value = "请勾选同意隐私政策和用户协议";
        return;
      }
      isLoading.value = true;
      try {
        const { code } = await common_vendor.index.login({ provider: "weixin" });
        const res = await api_login.loginByWeChat(code);
        if (res.code === 200) {
          common_vendor.index.showToast({ title: "注册成功", icon: "success" });
          common_vendor.index.setStorageSync("userInfo", res.data);
          common_vendor.index.setStorageSync("token", res.data.token);
          setTimeout(() => {
            common_vendor.index.navigateTo({ url: "/pages/index/index" });
          }, 1500);
        } else {
          errorTip.value = res.msg || "注册失败，请重试";
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/register/index.vue:100", "注册失败:", error);
        errorTip.value = error.message || "注册失败，请重试";
      } finally {
        isLoading.value = false;
      }
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: common_vendor.t(isLoading.value ? "注册中..." : "微信一键注册"),
        c: common_vendor.o(handleWeChatRegister),
        d: !agreement.value || isLoading.value,
        e: isLoading.value ? 1 : "",
        f: agreement.value,
        g: common_vendor.o(handleAgreementChange),
        h: common_vendor.o((...args) => _ctx.goToPrivacyPolicy && _ctx.goToPrivacyPolicy(...args)),
        i: common_vendor.o((...args) => _ctx.goToUserAgreement && _ctx.goToUserAgreement(...args)),
        j: errorTip.value
      }, errorTip.value ? {
        k: common_vendor.t(errorTip.value)
      } : {}, {
        l: common_vendor.o((...args) => _ctx.goToLogin && _ctx.goToLogin(...args))
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-46a64346"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/index.js.map
