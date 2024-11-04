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
