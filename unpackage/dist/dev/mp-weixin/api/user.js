"use strict";
const common_vendor = require("../common/vendor.js");
const getUserInfo = () => {
  return new Promise((resolve) => {
    const userInfo = {
      avatar: common_vendor.index.getStorageSync("avatar") || "/static/logo.png",
      nickName: common_vendor.index.getStorageSync("nickName") || "用户" + Math.floor(Math.random() * 1e4),
      phone: common_vendor.index.getStorageSync("phone") || "",
      address: common_vendor.index.getStorageSync("address") || ""
    };
    setTimeout(() => {
      resolve({
        code: 200,
        data: userInfo,
        msg: "获取成功"
      });
    }, 300);
  });
};
const updateUserInfo = (userData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (userData.avatar)
        common_vendor.index.setStorageSync("avatar", userData.avatar);
      if (userData.nickName)
        common_vendor.index.setStorageSync("nickName", userData.nickName);
      if (userData.phone)
        common_vendor.index.setStorageSync("phone", userData.phone);
      if (userData.address)
        common_vendor.index.setStorageSync("address", userData.address);
      resolve({
        code: 200,
        data: {
          ...userData,
          updateTime: (/* @__PURE__ */ new Date()).toISOString()
        },
        msg: "更新成功"
      });
    }, 500);
  });
};
const logout = () => {
  return new Promise((resolve) => {
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("avatar");
    common_vendor.index.removeStorageSync("nickName");
    common_vendor.index.removeStorageSync("phone");
    common_vendor.index.removeStorageSync("address");
    resolve({
      code: 200,
      msg: "退出成功"
    });
  });
};
const uploadAvatar = (filePath) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const avatarUrl = `/static/logo.png`;
      resolve({
        code: 200,
        data: {
          avatarUrl
        },
        msg: "上传成功"
      });
    }, 800);
  });
};
exports.getUserInfo = getUserInfo;
exports.logout = logout;
exports.updateUserInfo = updateUserInfo;
exports.uploadAvatar = uploadAvatar;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/user.js.map
