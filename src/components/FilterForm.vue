<template>
    <div class="form">
        <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
            <el-form-item v-for="item in formItemList" :label="item.label" :key="item.name">
                <el-input v-if="item.type === 'input'" v-model="formInline[item.name]" :placeholder="item.placeholder"
                    clearable />
                <el-select v-if="item.type === 'select'" v-model="formInline[item.name]">
                    <el-option v-for="i in item.option" :label="i.label" :value="i.value" :key="i.label" />
                </el-select>
                <el-date-picker v-if="item.type === 'date'" v-model="formInline[item.name]" type="daterange"
                    start-placeholder="开始时间" :default-time="defaultTime" end-placeholder="结束时间" style="width: 220px;"
                    value-format="YYYY-MM-DD HH:mm:ss" />
                    <el-input-number v-if="item.type === 'number'" v-model="formInline[item.name][0]" class="mx-4" :min="0"
                        :max="formInline[item.name][1]" controls-position="right" style="width: 110px;"
                        placeholder="最低" :precision="2" />
                    <p v-if="item.type === 'number'">&nbsp;-&nbsp;</p>
                    <el-input-number v-if="item.type === 'number'" v-model="formInline[item.name][1]" class="mx-4"
                        :min="formInline[item.name][0]" controls-position="right" style="width: 110px;"
                        placeholder="最高" :precision="2" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="emits('search')">搜索</el-button>
                <el-button :icon="Refresh" type="primary" :plain=true @click="emits('resetForm')">重置</el-button>
                <slot></slot>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue'
import { ref } from 'vue';
const { formItemList, formInline } = defineProps(['formItemList', 'formInline']);
const emits = defineEmits(['search', 'resetForm']);
const defaultTime = ref<[Date, Date]>([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
])
</script>

<script lang="ts">
export default {
    name: 'FilterForm'
}
</script>
