import { addRole, deleteRole, getAllRole, getRoleList, updateRole } from '@/services/role';
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

    // 添加角色
    const addRoleAsync = async (roleType: number, roleName: string, remark: string) => {
        const res = await addRole({
            roleType,
            roleName,
            remark
        })
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }

    // 修改角色
    const updateRoleAsync = async (roleId: number, roleType: number, roleName?: string, remark?: string) => {
        const res = await updateRole({
            roleId,
            roleType,
            roleName,
            remark
        })
        return res.data.code === 200;
    }

    // 删除角色
    const deleteRoleAsync = async (roleIds: number[]) => {
        const res = await deleteRole({roleIds})
        return res.data.code === 200;
    }
    
    return {
        roleInfo,
        getAllRoleAsync,
        getRoleListAsync,
        addRoleAsync,
        updateRoleAsync,
        deleteRoleAsync
    }
},{persist: true})