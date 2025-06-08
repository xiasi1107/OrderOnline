import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/order-management',
    name: 'OrderManagement',
    component: () => import('../views/OrderManagement.vue'),
    meta: { 
      //isParentMenu: true, // 标记为父菜单项
      title: '订单管理概览' 
    }
  },
  {
    path: '/my-shop',
    name: 'myshop',
    component: () => import('../views/MyShop.vue'),
  },
    {
    path: '/dish',
    name: 'Dish',
    component: () => import('../views/DishView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
