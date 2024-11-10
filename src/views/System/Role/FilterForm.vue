<template>
    <div class="form">
        <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
            <el-form-item label="关键字">
                <el-input v-model="formInline.keyword" placeholder="搜索名称/描述" clearable />
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="formInline.roleType">
                    <el-option label="全部" value='9999' />
                    <el-option v-for="item of RoleTypeList" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="emits('getRoleList')">搜索</el-button>
                <el-button :icon="Refresh" type="primary" :plain=true @click="emits('resetForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue'
import { RoleTypeList } from '@/variables/common'
const { formInline } = defineProps(['formInline']);
const emits = defineEmits(['getRoleList', 'resetForm']);
</script>
<script lang="ts">
export default {
    name: 'filterForm'
}
</script>