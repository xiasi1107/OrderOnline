import { http } from './api'

export const loginByWeChat = (code) => {
//	await uni.request({
//	    url: http + '/user/loginByWeChat',
//	    method: 'POST',
//	    header: {
//	        'Authorization': uni.getStorageSync('openid')
//	    },
//	    success: (res) => {
//          console.log('loginByWeChat: ok')	
//	        success(res)
//	    },
//	    fail: (res) => {
//	        fail(res)
//	    }
//	})
  return new Promise((resolve) => {
    // 模拟成功响应（返回假数据）
    resolve({
      code: 200,
      data: {
        nickName: '测试用户',
        token: 'mock-token-123',
      },
      msg: '登录成功',
    });
  });
};

export const loginByPhone = ({ phone, password }) => {
//	await uni.request({
//	    url: http + '/user/loginByPhone',
//	    method: 'POST',
//	    header: {
//	        'Authorization': uni.getStorageSync('openid')
//	    },
//	    success: (res) => {
//          console.log('loginByPhone: ok')	
//	        success(res)
//	    },
//	    fail: (res) => {
//	        fail(res)
//	    }
//	})
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟验证逻辑
      if (phone === '13800000000' && password === '123456') {
        resolve({
          code: 200,
          data: {
            nickName: '测试用户',
            avatar: 'https://mock.image/avatar2.png',
            token: 'phone-mock-token-456',
            phone: phone
          },
          msg: '登录成功'
        });
      } else {
        resolve({ 
          code: 401, 
          msg: phone.length !== 11 ? '手机号格式错误' : '密码错误' 
        });
      }
    }, 600);
  });
};