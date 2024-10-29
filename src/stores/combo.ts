import { addCombo, copyCombo, deleteCombo, getAllCombo, getCombo, getComboList, updateCombo } from '@/services/combo';
import { defineStore } from 'pinia';

export const useComboStore = defineStore('combo', () => {
    // 获取已上架套餐
    const getAllComboAsync = async (keyword?: string) => {
        const res = await getAllCombo({
            keyword
        })
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    // 添加套餐
    const addComboAsync = async (condition: Object) => {
        const res = await addCombo(condition);
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    // 修改套餐
    const updateComboAsync = async (condition: object) => {
        const res = await updateCombo(condition);
        return res.data.code === 200;
    }
    // 上下架套餐
    const updateComboStatusAsync = async (id: number, status: number) => {
        const res = await updateCombo({
            id,
            status
        })
        return res.data.code === 200;
    }
    // 复制套餐
    const copyComboAsync = async (id: number) => {
        const res = await copyCombo({id});
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    // 删除套餐
    const deleteComboAsync = async (ids: (number | string)[]) => {
        const res = await deleteCombo({ids});
        return res.data.code === 200;
    }
    // 获取套餐详情
    const getComboAsync = async (id: number | string) => {
        const res = await getCombo({id});
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    // 获取套餐列表
    const getComboListAsync = async (condition: object) => {
        const res = await getComboList(condition);
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    return {
        getAllComboAsync,
        addComboAsync,
        updateComboAsync,
        updateComboStatusAsync,
        copyComboAsync,
        deleteComboAsync,
        getComboAsync,
        getComboListAsync
    }
},{
    persist: true
});