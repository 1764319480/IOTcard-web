<template>
    <div class="form">
        <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
            <el-form-item label="关键字">
                <el-input v-model="formInline.keyword" placeholder="搜索用户名/账号" clearable />
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="formInline.roleId">
                    <el-option label="全部" value="9999" />
                    <el-option v-for="item of roleStore.roleInfo" :label="item.roleName" :value="item.id"
                        :key="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="formInline.status">
                    <el-option label="全部" value="99" />
                    <el-option v-for="item of UserStatusList" :label="item.label" :value="item.value"
                        :key="item.value" />
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker v-model="formInline.timeList" type="daterange" start-placeholder="开始时间"
                    :default-time="defaultTime" end-placeholder="结束时间" style="width: 220px;"
                    value-format="YYYY-MM-DD HH:mm:ss" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :icon="Search" @click="emits('getUserList')">搜索</el-button>
                <el-button :icon="Refresh" type="primary" :plain=true @click="emits('resetForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Refresh } from '@element-plus/icons-vue'
// @ts-ignore
import { useRoleStore } from '@/stores/role'
// @ts-ignore
import { UserStatusList } from '@/variables/common'
const roleStore = useRoleStore();
const { formInline } = defineProps(['formInline']);
const emits = defineEmits(['getUserList', 'resetForm']);
const defaultTime = ref<[Date, Date]>([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
])
</script>
<script lang="ts">
export default {
    name: 'filterForm'
}
</script>