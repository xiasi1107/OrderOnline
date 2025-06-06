"use strict";
require("../common/vendor.js");
const createOrder = (orderData, success, fail) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: {
          orderId: "ORD" + Date.now(),
          totalPrice: orderData.totalPrice,
          items: orderData.items,
          contactName: orderData.contactName,
          phone: orderData.phone,
          address: orderData.address,
          remark: orderData.remark,
          createTime: (/* @__PURE__ */ new Date()).toISOString(),
          status: 0
        },
        msg: "下单成功"
      });
    }, 800);
  });
};
const getOrderList = (success, fail) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        code: 200,
        data: [
          {
            orderId: "ORD123456789",
            totalPrice: 88,
            items: [
              {
                id: 1,
                name: "宫保鸡丁",
                price: 28,
                quantity: 2
              },
              {
                id: 3,
                name: "清炒时蔬",
                price: 18,
                quantity: 1
              }
            ],
            contactName: "张三",
            phone: "13800138000",
            address: "北京市朝阳区某某街道123号",
            remark: "请尽快送达",
            status: 0,
            // 0=待接单
            createTime: (/* @__PURE__ */ new Date()).toISOString()
          },
          {
            orderId: "ORD987654321",
            totalPrice: 56,
            items: [
              {
                id: 2,
                name: "红烧肉",
                price: 38,
                quantity: 1
              },
              {
                id: 4,
                name: "米饭",
                price: 2,
                quantity: 2
              },
              {
                id: 5,
                name: "酸辣汤",
                price: 14,
                quantity: 1
              }
            ],
            contactName: "李四",
            phone: "13900139000",
            address: "北京市海淀区某某小区5号楼",
            remark: "不要辣",
            status: 2,
            // 2=派送中
            createTime: "2023-05-19T18:30:00Z"
          },
          {
            orderId: "ORD567891234",
            totalPrice: 120,
            items: [
              {
                id: 6,
                name: "烤鸭",
                price: 98,
                quantity: 1
              },
              {
                id: 7,
                name: "春饼",
                price: 10,
                quantity: 2
              },
              {
                id: 8,
                name: "黄瓜条",
                price: 6,
                quantity: 2
              }
            ],
            contactName: "王五",
            phone: "13700137000",
            address: "北京市西城区某某胡同12号",
            remark: "",
            status: 3,
            // 3=已完成
            createTime: "2023-05-18T12:15:00Z"
          }
        ],
        msg: "获取成功"
      });
    }, 500);
  });
};
const getOrderDetail = (orderId, success, fail) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockOrder = {
        code: 200,
        data: {
          orderId: orderId || "ORD123456789",
          status: 3,
          totalPrice: 88.5,
          createTime: "2025-06-06 12:30:45",
          contact: {
            name: "张三",
            phone: "13812345678",
            address: "北京市朝阳区建国路88号"
          },
          items: [
            {
              id: 1,
              name: "宫保鸡丁",
              price: 28,
              quantity: 2
            },
            {
              id: 2,
              name: "鱼香肉丝",
              price: 26,
              quantity: 1
            },
            {
              id: 3,
              name: "米饭",
              price: 2.5,
              quantity: 2
            }
          ]
        },
        msg: "获取成功"
      };
      resolve(mockOrder);
    }, 800);
  });
};
exports.createOrder = createOrder;
exports.getOrderDetail = getOrderDetail;
exports.getOrderList = getOrderList;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/order.js.map
