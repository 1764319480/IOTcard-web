/**
 * 获取最高权限
 * @param roleArray
 * @returns number
 */
interface IRoleProps {
    id: number,
    roleName: string
}
export const getMaxPermission = (roleArray: IRoleProps[]) => {
    let max = Number(roleArray[0].id);
    for (let k of roleArray) {
        if (Number(k.id) < max) max = Number(k.id);
    }
    return max;
}