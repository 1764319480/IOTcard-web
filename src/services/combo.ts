import request, { IAxiosResponse } from "@/utils/request";

/** 添加套餐 */
export function addCombo(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/combo/add",
        method: "post",
        data: params
    });
}

/** 修改套餐 */
export function updateCombo(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/combo/update",
        method: "post",
        data: params
    });
}

/** 套餐上下架 */
export function updateComboStatus(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/combo/update_status",
        method: "post",
        data: params
    });
}

/** 复制套餐 */
export function copyCombo(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/combo/copy",
        method: "post",
        data: params
    });
}

/** 删除套餐 */
export function deleteCombo(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/combo/delete",
        method: "post",
        data: params
    });
}

/** 获取套餐详情 */
export function getCombo(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/combo/get",
        method: "post",
        params
    });
}

/** 获取所有已上架套餐 */
export function getAllCombo(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/combo/list_all",
        method: "get",
        params
    });
}

/** 获取套餐列表 */
export function getComboList(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/combo/list",
        method: "post",
        data: params
    });
}

