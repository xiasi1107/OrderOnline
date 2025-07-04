"use strict";
const common_vendor = require("../../common/vendor.js");
const api_menu = require("../../api/menu.js");
const api_cart = require("../../api/cart.js");
const _sfc_main = {
  data() {
    return {
      categories: [],
      dishList: [],
      activeCategoryId: null,
      cartQuantities: {},
      // 存储购物车数量，键为菜品ID
      searchKeyword: "",
      // 搜索关键词
      debounceTimer: null
      // 防抖定时器
    };
  },
  computed: {
    filteredDishes() {
      let dishes = this.activeCategoryId === "all" ? this.dishList : this.dishList.filter((dish) => dish.categoryId === this.activeCategoryId);
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.trim().toLowerCase();
        return dishes.filter(
          (dish) => dish.name.toLowerCase().includes(keyword)
        );
      }
      return dishes;
    },
    currentDishes() {
      return this.filteredDishes;
    },
    currentCategory() {
      return this.categories.find((cat) => cat.id === this.activeCategoryId) || { name: "全部", icon: "🍱" };
    }
  },
  onLoad() {
    this.fetchInitialData();
  },
  methods: {
    async fetchInitialData() {
      await Promise.all([
        this.fetchCategories(),
        this.fetchDishList(),
        this.fetchCartList()
        // 新增购物车数据获取
      ]);
    },
    async fetchCategories() {
      try {
        const { data } = await api_menu.getCategories();
        this.categories = data;
        this.activeCategoryId = "all";
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:187", "获取分类失败:", error);
      }
    },
    async fetchDishList() {
      try {
        const { data } = await api_menu.getDishList();
        this.dishList = data;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:196", "获取菜品失败:", error);
      }
    },
    async fetchCartList() {
      try {
        const res = await api_cart.getCartList();
        if (res.code === 200) {
          this.cartQuantities = res.data.reduce((acc, item) => {
            acc[item.id] = item.quantity;
            return acc;
          }, {});
        } else {
          this.cartQuantities = {};
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:213", "获取购物车失败:", error);
        this.cartQuantities = {};
      }
    },
    switchCategory(category) {
      this.activeCategoryId = category.id;
      this.searchKeyword = "";
      common_vendor.index.pageScrollTo({ scrollTop: 0, duration: 300 });
    },
    // 搜索相关方法
    debounceSearch() {
      if (this.debounceTimer)
        clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.handleSearch();
      }, 300);
    },
    handleSearch() {
      common_vendor.index.pageScrollTo({ scrollTop: 0, duration: 300 });
    },
    clearSearch() {
      this.searchKeyword = "";
    },
    async updateQuantity(dish, delta) {
      const newQuantity = Math.max(0, (this.cartQuantities[dish.id] || 0) + delta);
      try {
        await api_cart.updateCart(dish.id, newQuantity);
        let cartList = common_vendor.index.getStorageSync("cartList") || [];
        const existingIndex = cartList.findIndex((item) => item.id === dish.id);
        if (existingIndex !== -1) {
          newQuantity === 0 ? cartList.splice(existingIndex, 1) : cartList[existingIndex].quantity = newQuantity;
        } else if (newQuantity > 0) {
          cartList.push({ ...dish, quantity: newQuantity });
        }
        common_vendor.index.setStorageSync("cartList", cartList);
        this.cartQuantities[dish.id] = newQuantity;
        common_vendor.index.showToast({
          title: delta > 0 ? `已添加 ${dish.name}` : `已移除 ${dish.name}`,
          icon: "none",
          duration: 1e3
        });
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
  return common_vendor.e({
    a: common_vendor.f($data.categories, (category, index, i0) => {
      return {
        a: common_vendor.t(category.icon),
        b: common_vendor.t(category.name),
        c: index,
        d: $data.activeCategoryId === category.id ? 1 : "",
        e: common_vendor.o(($event) => $options.switchCategory(category), index)
      };
    }),
    b: common_vendor.o([($event) => $data.searchKeyword = $event.detail.value, (...args) => $options.debounceSearch && $options.debounceSearch(...args)]),
    c: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    d: $data.searchKeyword,
    e: $data.searchKeyword
  }, $data.searchKeyword ? {
    f: common_vendor.o((...args) => $options.clearSearch && $options.clearSearch(...args))
  } : {}, {
    g: common_vendor.t($options.currentCategory.name),
    h: common_vendor.t($options.filteredDishes.length),
    i: common_vendor.f($options.filteredDishes, (dish, index, i0) => {
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
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
