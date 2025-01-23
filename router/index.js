// router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../pages/HomeView.vue')
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('../pages/upload/UploadView.vue')
    },
    {
      path: '/add-stock',
      name: 'AddStock',
      component: () => import('../pages/stock/AddStock.vue')
    },
    // แก้ path ให้ชี้ไปที่ pages/upload/EditCarStatus.vue
   {
  path: '/cars/:id/edit-status',
  name: 'EditCarStatus',
  component: () => import('@/pages/stock/EditCarStatus.vue')
}
  ]
})

export default router