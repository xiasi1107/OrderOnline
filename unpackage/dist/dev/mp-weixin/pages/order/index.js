"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const _sfc_main = {
  data() {
    return {
      orderList: []
    };
  },
  onLoad() {
    this.fetchOrderList();
  },
  methods: {
    async fetchOrderList() {
      try {
        const res = await api_order.getOrderList();
        if (res.code === 200) {
          this.orderList = res.data;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order/index.vue:69", "获取订单列表失败:", error);
        common_vendor.index.showToast({ title: "获取订单失败", icon: "none" });
      }
    },
    getStatusText(status) {
      const statusMap = {
        0: "待接单",
        1: "待派送",
        2: "派送中",
        3: "已完成",
        4: "已取消"
      };
      return statusMap[status] || "未知状态";
    },
    getStatusColor(status) {
      const colorMap = {
        0: "#FF9900",
        // 待接单 - 橙色
        1: "#0099FF",
        // 待派送 - 蓝色
        2: "#339933",
        // 派送中 - 绿色
        3: "#999999",
        // 已完成 - 灰色
        4: "#FF3333"
        // 已取消 - 红色
      };
      return colorMap[status] || "#666666";
    },
    formatTime(timeStr) {
      if (!timeStr)
        return "";
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    },
    goToDetail(orderId) {
      common_vendor.index.navigateTo({
        url: `/pages/order/detail?id=${orderId}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.orderList.length === 0
  }, $data.orderList.length === 0 ? {} : {}, {
    b: common_vendor.f($data.orderList, (order, k0, i0) => {
      return {
        a: common_vendor.t(order.orderId),
        b: common_vendor.t($options.getStatusText(order.status)),
        c: $options.getStatusColor(order.status),
        d: common_vendor.f(order.items, (item, k1, i1) => {
          return {
            a: common_vendor.t(item.name),
            b: common_vendor.t(item.quantity),
            c: common_vendor.t((item.price * item.quantity).toFixed(2)),
            d: item.id
          };
        }),
        e: common_vendor.t(order.totalPrice.toFixed(2)),
        f: common_vendor.t($options.formatTime(order.createTime)),
        g: order.orderId,
        h: common_vendor.o(($event) => $options.goToDetail(order.orderId), order.orderId)
      };
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-17a44f9d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/index.js.map
