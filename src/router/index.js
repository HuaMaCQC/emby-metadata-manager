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
        path: 'anime_meta_data',
        component: () => import('../views/AnimeMetaData/AnimeMetaData.vue'),
      },
      // 影片管理 > 影片列表
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
