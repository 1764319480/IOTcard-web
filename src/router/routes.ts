import { RouteRecordRaw } from 'vue-router';
import { Setting } from '@element-plus/icons-vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/',
    redirect: '/home',
    props: { icon: Setting },
    component: () => import('@/components/Layout/index.vue'),
    children: [
      { path: '/home', component: () => import('@/views/Home/index.vue') },
      { path: '/system/user', component: () => import('@/views/System/User/index.vue') },
      { path: '/system/role', component: () => import('@/views/System/Role/index.vue') },
      { path: '/system/log', component: () => import('@/views/System/Log/index.vue') },
      { path: '/client/info', component: () => import('@/views/Client/Info/index.vue') },
      { path: '/service/combo', component: () => import('@/views/Service/Combo/index.vue') },
    ],
  },
];

export default routes;
