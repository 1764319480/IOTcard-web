import request, { IAxiosResponse } from "@/utils/request";

/** 获取日志列表 */
export function getLogList(params: any = {}) {
    return request<any, IAxiosResponse>({
        url: "/logs/list",
        method: "post",
        data: params
    });
}