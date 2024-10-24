import { getAllRole } from '@/services/role';
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
    const roleList = ref<IRoleListProps[]>();

    // 获取所有角色
    const getAllRoleAsync = async () => {
        const res = await getAllRole();
        if (res.data.success) {
            roleList.value = res.data.value;
            return true;
        }
        return false;
    }

    return {
        roleList,
        getAllRoleAsync
    }
},{persist: true})