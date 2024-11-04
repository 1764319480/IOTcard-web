<template>
    <div class="home">
        <div class="filter">
            <FilterForm :form-inline="formInline" @get-client-list="getClientList" @reset-form="resetForm"></FilterForm>
            <Operation ref="operation" :currentpage="currentpage" :select-ids="selectIds" @change-page="changePage" 
            @get-client-list="getClientList" @delete-client="deleteClient"></Operation>
        </div>
        <div class="lists">
            <el-table :data="clientList" style="width: 100%" @selection-change="handleSelectionChange"
                @sort-change="handleSortChange" v-loading="tableLoading" max-height="calc(100vh - 270px)">
                <el-table-column type="selection" width="40" />
                <el-table-column property="id" label="ID" width="70" fixed />
                <el-table-column property="clientNo" label="客户编号" width="150" show-overflow-tooltip sortable="custom" />
                <el-table-column property="clientName" label="客户名称" width="220" show-overflow-tooltip
                    sortable="custom" />
                <el-table-column property="clientType" label="客户类型" width="120" sortable="custom">
                    <template #default="scope">
                        <p>{{ scope.row.clientType === 1 ? '个人客户' : '企业用户' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="contact" label="联系人" sortable="custom" width="120" show-overflow-tooltip />
                <el-table-column property="contactPhone" label="联系号码" sortable="custom" width="120" />
                <el-table-column label="联系地址" width="250" show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ (scope.row.contactProvinceName || '') + (scope.row.contactCityName || '')+ (scope.row.contactAreaName || '') +
                            (scope.row.contactStreetName || '') + (scope.row.contactAddress || '') || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="salesmanName" label="业务员" width="150"
                    show-overflow-tooltip="" />
                <el-table-column property="createTime" label="创建时间" width="200" sortable="custom">
                    <template #default="scope">
                        <p>{{ dateParse(scope.row.createTime) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                    <template #default="scope">
                        <div>
                            <el-button link type="primary" size="small"
                                @click="operation.addOrModifyClient(2, scope.row)">编辑</el-button>
                            <el-button link type="danger" size="small">
                                <el-popconfirm width="220" :icon="WarningFilled" icon-color="red" title="确定删除该条记录吗?"
                                    @confirm="deleteClient(scope.row.id)">
                                    <template #reference>
                                        <p>删除</p>
                                    </template>
                                    <template #actions="{ confirm, cancel }">
                                        <div style="margin-top: 15px;">
                                            <el-button size="small" @click="cancel">取消</el-button>
                                            <el-button type="danger" size="small" @click="confirm">确定</el-button>
                                        </div>
                                    </template>
                                </el-popconfirm>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <p>共&nbsp;{{ total }}&nbsp;条</p>
                &nbsp;
                <el-pagination layout="prev, pager, next" :total="total" v-model:current-page="currentpage" background
                    :default-page-size="20" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import FilterForm from './FilterForm.vue';
import Operation from './Operation.vue';
// @ts-ignore
import { useClientStore } from '@/stores/client';
// @ts-ignore
import { dateParse } from '@/utils/dateHandler';
// @ts-ignore
import { ClientItemType } from '@/variables/common';
import { WarningFilled } from '@element-plus/icons-vue';
import { ref, reactive, onBeforeMount, watch } from 'vue';
import { ElMessage } from 'element-plus';

const operation = ref();
const clientStore = useClientStore();
const tableLoading = ref(false);
const clientList = ref<ClientItemType[]>();
const total = ref(0);// 客户列表数据总数
const selectIds = ref();// 多选时选中的id集合
const currentpage = ref(1);
const formInline = reactive({// 筛选的选项
    clientName: '',
    clientType: '9999',
    contact: '',
    contactPhone: '',
    timeList: [],
    orderBy: 'createTime',
    orderType: 'desc'
})
interface ISortProps {// 排序选项结构
    column: object,
    prop: string,
    order: string | null
}
// 选中条件：有权限
// const selectable = ref(true);
// 选中时存入选项
const handleSelectionChange = (items: ClientItemType[]) => {
    if (items?.length === 0) {
        selectIds.value = '';
        return;
    }
    selectIds.value = items.map(item => item.id);
}
// 获取客户列表
const getClientList = async (pageNum: number = 1, pageSize: number = 20) => {
    tableLoading.value = true;
    const data = await clientStore.getClientListAsync({
        clientName: formInline.clientName,
        clientType: formInline.clientType === '9999' ? undefined : formInline.clientType,
        contact: formInline.contact,
        contactPhone: formInline.contactPhone,
        pageNum,
        pageSize,
        orderBy: formInline.orderBy,
        orderType: formInline.orderType
    })
    if (data) {
        total.value = data.total;
        clientList.value = data.list;
    }
    tableLoading.value = false;
}
// 重置筛选的表单内容
const resetForm = async () => {
    formInline.clientName = '';
    formInline.clientType = '9999';
    formInline.contact = '';
    formInline.contactPhone = '';
    if (currentpage.value === 1) {
        await getClientList()
    } else {
        currentpage.value = 1;
    }
}
// 表单排序
const handleSortChange = async (data: ISortProps) => {
    let { prop, order } = data;
    if (!order) order = 'descending';
    formInline.orderBy = prop;
    formInline.orderType = order.replace('ending', '');
    await getClientList(currentpage.value);
}

// 删除客户
const deleteClient = async (clientIds: string[] | number[] | string | number) => {
    let ids = Array.isArray(clientIds) ? clientIds : [clientIds];
    let data = await clientStore.deleteClientAsync(ids);
    if (data) {
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
        if (currentpage.value === 1) {
            await getClientList()
        } else {
            currentpage.value = 1;
        }  
    }
}
// 分页功能 切换到某一页
const changePage = (value: number) => {
    currentpage.value = value;
}
watch(currentpage, async (value: number) => {
    await getClientList(value);
})
// 进入页面前获取一次数据
onBeforeMount(async () => {
    await getClientList();
})

</script>

<style lang="scss" src="@/assets/css/manage.scss"></style>