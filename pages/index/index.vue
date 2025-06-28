<template>
<view class="page-container">
<!-- 菜单内容区域 -->
 <view class="menu-container">
    <!-- 侧边栏分类导航 -->
    <view class="sidebar">
      <view class="sidebar-header">美食分类</view>
      <view 
        class="category-item"
        v-for="(category, index) in categories" 
        :key="index"
        :class="{ 'active': activeCategoryId === category.id }"
        @click="switchCategory(category)"
      >
        <text class="category-icon">{{ category.icon }}</text>
        <text class="category-name">{{ category.name }}</text>
      </view>
    </view>

    <!-- 主内容区域 -->
    <view class="main-content">
      <!-- 搜索栏 -->
      <view class="search-container">
        <view class="search-box">
          <icon type="search" size="16" color="#999"></icon>
          <input 
            class="search-input" 
            v-model="searchKeyword" 
            placeholder="搜索菜品名称" 
            @input="debounceSearch"
            @confirm="handleSearch"
          >
        </view>
        <view v-if="searchKeyword" class="clear-search" @click="clearSearch">
          <text>×</text>
        </view>
      </view>
      
      <!-- 分类标题 -->
      <view class="category-title">
        <text class="title-text">{{ currentCategory.name }}</text>
        <text class="title-count">({{ filteredDishes.length }}个菜品)</text>
      </view>

      <!-- 菜品列表 -->
      <view class="dish-list">
        <view 
          class="dish-item"
          v-for="(dish, index) in filteredDishes" 
          :key="index"
        >
          <!-- 菜品图片 -->
          <view class="dish-image-container">
            <image 
              class="dish-image" 
              :src="dish.image" 
              mode="aspectFill"
            ></image>
            <!-- 菜品标签 -->
            <view v-if="dish.tags" class="dish-tags">
              <view 
                class="dish-tag"
                v-for="(tag, tagIndex) in dish.tags"
                :key="tagIndex"
              >
                {{ tag }}
              </view>
            </view>
          </view>
          
          <!-- 菜品信息区域 -->
          <view class="dish-info">
            <view class="dish-name-rating">
              <view class="dish-name">{{ dish.name }}</view>
            </view>
            <view class="dish-desc">{{ dish.desc }}</view>
            <view class="dish-price-add">
              <view class="dish-price">¥{{ dish.price.toFixed(2) }}</view>
              
              <!-- 数量控制组件（初始数量为0） -->
              <view class="quantity-control">
                <!-- 初始为0时，-按钮禁用 -->
                <button 
                  class="quantity-btn minus" 
                  @click="updateQuantity(dish, -1)" 
                  :disabled="cartQuantities[dish.id] <= 0"
                >
                  -
                </button>
                <view class="quantity-value">{{ cartQuantities[dish.id] || 0 }}</view>
                <button class="quantity-btn plus" @click="updateQuantity(dish, 1)">
                  +
                </button>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>

    <!-- 底部导航栏 -->
    <view class="tabbar">
      <navigator url="/pages/index/index" class="tabbar-item">
        <text class="tabbar-icon">🍱</text>
        <text class="tabbar-text">首页</text>
      </navigator>
      <navigator url="/pages/order/index" class="tabbar-item">
        <text class="tabbar-icon">📦</text>
        <text class="tabbar-text">订单</text>
      </navigator>
      <navigator url="/pages/cart/index" class="tabbar-item">
        <text class="tabbar-icon">🛒</text>
        <text class="tabbar-text">购物车</text>
      </navigator>
      <navigator url="/pages/user/index" class="tabbar-item">
        <text class="tabbar-icon">👤</text>
        <text class="tabbar-text">我的</text>
      </navigator>
    </view>
</view>
</template>

<script>
import { getDishList, getCategories } from '@/api/menu';
import { getCartList, updateCart } from '@/api/cart';

export default {
  data() {
    return {
      categories: [],
      dishList: [],
      activeCategoryId: null,
      cartQuantities: {}, // 存储购物车数量，键为菜品ID
      searchKeyword: '', // 搜索关键词
      debounceTimer: null // 防抖定时器
    };
  },
  
  computed: {
    filteredDishes() {
      // 先应用分类筛选，再应用搜索筛选
      let dishes = this.activeCategoryId === 'all' 
        ? this.dishList 
        : this.dishList.filter(dish => dish.categoryId === this.activeCategoryId);
      
      // 如果有搜索关键词，进行模糊搜索
      if (this.searchKeyword.trim()) {
        const keyword = this.searchKeyword.trim().toLowerCase();
        return dishes.filter(dish => 
          dish.name.toLowerCase().includes(keyword)
        );
      }
      
      return dishes;
    },
    
    currentDishes() {
      return this.filteredDishes;
    },
    
    currentCategory() {
      return this.categories.find(cat => cat.id === this.activeCategoryId) || { name: '全部', icon: '🍱' };
    }
  },
  
  onLoad() {
    this.fetchInitialData();
  },
  
  methods: {
    async fetchInitialData() {
      // 并行获取分类和菜品数据
      await Promise.all([
        this.fetchCategories(),
        this.fetchDishList(),
        this.fetchCartList() // 新增购物车数据获取
      ]);
    },

    async fetchCategories() {
      try {
        const { data } = await getCategories();
        this.categories = data;
        this.activeCategoryId = 'all'; // 默认显示全部分类
      } catch (error) {
        console.error('获取分类失败:', error);
      }
    },
    
    async fetchDishList() {
      try {
        const { data } = await getDishList();
        this.dishList = data;
      } catch (error) {
        console.error('获取菜品失败:', error);
      }
    },
    
    async fetchCartList() {
      try {
        const res = await getCartList();
        if (res.code === 200) {
          // 转换购物车数据为 {id: quantity} 格式
          this.cartQuantities = res.data.reduce((acc, item) => {
            acc[item.id] = item.quantity;
            return acc;
          }, {});
        } else {
          this.cartQuantities = {}; // 接口失败时清空
        }
      } catch (error) {
        console.error('获取购物车失败:', error);
        this.cartQuantities = {}; // 异常时重置
      }
    },
    
    switchCategory(category) {
      this.activeCategoryId = category.id;
      this.searchKeyword = ''; // 切换分类时清空搜索
      uni.pageScrollTo({ scrollTop: 0, duration: 300 });
    },
    
    // 搜索相关方法
    debounceSearch() {
      // 防抖处理，避免频繁搜索
      if (this.debounceTimer) clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.handleSearch();
      }, 300);
    },
    
    handleSearch() {
      // 搜索逻辑
      uni.pageScrollTo({ scrollTop: 0, duration: 300 });
    },
    
    clearSearch() {
      // 清空搜索框
      this.searchKeyword = '';
    },
    
    async updateQuantity(dish, delta) {
      const newQuantity = Math.max(0, (this.cartQuantities[dish.id] || 0) + delta);
      
      try {
        await updateCart(dish.id, newQuantity); // 调用更新接口
        
        // 更新本地存储
        let cartList = uni.getStorageSync("cartList") || [];
        const existingIndex = cartList.findIndex(item => item.id === dish.id);
        
        if (existingIndex !== -1) {
          newQuantity === 0 
            ? cartList.splice(existingIndex, 1) 
            : cartList[existingIndex].quantity = newQuantity;
        } else if (newQuantity > 0) {
          cartList.push({ ...dish, quantity: newQuantity });
        }
        
        uni.setStorageSync("cartList", cartList);
        this.cartQuantities[dish.id] = newQuantity; // 更新响应式数据
        
        uni.showToast({
          title: delta > 0 ? `已添加 ${dish.name}` : `已移除 ${dish.name}`,
          icon: 'none',
          duration: 1000
        });
      } catch (error) {
        uni.showToast({
          title: error.message || '操作失败',
          icon: 'none'
        });
      }
    }
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* 确保容器占满视口 */
}
/* 整体布局 */
.menu-container {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏样式 */
.sidebar {
  width: 20%;
  min-width: 120px;
  max-width: 160px;
  background-color: #ffffff;
  border-right: 1px solid #e6e6e6;
  overflow-y: auto;
}

.sidebar-header {
  padding: 16px 12px;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  color: #333333;
  border-bottom: 1px solid #e6e6e6;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-item.active {
  background-color: #fff0e6;
  color: #ff6600;
  font-weight: bold;
  border-right: 3px solid #ff6600;
}

.category-item:not(.active):hover {
  background-color: #f5f5f5;
}

.category-icon {
  margin-right: 8px;
  font-size: 16px;
}

.category-name {
  font-size: 14px;
}

/* 主内容区域样式 */
.main-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background-color: #f9f9f9;
}

/* 搜索栏样式 */
.search-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #fff;
  border-radius: 18px;
  padding: 8px 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}

.search-box icon {
  margin-right: 8px;
}

.search-input {
  flex: 1;
  height: 32px;
  font-size: 14px;
  border: none;
  outline: none;
}

.clear-search {
  position: absolute;
  right: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #f5f5f5;
  color: #666;
  font-size: 12px;
  cursor: pointer;
}

.clear-search:hover {
  background-color: #e6e6e6;
}

.category-title {
  margin-bottom: 16px;
}

.title-text {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
}

.title-count {
  font-size: 14px;
  color: #666666;
  margin-left: 8px;
}

.dish-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.dish-item {
  width: 100%;
  max-width: 300px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s;
}

.dish-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

.dish-image-container {
  position: relative;
  height: 180px;
}

.dish-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dish-tags {
  position: absolute;
  top: 8px;
  left: 8px;
  display: flex;
  gap: 4px;
}

.dish-tag {
  background-color: #ff6600;
  color: #ffffff;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
}

.dish-info {
  padding: 12px;
}

.dish-name {
  font-size: 16px;
  font-weight: bold;
  color: #333333;
}

.dish-desc {
  font-size: 12px;
  color: #666666;
  line-height: 1.5;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.dish-price-add {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dish-price {
  font-size: 16px;
  font-weight: bold;
  color: #ff3300;
}

.add-cart-btn {
  background-color: #ff9900;
  color: #ffffff;
  border: none;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.add-cart-btn:hover {
  background-color: #ff6600;
}

.add-cart-btn text:first-child {
  margin-right: 4px;
}

/* 数量控制组件 */
.quantity-control {
  display: flex;
  align-items: center;
}

.quantity-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #ff9900;
  color: #ffffff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.quantity-btn:hover {
  background-color: #ff6600;
}

.quantity-btn.minus {
  background-color: #e6e6e6;
  color: #666666;
}

.quantity-btn.minus:hover {
  background-color: #d9d9d9;
}

.quantity-value {
  width: 24px;
  text-align: center;
  font-size: 14px;
  color: #333333;
}

/* 底部导航栏样式 */
.tabbar {
  position: fixed; /* 固定定位 */
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000; /* 层级高于内容区域 */
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 50px;
  border-top: 1px solid #eee;
  background-color: white;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.tabbar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #333;
  text-decoration: none;
}

.tabbar-item:active {
  color: #ff6600;
}

.tabbar-icon {
  font-size: 20px;
}

.tabbar-text {
  font-size: 12px;
  margin-top: 2px;
}

/* 响应式布局 */
@media (min-width: 640px) {
  .dish-list {
    gap: 20px;
  }
  
  .dish-item {
    width: calc(50% - 10px);
  }
}

@media (min-width: 1024px) {
  .dish-item {
    width: calc(33.333% - 13.333px);
  }
}
</style>