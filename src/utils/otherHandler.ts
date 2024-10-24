/**
 * 获取最高权限
 * @param roleArray
 * @returns number
 */
interface IRoleProps {
    id: number,
    roleType: number
    roleName: string
}
export const getMaxPermission = (roleArray: IRoleProps[]) => {
    let max = Number(roleArray[0].roleType);
    for (let k of roleArray) {
        if (Number(k.roleType) < max) max = Number(k.roleType);
    }
    return max;
}