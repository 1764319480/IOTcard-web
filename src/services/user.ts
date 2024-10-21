import request, { IAxiosResponse } from "@/utils/request";

/** 获取验证码 */
export function getCaptcha(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/common/captcha",
        method: "get",
        params
    });
}

/** 登录 */
export function login(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/login",
        method: "post",
        data: params
    });
}

/** 刷新token */
export function refreshToken(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/refresh_token",
        method: "get",
        data: params
    });
}

/** 获取用户信息 */
export function getUserInfo(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/my_profile",
        method: "get",
        params
    });
}

/** 修改用户信息 */
export function updateUserInfo(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/update",
        method: "post",
        data: params
    });
}

/** 修改密码 */
export function updatePassword(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/update_pwd",
        method: "post",
        data: params
    });
}

/** 退出登录 */
export function logout(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/logout",
        method: "get",
        data: params
    });
}