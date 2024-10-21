import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { setCookie } from '@/utils/cookieHandler';
import { refreshToken, getUserInfo } from '@/services/user';

interface IRoleProps {
    id: number;
    roleName: string;
}

interface IUserInfoProps {
    id: number;
    status: number;
    account: string;
    userName: string;
    roles: IRoleProps[];
}

export const useUserStore = defineStore('user', () => {
    // 当前登录用户信息
    const userInfo = reactive<IUserInfoProps>({
        id: 0,
        status: 0,
        account: '',
        userName: '',
        roles: []
    })

    // 退出登录
    const logoutAsync = async () => {
        // 调取退出接口
        // 清除cookie
        // 跳转到登录页
        // 清空用户信息
    }

    // 获取用户信息
    const getUserInfoAsync = async () => {
        const res = await getUserInfo();
        if (res.data.code === 200) {
            // 使用 Object.assign 批量更新对象属性
            Object.assign(userInfo, { ...res.data.value });
        }
    }

    // 刷新 token
    const refreshTokenAsync = async () => {
        // 每 20 分钟刷新一次 token
        const delay = 20 * 60 * 1000;

        const func = async () => {
            const res = await refreshToken();
            if (res.data.code === 200) {
                setCookie('access_token', res.data.value);
            };

            setTimeout(func, delay);
        }

        setTimeout(func, delay);
    }

    return {
        userInfo,
        logoutAsync,
        getUserInfoAsync,
        refreshTokenAsync
    }
}, { persist: true });
