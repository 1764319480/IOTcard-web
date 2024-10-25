import request, { IAxiosResponse } from "@/utils/request";

/** 获取所有角色 */
export function getAllRole() {
    return request<any, IAxiosResponse>({
        url: "/role/list_all",
        method: "get"
    });
}

/** 获取角色列表 */
export function getRoleList(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/role/list",
        method: "post",
        data: params
    });
}

/** 添加角色 */
export function addRole(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/role/add",
        method: "post",
        data: params
    });
}

/** 修改角色 */
export function updateRole(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/role/update",
        method: "post",
        data: params
    });
}

/** 删除角色 */
export function deleteRole(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/role/delete",
        method: "post",
        data: params
    });
}