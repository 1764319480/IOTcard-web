import { getAllRole, getRoleList } from '@/services/role';
import { defineStore } from 'pinia';
import {  ref } from 'vue';

interface IRoleListProps {
    id: number,
    roleType: number,
    roleName: string,
    remark: string,
    createTime: string
}
export const useRoleStore = defineStore('role', () => {
    // 所有角色信息
    const roleInfo = ref<IRoleListProps[]>();

    // 获取所有角色
    const getAllRoleAsync = async () => {
        const res = await getAllRole();
        if (res.data.success) {
            roleInfo.value = res.data.value;
            return true;
        }
        return false;
    }

    // 获取角色列表
    const getRoleListAsync = async (condition: object) => {
        const res = await getRoleList(condition);
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }

    return {
        roleInfo,
        getAllRoleAsync,
        getRoleListAsync
    }
},{persist: true})