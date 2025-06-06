import { http } from './api'
/**
 * 创建订单
 * @param {Object} orderData 订单数据
 * @param {Array} orderData.items 商品列表
 * @param {number} orderData.totalPrice 总价
 * @param {string} orderData.contactName 联系人姓名
 * @param {string} orderData.phone 手机号
 * @param {string} orderData.address 收货地址
 * @param {string} orderData.remark 备注
 */
export const createOrder = (orderData, success, fail) => {
	//	await uni.request({
	//	    url: http + '/user/createOrder',
	//	    method: 'POST',
	//	    header: {
	//	         "Content-Type": "application/json"
	//	    },
	//      data：orderData,
	//	    success: (res) => {
	//          console.log('createOrder: ok')
	//	        success(res)
	//	    },
	//	    fail: (res) => {
	//	        fail(res)
	//	    }
	//	})
  return new Promise((resolve) => {
    // 模拟处理时间
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          orderId: 'ORD' + Date.now(),
          totalPrice: orderData.totalPrice,
          items: orderData.items,
          contactName: orderData.contactName,
          phone: orderData.phone,
          address: orderData.address,
          remark: orderData.remark,
          createTime: new Date().toISOString(),
          status: 0
        },
        msg: "下单成功"
      });
    }, 800);
  });
};

/**
 * 获取订单列表
 */
export const getOrderList = ( success, fail) => {
	//	await uni.request({
	//	    url: http + '/user/getOrderList',
	//	    method: 'GET',
	//	    header: {
	//	         "Content-Type": "application/json"
	//	    },
	//      data：{
	//	        orderId,    
	//      },
	//	    success: (res) => {
	//          console.log('getOrderList: ok')
	//	        success(res)
	//	    },
	//	    fail: (res) => {
	//	        fail(res)
	//	    }
	//	})
  return new Promise((resolve) => {
    // 模拟数据
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          {
            orderId: 'ORD123456789',
            totalPrice: 88.00,
            items: [
              { 
                id: 1, 
                name: "宫保鸡丁", 
                price: 28.00, 
                quantity: 2 
              },
              { 
                id: 3, 
                name: "清炒时蔬", 
                price: 18.00, 
                quantity: 1 
              }
            ],
            contactName: "张三",
            phone: "13800138000",
            address: "北京市朝阳区某某街道123号",
            remark: "请尽快送达",
            status: 0, // 0=待接单
            createTime: new Date().toISOString()
          },
          {
            orderId: 'ORD987654321',
            totalPrice: 56.00,
            items: [
              { 
                id: 2, 
                name: "红烧肉", 
                price: 38.00, 
                quantity: 1 
              },
              { 
                id: 4, 
                name: "米饭", 
                price: 2.00, 
                quantity: 2 
              },
              { 
                id: 5, 
                name: "酸辣汤", 
                price: 14.00, 
                quantity: 1 
              }
            ],
            contactName: "李四",
            phone: "13900139000",
            address: "北京市海淀区某某小区5号楼",
            remark: "不要辣",
            status: 2, // 2=派送中
            createTime: "2023-05-19T18:30:00Z"
          },
          {
            orderId: 'ORD567891234',
            totalPrice: 120.00,
            items: [
              { 
                id: 6, 
                name: "烤鸭", 
                price: 98.00, 
                quantity: 1 
              },
              { 
                id: 7, 
                name: "春饼", 
                price: 10.00, 
                quantity: 2 
              },
              { 
                id: 8, 
                name: "黄瓜条", 
                price: 6.00, 
                quantity: 2 
              }
            ],
            contactName: "王五",
            phone: "13700137000",
            address: "北京市西城区某某胡同12号",
            remark: "",
            status: 3, // 3=已完成
            createTime: "2023-05-18T12:15:00Z"
          }
        ],
        msg: "获取成功"
      });
    }, 500);
  });
};

/**
 * 获取订单详情（模拟接口）
 * @param {string} orderId - 订单ID
 * @returns {Promise<Object>} 订单详情数据
 */
export const getOrderDetail = (orderId, success, fail) => {
	//	await uni.request({
	//	    url: http + '/user/getOrderDetail',
	//	    method: 'GET',
	//	    header: {
	//	         "Content-Type": "application/json"
	//	    },
	//	    success: (res) => {
	//          console.log('getOrderDetail: ok')
	//	        success(res)
	//	    },
	//	    fail: (res) => {
	//	        fail(res)
	//	    }
	//	})
  return new Promise((resolve) => {
    // 模拟延迟响应
    setTimeout(() => {
      // 模拟订单数据
      const mockOrder = {
        code: 200,
        data: {
          orderId: orderId || 'ORD123456789',
          status: 3,
          totalPrice: 88.50,
          createTime: '2025-06-06 12:30:45',
          contact: {
            name: '张三',
            phone: '13812345678',
            address: '北京市朝阳区建国路88号'
          },
          items: [
            {
              id: 1,
              name: '宫保鸡丁',
              price: 28.00,
              quantity: 2
            },
            {
              id: 2,
              name: '鱼香肉丝',
              price: 26.00,
              quantity: 1
            },
            {
              id: 3,
              name: '米饭',
              price: 2.50,
              quantity: 2
            }
          ]
        },
        msg: '获取成功'
      };

      resolve(mockOrder);
    }, 800); // 800ms延迟
  });
};