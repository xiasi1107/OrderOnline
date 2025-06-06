"use strict";
const common_vendor = require("../../common/vendor.js");
const api_order = require("../../api/order.js");
const _sfc_main = {
  data() {
    return {
      orderDetail: {},
      logisticsSteps: [],
      currentStep: 0,
      showActions: false
    };
  },
  onLoad(options) {
    this.fetchOrderDetail(options.id);
    this.initLogistics();
  },
  methods: {
    async fetchOrderDetail(orderId) {
      try {
        const res = await api_order.getOrderDetail(orderId);
        if (res.code === 200) {
          this.orderDetail = res.data;
          this.showActions = true;
          this.setCurrentStep();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order/detail.vue:111", "获取订单详情失败:", error);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      }
    },
    initLogistics() {
      this.logisticsSteps = [
        { time: "2025-06-06 12:00", desc: "商家已接单" },
        { time: "2025-06-06 12:15", desc: "正在准备食材" },
        { time: "2025-06-06 12:30", desc: "已交由骑手配送" },
        { time: "2025-06-06 13:00", desc: "订单已送达" }
      ];
    },
    setCurrentStep() {
      this.currentStep = Math.min(this.orderDetail.status, this.logisticsSteps.length - 1);
    },
    cancelOrder() {
      common_vendor.index.showModal({
        title: "确认取消",
        content: "是否确认取消该订单？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({ title: "订单已取消", icon: "none" });
            this.orderDetail.status = 4;
          }
        }
      });
    },
    confirmReceipt() {
      common_vendor.index.showToast({ title: "订单已完成", icon: "none" });
      this.orderDetail.status = 3;
    },
    // 直接返回状态文本（不使用映射）
    getStatusText(status) {
      if (status === 0)
        return "待接单";
      if (status === 1)
        return "待派送";
      if (status === 2)
        return "派送中";
      if (status === 3)
        return "已完成";
      if (status === 4)
        return "已取消";
      return "未知状态";
    },
    getStatusColor(status) {
      if (status === 0)
        return "#FF9900";
      if (status === 1)
        return "#0099FF";
      if (status === 2)
        return "#339933";
      if (status === 3)
        return "#999999";
      if (status === 4)
        return "#FF3333";
      return "#666666";
    },
    formatTime(timeStr) {
      if (!timeStr)
        return "";
      const date = new Date(timeStr.replace(/-/g, "/"));
      if (isNaN(date.getTime())) {
        return timeStr;
      }
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  var _a, _b, _c;
  return common_vendor.e({
    a: !$data.orderDetail.orderId
  }, !$data.orderDetail.orderId ? {} : common_vendor.e({
    b: common_vendor.t($data.orderDetail.orderId),
    c: common_vendor.t($options.getStatusText($data.orderDetail.status)),
    d: $options.getStatusColor($data.orderDetail.status),
    e: common_vendor.t($options.formatTime($data.orderDetail.createTime)),
    f: common_vendor.f($data.orderDetail.items, (item, k0, i0) => {
      return {
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.price ? item.price.toFixed(2) : "0.00"),
        c: common_vendor.t(item.quantity),
        d: common_vendor.t((item.price && item.quantity ? item.price * item.quantity : 0).toFixed(2)),
        e: item.id
      };
    }),
    g: common_vendor.t($data.orderDetail.totalPrice ? $data.orderDetail.totalPrice.toFixed(2) : "0.00"),
    h: common_vendor.t(((_a = $data.orderDetail.contact) == null ? void 0 : _a.name) || "未填写"),
    i: common_vendor.t(((_b = $data.orderDetail.contact) == null ? void 0 : _b.phone) || "未填写"),
    j: common_vendor.t(((_c = $data.orderDetail.contact) == null ? void 0 : _c.address) || "未填写"),
    k: common_vendor.f($data.logisticsSteps, (step, index, i0) => {
      return {
        a: index <= $data.currentStep ? 1 : "",
        b: common_vendor.t(step.time),
        c: common_vendor.t(step.desc),
        d: index
      };
    }),
    l: $data.showActions
  }, $data.showActions ? common_vendor.e({
    m: $data.orderDetail.status === 0
  }, $data.orderDetail.status === 0 ? {
    n: common_vendor.o((...args) => $options.cancelOrder && $options.cancelOrder(...args))
  } : {}, {
    o: $data.orderDetail.status === 3
  }, $data.orderDetail.status === 3 ? {
    p: common_vendor.o((...args) => $options.confirmReceipt && $options.confirmReceipt(...args))
  } : {}) : {}));
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-6b23c96c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/detail.js.map
