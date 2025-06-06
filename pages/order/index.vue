<template>
  <view class="order-page">
    <!-- 订单列表 -->
    <view class="order-list">
      <!-- 空订单提示 -->
      <view v-if="orderList.length === 0" class="empty-order">
        <text class="empty-tip">暂无订单记录</text>
        <navigator url="/pages/index/index" class="go-shopping-btn">去点餐</navigator>
      </view>

      <!-- 订单项 -->
      <view 
        class="order-item"
        v-for="order in orderList"
        :key="order.orderId"
        @click="goToDetail(order.orderId)"
      >
        <view class="order-header">
          <text class="order-id">订单号: {{ order.orderId }}</text>
          <text class="order-status" :style="{color: getStatusColor(order.status)}">
            {{ getStatusText(order.status) }}
          </text>
        </view>

        <view class="order-content">
          <!-- 菜品列表 -->
          <view 
            class="dish-item"
            v-for="item in order.items"
            :key="item.id"
          >
            <text class="dish-name">{{ item.name }}</text>
            <text class="dish-quantity">×{{ item.quantity }}</text>
            <text class="dish-price">¥{{ (item.price * item.quantity).toFixed(2) }}</text>
          </view>
        </view>

        <view class="order-footer">
          <text class="total-price">总价: ¥{{ order.totalPrice.toFixed(2) }}</text>
          <text class="order-time">{{ formatTime(order.createTime) }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getOrderList } from '@/api/order';

export default {
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
        const res = await getOrderList();
        if (res.code === 200) {
          this.orderList = res.data;
        }
      } catch (error) {
        console.error('获取订单列表失败:', error);
        uni.showToast({ title: '获取订单失败', icon: 'none' });
      }
    },

    getStatusText(status) {
      const statusMap = {
        0: '待接单',
        1: '待派送',
        2: '派送中',
        3: '已完成',
        4: '已取消'
      };
      return statusMap[status] || '未知状态';
    },

    getStatusColor(status) {
      const colorMap = {
        0: '#FF9900', // 待接单 - 橙色
        1: '#0099FF', // 待派送 - 蓝色
        2: '#339933', // 派送中 - 绿色
        3: '#999999', // 已完成 - 灰色
        4: '#FF3333'  // 已取消 - 红色
      };
      return colorMap[status] || '#666666';
    },

    formatTime(timeStr) {
      if (!timeStr) return '';
      const date = new Date(timeStr);
      return `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    },

    goToDetail(orderId) {
      uni.navigateTo({
        url: `/pages/order/detail?id=${orderId}`
      });
    }
  }
};
</script>

<style scoped>
.order-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 10px;
}

.empty-order {
  height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-tip {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.go-shopping-btn {
  padding: 8px 24px;
  background-color: #ff6600;
  color: #fff;
  border-radius: 20px;
  text-decoration: none;
}

.order-list {
  margin-bottom: 20px;
}

.order-item {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 12px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.order-id {
  font-size: 14px;
  color: #666;
}

.order-status {
  font-size: 14px;
  font-weight: bold;
}

.order-content {
  padding: 10px 0;
}

.dish-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
}

.dish-name {
  flex: 2;
  color: #333;
}

.dish-quantity {
  flex: 1;
  text-align: center;
  color: #666;
}

.dish-price {
  flex: 1;
  text-align: right;
  color: #333;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  font-size: 14px;
}

.total-price {
  color: #ff3300;
  font-weight: bold;
}

.order-time {
  color: #999;
}
</style>
