<template>
    <div class="header">
        <div class="header-left">
            <span>IOT 管理平台</span>
        </div>
        <div class="header-right">
            <el-popover placement="bottom-end" title="" :width="200" trigger="click">
                <template #reference>
                    <span>
                        <UserFilled />
                    </span>
                </template>
                <div class="user-name">
                    <span>
                        <UserFilled />
                    </span>
                    <span :title="user.userName">{{ user.userName }}</span>
                </div>
                <div class="settings" @click="openSettings = true">
                    <span>
                        <Setting />
                    </span>
                    <span>设置</span>
                </div>
                <div class="logout" @click="handleLogout">
                    <span>
                        <CircleClose />
                    </span>
                    <span>退出</span>
                </div>
            </el-popover>
        </div>
        <Settings :open="openSettings" @update:open="openSettings = $event" />
    </div>
</template>

<script setup lang="ts">
import Settings from './Settings.vue';
import { ElMessageBox } from 'element-plus'
import type { Action } from 'element-plus'
import { UserFilled, Setting, CircleClose } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { ref } from 'vue';

const openSettings = ref(false);
const userStore = useUserStore();
const user = userStore.userInfo;

const handleLogout = () => {
    ElMessageBox.confirm(
        '即将退出登录，是否继续',
        '退出登录',
        {
            distinguishCancelAndClose: true,
            confirmButtonText: '确认退出',
            cancelButtonText: '取消',
        }
    ).then(() => {
        userStore.logoutAsync();
    }).catch((action: Action) => {
        // 点击了取消
    })
};
</script>

<style lang="scss" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    user-select: none;

    &-left {
        font-size: 20px;
        font-weight: bold;
        color: #000;
    }

    &-right {
        span {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #f5f5f5;

            svg {
                width: 20px;
                height: 20px;
                color: #909aaa;
            }
        }
    }
}

.user-name {
    height: 40px;
    display: flex;
    align-items: center;
    overflow: hidden;
    gap: 8px;
    user-select: none;

    >span {
        &:first-child {
            width: 24px;
            min-width: 24px;
            height: 24px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background-color: #f5f5f5;

            svg {
                width: 16px;
                height: 16px;
                color: #909aaa;
            }
        }

        &:last-child {
            font-weight: 600;
            flex-grow: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: calc(100% - 32px);
        }
    }
}

.settings,
.logout {
    height: 36px;
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;

    &:hover {
        font-weight: 600;

        svg {
            color: #3D3D3D;
        }
    }

    >span {
        &:first-child {
            width: 24px;
            min-width: 24px;
            height: 24px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        svg {
            width: 20px;
            height: 20px;
            color: #909aaa;
        }
    }
}
</style>