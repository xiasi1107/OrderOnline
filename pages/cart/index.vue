<template>
  <view class="cart-page">
    <!-- 购物车内容 -->
    <view class="cart-content">
      <!-- 空购物车提示 -->
      <view v-if="cartList.length === 0" class="empty-cart">
        <text class="empty-tip">购物车空空如也，快去挑选商品吧！</text>
        <navigator url="/pages/index/index" class="go-shopping-btn">去购物</navigator>
      </view>

      <!-- 有商品时显示列表 -->
      <view v-else>
        <!-- 商品列表 -->
        <view class="cart-list">
          <view 
            class="cart-item"
            v-for="item in cartList" 
            :key="item.id"
          >
            <!-- 商品信息 -->
            <view class="item-info">
              <view class="item-name">{{ item.name }}</view>
              <view class="item-price">单价：¥{{ item.price.toFixed(2) }}</view>
              <view class="item-quantity">数量：{{ item.quantity }}</view>
              <view class="item-subtotal">小计：¥{{ (item.price * item.quantity).toFixed(2) }}</view>
            </view>
          </view>
        </view>

        <!-- 订单信息表单 -->
        <view class="order-form">
          <view class="form-title">订单信息</view>
          
          <view class="form-item">
            <text class="form-label">联系人</text>
            <input 
              class="form-input" 
              v-model="orderInfo.contactName" 
              placeholder="请输入联系人姓名"
              maxlength="20"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">手机号</text>
            <input 
              class="form-input" 
              v-model="orderInfo.phone" 
              placeholder="请输入手机号"
              type="number"
              maxlength="11"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">收货地址</text>
            <input 
              class="form-input" 
              v-model="orderInfo.address" 
              placeholder="请输入详细地址"
              maxlength="100"
            />
          </view>
          
          <view class="form-item">
            <text class="form-label">备注</text>
            <textarea 
              class="form-textarea" 
              v-model="orderInfo.remark" 
              placeholder="选填，可填写特殊要求"
              maxlength="200"
            />
          </view>
        </view>
      </view>

      <!-- 总价栏 -->
      <view v-if="cartList.length > 0" class="total-bar">
        <view class="total-info">
          <text>总价：</text>
          <text class="total-price">¥{{ totalPrice.toFixed(2) }}</text>
        </view>
        <button class="order-btn" @click="handleOrder">立即下单</button>
      </view>
    </view>
  </view>
</template>

<script>
import { getCartList } from '@/api/cart'; 
import { createOrder } from '@/api/order';

export default {
  data() {
    return {
      cartList: [],
      orderInfo: {
        contactName: '',
        phone: '',
        address: '',
        remark: ''
      }
    };
  },

  computed: {
    totalPrice() {
      return this.cartList.reduce(
        (sum, item) => sum + (item.price * item.quantity),
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
        const res = await getCartList();
        if (res.code === 200) {
          this.cartList = res.data;
        }
      } catch (error) {
        console.error('获取购物车失败:', error);
      }
    },

    validateForm() {
      if (!this.orderInfo.contactName) {
        uni.showToast({ title: '请输入联系人姓名', icon: 'none' });
        return false;
      }
      
      if (!this.orderInfo.phone) {
        uni.showToast({ title: '请输入手机号', icon: 'none' });
        return false;
      }
      
      // 简单的手机号格式验证
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(this.orderInfo.phone)) {
        uni.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return false;
      }
      
      if (!this.orderInfo.address) {
        uni.showToast({ title: '请输入收货地址', icon: 'none' });
        return false;
      }
      
      return true;
    },

    async handleOrder() {
      if (this.cartList.length === 0) {
        uni.showToast({ title: '购物车为空，无法下单', icon: 'none' });
        return;
      }
      
      // 验证表单
      if (!this.validateForm()) {
        return;
      }

      try {
        // 准备订单数据
        const orderData = {
          items: this.cartList,
          totalPrice: this.totalPrice,
          contactName: this.orderInfo.contactName,
          phone: this.orderInfo.phone,
          address: this.orderInfo.address,
          remark: this.orderInfo.remark
        };
        
        // 调用下单接口
        const orderRes = await createOrder(orderData);
        
        if (orderRes.code === 200) {
          uni.showModal({
            title: '下单成功',
            content: `订单号：${orderRes.data.orderId}\n总价：¥${orderRes.data.totalPrice.toFixed(2)}`,
            confirmText: '查看订单',
            success: () => {
              // 跳转到订单详情页
              uni.navigateTo({ 
                url: `/pages/order/detail?id=${orderRes.data.orderId}`
              });
              // 清空购物车
              this.cartList = [];
              // 清空表单
              this.orderInfo = {
                contactName: '',
                phone: '',
                address: '',
                remark: ''
              };
            }
          });
        } else {
          uni.showToast({ title: orderRes.msg, icon: 'none' });
        }
      } catch (error) {
        console.error('下单失败:', error);
        uni.showToast({ title: '下单失败，请重试', icon: 'none' });
      }
    }
  }
};
</script>

<style scoped>
.cart-page {
  flex: 1;
  background-color: #f5f5f5;
}

/* 空购物车状态 */
.empty-cart {
  height: calc(100vh - 44px - 50px); /* 减去导航栏和总价栏高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
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

/* 购物车列表 */
.cart-list {
  background-color: #fff;
  margin: 12px 16px;
  border-radius: 8px;
  padding: 16px;
}

.cart-item {
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
}

.item-info {
  font-size: 14px;
  color: #333;
}

.item-price {
  color: #ff3300;
  margin: 4px 0;
}

.item-subtotal {
  font-size: 12px;
  color: #666;
}

/* 订单信息表单 */
.order-form {
  background-color: #fff;
  margin: 12px 16px;
  border-radius: 8px;
  padding: 16px;
}

.form-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f5;
}

.form-item {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.form-input {
  width: 95%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-textarea {
  width: 95%;
  height: 80px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

/* 总价栏 */
.total-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #ffffff;
  box-shadow: 0 -1px 2px rgba(0,0,0,0.1);
}

.total-info {
  font-size: 14px;
}

.total-price {
  color: #ff3300;
  font-weight: 500;
  font-size: 16px;
  margin-left: 4px;
}

.order-btn {
  padding: 7px 24px;
  background-color: #ff6600;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  margin-left: 180px;
}
</style>