<template>
    <el-menu :default-active="active" router>
        <template v-for="item in menus">
            <el-sub-menu v-if="item.children" :index="item.path" :key="item.path">
                <template #title>
                    <el-icon>
                        <component :is="item.icon " />
                    </el-icon>
                    <span>{{ item.label }}</span>
                </template>
                <el-menu-item v-for="subItem in item.children" :index="subItem.path" :key="subItem.path">{{ subItem.label }}</el-menu-item>
            </el-sub-menu>
            <el-menu-item v-else :index="item.path" :key="item.label">
                <el-icon>
                    <component :is="item.icon" />
                </el-icon>
                <span>{{ item.label }}</span>
            </el-menu-item>
        </template>
    </el-menu>
</template>

<script lang="ts" setup>
// @ts-ignore
import menus from '@/variables/menus'
defineProps<{ active: string }>();
</script>