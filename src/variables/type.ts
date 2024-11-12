// 客户数据结构
export type ClientItemType = {
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

// 角色数据结构
export type RoleItemType = {
    id: number,
    roleType: number,
    roleName: string,
    remark: string,
    userCount: number,
    createTime: string
}

// 简单角色数据结构
export interface IRoleProps {
    id: number,
    roleType: number,
    roleName: string
}

// 用户数据结构
export type UserItemType = {
    id: string | number,
    userName: string,
    account: string,
    roles: IRoleProps[],
    status: number | string,
    createTime: string
}

// 排序字段结构
export interface ISortProps {
    column: object,
    prop: string,
    order: string | null
}

// 渲染表单结构
export type FormItemType = {
    name: string,
    label: string,
    type: string,
    placeholder: string,
    option: object[]
}