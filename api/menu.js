import { http } from './api'

/**
 * 获取菜品分类列表
 */
export const getCategories = () => {
  return new Promise((resolve) => {
    // 模拟接口响应
    resolve({
      code: 200,
      data: [
        { id: 'all', name: '全部', icon: '🍱' },
        { id: '1', name: '川菜', icon: '🌶️' },
        { id: '2', name: '粤菜', icon: '🦐' },
        { id: '3', name: '湘菜', icon: '🌶️' },
        { id: '4', name: '鲁菜', icon: '🥟' },
        { id: '5', name: '素菜', icon: '🥦' },
        { id: '6', name: '汤品', icon: '🍲' },
        { id: '7', name: '主食', icon: '🍚' },
        { id: '8', name: '饮品', icon: '🥤' }
      ],
      msg: "获取成功"
    });
  });
};

/**
 * 获取菜品列表（带分类）
 */
export const getDishList = () => {
  return new Promise((resolve) => {
    // 模拟接口响应（添加了categoryId字段）
    resolve({
      code: 200,
      data: [
        {
          id: 1,
          name: "宫保鸡丁",
          desc: "经典川菜，香辣可口，花生香脆",
          price: 28.00,
          image: "/static/logo.png",
          categoryId: "1",
          tags: ["招牌", "畅销"]
        },
        {
          id: 2,
          name: "鱼香肉丝",
          desc: "鱼香风味，肉丝鲜嫩，配菜丰富",
          price: 25.00,
          image: "/static/logo.png",
          categoryId: "1",
          tags: ["经典"]
        },
        {
          id: 3,
          name: "清炒时蔬",
          desc: "新鲜时蔬，清爽健康",
          price: 18.00,
          image: "/static/logo.png",
          categoryId: "5",
          tags: ["健康"]
        },
        {
          id: 4,
          name: "白灼虾",
          desc: "粤菜经典，保留海鲜原汁原味",
          price: 48.00,
          image: "/static/logo.png",
          categoryId: "2",
          tags: ["新鲜"]
        },
        {
          id: 5,
          name: "剁椒鱼头",
          desc: "湘菜代表，鲜辣开胃",
          price: 58.00,
          image: "/static/logo.png",
          categoryId: "3",
          tags: ["招牌"]
        },
        {
          id: 6,
          name: "糖醋鲤鱼",
          desc: "鲁菜经典，酸甜可口",
          price: 42.00,
          image: "/static/logo.png",
          categoryId: "4",
          tags: ["传统"]
        },
        {
          id: 7,
          name: "西湖牛肉羹",
          desc: "细腻滑嫩，营养丰富",
          price: 22.00,
          image: "/static/logo.png",
          categoryId: "6",
          tags: ["推荐"]
        },
        {
          id: 8,
          name: "扬州炒饭",
          desc: "配料丰富，米饭粒粒分明",
          price: 18.00,
          image: "/static/logo.png",
          categoryId: "7",
          tags: ["主食"]
        },
        {
          id: 9,
          name: "珍珠奶茶",
          desc: "香浓丝滑，口感丰富",
          price: 12.00,
          image: "/static/logo.png",
          categoryId: "8",
          tags: ["饮品"]
        }
      ],
      msg: "获取成功"
    });
  });
};