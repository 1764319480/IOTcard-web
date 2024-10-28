import { getAreas, getCities, getProvinces, getStreets } from '@/services/common';
import { defineStore } from 'pinia';

export const useCommonStore = defineStore('common', () => {
    
    // 获取省份列表
    const getProvincesAsync = async () => {
        const res = await getProvinces();
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    // 获取城市列表
    const getCitiesAsync = async (provinceId: number) => {
        const res = await getCities({provinceId});
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    // 获取城市分区列表
    const getAreasAsync = async (cityId: number) => {
        const res = await getAreas({cityId})
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }
    // 获取街道列表
    const getStreetsAsync = async (areaId: number) => {
        const res = await getStreets({areaId});
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }

    return {
        getProvincesAsync,
        getCitiesAsync,
        getAreasAsync,
        getStreetsAsync
    }
},{
    persist: true
});