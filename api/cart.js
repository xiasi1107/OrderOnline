/**
 * 获取购物车列表
 */
export const getCartList = () => {
  return new Promise((resolve) => {
    resolve({
      code: 200,
      data: [
        { 
          id: 1, 
          name: "宫保鸡丁", 
          price: 28.00, 
          quantity: 2 
        },
        { 
          id: 2, 
          name: "鱼香肉丝", 
          price: 25.00, 
          quantity: 5 
        },
		{
		  id: 3,
		  name: "清炒时蔬", 
		  price: 18.00, 
		  quantity: 1
		}
      ],
      msg: "获取成功"
    });
  });
};

/**
 * 更新购物车商品数量
 * @param {number} dishId - 菜品ID
 * @param {number} quantity - 数量（0表示删除）
 */
export const updateCart = (dishId, quantity) => {
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