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
                        :default-time="defaultTime" end-placeholder="结束时间" style="width: 220px;" value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item label="标准资费" v-show="showMoreItems">
                        <el-input-number v-model="formInline.standardTariffMin" class="mx-4" :min="0" :max="formInline.standardTariffMax"
                            controls-position="right" style="width: 110px;" placeholder="最低" :precision="2"/>
                        &nbsp;-&nbsp;
                        <el-input-number v-model="formInline.standardTariffMax" class="mx-4" :min="formInline.standardTariffMin"
                            controls-position="right" style="width: 110px;" placeholder="最高" :precision="2"/>
                    </el-form-item>
                    <el-form-item label="销售价格" v-show="showMoreItems">
                        <el-input-number v-model="formInline.salesPriceMin" class="mx-4" :min="0" :max="formInline.salesPriceMax"
                            controls-position="right" style="width: 110px;" placeholder="最低" :precision="2"/>
                        &nbsp;-&nbsp;
                        <el-input-number v-model="formInline.salesPriceMax" class="mx-4" :min="formInline.salesPriceMin"
                            controls-position="right" style="width: 110px;" placeholder="最高" :precision="2"/>
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
                    <el-button type="primary" :icon="Plus" @click="addOrModifyCombo(1)">添加</el-button>
                    <el-button type="danger" :icon="Delete" :plain=true @click="operateItems(0)">删除</el-button>
                    <el-button type="primary" :icon="Top" :plain=true @click="operateItems(1)">上架</el-button>
                    <el-button type="primary" :icon="Bottom" :plain=true @click="operateItems(2)">下架</el-button>
                </div>
                <el-dialog v-model="addOrModifyVisiable" width="680" :title="addOrModifyTitle === 1 ? '添加套餐' : '编辑套餐' " :show-close="false"
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
                                    <el-option label="流量包" value="1" />
                                    <el-option label="短信包" value="2" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="标准资费:" prop="standardTariff">
                                <el-input-number v-model="ruleForm.standardTariff" class="mx-4" :min="0" :max="999999"
                                    style="width: 210px;" placeholder="请输入标准资费" :precision="2">
                                    <template #prefix>
                                        <span>￥</span>
                                    </template>
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="销售价格:" prop="salesPrice">
                                <el-input-number v-model="ruleForm.salesPrice" class="mx-4" :min="0" :max="999999"
                                    style="width: 210px;" placeholder="请输入销售价格" :precision="2">
                                    <template #prefix>
                                        <span>￥</span>
                                    </template>
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="有效期:" prop="comboPeriod">
                                <el-select v-model="ruleForm.comboPeriod" style="width: 210px" collapse-tags
                                    collapse-tags-tooltip placeholder="请选择有效期">
                                    <el-option label="7天" value="7" />
                                    <el-option label="1个月" value="30" />
                                    <el-option label="3个月" value="90" />
                                    <el-option label="6个月" value="180" />
                                    <el-option label="1年" value="360" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="套餐容量:" prop="comboCapacity">
                                <el-input-number v-model="ruleForm.comboCapacity" class="mx-4" :min="0" :max="ruleForm.comboType === '1' ? undefined : 999999 "
                                    style="width: 210px;" placeholder="请输入套餐容量">
                                    <template #suffix>
                                        <span>{{ ruleForm.comboType === '1' ? 'M' : '条' }}</span>
                                    </template>
                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="套餐说明:">
                                <el-input v-model="ruleForm.remark" type="textarea" :rows="3" placeholder="请输入套餐说明"
                                    style="width: 550px"></el-input>
                            </el-form-item>
                            <div style="display: flex; justify-content: end;">
                                <el-button @click="addOrModifyVisiable = false;" style="width:80px">取消</el-button>
                                <el-button type="primary" @click="saveAddcombo" :loading="stopClick2"
                                    style="width: 80px;">保存</el-button>
                            </div>
                        </el-form>
                    </div>
                </el-dialog>
                <el-dialog v-model="operateItemsVisible" width="250" :show-close="false">
                    <div class="delete_class">
                        <div class="delete_title">{{'确认' + optionTitles[optionTitle] + '?'}}</div>
                        <div class="delete_data">
                            <el-icon :color="optionTitle === 1 ? 'blue' : 'red' " size="20">
                                <WarningFilled />
                            </el-icon>
                            &nbsp;
                            <p>{{'将' + optionTitles[optionTitle] + selectIdAndStatus[0]?.length + '条套餐，' + (optionTitle === 2 ? '下架后相关套餐将不可用！' : '请谨慎操作！') }}</p>
                        </div>
                    </div>
                    <template #footer>
                        <div class="dialog-footer">
                            <el-button @click="operateItemsVisible = false">取消</el-button>
                            <el-button :type="optionTitle === 1 ? 'primary' : 'danger' " @click="confirmOperate">
                                确认
                            </el-button>
                        </div>
                    </template>
                </el-dialog>
            </div>
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
                                @click="addOrModifyCombo(2, scope.row)">编辑</el-button>
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
import { ArrowDownBold, ArrowUpBold, Bottom, Delete, Plus, Refresh, Search, Top, WarningFilled } from '@element-plus/icons-vue';
import { onBeforeMount, reactive, ref, watch } from 'vue';
// @ts-ignore
import { useComboStore } from '@/stores/combo';
// @ts-ignore
import { dateParse } from '@/utils/dateHandler';
// @ts-ignore
import { PeriodMap } from '@/variables/common';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

const showMoreItems = ref(false);
const comboStore = useComboStore();
const tableLoading = ref(false);
const addOrModifyTitle = ref(1);
const addOrModifyVisiable = ref(false);
const ruleFormRef = ref<FormInstance>();
const ruleFormRef2 = ref<FormInstance>();
const stopClick2 = ref(false);
const operateItemsVisible = ref(false);
const optionTitle = ref();
const selectIdAndStatus = ref();
const currentpage = ref(1);
const optionTitles = ['删除', '上架', '下架'];
const total = ref(0);// 后台套餐数据总量
const comboList = ref<ComboItemType[]>();// 套餐列表
const defaultTime = ref<[Date, Date]>([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
])
const statusList = ref([
    {type: 'info', label: '待定'},
    {type: 'success', label: '上架'},
    {type: 'danger', label: '下架'}
])
interface ISortProps {// 表单排序
    column: object,
    prop: string,
    order: string | null
}
// 套餐数据结构
type ComboItemType = {
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
// 筛选表单
const formInline = reactive({
    comboName: '',
    comboType: '99',
    status: '99',
    timeList: [],
    standardTariffMin: undefined as undefined | number,
    standardTariffMax: undefined as undefined | number,
    salesPriceMin: undefined as undefined | number,
    salesPriceMax: undefined as undefined | number,
    orderBy: 'createTime',
    orderType: 'desc'
})
// 新增或编辑套餐的表单
const ruleForm = reactive({
    id: '' as string | number,
    comboName: '',
    comboType: '',
    standardTariff: undefined as undefined | number | string,
    salesPrice: undefined as undefined | number | string,
    comboPeriod: '',
    comboCapacity: undefined as undefined | number,
    remark: ''
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
// 新增或编辑客户表单的格式验证规则
const validateCapacity = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value > 999999 && ruleForm.comboType === '2') {
    callback(new Error("短信条数至多999999条"))
  } else {
    callback()
    rule;
  }
}
const rules = reactive<FormRules<typeof ruleForm>>({
    comboName: [
        { required: true, message: '请输入套餐名称', trigger: 'blur' },
        { min: 1, max: 128, message: '名称长度最多 128 个字符', trigger: 'blur' },
    ],
    comboType: [
        { required: true, message: '请选择套餐类型', trigger: 'change' },
    ],
    standardTariff: [
        { required: true, message: '请输入标准资费', trigger: 'blur' },
    ],
    salesPrice: [
        { required: true, message: '请输入销售价格', trigger: 'blur' },
    ],
    comboPeriod: [
        { required: true, message: '请选择有效期', trigger: 'change' },
    ],
    comboCapacity: [
        { required: true, message: '请输入套餐容量', trigger: 'blur' },
        { validator: validateCapacity, trigger: 'blur' }
    ],
})
// 搜索套餐
const getComboList = async (pageNum: number = 1, pageSize: number = 20) => {
    tableLoading.value = true;
    const data = await comboStore.getComboListAsync({
        comboName: formInline.comboName || undefined,
        comboType: formInline.comboType === '99' ? undefined : formInline.comboType,
        status: formInline.status === '99' ? undefined : formInline.status,
        salesPriceRange: [formInline.salesPriceMin || 0, formInline.salesPriceMax || 999999],
        standardTariffRange: [formInline.standardTariffMin || 0, formInline.standardTariffMax || 999999],
        startTime: formInline.timeList[0],
        endTime: formInline.timeList[1],
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
    formInline.standardTariffMin = undefined;
    formInline.standardTariffMax = undefined;
    formInline.salesPriceMin = undefined;
    formInline.salesPriceMax = undefined;
    if (currentpage.value === 1) {
        await getComboList()
    } else {
        currentpage.value = 1;
    }
}
// 重置新增或编辑套餐表单
const resetForm1 = () => {
    ruleFormRef2.value?.resetFields();
    ruleForm.id = '';
    ruleForm.comboName = '';
    ruleForm.comboPeriod = '';
    ruleForm.comboCapacity = undefined;
    ruleForm.comboType = '';
    ruleForm.standardTariff = undefined;
    ruleForm.salesPrice = undefined;
    ruleForm.remark = '';
}
// 打开新增或编辑套餐表单
const addOrModifyCombo = async (title: number, item?: ComboItemType) => {
    addOrModifyTitle.value = title;
    if (item) {
        ruleForm.id = item.id;
        ruleForm.comboName = item.comboName;
        ruleForm.comboPeriod = item.comboPeriod.toString();
        ruleForm.comboCapacity = item.comboCapacity;
        ruleForm.comboType = item.comboType.toString();
        ruleForm.standardTariff = item.standardTariff;
        ruleForm.salesPrice = item.salesPrice;
        ruleForm.remark = item.remark;
    } else {
        resetForm1();
    }
    addOrModifyVisiable.value = true;
}
// 新增或编辑套餐表单的保存按钮
const saveAddcombo = async () => {
    if (!ruleFormRef2.value) return
    await ruleFormRef2.value.validate(async (valid) => {
        if (valid) {
            stopClick2.value = true;
            const conditions = {
                id: ruleForm.id,
                comboName: ruleForm.comboName,
                comboPeriod: ruleForm.comboPeriod,
                comboCapacity: ruleForm.comboCapacity,
                comboType: ruleForm.comboType,
                standardTariff: ruleForm.standardTariff,
                salesPrice: ruleForm.salesPrice,
                remark: ruleForm.remark || undefined
            }
            let data: any;
            if (addOrModifyTitle.value === 2) {
                data = await comboStore.updateComboAsync(conditions);
            } else {
                data = await comboStore.addComboAsync(conditions);
            }
            if (data) {
                if (addOrModifyTitle.value === 2) {
                    await getComboList(currentpage.value);
                } else {
                    if (currentpage.value === 1) {
                        await getComboList()
                    } else {
                        currentpage.value = 1;
                    }
                }
                ElMessage({
                    message: addOrModifyTitle.value === 2 ? '编辑成功' : '添加成功',
                    type: 'success'
                })
                addOrModifyVisiable.value = false;
            }
            stopClick2.value = false;
        } else {
            console.log('error submit!')
        }
    })
}
// 删除套餐
const deleteCombo = async (comboIds: string[] | number[] | string | number) => {
    let ids = Array.isArray(comboIds) ? comboIds : [comboIds];
    const data = await comboStore.deleteComboAsync(ids);
    if (data) {
        if (currentpage.value === 1) {
            await getComboList()
        } else {
            currentpage.value = 1;
        }
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
    }
}
// 上下架套餐
const changeComboStatus = async (id: (number | string)[] | string | number, status: number) => {
    const ids = Array.isArray(id) ? id : [id];
    const data = await comboStore.updateComboStatusAsync(ids, status);
    if (data) {
        await getComboList(currentpage.value);
        ElMessage({
            message: status === 1 ? '上架成功' : '下架成功',
            type: 'success'
        })
    }
}
// 复制套餐
const copyCombo = async (id: number) => {
    const data = await comboStore.copyComboAsync(id);
    if (data) {
        await getComboList();
        ElMessage({
            message: '复制成功',
            type: 'success'
        })
    }
}
// 批量操作
const operateItems = (title: number) => {
    if (!selectIdAndStatus.value) {
        ElMessage({
            message: '请选择需要操作的套餐',
            type: 'warning'
        });
        return;
    }  
    if (title === 0 && selectIdAndStatus.value[1].includes(1)) {
        ElMessage({
            message: '无法删除已上架的套餐',
            type: 'warning'
        });
        return;
    }
    if (title === 1 && selectIdAndStatus.value[1].includes(1)) {
        ElMessage({
            message: '已上架的套餐无法再次操作上架',
            type: 'warning'
        });
        return;
    };
    if (title === 2 && (selectIdAndStatus.value[1].includes(0) || selectIdAndStatus.value[1].includes(2))) {
        ElMessage({
            message: '未上架的套餐无法下架',
            type: 'warning'
        });
        return;
    };
    optionTitle.value = title;
    operateItemsVisible.value = true;
}
const confirmOperate = async () => {
    operateItemsVisible.value = false;
    switch(optionTitle.value) {
        case 0: {
            await deleteCombo(selectIdAndStatus.value[0]);
            break;
        }
        case 1: {
            await changeComboStatus(selectIdAndStatus.value[0], 1);
            break;
        }
        case 2: {
            await changeComboStatus(selectIdAndStatus.value[0], 2);
            break;
        }
    } 
}
// 分页功能 切换到某一页
watch(currentpage, async (value: number) => {
    await getComboList(value);
})
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