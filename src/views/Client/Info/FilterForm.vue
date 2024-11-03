<template>
    <div class="form">
        <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
            <el-form-item label="客户名称">
                <el-input v-model="formInline.clientName" placeholder="搜索客户名称" clearable />
            </el-form-item>
            <el-form-item label="客户类型">
                <el-select v-model="formInline.clientType">
                    <el-option label="全部" value="9999" />
                    <el-option label="个人客户" value="1" />
                    <el-option label="企业客户" value="2" />
                </el-select>
            </el-form-item>
            <el-form-item label="联系人">
                <el-input v-model="formInline.contact" placeholder="联系人" clearable></el-input>
            </el-form-item>
            <el-form-item label="联系号码">
                <el-input v-model="formInline.contactPhone" placeholder="联系号码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="emit('getClientList');">搜索</el-button>
                <el-button :icon="Refresh" type="primary" :plain=true @click="emit('resetForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { Refresh, Search } from '@element-plus/icons-vue';
const { formInline } = defineProps(['formInline']);
const emit = defineEmits(['getClientList', 'resetForm']);
</script>
<script lang="ts">
export default {
    name: 'filterForm'
}
</script>