<template>
    <div class="filter_right">
        <div v-if="getMaxPermission(userStore.userInfo.roles) !== 3">
            <el-button type="primary" :icon="Plus" @click="addOrModifyUser(1)">添加</el-button>
            <el-button type="danger" :icon="Delete" :plain=true @click="deleteUsers">删除</el-button>
        </div>
        <el-dialog v-model="addOrModifyVisiable" width="400" :title="addOrModifyTitle === 1 ? '添加用户' : '编辑用户'"
            :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="form-items">
                <el-form ref="ruleFormRef2" style="max-width: 600px" :model="ruleForm" :rules="rules"
                    label-position="left" label-width="auto" class="demo-ruleForm">
                    <el-form-item label="账号:" prop="account">
                        <el-input v-model="ruleForm.account" style="width: 200px;" autocomplete="off"
                            placeholder="请输入账号" :disabled="addOrModifyTitle === 2" />
                    </el-form-item>
                    <el-form-item label="用户名:" prop="userName">
                        <el-input v-model="ruleForm.userName" style="width: 200px;" autocomplete="off"
                            placeholder="请输入用户名" />
                    </el-form-item>
                    <el-form-item label="角色:" prop="roleId">
                        <el-select v-model="ruleForm.roleId" style="width: 200px" :multiple="addOrModifyTitle === 2"
                            collapse-tags collapse-tags-tooltip placeholder="请选择角色">
                            <el-option v-for="item of roleStore.roleInfo" :label="item.roleName" :value="item.id"
                                :key="item.id"
                                v-show="(addOrModifyTitle === 1 && getMaxPermission(userStore.userInfo.roles) <= item.roleType)
                                    || (addOrModifyTitle === 2 && getMaxPermission(userStore.userInfo.roles) < item.roleType)" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="密码:" prop="password" required v-show="addOrModifyTitle === 1">
                        <el-input v-model="ruleForm.password" style="width: 200px;" autocomplete="off" disabled />
                    </el-form-item>
                    <div style="display: flex; justify-content: end;">
                        <el-button @click="addOrModifyVisiable = false;" style="width:80px">取消</el-button>
                        <el-button type="primary" @click="saveAddUser" :loading="stopClick2"
                            style="width: 80px;">保存</el-button>
                    </div>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog v-model="deleteUsersVisible" width="250" :show-close="false">
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
                    <el-button @click="deleteUsersVisible = false">取消</el-button>
                    <el-button type="danger" @click="confirmDeleteUsers">
                        确认
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue';
// @ts-ignore
import { getMaxPermission } from '@/utils/otherHandler'
// @ts-ignore
import { useUserStore } from '@/stores/user'
// @ts-ignore
import { useRoleStore } from '@/stores/role'
// @ts-ignore
import { UserItemType } from '@/variables/common'
const roleStore = useRoleStore();
const userStore = useUserStore();
const addOrModifyVisiable = ref(false);
const deleteUsersVisible = ref(false);
const ruleFormRef2 = ref<FormInstance>();
const stopClick2 = ref(false);
const addOrModifyTitle = ref(1);
const { selectIds, currentpage } = defineProps(['selectIds', 'currentpage'])
const emits = defineEmits(['getUserList', 'deleteUser', 'changePage'])
// 新增或编辑用户的表单
const ruleForm = reactive({
    account: '',
    userName: '',
    roleId: [] as number[] | number,
    password: '12345678'
})
// 打开新增或编辑用户表单
const addOrModifyUser = (title: number, item?: UserItemType) => {
    addOrModifyTitle.value = title;
    ruleFormRef2.value?.resetFields();
    if (item) {
        ruleForm.account = item.account;
        ruleForm.userName = item.userName;
        ruleForm.roleId = item.roles.map(k => k.id);
        ruleForm.password = item.id.toString();//用密码暂存用户Id
    } else {
        ruleForm.account = '';
        ruleForm.userName = '';
        ruleForm.roleId = [];
        ruleForm.password = '12345678';
    }
    addOrModifyVisiable.value = true;
}
// 新增或编辑用户表单的格式验证规则
const rules = reactive<FormRules<typeof ruleForm>>({
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 4, max: 16, message: '账号长度在 4 到 16 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: '账号只能包含字母和数字', trigger: 'blur' },
    ],
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 16, message: '用户名长度最多 16 个字符', trigger: 'blur' }
    ],
    roleId: [
        { required: true, message: '请至少选择一个角色', trigger: 'blur' },
    ]
})
// 新增或编辑用户表单的保存按钮
const saveAddUser = async () => {
    if (!ruleFormRef2.value) return
    await ruleFormRef2.value.validate(async (valid) => {
        if (valid) {
            stopClick2.value = true;
            let data: any;
            if (addOrModifyTitle.value === 2) {
                data = await userStore.updateUserInfoAsync(
                    ruleForm.password,
                    ruleForm.userName,
                    undefined,
                    ruleForm.roleId as []
                )
            } else {
                data = await userStore.addUserAsync(
                    ruleForm.userName,
                    ruleForm.account,
                    Number(ruleForm.roleId)
                );
            }
            if (data) {
                if (addOrModifyTitle.value === 2) {
                    emits('getUserList', currentpage);
                } else {
                    if (currentpage === 1) {
                        emits('getUserList');
                    } else {
                        emits('changePage', 1);
                    }
                }
                ElMessage({
                    message: addOrModifyTitle.value === 2 ? '编辑成功' : '添加成功',
                    type: 'success'
                })
                addOrModifyVisiable.value = false;
            }
            stopClick2.value = false;
        } else {
            console.log('error submit!')
        }
    })
}
// 批量删除
const deleteUsers = () => {
    if (!selectIds) {
        ElMessage({
            message: '未选择任何数据',
            type: 'warning'
        });
        return;
    }
    deleteUsersVisible.value = true;
}
const confirmDeleteUsers = () => {
    emits('deleteUser', selectIds);
    deleteUsersVisible.value = false;
}
// 页面刷新前获取数据
onBeforeMount(() => {
    roleStore.getAllRoleAsync();
})
defineExpose({
    addOrModifyUser
})
</script>

<script lang="ts">
export default {
    name: 'operation'
}
</script>