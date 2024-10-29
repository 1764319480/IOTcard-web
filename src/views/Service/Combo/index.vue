<template>
    <div class="home">
        <div class="filter">
            <div class="form">
                <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
                    <el-form-item label="套餐名称">
                        <el-input v-model="formInline.comboName" placeholder="搜索套餐名称" clearable />
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="formInline.comboType">
                            <el-option label="全部" value="99" />
                            <el-option label="流量包" value="1" />
                            <el-option label="短信包" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="formInline.status">
                            <el-option label="全部" value="99" />
                            <el-option label="待定" value="0" />
                            <el-option label="上架" value="1" />
                            <el-option label="下架" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间" v-show="showMoreItems">
                        <el-date-picker v-model="formInline.timeList" type="daterange" start-placeholder="开始时间"
                            end-placeholder="结束时间" style="width: 220px;" value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item label="标准资费" v-show="showMoreItems">
                        <el-input-number v-model="formInline.standardTariffRange[0]" class="mx-4" :min="0" :max="10"
                            controls-position="right" style="width: 90px;" placeholder="最低" />
                        &nbsp;-&nbsp;
                        <el-input-number v-model="formInline.standardTariffRange[1]" class="mx-4" :min="0" :max="10"
                            controls-position="right" style="width: 90px;" placeholder="最高" />
                    </el-form-item>
                    <el-form-item label="销售价格" v-show="showMoreItems">
                        <el-input-number v-model="formInline.salesPriceRange[0]" class="mx-4" :min="0" :max="10"
                            controls-position="right" style="width: 90px;" placeholder="最低" />
                        &nbsp;-&nbsp;
                        <el-input-number v-model="formInline.salesPriceRange[1]" class="mx-4" :min="0" :max="10"
                            controls-position="right" style="width: 90px;" placeholder="最高" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="getComboList()">搜索</el-button>
                        <el-button :icon="Refresh" type="primary" :plain=true @click="resetForm">重置</el-button>
                        <el-button :icon="showMoreItems ? ArrowUpBold : ArrowDownBold" type="primary" :plain=true
                            @click="showMoreItems = !showMoreItems">{{ showMoreItems ? '收起' : '更多' }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="filter_right">
                <div>
                    <el-button type="primary" :icon="Plus" @click="addOrModifyCombo('添加套餐')">添加</el-button>
                    <el-button type="danger" :icon="Delete" :plain=true @click="deleteCombos">删除</el-button>
                    <el-button type="primary" :icon="Top" :plain=true>上架</el-button>
                    <el-button type="primary" :icon="Bottom" :plain=true>下架</el-button>
                </div>
                <el-dialog v-model="addOrModifyVisiable" width="680" :title="addOrModifyTitle" :show-close="false"
                    :close-on-click-modal="false" :close-on-press-escape="false">
                    <div class="form-items">
                        <el-form :inline="true" ref="ruleFormRef2" :model="ruleForm" :rules="rules"
                            label-position="left" label-width="auto" class="demo-ruleForm">
                            <el-form-item label="套餐名称:" prop="comboName">
                                <el-input v-model="ruleForm.comboName" style="width: 210px;" autocomplete="off"
                                    placeholder="请输入套餐名称" />
                            </el-form-item>
                            <el-form-item label="套餐类型:" prop="comboType">
                                <el-select v-model="ruleForm.comboType" style="width: 210px" collapse-tags
                                    collapse-tags-tooltip placeholder="请选择套餐类型">
                                    <el-option label="短信包" value="1" />
                                    <el-option label="流量包" value="2" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="标准资费:" prop="standardTariff">
                                <el-input-number v-model="ruleForm.standardTariff" class="mx-4" :min="0" :max="10"
                                    style="width: 210px;" placeholder="请输入标准资费">
                                    <template #prefix>
                                        <span>￥</span>
                                    </template>
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="销售价格:" prop="salesPrice">
                                <el-input-number v-model="ruleForm.salesPrice" class="mx-4" :min="0" :max="10"
                                    style="width: 210px;" placeholder="请输入销售价格">
                                    <template #prefix>
                                        <span>￥</span>
                                    </template>
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="有效期:" prop="comboPeriod">
                                <el-select v-model="ruleForm.comboPeriod" style="width: 210px" collapse-tags
                                    collapse-tags-tooltip placeholder="请选择有效期">
                                    <el-option label="短信包" value="1" />
                                    <el-option label="短信包" value="2" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="套餐容量:" prop="comboCapacity">
                                <el-input-number v-model="ruleForm.comboCapacity" class="mx-4" :min="0" :max="10"
                                    style="width: 210px;" placeholder="请输入套餐容量">
                                    <template #suffix>
                                        <span>M</span>
                                    </template>
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="套餐说明:">
                                <el-input v-model="ruleForm.remark" type="textarea" :rows="3" placeholder="请输入套餐说明"
                                    style="width: 550px"></el-input>
                            </el-form-item>
                            <div style="display: flex; justify-content: end;">
                                <el-button @click="cancelAddCombo" style="width:80px">取消</el-button>
                                <el-button type="primary" @click="saveAddcombo" :loading="stopClick2"
                                    style="width: 80px;">保存</el-button>
                            </div>
                        </el-form>
                    </div>
                </el-dialog>
            </div>
        </div>
        <div class="lists">
            <el-table :data="comboList" style="width: 100%" @selection-change="handleSelectionChange"
                @sort-change="handleSortChange" v-loading="tableLoading" max-height="calc(100vh - 270px)">
                <el-table-column type="selection" width="40" />
                <el-table-column property="id" label="ID" width="70" fixed />
                <el-table-column property="comboNo" label="套餐编号" width="150" show-overflow-tooltip sortable="custom" />
                <el-table-column property="comboName" label="套餐名称" width="150" show-overflow-tooltip sortable="custom" />
                <el-table-column label="有效期" width="100" sortable="custom">
                    <template #default="scope">
                        <p>{{ periodParse(scope.row.comboPeriod) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="套餐类型" width="120" sortable="custom">
                    <template #default="scope">
                        <p>{{ scope.row.comboType === 1 ? '流量包' : '短信包' }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="套餐容量" sortable="custom" width="140"
                    show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ scope.row.comboCapacity >= 1024 ? (scope.row.comboCapacity / 1024).toFixed(2) + 'G' : scope.row.comboCapacity + 'M' }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="标准资费" sortable="custom" width="120">
                    <template #default="scope">
                        <p>{{ '￥' + scope.row.standardTariff }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="销售资费" sortable="custom" width="120">
                    <template #default="scope">
                        <p>{{ '￥' + scope.row.salesPrice }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="套餐说明" width="200" show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ scope.row.remark || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80" sortable="custom">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status === 0" type="info">待定</el-tag>
                        <el-tag  v-else-if="scope.row.status === 1" type="success">上架</el-tag>
                        <el-tag v-else type="danger">下架</el-tag>
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
                                @click="addOrModifyCombo('编辑套餐', scope.row)">编辑</el-button>
                            <el-button link type="success" size="small" v-if="scope.row.status !== 1"
                            >上架</el-button>
                            <el-button link type="danger" size="small" v-if="scope.row.status === 1"
                            >下架</el-button>
                            <el-button link type="danger" size="small" v-if="scope.row.status !== 1">
                                <el-popconfirm width="220" :icon="WarningFilled" icon-color="red" title="确定删除该条记录吗?"
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
                            <el-button link type="primary" size="small">复制</el-button>
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
import { ArrowDownBold, ArrowUpBold, Bottom, Delete, Plus, Refresh, Search, Top, WarningFilled } from '@element-plus/icons-vue';
import { onBeforeMount, reactive, ref, watch } from 'vue';
// @ts-ignore
import { useComboStore } from '@/stores/combo';
// @ts-ignore
import { dateParse } from '@/utils/dateHandler';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
const showMoreItems = ref(false);
const comboStore = useComboStore();
const tableLoading = ref(false);
const addOrModifyTitle = ref('添加套餐');
const addOrModifyVisiable = ref(false);
const deleteCombosVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const ruleFormRef2 = ref<FormInstance>();
const stopClick2 = ref(false);
// 后台套餐数据总量
const total = ref(0);
// 筛选表单
const formInline = reactive({
    comboName: '',
    comboType: '99',
    status: '99',
    timeList: [],
    standardTariffRange: [],
    salesPriceRange: [],
    orderBy: 'createTime',
    orderType: 'desc'
})
// 选中时存入选项
const selectIds = ref();
const handleSelectionChange = (items: comboItem[]) => {
    if (items?.length === 0) {
        selectIds.value = '';
        return;
    }
    selectIds.value = items.map(item => item.id);
}
// 分页功能 切换到某一页
const currentpage = ref(1);
watch(currentpage, async (value: number) => {
    await getComboList(value);
})
// 表单排序
interface ISortProps {
    column: object,
    prop: string,
    order: string | null
}
const handleSortChange = async (data: ISortProps) => {
    let { prop, order } = data;
    if (!order) order = 'descending';
    formInline.orderBy = prop;
    formInline.orderType = order.replace('ending', '');
    await getComboList(currentpage.value);
}
// 有效期格式转化
const periodParse = (period: number) => {
    switch (period) {
        case 7: return '7天';
        case 30: return '1个月';
        case 90: return '3个月';
        case 180: return '6个月';
        case 360: return '1年';
        default: return '未知'
    }
}
// 新增或编辑客户表单的格式验证规则
const rules = reactive<FormRules<typeof ruleForm>>({
    comboName: [
        { required: true, message: '请输入套餐名称', trigger: 'blur' },
        { min: 1, max: 128, message: '名称长度最多 128 个字符', trigger: 'blur' },
    ],
    comboType: [
        { required: true, message: '请选择套餐类型', trigger: 'change' },
    ],
})
// 套餐数据结构
type comboItem = {
    id: number,
    comboNo: string,
    comboName: string,
    comboPeriod: number,
    comboCapacity: number,
    comboType: number,
    status: number,
    standardTariff: string,
    salesPrice: string,
    remark: string,
    createTime: string
}
// 套餐列表
const comboList = ref<comboItem[]>();
// 搜索套餐
const getComboList = async (pageNum: number = 1, pageSize: number = 20) => {
    tableLoading.value = true;
    const data = await comboStore.getComboListAsync({
        comboName: formInline.comboName,
        comboType: formInline.comboType,
        status: formInline.status,
        salesPriceRange: formInline.salesPriceRange,
        standardTariffRange: formInline.standardTariffRange,
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
const resetForm = () => {

}
// 新增或编辑套餐的表单
const ruleForm = reactive({
    id: '',
    comboName: '',
    comboType: '',
    standardTariff: undefined,
    salesPrice: undefined,
    comboPeriod: '',
    comboCapacity: undefined,
    remark: ''
})
// 打开新增或编辑套餐表单
const addOrModifyCombo = async (title: string, item?: comboItem) => {
    addOrModifyTitle.value = title;
    if (item) {
        addOrModifyVisiable.value = true;
    } else {
        addOrModifyVisiable.value = true;
        ruleFormRef2.value?.resetFields();
    }
}
// 新增或编辑套餐表单的保存按钮
const saveAddcombo = async () => {
}
// 新增或编辑套餐表单的取消按钮
const cancelAddCombo = () => {
    addOrModifyVisiable.value = false;
}
// 删除套餐
const deleteCombo = async (comboIds: string[] | number[] | string | number) => {
    let ids = Array.isArray(comboIds) ? comboIds : [comboIds];
    ids
    // let data = await comboStore.deletecomboAsync(ids);
    // if (data) {
    //     if (currentpage.value === 1) {
    //         await getcomboList()
    //     } else {
    //         currentpage.value = 1;
    //     }
    //     ElMessage({
    //         message: '删除成功',
    //         type: 'success'
    //     })
    // }
}
// 批量删除
const deleteCombos = () => {
    if (!selectIds.value) {
        ElMessage({
            message: '未选择任何数据',
            type: 'warning'
        });
        return;
    }
    deleteCombosVisible.value = true;
}
// const confirmDeleteCombos = () => {
//     deleteCombo(selectIds.value);
//     deleteCombosVisible.value = false;
// }

onBeforeMount(async () => {
    await getComboList();
})
</script>


<style lang="scss" scoped src="@/assets/css/manage.scss"></style>
<style lang="scss" scoped>
.home {
    .filter {
        .filter_right {
            >div {
                display: flex;
            }

        }
    }
}
</style>