<template>
    <div class="home">
        <div class="options">
            <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="登录日志" name="1"/>
                <el-tab-pane label="操作日志" name="2"/>
                <el-tab-pane label="错误日志" name="3"/>
            </el-tabs>
        </div>
        <div class="lists">
            <el-table :data="logList" style="width: 100%"  v-loading="tableLoading" height="400">
                <el-table-column property="id" label="ID" width="60"/>
                <el-table-column property="logInfo" :label="activeName === '3' ? '错误信息': '日志内容' " show-overflow-tooltip/>
                <el-table-column property="logSource" label="错误来源" width="220" v-if="activeName === '3'" show-overflow-tooltip/>
                <el-table-column property="userName" :label="activeName === '3' ? '用户' : '操作人' " width="150" 
                show-overflow-tooltip v-if="activeName !== '1' "/>
                <el-table-column property="createTime" label="创建时间" width="200"/>
            </el-table>
        </div>
        <div class="pagination">
            <p>共&nbsp;{{total}}&nbsp;条</p>
            &nbsp;
            <el-pagination layout="prev, pager, next" background :total="total" v-model:current-page="currentpage" :default-page-size="10"/>
        </div> 
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch } from 'vue';
// @ts-ignore
import { useLogStore } from '@/stores/log';
const activeName = ref('1');
const tableLoading = ref(false);
const logStore = useLogStore();
const total = ref(0);
const currentpage = ref(1);
// 日志数据结构
type logItem = {
    id: number,
    logType: number,
    logInfo: string,
    logSource?: string,
    createId: number,
    createTime: string,
    userName: string,
}
const logList = ref<logItem>();
const getLogList = async (pageNum: number = 1) => {
    tableLoading.value = true;
    const data = await logStore.getLogListAsync(Number(activeName.value), pageNum);
    if (data) {
        total.value = data.total;
        logList.value = data.list;
        tableLoading.value = false;
    } else {
        tableLoading.value = false;
    } 
}
watch(currentpage, async () => {
    await getLogList(currentpage.value);
})
watch(activeName, async () => { // 切换选项时页码回到1
    currentpage.value = 1;
})

// 刷新页面时获取一次数据
onBeforeMount(async () => {
    await getLogList(currentpage.value);
})
</script>

<style lang="scss" scoped>
.home {
        .pagination {
            margin-top: 10px;
            width: 100%;
            display: flex;
            justify-content: end;
            align-items: center;
        }
    }
</style>