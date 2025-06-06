<template>
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
      <!-- 分类标题 -->
      <view class="category-title">
        <text class="title-text">{{ currentCategory.name }}</text>
        <text class="title-count">({{ currentDishes.length }}个菜品)</text>
      </view>

      <!-- 菜品列表 -->
      <view class="dish-list">
        <view 
          class="dish-item"
          v-for="(dish, index) in currentDishes" 
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
</template>

<script>
import { getDishList, getCategories, updateCart } from '@/api/menu'; // 引入API服务

export default {
  data() {
    return {
      categories: [], // 分类列表
      dishList: [],   // 全部菜品
      activeCategoryId: null, // 当前选中的分类ID
      loading: false,
      error: null,
      cartQuantities: {} // 购物车中每个菜品的数量
    };
  },
  
  computed: {
    // 当前分类下的菜品
    currentDishes() {
      if (!this.activeCategoryId || this.activeCategoryId === 'all') {
        return this.dishList; // 全部菜品
      }
      return this.dishList.filter(dish => dish.categoryId === this.activeCategoryId);
    },
    
    // 当前分类信息
    currentCategory() {
      if (!this.activeCategoryId || this.activeCategoryId === 'all') {
        return { name: '全部', icon: '🍱' };
      }
      return this.categories.find(cat => cat.id === this.activeCategoryId) || { name: '未知分类' };
    }
  },
  
  onLoad() {
    this.fetchCategories();
    this.fetchDishList();
    this.loadCart(); // 加载购物车数据
  },
  
  methods: {
    // 获取分类列表
    async fetchCategories() {
      try {
        const response = await getCategories();
        this.categories = response.data || [];
        // 默认选中全部菜品
        this.activeCategoryId = 'all';
      } catch (error) {
        this.error = error.message || '获取分类失败';
        uni.showToast({
          title: this.error,
          icon: 'none'
        });
      }
    },
    
    // 获取菜品列表
    async fetchDishList() {
      this.loading = true;
      try {
        const response = await getDishList();
        this.dishList = response.data || [];
      } catch (error) {
        this.error = error.message || '获取菜品失败';
        uni.showToast({
          title: this.error,
          icon: 'none'
        });
      } finally {
        this.loading = false;
      }
    },
    
    // 加载购物车数据
    loadCart() {
      const cartList = uni.getStorageSync("cartList") || [];
      this.cartQuantities = cartList.reduce((acc, item) => {
        acc[item.id] = item.quantity;
        return acc;
      }, {});
    },
    
    // 切换分类
    switchCategory(category) {
      this.activeCategoryId = category.id;
      // 添加切换动画效果
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      });
    },
    
    // 更新购物车数量
    async updateQuantity(dish, delta) {
      const newQuantity = Math.max(0, (this.cartQuantities[dish.id] || 0) + delta);
      
      try {
        await updateCart(dish.id, newQuantity); // 调用API更新购物车
        
        // 更新本地购物车状态
        let cartList = uni.getStorageSync("cartList") || [];
        const existingIndex = cartList.findIndex(item => item.id === dish.id);
        
        if (existingIndex !== -1) {
          if (newQuantity === 0) {
            cartList.splice(existingIndex, 1); // 从购物车移除
          } else {
            cartList[existingIndex].quantity = newQuantity;
          }
        } else if (newQuantity > 0) {
          cartList.push({ ...dish, quantity: newQuantity });
        }
        
        uni.setStorageSync("cartList", cartList);
        this.cartQuantities[dish.id] = newQuantity;
        
        // 显示提示
        if (delta > 0) {
          uni.showToast({
            title: `已增加 ${dish.name}`,
            icon: 'none',
            duration: 1000
          });
        } else if (delta < 0) {
          uni.showToast({
            title: `已减少 ${dish.name}`,
            icon: 'none',
            duration: 1000
          });
        }
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