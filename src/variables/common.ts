export const RoleTypeList = [
    { value: 1, label: '系统管理员' },
    { value: 2, label: '管理员' },
    { value: 3, label: '普通用户' }
];

export const UserStatusList = [
    { value: 0, label: '禁用' },
    { value: 1, label: '启用' }
];

export const PeriodMap = new Map<number, string> ([
    [7, '7天'],
    [30, '1个月'],
    [90, '3个月'],
    [180, '6个月'],
    [360, '1年'],
])

export type ClientItemType = {// 客户数据结构
    id: number,
    clientNo: string,
    clientName: string,
    clientType: number,
    contact: string,
    contactPhone: string,
    contactProvince: number,
    contactProvinceName: string,
    contactCity: number,
    contactCityName: string,
    contactArea: number,
    contactAreaName: string,
    contactStreet: number,
    contactStreetName: string,
    contactAddress: string,
    salesman: number,
    selesmanName: string,
    createTime: string
}

// 套餐数据结构
export type ComboItemType = {
    id: number,
    comboNo: string,
    comboName: string,
    comboPeriod: number,
    comboCapacity: number,
    comboType: number,
    status: number,
    standardTariff: string,
    salesPrice: string,
    remark: string,
    createTime: string
}