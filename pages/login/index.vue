<template>
  <view class="login-container">
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

    <!-- 手机号登录表单 -->
    <view class="form-container">
      <view class="form-item">
        <input 
          v-model="phone" 
          type="number" 
          placeholder="请输入手机号" 
          maxlength="11"
          class="form-input"
        />
      </view>
      <view class="form-item">
        <input 
          v-model="password" 
          type="password" 
          placeholder="请输入密码" 
          class="form-input"
        />
      </view>
      <button 
        class="phone-login-btn" 
        @click="handlePhoneLogin"
        :disabled="!agreement || isLoading"
      >
        手机号登录
      </button>
    </view>
    <!-- 分割线 -->
    <view class="divider">
      <view class="divider-line"></view>
      <text class="divider-text">或</text>
      <view class="divider-line"></view>
    </view>

    <!-- 微信登录按钮 -->
    <button 
      class="wechat-login-btn" 
      @click="handleWeChatLogin"
      :disabled="!agreement || isLoading" 
      :class="{ 'login-btn-loading': isLoading }"
    >
      <icon 
        type="weixin" 
        size="24rpx"  
        color="#fff" 
        class="wechat-icon"
      />
      {{ isLoading ? '登录中...' : '微信一键注册/登录' }}
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

    <!-- 注册入口 -->
    <view class="register-tip">
      还没有账号？
      <text class="link-text" @click="goToRegister">立即注册</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { loginByWeChat, loginByPhone } from '@/api/login';

const isLoading = ref(false);
const agreement = ref(false);
const errorTip = ref('');
const phone = ref('');
const password = ref('');

const handleAgreementChange = (e) => {
  agreement.value = e.detail.value.length > 0;
  errorTip.value = '';
};

const handleWeChatLogin = async () => {
  if (!validateAgreement()) return;
  
  isLoading.value = true;
  try {
    const { code } = await uni.login({ provider: 'weixin' });
    const res = await loginByWeChat(code);
    handleLoginResult(res);
  } catch (error) {
    handleLoginError(error);
  } finally {
    isLoading.value = false;
  }
};

const handlePhoneLogin = async () => {
  if (!validateAgreement()) return;
  if (!validatePhone()) return;
  
  isLoading.value = true;
  try {
    const res = await loginByPhone({
      phone: phone.value,
      password: password.value
    });
    handleLoginResult(res);
  } catch (error) {
    handleLoginError(error);
  } finally {
    isLoading.value = false;
  }
};

// 公共验证方法
const validateAgreement = () => {
  if (!agreement.value) {
    errorTip.value = '请勾选同意隐私政策和用户协议';
    return false;
  }
  return true;
};

const validatePhone = () => {
  if (!phone.value) {
    errorTip.value = '请输入手机号';
    return false;
  }
  if (!/^1[3-9]\d{9}$/.test(phone.value)) {
    errorTip.value = '请输入正确的手机号';
    return false;
  }
  if (!password.value) {
    errorTip.value = '请输入密码';
    return false;
  }
  return true;
};

const handleLoginResult = (res) => {
  if (res.code === 200) {
    uni.showToast({ title: '登录成功', icon: 'success' });
    uni.navigateTo({ url: '/pages/index/index' });
  } else {
    errorTip.value = res.msg || '登录失败，请重试';
  }
};

const handleLoginError = (error) => {
  console.error('登录失败:', error);
  errorTip.value = error.message || '登录失败，请重试';
};

const goToRegister = () => {
  uni.navigateTo({ url: '/pages/register/index' });
};

const goToPrivacyPolicy = () => {
  uni.navigateTo({ url: '/pages/privacyPolicy/index' });
};

const goToUserAgreement = () => {
  uni.navigateTo({ url: '/pages/userAgreement/index' });
};
</script>

<style scoped>
.login-container {
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
  margin-bottom: 20rpx;
}

.logo-image {
  margin-bottom: 30rpx; /* 图片和文字之间的间距 */
}

.logo-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333; /* 可选颜色调整 */
  text-align: center;
  width: 100%;
  margin-bottom: 30rpx;
}

.wechat-login-btn,
.phone-login-btn {
  width: 100%;
  max-width: 600rpx;
  height: 90rpx;
  font-size: 32rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16rpx;
  transition: all 0.3s;
  margin-bottom: 10rpx;
}

.wechat-login-btn {
  background-color: #4CD964;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(76, 217, 100, 0.2);
}

.phone-login-btn {
  background-color: #216cea;
  color: #fff;
  box-shadow: 0 8rpx 24rpx rgba(33, 108, 234, 0.2);
}

.login-btn-loading {
  opacity: 0.7;
  pointer-events: none;
}

.divider {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 600rpx;
  margin: 10rpx 0;
  margin-bottom: 30rpx;
}

.divider-line {
  flex: 10;
  height: 1px;
  background-color: #e0e0e0;
}

.divider-text {
  padding: 0 20rpx;
  color: #999;
  font-size: 26rpx;
}

.form-container {
  width: 100%;
  max-width: 600rpx;
  margin-bottom: 30rpx;
}

.form-item {
  margin-bottom: 40rpx;
}

.form-input {
  width: 100%;
  height: 90rpx;
  padding: 0 5rpx;
  background-color: #fff;
  border-radius: 16rpx;
  font-size: 30rpx;
  border: 1px solid #e0e0e0;
}

.agreement-area {
  display: flex;
  align-items: center;
  font-size: 26rpx;
  color: #666;
  margin: 20rpx 0;
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

.register-tip {
  margin-top: 40rpx;
  font-size: 28rpx;
  color: #666;
}
</style>