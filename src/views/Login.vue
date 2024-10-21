<template>
    <div class="container">
        <div class="login-wrapper">
            <div class="left"></div>
            <div class="right">
                <div class="title">登录</div>
                <div class="form">
                    <el-form ref="formRef" :model="formValue" :rules="formRules" label-width="auto" :size="formSize">
                        <el-form-item label="" prop="account">
                            <div class="input-wrapper">
                                <img alt="" src="@/assets/icons/icon-account-box-fill.svg" />
                                <el-input prefix-icon="" v-model="formValue.account" placeholder="请输入账号"
                                    @keyup.enter="handleLogin(formRef)" />
                            </div>
                        </el-form-item>
                        <el-form-item label="" prop="password">
                            <div class="input-wrapper">
                                <img alt="" src="@/assets/icons/icon-lock-fill.svg" />
                                <el-input prefix-icon="" v-model="formValue.password" placeholder="请输入密码"
                                    @keyup.enter="handleLogin(formRef)" type="password">
                                </el-input>
                            </div>
                        </el-form-item>
                        <el-form-item label="" prop="verifyCode">
                            <div class="verify-code">
                                <div class="input-wrapper">
                                    <img alt="" src="@/assets/icons/icon-shield-check-fill.svg" />
                                    <el-input prefix-icon="" v-model="formValue.verifyCode"
                                        @keyup.enter="handleLogin(formRef)" placeholder="请输入验证码"></el-input>
                                </div>
                                <img class="captcha" alt="" :src="loginStore.verifyCode"
                                    @click="loginStore.getCaptchaAsync" />
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="login-btn">
                    <el-button type="primary" @click="handleLogin(formRef)">
                        登录
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { useLoginStore } from '@/stores/login'

interface FormValueProps {
    account: string;
    password: string;
    verifyCode: string;
}

const router = useRouter()
const loginStore = useLoginStore()
const formRef = ref<FormInstance>()
const formSize = ref<ComponentSize>('default')
const formValue = reactive<FormValueProps>({
    account: '',
    password: '',
    verifyCode: '',
})
const formRules = reactive<FormRules<FormValueProps>>({
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 4, max: 16, message: '账号长度在 4 到 16 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: '账号只能包含字母和数字', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, max: 16, message: '密码长度在 8 到 16 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: '密码只能包含字母和数字', trigger: 'blur' },
    ],
    verifyCode: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 4, max: 4, message: '验证码长度为 4 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: '验证码只能包含字母和数字', trigger: 'blur' },
    ]
})

onMounted(async () => {
    await loginStore.getCaptchaAsync();
})

const handleLogin = async (formEl?: FormInstance) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const isSuccess = await loginStore.loginAsync(formValue.account, formValue.password, formValue.verifyCode)

            if (isSuccess) {
                const params = new URLSearchParams(window.location.search);
                const redirectUrl = params.get('redirect_url');
                
                // 如果有重定向地址，则跳转到该地址，否则跳转到首页
                if (redirectUrl) {
                    window.location.href = decodeURIComponent(redirectUrl);
                    return;
                }

                router.push('/home');
            } else {
                await loginStore.getCaptchaAsync();
            }
        }
    })
}

</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    &::before,
    &::after {
        content: '';
        position: fixed;
        background-size: cover;
        pointer-events: none;
        z-index: 1;
    }

    &::before {
        top: -200px;
        right: -200px;
        width: 644px;
        height: 644px;
        background-image: url('@/assets/images/circle-1.png');
    }

    &::after {
        bottom: -120px;
        left: -120px;
        width: 300px;
        height: 300px;
        background-image: url('@/assets/images/circle-2.png');
    }

    .login-wrapper {
        display: flex;
        width: 530px;
        height: 350px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.3);
        position: relative;
        z-index: 2;

        .left,
        .right {
            width: 50%;
            height: 100%;
        }

        .left {
            background-color: #5995FD;
            background-image: url('@/assets/images/login-left.png');
            background-size: cover;
            pointer-events: none;
        }

        .right {
            padding: 24px;

            .title {
                font-weight: 600;
                font-size: 18px;
            }

            .form {
                margin-top: 32px;

                :deep(.el-input__wrapper) {
                    box-shadow: none;
                    background-color: transparent;
                }

                .input-wrapper {
                    border-bottom: 1px solid #CBD5E0;
                    display: flex;
                }

                .verify-code {
                    display: flex;

                    >img {
                        min-width: 100px;
                        cursor: pointer;
                    }
                }
            }

            .login-btn {
                padding-top: 32px;

                :deep(.el-button) {
                    background-color: #5995FD;
                    width: 100%;
                }
            }
        }
    }
}
</style>