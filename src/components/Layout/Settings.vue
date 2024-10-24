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
                            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm"
                                hide-required-asterisk="false" :rules="rules" label-width="auto" class="demo-ruleForm">
                                <el-form-item label="昵称" prop="userName">
                                    <el-input v-model="ruleForm.userName" autocomplete="off" style="width: 200px;"/>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div v-if="tab === 2" class="form-items-wrapper">
                        <div class="form-title">修改密码</div>
                        <div class="form-items">
                            <el-form ref="ruleFormRef" style="max-width: 600px" :model="ruleForm" hide-required-asterisk="false"
                                :rules="rules" label-width="auto" class="demo-ruleForm">
                                <el-form-item label="原密码" prop="oldPassword">
                                    <el-input v-model="ruleForm.oldPassword" type="password" style="width: 200px;" autocomplete="off" show-password placeholder="请输入原密码"/>
                                </el-form-item>
                                <el-form-item label="新密码" prop="newPassword">
                                    <el-input v-model="ruleForm.newPassword" type="password" style="width: 200px;" autocomplete="off" show-password placeholder="请输入新密码"/>
                                </el-form-item>
                                <el-form-item label="确认密码" prop="checkPassword">
                                    <el-input v-model="ruleForm.checkPassword" type="password" style="width: 200px;" autocomplete="off" show-password placeholder="请再次输入新密码"/>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
                <div class="form-footer">
                    <el-button @click="handleClose" style="width: 80px;">关闭</el-button>
                    <el-button type="primary" @click="handleSave(ruleFormRef)" :loading="stopClick" style="width: 80px;">保存</el-button>
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch, reactive } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
// @ts-ignore
import { useUserStore } from '@/stores/user';
const ruleFormRef = ref<FormInstance>()
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
const userStore = useUserStore();
const ruleForm = reactive({
    userName: userStore.userInfo.userName,
    oldPassword: '',
    newPassword: '',
    checkPassword: ''
})
const stopClick = ref(false);
// 表单验证规则
const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (ruleForm.checkPassword !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPassword')
    }
    callback()
    rule;
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== ruleForm.newPassword) {
    callback(new Error("两次密码输入不相同"))
  } else {
    callback()
    rule;
  }
}
const rules = reactive<FormRules<typeof ruleForm>>({
    userName: [
        { required: true, message: '请输入昵称', trigger: 'blur' },
        { min: 1, max: 16, message: '昵称长度最长16位', trigger: 'blur' }
    ],
    oldPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字', trigger: 'blur' },
    ],
    newPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字', trigger: 'blur' },
        { validator: validatePass, trigger: 'blur' }
    ],
    checkPassword: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字', trigger: 'blur' },
        { validator: validatePass2, trigger: 'blur' }
    ]
})
// 修改昵称
const updateUserName = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            stopClick.value = true;
            const data = await userStore.updateUserInfoAsync(userStore.userInfo.id, ruleForm.userName);
            if(data) {
                userStore.getUserInfoAsync();
                ElMessage({
                    message: '修改成功',
                    type: 'success'
                })
                stopClick.value = false;
            }else {
                stopClick.value = false;
            }  
        } else {
            console.log('error submit!')
        }
    })
}
// 修改密码
const updatePassword = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid) => {
        if (valid) {
            stopClick.value = true;
            const data = await userStore.updatePasswordAsync(ruleForm.oldPassword, ruleForm.newPassword);
            if(data) {
                ruleForm.oldPassword = '';
                ruleForm.newPassword = '';
                ruleForm.checkPassword = '';
                ElMessage({
                    message: '修改成功',
                    type: 'success'
                })
                stopClick.value = false;
            }else {
                stopClick.value = false;
            }  
        } else {
            console.log('error submit!')
        }
    })
}
// 监听外部的 open 变化
watch(() => props.open, (open) => {
    ruleFormRef.value?.resetFields();
    tab.value = 1;
    isVisible.value = open;
});

const handleClose = () => {
    // 关闭弹窗时，通知外部更新 open 状态
    emit('update:open', false);
}

const handleSave = (formEl: FormInstance | undefined) => {
    if (tab.value === 1) {
        updateUserName(formEl);
        // 处理保存修改资料逻辑
    } else if (tab.value === 2) {
        updatePassword(formEl)
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
                    margin-top: 10%;
                    height: calc(100% - 40px);
                    overflow-y: auto;
                    width: 80%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
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