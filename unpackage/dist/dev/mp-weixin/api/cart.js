"use strict";
require("../common/vendor.js");
const getCartList = (success, fail) => {
  return new Promise((resolve) => {
    resolve({
      code: 200,
      data: [
        {
          id: 1,
          name: "宫保鸡丁",
          price: 28,
          quantity: 2
        },
        {
          id: 2,
          name: "鱼香肉丝",
          price: 25,
          quantity: 5
        },
        {
          id: 3,
          name: "清炒时蔬",
          price: 18,
          quantity: 1
        }
      ],
      msg: "获取成功"
    });
  });
};
const updateCart = (dishId, quantity, success, fail) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (quantity < 0) {
        resolve({
          code: 400,
          msg: "数量不能为负数"
        });
        return;
      }
      resolve({
        code: 200,
        msg: quantity === 0 ? "移除成功" : "更新成功"
      });
    }, 200);
  });
};
exports.getCartList = getCartList;
exports.updateCart = updateCart;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/cart.js.map
