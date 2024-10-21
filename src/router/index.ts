import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { getCookie } from '@/utils/cookieHandler';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
    const token = getCookie('access_token');

    if (!token && to.path.toLowerCase() !== '/login') {
        next({ path: `/login?redirect_url=${encodeURIComponent(window.location.href)}` })
    }

    next();
});

export default router;
