<template>
  <view class="order-detail-page">
	<view v-if="!orderDetail.orderId" class="loading">
	     <text>加载中...</text>
	    </view>  
		<view v-else>
    <!-- 订单头部信息 -->
    <view class="order-header">
      <view class="order-info">
        <text class="order-id">订单号：{{ orderDetail.orderId }}</text>
        <text class="order-status" :style="{ color: getStatusColor(orderDetail.status) }">
          {{ getStatusText(orderDetail.status) }}
        </text>
      </view>

      <view class="order-time">{{ formatTime(orderDetail.createTime) }}</view>
    </view>

    <!-- 订单内容 -->
    <view class="order-content">
      <!-- 商品列表 -->
      <view class="dish-list">
        <view 
          class="dish-item"
          v-for="item in orderDetail.items"
          :key="item.id"
        >
          <view class="dish-info">
            <text class="dish-name">{{ item.name }}</text>
            <text class="dish-price"> 单价:¥{{ item.price ? item.price.toFixed(2) : '0.00' }}</text>
            <text class="dish-quantity"> 数量:×{{ item.quantity }}</text>
          </view>
          <text class="dish-subtotal">小计：¥{{ (item.price && item.quantity ? item.price * item.quantity : 0).toFixed(2) }}</text>
        </view>
      </view>

      <!-- 订单总计 -->
      <view class="order-total">
        <text class="total-label">总计：</text>
        <text class="total-amount">¥{{ orderDetail.totalPrice ? orderDetail.totalPrice.toFixed(2) : '0.00' }}</text>
      </view>
    </view>

    <!-- 收货信息 -->
    <view class="contact-info">
      <text class="info-label">收货人：{{ orderDetail.contact?.name || '未填写' }}</text>
      <view class="contact-content">
        <text class="contact-phone">{{ orderDetail.contact?.phone || '未填写' }}</text>
        <text class="contact-address">{{ orderDetail.contact?.address || '未填写' }}</text>
      </view>
    </view>

    <!-- 物流信息（模拟） -->
    <view class="logistics-info">
      <text class="info-label">物流状态：</text>
      <view class="logistics-step" v-for="(step, index) in logisticsSteps" :key="index">
        <view class="step-icon" :class="{ 'active': index <= currentStep }"></view>
        <view class="step-content">
          <text class="step-time">{{ step.time }}</text>
          <text class="step-desc">{{ step.desc }}</text>
        </view>
      </view>
    </view>

    <!-- 操作按钮 -->
    <view class="action-buttons" v-if="showActions">
      <button 
        v-if="orderDetail.status === 0" 
        class="cancel-btn" 
        @click="cancelOrder"
      >取消订单</button>
      
      <button 
        v-if="orderDetail.status === 3" 
        class="confirm-btn" 
        @click="confirmReceipt"
      >确认收货</button>
    </view>
  </view>
  </view>
</template>

<script>
import { getOrderDetail } from '@/api/order'; // 订单详情接口

export default {
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
        const res = await getOrderDetail(orderId);
        if (res.code === 200) {
          this.orderDetail = res.data;
          this.showActions = true;
          this.setCurrentStep();
        }
      } catch (error) {
        console.error('获取订单详情失败:', error);
        uni.showToast({ title: '加载失败', icon: 'none' });
      }
    },

    initLogistics() {
      this.logisticsSteps = [
        { time: '2025-06-06 12:00', desc: '商家已接单' },
        { time: '2025-06-06 12:15', desc: '正在准备食材' },
        { time: '2025-06-06 12:30', desc: '已交由骑手配送' },
        { time: '2025-06-06 13:00', desc: '订单已送达' }
      ];
    },

    setCurrentStep() {
      this.currentStep = Math.min(this.orderDetail.status, this.logisticsSteps.length - 1);
    },

    cancelOrder() {
      uni.showModal({
        title: '确认取消',
        content: '是否确认取消该订单？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '订单已取消', icon: 'none' });
            this.orderDetail.status = 4;
          }
        }
      });
    },

    confirmReceipt() {
      uni.showToast({ title: '订单已完成', icon: 'none' });
      this.orderDetail.status = 3;
    },

    // 直接返回状态文本（不使用映射）
    getStatusText(status) {
      if (status === 0) return '待接单';
      if (status === 1) return '待派送';
      if (status === 2) return '派送中';
      if (status === 3) return '已完成';
      if (status === 4) return '已取消';
      return '未知状态';
    },

    getStatusColor(status) {
      if (status === 0) return '#FF9900'; // 待接单 - 橙色
      if (status === 1) return '#0099FF'; // 待派送 - 蓝色
      if (status === 2) return '#339933'; // 派送中 - 绿色
      if (status === 3) return '#999999'; // 已完成 - 灰色
      if (status === 4) return '#FF3333'; // 已取消 - 红色
      return '#666666'; // 未知状态
    },

formatTime(timeStr) {
  if (!timeStr) return '';
  const date = new Date(timeStr.replace(/-/g, '/'));
  if (isNaN(date.getTime())) { // 处理无效时间
    return timeStr;
  }
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}
  }
};
</script>

<style scoped>
.order-detail-page {
  background-color: #fff;
  padding: 16px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.order-info {
  flex: 1;
}

.order-id {
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}

.order-status {
  font-size: 14px;
  margin-left: 5px;
}

.order-time {
  font-size: 12px;
  color: #999;
}

.dish-list {
  margin: 20px 0;
}

.dish-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.dish-image {
  width: 60px;
  height: 60px;
  margin-right: 12px;
  border-radius: 4px;
}

.dish-info {
  flex: 1;
  margin-right: 12px;
}

.dish-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.dish-price, .dish-quantity {
  font-size: 14px;
  color: #333;
}

.dish-subtotal {
  font-size: 14px;
  color: #ff3300;
}

.order-total {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
  font-size: 16px;
  color: #333;
}

.total-label {
  margin-right: 8px;
  color: #666;
}

.total-amount {
  font-weight: bold;
  color: #ff3300;
}

.contact-info {
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.contact-phone, .contact-address {
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  display: block;
}

.logistics-info {
  padding: 16px 0;
}

.logistics-step {
  display: flex;
  align-items: center;
  margin: 12px 0;
}

.step-icon {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e5e5;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
}

.step-icon.active {
  border-color: #ff6600;
}

.step-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #e5e5e5;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.step-icon:first-child::after {
  display: none;
}

.step-content {
  flex: 1;
}

.step-time {
  font-size: 12px;
  color: #999;
  margin-bottom: 4px;
}

.step-desc {
  font-size: 14px;
  color: #333;
}

.action-buttons {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.cancel-btn, .confirm-btn {
  padding: 10px 30px;
  border-radius: 24px;
  font-size: 14px;
  margin-right: 10px;
}

.cancel-btn {
  color: #ff3333;
  border: 1px solid #ff3333;
  background-color: transparent;
}

.confirm-btn {
  color: #fff;
  background-color: #ff6600;
  border: none;
}
</style>