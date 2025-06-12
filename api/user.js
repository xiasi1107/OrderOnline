import { http } from './api'

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
//	await uni.request({
//	    url: http + '/user/getUserInfo',
//	    method: 'GET',
//	    header: {
//	        'Authorization': uni.getStorageSync('openid')
//	    },
//	    success: (res) => {
//          console.log('getUserInfo: ok')	
//	        success(res)
//	    },
//	    fail: (res) => {
//	        fail(res)
//	    }
//	})
  return new Promise((resolve) => {
    // 模拟从本地存储获取用户信息
    const userInfo = {
      avatar: uni.getStorageSync('avatar') || '/static/logo.png',
      nickName: uni.getStorageSync('nickName') || '用户' + Math.floor(Math.random() * 10000),
      phone: uni.getStorageSync('phone') || '',
      address: uni.getStorageSync('address') || ''
    }
    
    // 模拟接口延迟
    setTimeout(() => {
      resolve({
        code: 200,
        data: userInfo,
        msg: '获取成功'
      })
    }, 300)
  })
}

/**
 * 更新用户信息
 * @param {Object} userData - 用户数据
 * @param {string} userData.avatar - 头像URL
 * @param {string} userData.nickName - 昵称
 * @param {string} userData.phone - 手机号
 * @param {string} userData.address - 地址
 */
export const updateUserInfo = (userData) => {
//	await uni.request({
//	    url: http + '/user/getUserInfo',
//	    method: 'POST',
//	    header: {
//	        'Authorization': uni.getStorageSync('openid')
//          'Content-Type': 'application/json'
//	    },
//      data: userData,
//	    success: (res) => {
//          console.log('getUserInfo: ok')	
//	        success(res)
//	    },
//	    fail: (res) => {
//	        fail(res)
//	    }
//	})
  return new Promise((resolve) => {
    // 模拟接口延迟
    setTimeout(() => {
      // 保存到本地存储
      if (userData.avatar) uni.setStorageSync('avatar', userData.avatar)
      if (userData.nickName) uni.setStorageSync('nickName', userData.nickName)
      if (userData.phone) uni.setStorageSync('phone', userData.phone)
      if (userData.address) uni.setStorageSync('address', userData.address)
      
      resolve({
        code: 200,
        data: {
          ...userData,
          updateTime: new Date().toISOString()
        },
        msg: '更新成功'
      })
    }, 500)
  })
}

/**
 * 退出登录
 */
export const logout = () => {
//	await uni.request({
//	    url: http + '/user/logout',
//	    method: 'POST',
//	    header: {
//	        'Authorization': uni.getStorageSync('openid')
//	    },
//	    success: (res) => {
//          console.log('logout: ok')	
//	        success(res)
//	    },
//	    fail: (res) => {
//	        fail(res)
//	    }
//	})
  return new Promise((resolve) => {
    // 清除本地存储的用户信息
    uni.removeStorageSync('token')
    uni.removeStorageSync('avatar')
    uni.removeStorageSync('nickName')
    uni.removeStorageSync('phone')
    uni.removeStorageSync('address')
    
    resolve({
      code: 200,
      msg: '退出成功'
    })
  })
}

/**
 * 上传头像
 * @param {string} filePath - 头像文件路径
 */
export const uploadAvatar = (filePath) => {
  return new Promise((resolve) => {
    // 模拟上传延迟
    setTimeout(() => {
      // 模拟生成头像URL
      const avatarUrl = `/static/logo.png`
      
      resolve({
        code: 200,
        data: {
          avatarUrl
        },
        msg: '上传成功'
      })
    }, 800)
  })
}