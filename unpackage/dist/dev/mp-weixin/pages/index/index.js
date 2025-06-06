"use strict";
const common_vendor = require("../../common/vendor.js");
const api_menu = require("../../api/menu.js");
const _sfc_main = {
  data() {
    return {
      categories: [],
      // 分类列表
      dishList: [],
      // 全部菜品
      activeCategoryId: null,
      // 当前选中的分类ID
      loading: false,
      error: null,
      cartQuantities: {}
      // 购物车中每个菜品的数量
    };
  },
  computed: {
    // 当前分类下的菜品
    currentDishes() {
      if (!this.activeCategoryId || this.activeCategoryId === "all") {
        return this.dishList;
      }
      return this.dishList.filter((dish) => dish.categoryId === this.activeCategoryId);
    },
    // 当前分类信息
    currentCategory() {
      if (!this.activeCategoryId || this.activeCategoryId === "all") {
        return { name: "全部", icon: "🍱" };
      }
      return this.categories.find((cat) => cat.id === this.activeCategoryId) || { name: "未知分类" };
    }
  },
  onLoad() {
    this.fetchCategories();
    this.fetchDishList();
    this.loadCart();
  },
  methods: {
    // 获取分类列表
    async fetchCategories() {
      try {
        const response = await api_menu.getCategories();
        this.categories = response.data || [];
        this.activeCategoryId = "all";
      } catch (error) {
        this.error = error.message || "获取分类失败";
        common_vendor.index.showToast({
          title: this.error,
          icon: "none"
        });
      }
    },
    // 获取菜品列表
    async fetchDishList() {
      this.loading = true;
      try {
        const response = await api_menu.getDishList();
        this.dishList = response.data || [];
      } catch (error) {
        this.error = error.message || "获取菜品失败";
        common_vendor.index.showToast({
          title: this.error,
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    // 加载购物车数据
    loadCart() {
      const cartList = common_vendor.index.getStorageSync("cartList") || [];
      this.cartQuantities = cartList.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});
    },
    // 切换分类
    switchCategory(category) {
      this.activeCategoryId = category.id;
      common_vendor.index.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
    // 更新购物车数量
    async updateQuantity(dish, delta) {
      const newQuantity = Math.max(0, (this.cartQuantities[dish.id] || 0) + delta);
      try {
        await api_menu.updateCart(dish.id, newQuantity);
        let cartList = common_vendor.index.getStorageSync("cartList") || [];
        const existingIndex = cartList.findIndex((item) => item.id === dish.id);
        if (existingIndex !== -1) {
          if (newQuantity === 0) {
            cartList.splice(existingIndex, 1);
          } else {
            cartList[existingIndex].quantity = newQuantity;
          }
        } else if (newQuantity > 0) {
          cartList.push({ ...dish, quantity: newQuantity });
        }
        common_vendor.index.setStorageSync("cartList", cartList);
        this.cartQuantities[dish.id] = newQuantity;
        if (delta > 0) {
          common_vendor.index.showToast({
            title: `已增加 ${dish.name}`,
            icon: "none",
            duration: 1e3
          });
        } else if (delta < 0) {
          common_vendor.index.showToast({
            title: `已减少 ${dish.name}`,
            icon: "none",
            duration: 1e3
          });
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: error.message || "操作失败",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.categories, (category, index, i0) => {
      return {
        a: common_vendor.t(category.icon),
        b: common_vendor.t(category.name),
        c: index,
        d: $data.activeCategoryId === category.id ? 1 : "",
        e: common_vendor.o(($event) => $options.switchCategory(category), index)
      };
    }),
    b: common_vendor.t($options.currentCategory.name),
    c: common_vendor.t($options.currentDishes.length),
    d: common_vendor.f($options.currentDishes, (dish, index, i0) => {
      return common_vendor.e({
        a: dish.image,
        b: dish.tags
      }, dish.tags ? {
        c: common_vendor.f(dish.tags, (tag, tagIndex, i1) => {
          return {
            a: common_vendor.t(tag),
            b: tagIndex
          };
        })
      } : {}, {
        d: common_vendor.t(dish.name),
        e: common_vendor.t(dish.desc),
        f: common_vendor.t(dish.price.toFixed(2)),
        g: common_vendor.o(($event) => $options.updateQuantity(dish, -1), index),
        h: $data.cartQuantities[dish.id] <= 0,
        i: common_vendor.t($data.cartQuantities[dish.id] || 0),
        j: common_vendor.o(($event) => $options.updateQuantity(dish, 1), index),
        k: index
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
