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
        params
    });
}

/** 获取所有用户 */
export function getAllUser(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/list_all",
        method: "get",
        params
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
export function logout() {
    return request<any, IAxiosResponse>({
        url: "/user/logout",
        method: "get"
    });
}

/** 获取用户列表 */
export function getUserList(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/list",
        method: "post",
        data: params
    });
}

/** 添加用户 */
export function addUser(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/add",
        method: "post",
        data: params
    });
}

/** 删除用户 */
export function deleteUser(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/user/delete",
        method: "post",
        data: params
    });
}