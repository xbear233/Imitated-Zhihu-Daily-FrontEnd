import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/detail/:id',
      component: () => import('../views/Detail.vue')
    },
    {
      path:'/login',
      component: () => import('../views/Login.vue')
    },
    {
      path:'/personalinfo',
      component: () => import('../views/PersonalInfo.vue')
    },

  ]
})

export default router
