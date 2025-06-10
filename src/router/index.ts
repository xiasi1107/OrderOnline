import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/',
    name: 'Mian',
    component: () => import('../views/AppContent.vue'),
    children: [
      {
        path: '/order-management',
        name: 'OrderManagement',
        component: () => import('../views/appcontent/OrderManagement.vue'),
        meta: { 
          //isParentMenu: true, // 标记为父菜单项
          title: '订单管理概览' 
        }
      },
      {
        path: '',
        name: 'myshop',
        component: () => import('../views/appcontent/MyShop.vue'),
      },
        {
        path: '/dish',
        name: 'Dish',
        component: () => import('../views/appcontent/DishView.vue'),
      },
    ]
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 简单的路由守卫检查登录
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem('token') // 假设token标记登录状态
  if (to.path !== '/login' && !isLogin) {
    next('/login')
  } else if (to.path === '/login' && isLogin) {
    next('/')
  } else {
    next()
  }
})

export default router
