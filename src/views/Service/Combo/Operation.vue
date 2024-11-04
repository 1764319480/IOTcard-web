<template>
    <div class="filter_right">
        <div>
            <el-button type="primary" :icon="Plus" @click="addOrModifyCombo(1)">添加</el-button>
            <el-button type="danger" :icon="Delete" :plain=true @click="operateItems(0)">删除</el-button>
            <el-button type="primary" :icon="Top" :plain=true @click="operateItems(1)">上架</el-button>
            <el-button type="primary" :icon="Bottom" :plain=true @click="operateItems(2)">下架</el-button>
        </div>
        <el-dialog v-model="addOrModifyVisiable" width="680" :title="addOrModifyTitle === 1 ? '添加套餐' : '编辑套餐'"
            :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="form-items">
                <el-form :inline="true" ref="ruleFormRef2" :model="ruleForm" :rules="rules" label-position="left"
                    label-width="auto" class="demo-ruleForm">
                    <el-form-item label="套餐名称:" prop="comboName">
                        <el-input v-model="ruleForm.comboName" style="width: 210px;" autocomplete="off"
                            placeholder="请输入套餐名称" />
                    </el-form-item>
                    <el-form-item label="套餐类型:" prop="comboType">
                        <el-select v-model="ruleForm.comboType" style="width: 210px" collapse-tags collapse-tags-tooltip
                            placeholder="请选择套餐类型">
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
                        <el-input-number v-model="ruleForm.comboCapacity" class="mx-4" :min="0"
                            :max="ruleForm.comboType === '1' ? undefined : 999999" style="width: 210px;"
                            placeholder="请输入套餐容量">
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
                <div class="delete_title">{{ '确认' + optionTitles[optionTitle] + '?' }}</div>
                <div class="delete_data">
                    <el-icon :color="optionTitle === 1 ? 'blue' : 'red'" size="20">
                        <WarningFilled />
                    </el-icon>
                    &nbsp;
                    <p>{{ '将' + optionTitles[optionTitle] + selectIdAndStatus[0]?.length + '条套餐，' + (optionTitle === 2 ?
                        '下架后相关套餐将不可用！' : '请谨慎操作！') }}</p>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="operateItemsVisible = false">取消</el-button>
                    <el-button :type="optionTitle === 1 ? 'primary' : 'danger'" @click="confirmOperate">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { Bottom, Delete, Plus, Top, WarningFilled } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
// @ts-ignore
import { useComboStore } from '@/stores/combo';
// @ts-ignore
import { dateParse } from '@/utils/dateHandler';
// @ts-ignore
import { PeriodMap } from '@/variables/common';
// @ts-ignore
import { ComboItemType } from '@/variables/common';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

const comboStore = useComboStore();
const addOrModifyTitle = ref(1);
const addOrModifyVisiable = ref(false);
const ruleFormRef2 = ref<FormInstance>();
const stopClick2 = ref(false);
const operateItemsVisible = ref(false);
const optionTitle = ref();
const optionTitles = ['删除', '上架', '下架'];
const { selectIdAndStatus, currentpage } = defineProps(['selectIdAndStatus', 'currentpage']);
const emits = defineEmits(['getComboList', 'changePage', 'deleteCombo', 'changeComboStatus'])
// 新增或编辑套餐的表单
const ruleForm = reactive<ComboFormType>({
    id: '' as string | number,
    comboName: '',
    comboType: '',
    standardTariff: undefined,
    salesPrice: undefined,
    comboPeriod: '',
    comboCapacity: undefined,
    remark: ''
})
type ComboFormType = {
    id: string | number,
    comboName: string,
    comboType: string,
    standardTariff: undefined | string,
    salesPrice: undefined | string,
    comboPeriod: string,
    comboCapacity: undefined | number,
    remark: string
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
// 重置新增或编辑套餐表单
const resetForm1 = () => {
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
    ruleFormRef2.value?.resetFields();
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
                ElMessage({
                    message: addOrModifyTitle.value === 2 ? '编辑成功' : '添加成功',
                    type: 'success'
                })
                addOrModifyVisiable.value = false;
                if (addOrModifyTitle.value === 2) {
                    emits('getComboList', currentpage);
                } else {
                    if (currentpage === 1) {
                        emits('getComboList');
                    } else {
                        emits('changePage', 1);
                    }
                }
            }
            stopClick2.value = false;
        } else {
            console.log('error submit!')
        }
    })
}
// 批量操作
const operateItems = (title: number) => {
    if (!selectIdAndStatus) {
        ElMessage({
            message: '请选择需要操作的套餐',
            type: 'warning'
        });
        return;
    }
    if (title === 0 && selectIdAndStatus[1].includes(1)) {
        ElMessage({
            message: '无法删除已上架的套餐',
            type: 'warning'
        });
        return;
    }
    if (title === 1 && selectIdAndStatus[1].includes(1)) {
        ElMessage({
            message: '已上架的套餐无法再次操作上架',
            type: 'warning'
        });
        return;
    };
    if (title === 2 && (selectIdAndStatus[1].includes(0) || selectIdAndStatus[1].includes(2))) {
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
    switch (optionTitle.value) {
        case 0: {
            emits('deleteCombo', selectIdAndStatus[0]);
            break;
        }
        case 1: {
            emits('changeComboStatus', {id: selectIdAndStatus[0], status: 1});
            break;
        }
        case 2: {
            emits('changeComboStatus', {id: selectIdAndStatus[0], status: 2});
            break;
        }
    }
}
defineExpose({
    addOrModifyCombo
})
</script>

<script lang="ts">
export default {
    name: 'operation'
}
</script>
<style scoped lang="scss">
.filter_right {
    >div {
        display: flex;
    }
}
</style>