<template>
    <el-dialog class="settings-dialog" v-model="isVisible" width="500" :show-header="false" :show-close="false"
        :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="settings-dialog-content">
            <div class="options">
                <div class="title">设置</div>
                <div v-for="(item) in tabList" :key="item.value" class="option-item"
                    :class="{ 'active': tab === item.value }" @click="tab = item.value">
                    <div class="label">{{ item.label }}</div>
                </div>
            </div>
            <div class="form">
                <div class="form-body">
                    <div v-if="tab === 1" class="form-items-wrapper">
                        <div class="form-title">修改资料</div>
                        <div class="form-items">
                            <!-- 修改资料 Form 表单 -->
                        </div>
                    </div>
                    <div v-if="tab === 2" class="form-items-wrapper">
                        <div class="form-title">修改密码</div>
                        <div class="form-items">
                            <!-- 修改密码 Form 表单 -->
                        </div>
                    </div>
                </div>
                <div class="form-footer">
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSave">保存</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const tabList = [{
    label: '修改资料',
    value: 1
}, {
    label: '修改密码',
    value: 2
}];
const props = defineProps<{ open: boolean }>();
const emit = defineEmits(['update:open', 'openchange']); // 使用 emit 定义事件

const isVisible = ref(props.open);
const tab = ref(1);

// 监听外部的 open 变化
watch(() => props.open, (open) => {
    isVisible.value = open;
});

const handleClose = () => {
    // 关闭弹窗时，通知外部更新 open 状态
    emit('update:open', false);
}

const handleSave = () => {
    if (tab.value === 1) {
        // 处理保存修改资料逻辑
    } else if (tab.value === 2) {
        // 处理保存修改密码逻辑
    }
}

</script>

<style lang="scss">
.settings-dialog {
    padding: 0;

    >.el-dialog__header {
        display: none !important;
    }

    >.el-dialog__body>.settings-dialog-content {
        display: flex;
        height: 330px;

        .options {
            width: 140px;
            height: 100%;
            border-right: 1px solid #e0e0e0;

            .title {
                font-weight: 600;
                font-size: 16px;
                height: 50px;
                padding: 0 16px;
                display: flex;
                align-items: center;
            }
        }

        .option-item {
            height: 40px;
            padding: 0 8px;
            display: flex;
            align-items: center;
            cursor: pointer;

            .label {
                padding: 0 8px;
                width: 100%;
                height: 32px;
                display: inline-flex;
                align-items: center;
                border-radius: 4px;
            }

            &:hover {
                color: #5995FD;
            }
        }

        .active {
            color: #5995FD;

            .label {
                background-color: rgba(89, 149, 253, 0.05);
            }
        }

        .form {
            height: 100%;
            flex-grow: 1;

            .form-body {
                height: calc(100% - 50px);

                .form-items-wrapper {
                    height: 100%;
                }

                .form-title {
                    height: 40px;
                    display: flex;
                    align-items: center;
                    padding: 0 16px;
                }

                .form-items {
                    height: calc(100% - 40px);
                    overflow-y: auto;
                    width: 100%;
                }
            }

            .form-footer {
                padding: 0 16px;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: flex-end;
            }
        }
    }
}
</style>