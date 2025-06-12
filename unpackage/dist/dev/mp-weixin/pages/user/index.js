"use strict";
const common_vendor = require("../../common/vendor.js");
const api_user = require("../../api/user.js");
const _sfc_main = {
  data() {
    return {
      userInfo: {
        avatar: common_vendor.index.getStorageSync("avatar"),
        nickName: common_vendor.index.getStorageSync("nickName"),
        phone: common_vendor.index.getStorageSync("phone"),
        address: common_vendor.index.getStorageSync("address")
      },
      showEditModal: false,
      editField: "",
      editTitle: "",
      editValue: "",
      tempAvatar: "",
      fieldLabels: {
        nickName: "昵称",
        phone: "手机号",
        address: "收货地址"
      },
      fieldPlaceholders: {
        nickName: "请输入昵称（2-10字）",
        phone: "请输入11位手机号",
        address: "请输入详细收货地址"
      }
    };
  },
  onLoad() {
    this.fetchUserInfo();
  },
  methods: {
    // 获取用户信息
    fetchUserInfo() {
      api_user.getUserInfo().then((res) => {
        if (res.code === 200) {
          this.userInfo = res.data;
        } else {
          common_vendor.index.showToast({ title: res.msg || "获取用户信息失败", icon: "none" });
        }
      });
    },
    // 打开编辑模态框
    openEditModal(field) {
      this.editField = field;
      this.editTitle = this.fieldLabels[field] || "编辑信息";
      this.editValue = this.userInfo[field] || "";
      this.tempAvatar = "";
      this.showEditModal = true;
    },
    // 选择头像
    chooseAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          this.tempAvatar = res.tempFilePaths[0];
          this.editValue = this.tempAvatar;
          api_user.uploadAvatar(res.tempFilePaths[0]).then((uploadRes) => {
            if (uploadRes.code === 200) {
              this.editValue = uploadRes.data.avatarUrl;
            }
          });
        }
      });
    },
    // 确认编辑
    confirmEdit() {
      if (this.editField === "nickName") {
        if (!this.editValue || this.editValue.length < 2 || this.editValue.length > 10) {
          common_vendor.index.showToast({ title: "昵称长度需在2-10字之间", icon: "none" });
          return;
        }
      } else if (this.editField === "phone") {
        if (!this.editValue || !/^1[3-9]\\d{9}$/.test(this.editValue)) {
          common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
          return;
        }
      } else if (this.editField === "address") {
        if (!this.editValue || this.editValue.length < 10) {
          common_vendor.index.showToast({ title: "地址需至少10个字", icon: "none" });
          return;
        }
      }
      const updateData = {
        [this.editField]: this.editValue
      };
      api_user.updateUserInfo(updateData).then((res) => {
        if (res.code === 200) {
          common_vendor.index.showToast({ title: "修改成功", icon: "success" });
          this.closeEditModal();
          this.fetchUserInfo();
        } else {
          common_vendor.index.showToast({ title: res.msg || "修改失败", icon: "none" });
        }
      });
    },
    // 关闭编辑模态框
    closeEditModal() {
      this.showEditModal = false;
      this.tempAvatar = "";
    },
    // 前往订单列表
    goToOrderList() {
      common_vendor.index.navigateTo({
        url: "/pages/order/index"
      });
    },
    // 退出登录
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            api_user.logout().then((logoutRes) => {
              common_vendor.index.showToast({ title: logoutRes.msg || "退出成功", icon: "success" });
              common_vendor.index.reLaunch({
                url: "/pages/login/index"
              });
            });
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar || "/static/logo.png",
    b: common_vendor.o(($event) => $options.openEditModal("avatar")),
    c: common_vendor.t($data.userInfo.nickName || "未设置昵称"),
    d: common_vendor.o(($event) => $options.openEditModal("nickName")),
    e: common_vendor.t($data.userInfo.phone || "点击设置手机号"),
    f: common_vendor.o(($event) => $options.openEditModal("phone")),
    g: common_vendor.t($data.userInfo.address || "未设置"),
    h: common_vendor.o(($event) => $options.openEditModal("address")),
    i: common_vendor.o((...args) => $options.goToOrderList && $options.goToOrderList(...args)),
    j: $data.showEditModal
  }, $data.showEditModal ? common_vendor.e({
    k: common_vendor.o((...args) => $options.closeEditModal && $options.closeEditModal(...args)),
    l: common_vendor.t($data.editTitle),
    m: common_vendor.o((...args) => $options.closeEditModal && $options.closeEditModal(...args)),
    n: $data.editField === "avatar"
  }, $data.editField === "avatar" ? {
    o: $data.tempAvatar || $data.userInfo.avatar,
    p: common_vendor.o((...args) => $options.chooseAvatar && $options.chooseAvatar(...args))
  } : ["nickName", "phone", "address"].includes($data.editField) ? {
    r: common_vendor.t($data.fieldLabels[$data.editField]),
    s: $data.fieldPlaceholders[$data.editField],
    t: $data.editField === "phone" ? "number" : "text",
    v: $data.editValue,
    w: common_vendor.o(($event) => $data.editValue = $event.detail.value)
  } : {}, {
    q: ["nickName", "phone", "address"].includes($data.editField),
    x: common_vendor.o((...args) => $options.closeEditModal && $options.closeEditModal(...args)),
    y: common_vendor.o((...args) => $options.confirmEdit && $options.confirmEdit(...args))
  }) : {}, {
    z: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/index.js.map
