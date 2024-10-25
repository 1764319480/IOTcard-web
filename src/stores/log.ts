import { getLogList } from '@/services/log';
import { defineStore } from 'pinia';

export const useLogStore = defineStore('log', () => {
    // 获取日志列表
    const getLogListAsync = async (type: number, pageNum: number, pageSize: number = 20, startTime?:string, endTime?: string) => {
        const res = await getLogList({
            type,
            pageNum,
            pageSize,
            startTime,
            endTime
        })
        if (res.data.code === 200) {
            return res.data.value;
        }
        return false;
    }

    return {
        getLogListAsync
    }
},{
    persist: true
});