
import { addClient, deleteClient, getAllClient, getClient, getClientList, updateClient } from '@/services/client';
import { defineStore } from 'pinia';
import { ref } from 'vue';
interface IClientListProps {
    id: number,
    clientNo: string,
    clientName: string,
    contact: string,
    contactPhone: string
}
export const useClientStore = defineStore('client', () => {
    // 所有客户信息
    const ClientInfo = ref<IClientListProps[]>()
    // 获取所有客户
    const getAllClientAsync = async (keyword?: string) => {
        const res = await getAllClient(keyword);
        if (res.data.code === 200) {
            ClientInfo.value = res.data.value;
            return true;
        }
        return false;
    }
    // 获取客户列表
    const getClientListAsync = async (condition: object) => {
        const res = await getClientList(condition);
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    // 添加用户
    const addClientAsync = async (condition: object) => {
        const res = await addClient(condition);
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    // 修改客户
    const updateClientAsync = async (condition: object) => {
        const res = await updateClient(condition);
        return res.data.code === 200;
    }
    // 删除用户
    const deleteClientAsync = async (ids: (string | number)[]) => {
        const res = await deleteClient({ids});
        return res.data.code === 200; 
    }
    // 获取客户详情
    const getClientAsync = async (id: number | string) => {
        const res = await getClient(id);
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }

    return {
        ClientInfo,
        getAllClientAsync,
        getClientListAsync,
        addClientAsync,
        updateClientAsync,
        deleteClientAsync,
        getClientAsync
    }
},{
    persist: true
});