import { defineStore } from 'pinia';
import { ref } from 'vue';
import crypto from 'crypto-js';
import { setCookie } from '@/utils/cookieHandler';
import { login, getCaptcha } from '@/services/user';

export const useLoginStore = defineStore('login', () => {
    const verifyCode = ref<string>('');
    const sessionId = ref<string>('');

    const getCaptchaAsync = async () => {
        const res = await getCaptcha({ sessionId: sessionId.value });

        if (res.data.code === 200) {
            verifyCode.value = res.data.value?.captcha;
            sessionId.value = res.data.value?.sessionId;
        }
    }

    const loginAsync = async (account: string, password: string, code: string) => {
        const res = await login({
            account,
            password: crypto.MD5(password).toString(),
            sessionId: sessionId.value,
            verifyCode: code
        });

        if (res.data.code === 200) {
            setCookie('access_token', res.data.value);
        }

        return res.data.success;
    }

    return {
        verifyCode,
        sessionId,
        loginAsync,
        getCaptchaAsync
    }
}, {
    persist: false, // 开启持久化
});
