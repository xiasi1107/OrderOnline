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
    const phone = common_vendor.ref("");
    const password = common_vendor.ref("");
    const handleAgreementChange = (e) => {
      agreement.value = e.detail.value.length > 0;
      errorTip.value = "";
    };
    const handleWeChatLogin = async () => {
      if (!validateAgreement())
        return;
      isLoading.value = true;
      try {
        const { code } = await common_vendor.index.login({ provider: "weixin" });
        const res = await api_login.loginByWeChat(code);
        handleLoginResult(res);
      } catch (error) {
        handleLoginError(error);
      } finally {
        isLoading.value = false;
      }
    };
    const handlePhoneLogin = async () => {
      if (!validateAgreement())
        return;
      if (!validatePhone())
        return;
      isLoading.value = true;
      try {
        const res = await api_login.loginByPhone({
          phone: phone.value,
          password: password.value
        });
        handleLoginResult(res);
      } catch (error) {
        handleLoginError(error);
      } finally {
        isLoading.value = false;
      }
    };
    const validateAgreement = () => {
      if (!agreement.value) {
        errorTip.value = "请勾选同意隐私政策和用户协议";
        return false;
      }
      return true;
    };
    const validatePhone = () => {
      if (!phone.value) {
        errorTip.value = "请输入手机号";
        return false;
      }
      if (!/^1[3-9]\d{9}$/.test(phone.value)) {
        errorTip.value = "请输入正确的手机号";
        return false;
      }
      if (!password.value) {
        errorTip.value = "请输入密码";
        return false;
      }
      return true;
    };
    const handleLoginResult = (res) => {
      if (res.code === 200) {
        common_vendor.index.showToast({ title: "登录成功", icon: "success" });
        common_vendor.index.navigateTo({ url: "/pages/index/index" });
      } else {
        errorTip.value = res.msg || "登录失败，请重试";
      }
    };
    const handleLoginError = (error) => {
      common_vendor.index.__f__("error", "at pages/login/index.vue:174", "登录失败:", error);
      errorTip.value = error.message || "登录失败，请重试";
    };
    const goToRegister = () => {
      common_vendor.index.navigateTo({ url: "/pages/register/index" });
    };
    const goToPrivacyPolicy = () => {
      common_vendor.index.navigateTo({ url: "/pages/privacyPolicy/index" });
    };
    const goToUserAgreement = () => {
      common_vendor.index.navigateTo({ url: "/pages/userAgreement/index" });
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0,
        b: phone.value,
        c: common_vendor.o(($event) => phone.value = $event.detail.value),
        d: password.value,
        e: common_vendor.o(($event) => password.value = $event.detail.value),
        f: common_vendor.o(handlePhoneLogin),
        g: !agreement.value || isLoading.value,
        h: common_vendor.t(isLoading.value ? "登录中..." : "微信一键注册/登录"),
        i: common_vendor.o(handleWeChatLogin),
        j: !agreement.value || isLoading.value,
        k: isLoading.value ? 1 : "",
        l: agreement.value,
        m: common_vendor.o(handleAgreementChange),
        n: common_vendor.o(goToPrivacyPolicy),
        o: common_vendor.o(goToUserAgreement),
        p: errorTip.value
      }, errorTip.value ? {
        q: common_vendor.t(errorTip.value)
      } : {}, {
        r: common_vendor.o(goToRegister)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-d08ef7d4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/index.js.map
