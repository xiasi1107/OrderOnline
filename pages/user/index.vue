<template>
  <view class="my-page">
    <!-- 头部用户信息区域 -->
    <view class="user-header">
      <view class="user-info">
        <image 
          :src="userInfo.avatar || '/static/logo.png'" 
          class="avatar" 
          mode="aspectFill"
          @click="openEditModal('avatar')"></image>
        <view class="user-detail">
          <view class="nickname" @click="openEditModal('nickName')">{{ userInfo.nickName || '未设置昵称' }}</view>
          <view class="phone" @click="openEditModal('phone')">{{ userInfo.phone || '点击设置手机号' }}</view>
        </view>
      </view>
    </view>
    
    <!-- 个人信息卡片 -->
    <view class="info-card">
      <view class="card-item" @click="openEditModal('address')">
        <view class="item-left">
          <text class="icon-location">📌</text>
          <text>收货地址</text>
        </view>
        <view class="item-right">
          <text>{{ userInfo.address || '未设置' }}</text>
          <text class="icon-arrow-right">→</text>
        </view>
      </view>
      
      <view class="card-item" @click="goToOrderList">
        <view class="item-left">
          <text class="icon-order">📝</text>
          <text>我的订单</text>
        </view>
        <view class="item-right">
          <text>全部订单</text>
          <text class="icon-arrow-right">→</text>
        </view>
      </view>
    </view>
    
    <!-- 编辑模态框 -->
    <view class="edit-modal" v-if="showEditModal">
      <view class="modal-mask" @click="closeEditModal"></view>
      <view class="modal-content">
        <view class="modal-header">
          <text class="modal-title">{{ editTitle }}</text>
          <text class="close-btn" @click="closeEditModal">×</text>
        </view>
        
        <view class="form-group" v-if="editField === 'avatar'">
          <view class="form-title">更换头像</view>
          <view class="avatar-upload">
            <image :src="tempAvatar || userInfo.avatar" class="upload-avatar" mode="aspectFill"></image>
            <view class="upload-btn" @click="chooseAvatar">
              <text class="icon-upload">📤</text>
              <text>上传头像</text>
            </view>
          </view>
        </view>
        
        <view class="form-group" v-else-if="['nickName', 'phone', 'address'].includes(editField)">
          <view class="form-title">{{ fieldLabels[editField] }}</view>
          <input 
            v-model="editValue" 
            class="form-input" 
            :placeholder="fieldPlaceholders[editField]"
            :type="editField === 'phone' ? 'number' : 'text'"></input>
        </view>
        
        <view class="modal-footer">
          <button class="cancel-btn" @click="closeEditModal">取消</button>
          <button class="confirm-btn" @click="confirmEdit">确认修改</button>
        </view>
      </view>
    </view>
    
    <!-- 退出登录按钮 -->
    <view class="logout-container">
      <button class="logout-btn" @click="handleLogout">退出登录</button>
    </view>
  </view>
</template>

<script>
import { getUserInfo, updateUserInfo, uploadAvatar, logout } from '@/api/user'

export default {
  data() {
    return {
      userInfo: {
        avatar: uni.getStorageSync('avatar'),
        nickName: uni.getStorageSync('nickName'),
        phone: uni.getStorageSync('phone'),
        address: uni.getStorageSync('address')
      },
      showEditModal: false,
      editField: '',
      editTitle: '',
      editValue: '',
      tempAvatar: '',
      fieldLabels: {
        nickName: '昵称',
        phone: '手机号',
        address: '收货地址'
      },
      fieldPlaceholders: {
        nickName: '请输入昵称（2-10字）',
        phone: '请输入11位手机号',
        address: '请输入详细收货地址'
      }
    }
  },
  onLoad() {
    this.fetchUserInfo()
  },
  methods: {
    // 获取用户信息
    fetchUserInfo() {
      getUserInfo().then(res => {
        if (res.code === 200) {
          this.userInfo = res.data
        } else {
          uni.showToast({ title: res.msg || '获取用户信息失败', icon: 'none' })
        }
      })
    },
    
    // 打开编辑模态框
    openEditModal(field) {
      this.editField = field
      this.editTitle = this.fieldLabels[field] || '编辑信息'
      this.editValue = this.userInfo[field] || ''
      this.tempAvatar = ''
      this.showEditModal = true
    },
    
    // 选择头像
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
          this.tempAvatar = res.tempFilePaths[0]
          this.editValue = this.tempAvatar
          
          // 上传头像
          uploadAvatar(res.tempFilePaths[0]).then(uploadRes => {
            if (uploadRes.code === 200) {
              this.editValue = uploadRes.data.avatarUrl
            }
          })
        }
      })
    },
    
    // 确认编辑
    confirmEdit() {
      // 验证输入
      if (this.editField === 'nickName') {
        if (!this.editValue || this.editValue.length < 2 || this.editValue.length > 10) {
          uni.showToast({ title: '昵称长度需在2-10字之间', icon: 'none' })
          return
        }
      } else if (this.editField === 'phone') {
        if (!this.editValue ||!/^1[3-9]\\d{9}$/.test(this.editValue)) {
          uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
          return
        }
      } else if (this.editField === 'address') {
        if (!this.editValue || this.editValue.length < 10) {
          uni.showToast({ title: '地址需至少10个字', icon: 'none' })
          return
        }
      }
      
      // 构造更新数据
      const updateData = {
        [this.editField]: this.editValue
      }
      
      // 更新用户信息
      updateUserInfo(updateData).then(res => {
        if (res.code === 200) {
          uni.showToast({ title: '修改成功', icon: 'success' })
          this.closeEditModal()
          this.fetchUserInfo() // 刷新用户信息
        } else {
          uni.showToast({ title: res.msg || '修改失败', icon: 'none' })
        }
      })
    },
    
    // 关闭编辑模态框
    closeEditModal() {
      this.showEditModal = false
      this.tempAvatar = ''
    },
    
    // 前往订单列表
    goToOrderList() {
      uni.navigateTo({
        url: '/pages/order/index'
      })
    },
    
    // 退出登录
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            logout().then(logoutRes => {
              uni.showToast({ title: logoutRes.msg || '退出成功', icon: 'success' })
              uni.reLaunch({
                url: '/pages/login/index'
              })
            })
          }
        }
      })
    }
  }
}
</script>

<style>
.my-page {
  padding-bottom: 30rpx;
  background-color: #f6f6f6;
  min-height: 100vh;
}

.user-header {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 60rpx;
  margin-right: 20rpx;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}

.user-detail {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.nickname {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
  color: #333;
}

.phone {
  font-size: 24rpx;
  color: #333;
}

.info-card {
  background-color: #fff;
  border-radius: 12rpx;
  margin: 20rpx 30rpx;
  overflow: hidden;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.card-item {
  display: flex;
  align-items: center;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.card-item:last-child {
  border-bottom: none;
}

.item-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.item-left .icon-location, 
.item-left .icon-order,
.upload-btn .icon-upload {
  font-size: 36rpx;
  margin-right: 20rpx;
  color: #ff6b6b;
}

.item-left text {
  font-size: 28rpx;
  color: #333;
}

.item-right {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 300rpx;
}

.item-right text:first-child {
  font-size: 28rpx;
  color: #666;
  text-align: right;
  flex: 1;
}

.item-right .icon-arrow-right {
  font-size: 28rpx;
  color: #ccc;
}

/* 编辑模态框样式 */
.edit-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  position: relative;
  width: 80%;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  animation: modalIn 0.3s;
}

@keyframes modalIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.modal-title {
  font-size: 32rpx;
  font-weight: bold;
}

.close-btn {
  font-size: 36rpx;
  color: #999;
}

.form-group {
  padding: 30rpx;
}

.form-title {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 20rpx;
}

.avatar-upload {
  display: flex;
  align-items: center;
}

.upload-avatar {
  width: 160rpx;
  height: 160rpx;
  border-radius: 80rpx;
  margin-right: 30rpx;
  border: 1rpx solid #f0f0f0;
}

.upload-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200rpx;
  height: 80rpx;
  background-color: #f6f6f6;
  border-radius: 40rpx;
  font-size: 24rpx;
}

.upload-btn .icon-upload {
  margin-right: 10rpx;
  font-size: 32rpx;
}

.form-input {
  width: 100%;
  height: 80rpx;
  border: 1rpx solid #f0f0f0;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
}

.modal-footer {
  display: flex;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 40rpx;
  font-size: 28rpx;
  margin: 0 10rpx;
  border: none;
}

.cancel-btn {
  background-color: #f6f6f6;
  color: #666;
}

.confirm-btn {
  background-color: #2b9939;
  color: #fff;
}

.logout-container {
  padding: 0 30rpx;
  margin-top: 40rpx;
}

.logout-btn {
  background-color: #2b9939;
  color: #fff;
  border-radius: 40rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 28rpx;
  border: none;
  width: 100%;
}
</style>