<template>
    <div class="filter_right">
        <div v-if="getMaxPermission(userStore.userInfo.roles) !== 3">
            <el-button type="primary" :icon="Plus" @click="addOrModifyRole(1)">添加</el-button>
            <el-button type="danger" :icon="Delete" :plain=true @click="deleteRoles">删除</el-button>
        </div>
        <el-dialog v-model="addOrModifyVisiable" width="400" :title="addOrModifyTitle === 1 ? '添加角色' : '编辑角色'"
            :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="form-items">
                <el-form ref="ruleFormRef2" style="max-width: 600px" :model="ruleForm" :rules="rules" label-width="auto"
                    class="demo-ruleForm">
                    <el-form-item label="名称:" prop="roleName">
                        <el-input v-model="ruleForm.roleName" style="width: 200px;" autocomplete="off"
                            placeholder="请输入名称" />
                    </el-form-item>
                    <el-form-item label="类型:" prop="roleType">
                        <el-select v-model="ruleForm.roleType" style="width: 200px" collapse-tags collapse-tags-tooltip
                            placeholder="请选择角色类型">
                            <el-option v-for="item of RoleTypeList" :label="item.label" :value="item.value"
                                :key="item.value"
                                v-show="(addOrModifyTitle === 1 && getMaxPermission(userStore.userInfo.roles) <= item.value)
                                    || (addOrModifyTitle === 2 && getMaxPermission(userStore.userInfo.roles) < item.value)" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="描述:" prop="remark">
                        <el-input v-model="ruleForm.remark" type="textarea" style="width: 300px;" :rows="4"
                            autocomplete="off" placeholder="描述（可选）" />
                    </el-form-item>
                    <div style="display: flex; justify-content: end;">
                        <el-button @click="addOrModifyVisiable = false;" style="width:80px">取消</el-button>
                        <el-button type="primary" @click="saveAddRole" :loading="stopClick2"
                            style="width: 80px;">保存</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog v-model="deleteRolesVisible" width="250" :show-close="false">
            <div class="delete_class">
                <div class="delete_title">确认删除?</div>
                <div class="delete_data">
                    <el-icon color="red" size="20">
                        <WarningFilled />
                    </el-icon>
                    &nbsp;
                    <p>将删除{{ selectIds.length }}条记录，请谨慎操作！</p>
                </div>
            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="deleteRolesVisible = false">取消</el-button>
                    <el-button type="danger" @click="confirmDeleteRoles">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { Delete, Plus, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { RoleTypeList } from '@/variables/common'
import { RoleItemType } from '@/variables/type'
import { getMaxPermission } from '@/utils/otherHandler'
import { useUserStore } from '@/stores/user'
import { useRoleStore } from '@/stores/role'
const userStore = useUserStore();
const roleStore = useRoleStore();
const addOrModifyVisiable = ref(false);
const addOrModifyTitle = ref(1);
const deleteRolesVisible = ref(false);
const ruleFormRef2 = ref<FormInstance>();
const stopClick2 = ref(false);
const { selectIds, currentpage } = defineProps(['selectIds', 'currentpage']);
const emits = defineEmits(['getRoleList', 'deleteRole', 'changePage']);
// 新增或编辑角色的表单
const ruleForm = reactive({
    roleId: 0,
    roleName: '',
    roleType: '' as string | number,
    remark: ''
})
// 打开新增或编辑角色表单
const addOrModifyRole = (title: number, item?: RoleItemType) => {
    addOrModifyTitle.value = title;
    ruleFormRef2.value?.resetFields();
    if (item) {
        ruleForm.roleId = item.id;
        ruleForm.roleName = item.roleName;
        ruleForm.roleType = item.roleType;
        ruleForm.remark = item.remark;
    } else {
        ruleForm.roleName = '';
        ruleForm.roleType = '';
        ruleForm.remark = '';
    }
    addOrModifyVisiable.value = true;
}
// 新增或编辑角色表单的格式验证规则
const rules = reactive<FormRules<typeof ruleForm>>({
    roleName: [
        { required: true, message: '请输入角色名', trigger: 'blur' },
        { min: 1, max: 16, message: '角色名长度最多 16 个字符', trigger: 'blur' }
    ],
    roleType: [
        { required: true, message: '请选择一个类型', trigger: 'blur' },
    ],
    remark: [
        { max: 256, message: '角色描述最多 256 个字符', trigger: 'blur' }
    ]
})
// 新增或编辑角色表单的保存按钮
const saveAddRole = async () => {
    if (!ruleFormRef2.value) return
    await ruleFormRef2.value.validate(async (valid) => {
        if (valid) {
            stopClick2.value = true;
            let data: any;
            if (addOrModifyTitle.value === 2) {
                data = await roleStore.updateRoleAsync(
                    ruleForm.roleId,
                    Number(ruleForm.roleType),
                    ruleForm.roleName,
                    ruleForm.remark
                )
            } else {
                data = await roleStore.addRoleAsync(
                    Number(ruleForm.roleType),
                    ruleForm.roleName,
                    ruleForm.remark
                );
            }
            if (data) {
                ElMessage({
                    message: addOrModifyTitle.value === 2 ? '编辑成功' : '添加成功',
                    type: 'success'
                })
                addOrModifyVisiable.value = false;
                if (addOrModifyTitle.value === 2) {
                    emits('getRoleList', currentpage);
                } else {
                    if (currentpage === 1) {
                        emits('getRoleList');
                    } else {
                        emits('changePage', 1);
                    }
                }  
            }
            stopClick2.value = false;
        } else {
            console.log('error submit!')
        }
    })
}
// 批量删除
const deleteRoles = () => {
    if (!selectIds) {
        ElMessage({
            message: '未选择任何数据',
            type: 'warning'
        });
        return;
    }
    deleteRolesVisible.value = true;
}
const confirmDeleteRoles = async () => {
    emits('deleteRole', selectIds);
    deleteRolesVisible.value = false;
}
defineExpose({
    addOrModifyRole
})
</script>

<script lang="ts">
export default {
    name: 'operation'
}
</script>