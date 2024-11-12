import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import { clearCookie, setCookie } from '@/utils/cookieHandler';
import crypto from 'crypto-js';
import { refreshToken, getUserInfo, updateUserInfo, updatePassword, logout, getUserList, addUser, deleteUser, getAllUser } from '@/services/user';
import router from '@/router';
interface IRoleProps { // 角色结构
    id: number,
    roleType: number,
    roleName: string
}

interface IUserInfoProps { //个人信息结构
    id: string;
    status: number;
    account: string;
    userName: string;
    roles: IRoleProps[];
}

interface IUserProps { // 用户信息结构
    id: number,
    account: string,
    userName: string
}
export const useUserStore = defineStore('user', () => {
    const timer = ref();
    const users = ref<IUserProps[]>();
    // 当前登录用户信息
    const userInfo = reactive<IUserInfoProps>({
        id: '',
        status: 0,
        account: '',
        userName: '',
        roles: []
    })
    // 获取所有用户
    const getAllUserAsync = async (keyword: string = '') => {
        const res = await getAllUser({keyword});
        if (res.data.code === 200) {
            users.value = res.data.value;
            return true;
        }
        return false;
    }

    // 退出登录
    const logoutAsync = async () => {
        clearTimeout(timer.value)
        await logout();
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
        // 每 10 分钟刷新一次 token
        const delay = 10 * 60 * 1000;
        const func = async () => {
            const res = await refreshToken();
            if (res.data.code === 200) {
                setCookie('access_token', res.data.value);
            };

            timer.value = setTimeout(func, delay);
        }
        func();
    }

    // 修改用户信息
    const updateUserInfoAsync = async (userId: string, userName?: string, status?: number, roleIds?: number[] | string[]) => {
        const res = await updateUserInfo({
            userId,
            userName,
            status,
            roleIds
        })
        return res.data.code === 200;
    }

    // 修改密码
    const updatePasswordAsync = async (oldPassword: string, newPassword: string) => {
        const res = await updatePassword({
            oldPassword: crypto.MD5(oldPassword).toString(),
            newPassword: crypto.MD5(newPassword).toString(),
        })
        return res.data.code === 200;
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
        return res.data.code === 200;
    }

    return {
        timer,
        users,
        userInfo,
        getAllUserAsync,
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
