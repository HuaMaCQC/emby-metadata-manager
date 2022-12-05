import { createRouter, createWebHistory } from 'vue-router';
import Index from '@/views/Index/Index.vue';
import Login from '@/views/Login/Login.vue';
import Home from '@/views/Home.vue';

const routes = [
  { path: '/*', redirect: '/' },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        path: '',
        component: Index,
      },
      // 標籤管理
      {
        path: 'tag',
        component: () => import('../views/Tag/Tag.vue'),
      },
      // 動漫 => 中繼資料管理
      {
        path: 'genre-tag-metadata',
        component: () => import('../views/GenreTagMetadata/GenreTagMetadata.vue'),
      },
      // 簡介編輯
      {
        path: 'info',
        component: () => import('../views/info/info.vue'),
      },
      // 風格管理
      {
        path: 'genre',
        component: () => import('../views/Genre/Genre.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
