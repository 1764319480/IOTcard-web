import { defineStore } from 'pinia';
import { reactive } from 'vue';
import { clearCookie, setCookie } from '@/utils/cookieHandler';
import crypto from 'crypto-js';
import { refreshToken, getUserInfo, updateUserInfo, updatePassword, logout, getUserList, addUser, deleteUser } from '@/services/user';
import { useRouter } from 'vue-router';

interface IRoleProps {
    id: number;
    roleName: string;
}

interface IUserInfoProps {
    id: string;
    status: number;
    account: string;
    userName: string;
    roles: IRoleProps[];
}

export const useUserStore = defineStore('user', () => {
    // 当前登录用户信息
    const userInfo = reactive<IUserInfoProps>({
        id: '',
        status: 0,
        account: '',
        userName: '',
        roles: []
    })

    // 退出登录
    const logoutAsync = () => {
        const router = useRouter();
        logout();
        clearCookie();
        sessionStorage.clear();
        router.push('/login');
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

    // 修改用户信息
    const updateUserInfoAsync = async (userId: string, userName?: string, status?: number, roleIds?: number[] | string[]) => {
        const res = await updateUserInfo({
            userId,
            userName,
            status,
            roleIds
        })
        if (res.data.code === 200) {
            getUserInfoAsync();
            return true;
        }
        return false;
    }

    // 修改密码
    const updatePasswordAsync = async (oldPassword: string, newPassword: string) => {
        const res = await updatePassword({
            oldPassword: crypto.MD5(oldPassword).toString(),
            newPassword: crypto.MD5(newPassword).toString(),
        })
        if (res.data.code === 200) {
            return true;
        }
        return false;
    }

    // 获取用户列表
    const getUserListAsync = async (condition: object) => {
        const res = await getUserList(condition);
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }

    // 添加用户
    const addUserAsync = async (userName:string, account: string, roleId: number) => {
        const res = await addUser({
            userName,
            account,
            roleId
        })
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }

    // 删除用户
    const deleteUserAsync = async (userIds:(string | number)[]) => {
        const res = await deleteUser({userIds});
        if (res.data.code === 200) {
            return true;
        }
        return false;
    }

    return {
        userInfo,
        logoutAsync,
        getUserInfoAsync,
        refreshTokenAsync,
        updateUserInfoAsync,
        updatePasswordAsync,
        getUserListAsync,
        addUserAsync,
        deleteUserAsync
    }
}, { persist: true });
