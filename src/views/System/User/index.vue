<template>
    <div class="home">
        <div class="filter">
            <div class="form">
                <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
                    <el-form-item label="关键字">
                        <el-input v-model="formInline.keyword" placeholder="搜索用户名/账号" clearable />
                    </el-form-item>
                    <el-form-item label="角色">
                        <el-select v-model="formInline.roleId">
                            <el-option label="全部" value="1003" />
                            <el-option label="系统管理员" value="1000" />
                            <el-option label="管理员" value="1001" />
                            <el-option label="普通用户" value="1002" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="formInline.status">
                            <el-option label="全部" value="2" />
                            <el-option label="启用" value="1" />
                            <el-option label="禁用" value="0" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker v-model="formInline.timeList" type="datetimerange" start-placeholder="开始时间"
                            end-placeholder="结束时间" value-format="YYYY/MM/DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="getUserList()"
                            :loading="stopClick">搜索</el-button>
                        <el-button :icon="Refresh" type="primary" plain="true" @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="filter_right">
                <div v-if="userStore.userInfo.roles.some(item => item.id == 1000 || item.id == 1001)">
                    <el-button type="primary" :icon="Plus" @click="addUserVisible = true">添加</el-button>
                    <el-dialog v-model="addUserVisible" width="400" title="添加用户" :show-close="false">
                        <div class="form-items">
                            <el-form ref="ruleFormRef2" style="max-width: 600px" :model="ruleForm" :rules="rules"
                                label-width="auto" class="demo-ruleForm">
                                <el-form-item label="账号:" prop="account">
                                    <el-input v-model="ruleForm.account" style="width: 200px;" autocomplete="off"
                                        placeholder="请输入账号" />
                                </el-form-item>
                                <el-form-item label="用户名:" prop="userName">
                                    <el-input v-model="ruleForm.userName" style="width: 200px;" autocomplete="off"
                                        placeholder="请输入用户名" />
                                </el-form-item>
                                <el-form-item label="角色:" prop="roleId" required>
                                    <el-select v-model="ruleForm.roleId" style="width: 200px">
                                        <el-option label="普通用户" value="1002" />
                                        <el-option label="管理员" value="1001" />
                                        <el-option label="系统管理员" value="1000"
                                            v-if="userStore.userInfo.roles.some(item => item.id == 1000)" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="密码:" prop="password" required>
                                    <el-input v-model="ruleForm.password" style="width: 200px;" autocomplete="off"
                                        disabled placeholder="请再次输入新密码" />
                                </el-form-item>
                                <div style="display: flex; justify-content: end;">
                                    <el-button @click="cancelAddUser" style="width:80px">取消</el-button>
                                    <el-button type="primary" @click="saveAddUser" :loading="stopClick2"
                                        style="width: 80px;">保存</el-button>
                                </div>
                            </el-form>
                        </div>
                    </el-dialog>
                    &nbsp;
                    <el-button type="danger" :icon="Delete" plain="true"
                        @click="deleteUsersVisible = true">删除</el-button>
                    <el-dialog v-model="deleteUsersVisible" width="250" :show-close="false">
                        <div class="delete_class">
                            <div class="delete_title">确认删除?</div>
                            <div class="delete_data">
                                <el-icon color="red" size="20">
                                    <WarningFilled />
                                </el-icon>
                                &nbsp;
                                <p>将删除10条记录，请谨慎操作！</p>
                            </div>
                        </div>
                        <template #footer>
                            <div class="dialog-footer">
                                <el-button @click="deleteUsersVisible = false">取消</el-button>
                                <el-button type="danger" @click="deleteUsersVisible = false">
                                    确认
                                </el-button>
                            </div>
                        </template>
                    </el-dialog>
                </div>
            </div>
        </div>
        <div class="lists">
            <el-table :data="userList" style="width: 100%">
                <el-table-column type="selection" width="40" />
                <el-table-column property="id" label="id" width="70" />
                <el-table-column property="userName" label="用户名" width="160" show-overflow-tooltip />
                <el-table-column property="account" label="账号" width="160" show-overflow-tooltip />
                <el-table-column label="用户角色" width="160" show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ getRoleName(scope.row.roles) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80">
                    <template #default="scope">
                        <el-switch inline-prompt active-text="启用" inactive-text="禁用" active-value="1" inactive-value="0"
                            :disabled="getMaxPermission(userStore.userInfo.roles) >= getMaxPermission(scope.row.roles)"
                            v-model="scope.row.status" />
                    </template>
                </el-table-column>
                <el-table-column property="address" label="创建时间" width="200">
                    <template #default="scope">
                        <p>{{ dateParse(scope.row.createTime) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140">
                    <template #default="scope">
                        <div v-if="getMaxPermission(userStore.userInfo.roles) < getMaxPermission(scope.row.roles)">
                            <el-button link type="primary" size="small">编辑</el-button>
                            <el-button link type="danger" size="small">
                                <el-popconfirm width="220" :icon="WarningFilled" icon-color="red" title="确定删除该条记录吗?"
                                    @confirm="deleteUser(scope.row.id)">
                                    <template #reference>
                                        <p>删除</p>
                                    </template>
                                    <template #actions="{ confirm, cancel }">
                                        <div style="margin-top: 15px;">
                                            <el-button size="small" @click="cancel">取消</el-button>
                                            <el-button type="danger" size="small" @click="confirm">确定</el-button>
                                        </div>
                                    </template>
                                </el-popconfirm>
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Plus, Delete, Search, Refresh, WarningFilled } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
// @ts-ignore
import { useUserStore } from '@/stores/user';
const addUserVisible = ref(false);
const deleteUsersVisible = ref(false);
const userStore = useUserStore();
const ruleFormRef = ref<FormInstance>();
const ruleFormRef2 = ref<FormInstance>();
const stopClick = ref(false);
const stopClick2 = ref(false);
// 筛选的表单选项
const formInline = reactive({
    keyword: '',
    roleId: '1003',
    status: '2',
    timeList: []
})
interface IRoleProps {
    id: number;
    roleName: string;
}
// 用户数据结构
type userItem = {
    id: string | number,
    userName: string,
    account: string,
    roles: IRoleProps[],
    status: number | string,
    createTime: string
}
// 从数组中取出角色名称
const getRoleName = (roleArray: IRoleProps[]) => {
    return roleArray.map((e: any) => e.roleName).join(',')
}
// 时间格式转化
const dateParse = (date: string) => {
    const utcDate = new Date(date);
    const utcPlus8Date = new Date(utcDate.getTime());
    return utcPlus8Date.getFullYear() + "-" +
        (utcPlus8Date.getMonth() + 1).toString().padStart(2, "0") + "-" +
        utcPlus8Date.getDate().toString().padStart(2, "0") + " " +
        utcPlus8Date.getHours().toString().padStart(2, "0") + ":" +
        utcPlus8Date.getMinutes().toString().padStart(2, "0") + ":" +
        utcPlus8Date.getSeconds().toString().padStart(2, "0");
}
// 获取用户的最高权限id
const getMaxPermission = (roleArray: IRoleProps[]) => {
    let max = Number(roleArray[0].id);
    for (let k of roleArray) {
        if (Number(k.id) < max) max = Number(k.id);
    }
    return max;
}
// 用户列表
const userList = ref<userItem[]>();
// 获取用户列表
const getUserList = async () => {
    stopClick.value = true;
    const data = await userStore.getUserListAsync({
        keyword: formInline.keyword,
        roleId: formInline.roleId == '1003' ? '' : formInline.roleId,
        status: formInline.status == '2' ? '' : formInline.status,
        startTime: formInline.timeList[0],
        endTime: formInline.timeList[1],
        pageNum: 1,
        pageSize: 10
    });
    if (data) {
        stopClick.value = false;
        userList.value = data.list.map((item: any) => {
            item.status = item.status + '';
            return item;
        });
        ElMessage({
            message: '查询成功',
            type: 'success'
        })
    } else {
        stopClick.value = false;
    }
}
// 重置筛选的表单内容
const resetForm = () => {
    formInline.keyword = '';
    formInline.roleId = '1003';
    formInline.status = '2';
    formInline.timeList = [];
}
// 新增用户的表单
const ruleForm = reactive({
    account: '',
    userName: '',
    roleId: '1002',
    password: '12345678'
})
// 新增用户表单的格式验证规则
const rules = reactive<FormRules<typeof ruleForm>>({
    account: [
        { required: true, message: '请输入账号', trigger: 'blur' },
        { min: 4, max: 16, message: '账号长度在 4 到 16 个字符', trigger: 'blur' },
        { pattern: /^[a-zA-Z0-9]+$/, message: '账号只能包含字母和数字', trigger: 'blur' },
    ],
    userName: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 1, max: 16, message: '用户名长度最多 16 个字符', trigger: 'blur' }
    ]
})
// 新增用户表单的取消按钮
const cancelAddUser = () => {
    ruleFormRef2.value?.resetFields();
    addUserVisible.value = false;
}
// 新增用户表单的保存按钮
const saveAddUser = async () => {
    if (!ruleFormRef2.value) return
    await ruleFormRef2.value.validate(async (valid) => {
        if (valid) {
            stopClick2.value = true;
            const data = await userStore.addUserAsync(
                ruleForm.userName,
                ruleForm.account,
                Number(ruleForm.roleId)
            );
            if (data) {
                ElMessage({
                    message: '添加成功',
                    type: 'success'
                })
                stopClick2.value = false;
                cancelAddUser();
            } else {
                stopClick2.value = false;
            }
        } else {
            console.log('error submit!')
        }
    })
}
// 删除用户
const deleteUser = async (userId: string[] | number[] | string | number) => {
    let userIds = Array.isArray(userId) ? userId : [userId]
    let data = await userStore.deleteUserAsync(userIds);
    if (data) {
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
    }
}
</script>

<style scoped lang="scss">
.home {
    .filter {
        display: flex;
        justify-content: space-between;

        .form {
            margin: 10px 0;

            .demo-form-inline .el-input {
                --el-input-width: 160px;
            }

            .demo-form-inline .el-select {
                --el-select-width: 150px;
            }

        }

        .filter_right {
            width: 350px;
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .delete_class {
                display: flex;
                flex-direction: column;
                align-items: center;

                .delete_title {
                    align-self: flex-start;
                    height: 23px;
                    font-size: 16px;
                    color: #3D3D3D;
                }

                .delete_data {
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                    // width:200px;
                    height: 17px;
                    font-size: 12px;
                    color: #909AAA;
                }
            }
        }
    }
}
</style>