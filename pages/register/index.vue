<template>
  <view class="register-container">
    <!-- 顶部Logo -->
    <view class="login-logo">
      <image 
        src="/static/logo.png" 
        mode="aspectFit" 
        style="width: 280rpx; height: 280rpx;"
        class="logo-image"
      />
      <text class="logo-text">Order Online</text>
    </view>

    <view class="title">账号注册</view>

    <!-- 微信注册按钮 -->
    <button 
      class="wechat-register-btn" 
      @click="handleWeChatRegister"
      :disabled="!agreement || isLoading" 
      :class="{ 'register-btn-loading': isLoading }"
    >
      <icon 
        type="weixin" 
        size="24rpx"  
        color="#fff" 
        class="wechat-icon"
      />
      {{ isLoading ? '注册中...' : '微信一键注册' }}
    </button>

    <!-- 协议勾选区域 -->
    <view class="agreement-area">
      <checkbox-group @change="handleAgreementChange">
        <checkbox :value="true" :checked="agreement" shape="square" active-color="#216cea"/>
      </checkbox-group>
      <text class="agreement-text">
        我已阅读并同意
        <text class="link-text" @click="goToPrivacyPolicy">《隐私政策》</text>
        和
        <text class="link-text" @click="goToUserAgreement">《用户协议》</text>
      </text>
    </view>

    <!-- 错误提示 -->
    <view v-if="errorTip" class="error-tip">
      <icon type="warn" size="28rpx" color="#ff4d4f" />
      {{ errorTip }}
    </view>

    <!-- 登录入口 -->
    <view class="login-tip">
      已有账号？
      <text class="link-text" @click="goToLogin">立即登录</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { loginByWeChat } from '@/api/login'; // 导入你提供的接口

const isLoading = ref(false);
const agreement = ref(false);
const errorTip = ref('');

// 协议勾选
const handleAgreementChange = (e) => {
  agreement.value = e.detail.value.length > 0;
  errorTip.value = '';
};

// 微信一键注册（实际调用登录接口，后端判断是否需要注册）
const handleWeChatRegister = async () => {
  if (!agreement.value) {
    errorTip.value = '请勾选同意隐私政策和用户协议';
    return;
  }

  isLoading.value = true;
  try {
    // 获取微信登录凭证
    const { code } = await uni.login({ provider: 'weixin' });
    // 调用登录接口（后端会判断用户是否存在，不存在则自动注册）
    const res = await loginByWeChat(code);
    
    if (res.code === 200) {
      uni.showToast({ title: '注册成功', icon: 'success' });
      // 保存用户信息和token
      uni.setStorageSync('userInfo', res.data);
      uni.setStorageSync('token', res.data.token);
      // 注册成功后跳转首页
      setTimeout(() => {
        uni.navigateTo({ url: '/pages/index/index' });
      }, 1500);
    } else {
      errorTip.value = res.msg || '注册失败，请重试';
    }
  } catch (error) {
    console.error('注册失败:', error);
    errorTip.value = error.message || '注册失败，请重试';
  } finally {
    isLoading.value = false;
  }
};

// 其他方法保持不变
</script>

<style scoped>
/* 样式复用登录页逻辑，仅调整按钮文字和跳转提示 */
.register-container {
  background-color: #f8f9fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60rpx 40rpx;
}

.login-logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60rpx;
}

.logo-image {
  margin-bottom: 30rpx;
}

.logo-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 80rpx;
}

.wechat-register-btn {
  width: 100%;
  max-width: 600rpx;
  height: 90rpx;
  font-size: 32rpx;
  border-radius: 16rpx;
  background-color: #4CD964;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 24rpx rgba(76, 217, 100, 0.2);
}

.register-btn-loading {
  opacity: 0.7;
  pointer-events: none;
}

.agreement-area {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #666;
  margin: 20rpx 0 60rpx 0;
  line-height: 1.8;
}

.link-text {
  color: #216cea;
  text-decoration: underline;
}

.error-tip {
  color: #ff4d4f;
  font-size: 24rpx;
  margin: 10rpx 0;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.login-tip {
  margin-top: 40rpx;
  font-size: 28rpx;
  color: #666;
}
</style>