"use strict";
const common_vendor = require("../../common/vendor.js");
const api_cart = require("../../api/cart.js");
const api_order = require("../../api/order.js");
const _sfc_main = {
  data() {
    return {
      cartList: [],
      orderInfo: {
        contactName: "",
        phone: "",
        address: "",
        remark: ""
      }
    };
  },
  computed: {
    totalPrice() {
      return this.cartList.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }
  },
  onLoad() {
    this.fetchCartList();
  },
  methods: {
    async fetchCartList() {
      try {
        const res = await api_cart.getCartList();
        if (res.code === 200) {
          this.cartList = res.data;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/cart/index.vue:127", "获取购物车失败:", error);
      }
    },
    validateForm() {
      if (!this.orderInfo.contactName) {
        common_vendor.index.showToast({ title: "请输入联系人姓名", icon: "none" });
        return false;
      }
      if (!this.orderInfo.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return false;
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.orderInfo.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return false;
      }
      if (!this.orderInfo.address) {
        common_vendor.index.showToast({ title: "请输入收货地址", icon: "none" });
        return false;
      }
      return true;
    },
    async handleOrder() {
      if (this.cartList.length === 0) {
        common_vendor.index.showToast({ title: "购物车为空，无法下单", icon: "none" });
        return;
      }
      if (!this.validateForm()) {
        return;
      }
      try {
        const orderData = {
          items: this.cartList,
          totalPrice: this.totalPrice,
          contactName: this.orderInfo.contactName,
          phone: this.orderInfo.phone,
          address: this.orderInfo.address,
          remark: this.orderInfo.remark
        };
        const orderRes = await api_order.createOrder(orderData);
        if (orderRes.code === 200) {
          common_vendor.index.showModal({
            title: "下单成功",
            content: `订单号：${orderRes.data.orderId}
总价：¥${orderRes.data.totalPrice.toFixed(2)}`,
            confirmText: "查看订单",
            success: () => {
              common_vendor.index.navigateTo({
                url: `/pages/order/detail?id=${orderRes.data.orderId}`
              });
              this.cartList = [];
              this.orderInfo = {
                contactName: "",
                phone: "",
                address: "",
                remark: ""
              };
            }
          });
        } else {
          common_vendor.index.showToast({ title: orderRes.msg, icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/cart/index.vue:207", "下单失败:", error);
        common_vendor.index.showToast({ title: "下单失败，请重试", icon: "none" });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.cartList.length === 0
  }, $data.cartList.length === 0 ? {} : {
    b: common_vendor.f($data.cartList, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.price.toFixed(2)),
        c: common_vendor.t(item.quantity),
        d: common_vendor.t((item.price * item.quantity).toFixed(2)),
        e: item.id
      };
    }),
    c: $data.orderInfo.contactName,
    d: common_vendor.o(($event) => $data.orderInfo.contactName = $event.detail.value),
    e: $data.orderInfo.phone,
    f: common_vendor.o(($event) => $data.orderInfo.phone = $event.detail.value),
    g: $data.orderInfo.address,
    h: common_vendor.o(($event) => $data.orderInfo.address = $event.detail.value),
    i: $data.orderInfo.remark,
    j: common_vendor.o(($event) => $data.orderInfo.remark = $event.detail.value)
  }, {
    k: $data.cartList.length > 0
  }, $data.cartList.length > 0 ? {
    l: common_vendor.t($options.totalPrice.toFixed(2)),
    m: common_vendor.o((...args) => $options.handleOrder && $options.handleOrder(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8039fbf1"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/cart/index.js.map
