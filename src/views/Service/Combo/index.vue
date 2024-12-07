<template>
    <div class="home">
        <div class="filter">
            <FilterForm :form-inline="formInline" :form-item-list="formItemList" @reset-form="resetForm" @search="getComboList">
                <el-button :icon="showMoreItems ? ArrowUpBold : ArrowDownBold" type="primary" :plain=true
                    @click="showMoreItems = !showMoreItems">{{ showMoreItems ? '收起' : '更多' }}</el-button>
            </FilterForm>
            <Operation ref="operation" :currentpage="currentpage" :select-id-and-status="selectIdAndStatus"
            @change-page="changePage" @get-combo-list="getComboList" @delete-combo="deleteCombo"
            @change-combo-status="({id, status}) => changeComboStatus(id, status)"></Operation>
        </div>
        <div class="lists">
            <el-table :data="comboList" style="width: 100%" @selection-change="handleSelectionChange"
                @sort-change="handleSortChange" v-loading="tableLoading" :max-height="showMoreItems ? 'calc(100vh - 320px)' : 'calc(100vh - 270px)'">
                <el-table-column type="selection" width="40" />
                <el-table-column property="id" label="ID" width="70" fixed />
                <el-table-column property="comboNo" label="套餐编号" width="150" show-overflow-tooltip sortable="custom" />
                <el-table-column property="comboName" label="套餐名称" width="150" show-overflow-tooltip sortable="custom" />
                <el-table-column property="comboPeriod" label="有效期" width="100" sortable="custom">
                    <template #default="scope">
                        <p>{{ PeriodMap.get(scope.row.comboPeriod) }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="comboType" label="套餐类型" width="120" sortable="custom">
                    <template #default="scope">
                        <p>{{ scope.row.comboType === 1 ? '流量包' : '短信包' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="comboCapacity" label="套餐容量" sortable="custom" width="140"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ scope.row.comboType === 1 ? capacityParse(scope.row.comboCapacity) : scope.row.comboCapacity + '条' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="standardTariff" label="标准资费" sortable="custom" width="120">
                    <template #default="scope">
                        <p>{{ '￥' + scope.row.standardTariff }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="salesPrice" label="销售资费" sortable="custom" width="120">
                    <template #default="scope">
                        <p>{{ '￥' + scope.row.salesPrice }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="套餐说明" width="200" show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ scope.row.remark || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="status" label="状态" width="80" sortable="custom">
                    <template #default="scope">
                        <el-tag :type="statusList[scope.row.status].type">{{ statusList[scope.row.status].label }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column property="createTime" label="创建时间" width="200" sortable="custom">
                    <template #default="scope">
                        <p>{{ dateParse(scope.row.createTime) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" fixed="right">
                    <template #default="scope">
                        <div>
                            <el-button link type="primary" size="small" v-if="scope.row.status === 0"
                                @click="operation.addOrModifyCombo(2, scope.row)">编辑</el-button>
                            <el-button link type="success" size="small" v-if="scope.row.status !== 1">
                                <el-popconfirm width="220" :icon="WarningFilled" icon-color="blue" title="确定上架该套餐吗?"
                                    @confirm="changeComboStatus(scope.row.id, 1)">
                                    <template #reference>
                                        <p>上架</p>
                                    </template>
                                    <template #actions="{ confirm, cancel }">
                                        <div style="margin-top: 15px;">
                                            <el-button size="small" @click="cancel">取消</el-button>
                                            <el-button type="primary" size="small" @click="confirm">确定</el-button>
                                        </div>
                                    </template>
                                </el-popconfirm>
                            </el-button>
                            <el-button link type="danger" size="small" v-if="scope.row.status === 1">
                                <el-popconfirm width="220" :icon="WarningFilled" icon-color="red" title="确定下架该套餐吗?"
                                    @confirm="changeComboStatus(scope.row.id, 2)">
                                    <template #reference>
                                        <p>下架</p>
                                    </template>
                                    <template #actions="{ confirm, cancel }">
                                        <div style="margin-top: 15px;">
                                            <el-button size="small" @click="cancel">取消</el-button>
                                            <el-button type="danger" size="small" @click="confirm">确定</el-button>
                                        </div>
                                    </template>
                                </el-popconfirm>
                            </el-button>
                            <el-button link type="danger" size="small" v-if="scope.row.status !== 1">
                                <el-popconfirm width="220" :icon="WarningFilled" icon-color="red" title="确定删除该套餐吗?"
                                    @confirm="deleteCombo(scope.row.id)">
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
                            <el-button link type="primary" size="small">
                                <el-popconfirm width="220" :icon="WarningFilled" icon-color="blue" title="确定复制该套餐吗?"
                                    @confirm="copyCombo(scope.row.id)">
                                    <template #reference>
                                        <p>复制</p>
                                    </template>
                                    <template #actions="{ confirm, cancel }">
                                        <div style="margin-top: 15px;">
                                            <el-button size="small" @click="cancel">取消</el-button>
                                            <el-button type="primary" size="small" @click="confirm">确定</el-button>
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
import { WarningFilled, ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue'
import { onBeforeMount, reactive, ref, watch, computed } from 'vue'
import FilterForm from '@/components/FilterForm.vue'
import Operation from './Operation.vue'
import { useComboStore } from '@/stores/combo'
import { dateParse } from '@/utils/dateHandler'
import { PeriodMap } from '@/variables/common'
import {ComboItemType, ISortProps, FormItemType} from '@/variables/type'
import { ElMessage } from 'element-plus'
const operation = ref();
const showMoreItems = ref(false);
const comboStore = useComboStore();
const tableLoading = ref(false);
const selectIdAndStatus = ref();
const currentpage = ref(1);
const total = ref(0);// 后台套餐数据总量
const comboList = ref<ComboItemType[]>();// 套餐列表
const statusList = ref([
    {type: 'info', label: '待定'},
    {type: 'success', label: '上架'},
    {type: 'danger', label: '下架'}
])
const formItemListAll = <FormItemType[]>[
    {name: 'comboName', label: '套餐名称', type: 'input', placeholder: '搜索套餐名称', option: []},
    {name: 'comboType', label: '类型', type: 'select', placeholder: '', option: [{label: '全部', value: '99'}, {label: '流量包', value: '1'}, {label: '短信包', value: '2'}]},
    {name: 'status', label: '状态', type: 'select', placeholder: '', option: [{label: '全部', value: '99'}, {label: '待定', value: '0'}, {label: '上架', value: '1'}, {label: '下架', value: '2'}]},
    {name: 'timeList', label: '创建时间', type: 'date', placeholder: '', option: []},
    {name: 'standardTariff', label: '标准资费', type: 'number', placeholder: '', option: []},
    {name: 'salesPrice', label: '销售价格', type: 'number', placeholder: '', option: []}
]
const formItemList = computed(() => showMoreItems.value ? formItemListAll : formItemListAll.slice(0, -3));
const formInline = reactive({
    comboName: '',
    comboType: '99',
    status: '99',
    timeList: [],
    standardTariff: [],
    salesPrice: [],
    orderBy: 'createTime',
    orderType: 'desc'
})
// 选中时存入选项
const handleSelectionChange = (items: ComboItemType[]) => {
    if (items?.length === 0) {
        selectIdAndStatus.value = '';
        return;
    }
    selectIdAndStatus.value = [items.map(item => item.id), items.map(item => item.status)];
}
const handleSortChange = async (data: ISortProps) => {
    let { prop, order } = data;
    if (!order) order = 'descending';
    formInline.orderBy = prop;
    formInline.orderType = order.replace('ending', '');
    await getComboList(currentpage.value);
}
// 套餐容量-流量格式转化
const capacityParse = (capacity: number) => {
    if (capacity < 1024) return capacity + 'M';
    if (capacity < 1024 * 1024) return (capacity / 1024).toFixed(2) + 'G';
    return (capacity / 1024 / 1024).toFixed(2) + 'T';
}
// 搜索套餐
const getComboList = async (pageNum: number = 1, pageSize: number = 20) => {
    tableLoading.value = true;
    const data = await comboStore.getComboListAsync({
        comboName: formInline.comboName || undefined,
        comboType: formInline.comboType === '99' ? undefined : formInline.comboType,
        status: formInline.status === '99' ? undefined : formInline.status,
        salesPriceRange: [formInline.salesPrice[0] || 0, formInline.salesPrice[1] || 999999],
        standardTariffRange: [formInline.standardTariff[0] || 0, formInline.standardTariff[1] || 999999],
        startTime: formInline.timeList?.[0],
        endTime: formInline.timeList?.[1],
        pageNum,
        pageSize,
        orderBy: formInline.orderBy,
        orderType: formInline.orderType
    })
    if (data) {
        total.value = data.total;
        comboList.value = data.list;
    }
    tableLoading.value = false;
}
// 重置筛选表单
const resetForm = async () => {
    formInline.comboName = '';
    formInline.comboType = '99';
    formInline.status = '99';
    formInline.timeList = [];
    formInline.standardTariff = [];
    formInline.salesPrice = [];
    if (currentpage.value === 1) {
        await getComboList()
    } else {
        currentpage.value = 1;
    }
}
// 删除套餐
const deleteCombo = async (comboIds: string[] | number[] | string | number) => {
    let ids = Array.isArray(comboIds) ? comboIds : [comboIds];
    const data = await comboStore.deleteComboAsync(ids);
    if (data) {
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
        if (currentpage.value === 1) {
            await getComboList()
        } else {
            currentpage.value = 1;
        }
    }
}
// 上下架套餐
const changeComboStatus = async (id: (number | string)[] | string | number, status: number) => {
    const ids = Array.isArray(id) ? id : [id];
    const data = await comboStore.updateComboStatusAsync(ids, status);
    if (data) {
        ElMessage({
            message: status === 1 ? '上架成功' : '下架成功',
            type: 'success'
        })
        await getComboList(currentpage.value);
    }
}
// 复制套餐
const copyCombo = async (id: number) => {
    const data = await comboStore.copyComboAsync(id);
    if (data) {
        ElMessage({
            message: '复制成功',
            type: 'success'
        })
        await getComboList();
    }
}
// 分页功能 切换到某一页
const changePage = (value:number) => {
    currentpage.value = value;
}
watch(currentpage, async (value: number) => {
    await getComboList(value);
})
onBeforeMount(async () => {
    await getComboList();
})
</script>


<style lang="scss" src="@/assets/css/manage.scss"></style>