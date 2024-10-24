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