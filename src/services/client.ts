import request, { IAxiosResponse } from "@/utils/request";

/** 获取所有客户 */
export function getAllClient(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/client/list_all",
        method: "get",
        params
    });
}

/** 获取客户列表 */
export function getClientList(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/client/list",
        method: "post",
        data: params
    });
}

/** 添加客户 */
export function addClient(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/client/add",
        method: "post",
        data: params
    });
}

/** 修改客户 */
export function updateClient(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/client/update",
        method: "post",
        data: params
    });
}

/** 删除客户 */
export function deleteClient(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/client/delete",
        method: "post",
        data: params
    });
}

/** 获取客户详情 */
export function getClient(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/client/get",
        method: "get",
        params
    });
}
