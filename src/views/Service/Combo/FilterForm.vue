<template>
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
                    :default-time="defaultTime" end-placeholder="结束时间" style="width: 220px;"
                    value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item label="标准资费" v-show="showMoreItems">
                <el-input-number v-model="formInline.standardTariffMin" class="mx-4" :min="0"
                    :max="formInline.standardTariffMax" controls-position="right" style="width: 110px;" placeholder="最低"
                    :precision="2" />
                &nbsp;-&nbsp;
                <el-input-number v-model="formInline.standardTariffMax" class="mx-4" :min="formInline.standardTariffMin"
                    controls-position="right" style="width: 110px;" placeholder="最高" :precision="2" />
            </el-form-item>
            <el-form-item label="销售价格" v-show="showMoreItems">
                <el-input-number v-model="formInline.salesPriceMin" class="mx-4" :min="0"
                    :max="formInline.salesPriceMax" controls-position="right" style="width: 110px;" placeholder="最低"
                    :precision="2" />
                &nbsp;-&nbsp;
                <el-input-number v-model="formInline.salesPriceMax" class="mx-4" :min="formInline.salesPriceMin"
                    controls-position="right" style="width: 110px;" placeholder="最高" :precision="2" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="emits('getComboList')">搜索</el-button>
                <el-button :icon="Refresh" type="primary" :plain=true @click="emits('resetForm')">重置</el-button>
                <el-button :icon="showMoreItems ? ArrowUpBold : ArrowDownBold" type="primary" :plain=true
                    @click="changeShowMore">{{ showMoreItems ? '收起' : '更多' }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDownBold, ArrowUpBold, Refresh, Search } from '@element-plus/icons-vue'

const { formInline } = defineProps(['formInline']);
const emits = defineEmits(['getComboList', 'resetForm', 'changeShowMore']);
const showMoreItems = ref(false);
const defaultTime = ref<[Date, Date]>([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
])
const changeShowMore = () => {
    showMoreItems.value = !showMoreItems.value;
    emits('changeShowMore', showMoreItems.value);
}
</script>
<script lang="ts">
export default {
    name: 'filterForm'
}
</script>