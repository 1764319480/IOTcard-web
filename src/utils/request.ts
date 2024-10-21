import axios, { AxiosResponse } from "axios";
import { ElMessage } from 'element-plus';
import { getCookie } from "./cookieHandler";

interface IResponseData {
    code: number;
    message: string;
    success: boolean;
    value: any;
    datetime: number;
}

export interface IAxiosResponse extends AxiosResponse<IResponseData> {

}

// 防抖
let timer: any = null;
const debounce = (fn: Function, delay: number = 500) => {
    if (timer) {
        clearTimeout(timer);
    }
    timer = setTimeout(() => {
        fn();
    }, delay);
};

// 创建 Axios 实例
const axiosInstance = axios.create({
    baseURL: '/api', // API 基础路径
    timeout: 30 * 1000,  // 请求超时时间
});

// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
    // 在发送请求之前做些什么
    // 例如：在请求头中携带 token
    const token = getCookie('access_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 响应拦截器
axiosInstance.interceptors.response.use((response: IAxiosResponse) => {
    // 对响应数据做点什么
    if (response.status === 200) {
        if ([401, 403].includes(response.data.code)) {
            // 使用防抖，防止短时间内多次弹出错误提示
            debounce(() => {
                ElMessage.error({
                    message: response.data.message,
                    onClose: () => {
                        // 跳转到登录页面
                        window.location.href = `/login?redirect_url=${encodeURIComponent(window.location.href)}`;
                    }
                });
            })
        }

        if ([400, 500].includes(response.data.code)) {
            debounce(() => {
                ElMessage.error(response.data.message);
            })
        }
    }

    return response;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;