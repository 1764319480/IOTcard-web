import { RoleTypeList } from "@/variables/common"
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
  let max = 99;
  try {
    for (let k in roleArray) {
      if (Number(roleArray[k].roleType) < max) max = Number(roleArray[k].roleType);
    }
  } catch (error) {
    console.error(error);
  }
  return max;
};
/**
 * 提取角色类型名称
 * @param value 
 * @returns string
 */
export const getRoleTypeFont = (value: number) => {
    for(let k of RoleTypeList) {
        if (k.value === value)
        return k.label;
    }
    return '未知'
}