import request, { IAxiosResponse } from "@/utils/request";

/** 获取省份列表 */
export function getProvinces(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/common/address/provinces",
        method: "get",
        params
    });
}

/** 获取城市列表 */
export function getCities(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/common/address/cities",
        method: "get",
        params
    });
}

/** 获取城市分区列表 */
export function getAreas(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/common/address/areas",
        method: "get",
        params
    });
}

/** 获取街道列表 */
export function getStreets(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/common/address/streets",
        method: "get",
        params
    });
}