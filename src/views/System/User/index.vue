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
                            <el-option label="全部" value="9999" />
                            <el-option v-for="item of roleStore.roleInfo" :label="item.roleName" :value="item.id"
                                :key="item.id" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="formInline.status">
                            <el-option label="全部" value="99" />
                            <el-option v-for="item of UserStatusList" :label="item.label" :value="item.value"
                                :key="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间">
                        <el-date-picker v-model="formInline.timeList" type="daterange" start-placeholder="开始时间"
                            :default-time="defaultTime" end-placeholder="结束时间" style="width: 220px;"
                            value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="getUserList()">搜索</el-button>
                        <el-button :icon="Refresh" type="primary" :plain=true @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="filter_right">
                <div v-if="getMaxPermission(userStore.userInfo.roles) !== 3">
                    <el-button type="primary" :icon="Plus" @click="addOrModifyUser('添加用户')">添加</el-button>
                    <el-dialog v-model="addOrModifyVisiable" width="400" :title="addOrModifyTitle" :show-close="false"
                        :close-on-click-modal="false" :close-on-press-escape="false">
                        <div class="form-items">
                            <el-form ref="ruleFormRef2" style="max-width: 600px" :model="ruleForm" :rules="rules"
                                label-width="auto" class="demo-ruleForm">
                                <el-form-item label="账号:" prop="account">
                                    <el-input v-model="ruleForm.account" style="width: 200px;" autocomplete="off"
                                        placeholder="请输入账号" :disabled="addOrModifyTitle === '编辑用户'" />
                                </el-form-item>
                                <el-form-item label="用户名:" prop="userName">
                                    <el-input v-model="ruleForm.userName" style="width: 200px;" autocomplete="off"
                                        placeholder="请输入用户名" />
                                </el-form-item>
                                <el-form-item label="角色:" prop="roleId">
                                    <el-select v-model="ruleForm.roleId" style="width: 200px"
                                        :multiple="addOrModifyTitle === '编辑用户'" collapse-tags collapse-tags-tooltip
                                        placeholder="请选择角色">
                                        <el-option v-for="item of roleStore.roleInfo" :label="item.roleName"
                                            :value="item.id" :key="item.id"
                                            v-show="(addOrModifyTitle === '添加用户' && getMaxPermission(userStore.userInfo.roles) <= item.roleType)
                                                || (addOrModifyTitle === '编辑用户' && getMaxPermission(userStore.userInfo.roles) < item.roleType)" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="密码:" prop="password" required v-show="addOrModifyTitle === '添加用户'">
                                    <el-input v-model="ruleForm.password" style="width: 200px;" autocomplete="off"
                                        disabled />
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
                    <el-button type="danger" :icon="Delete" :plain=true @click="deleteUsers">删除</el-button>
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
            </div>
        </div>
        <div class="lists">
            <el-table :data="userList" style="width: 100%" @selection-change="handleSelectionChange"
                @sort-change="handleSortChange" v-loading="tableLoading" height="330">
                <el-table-column type="selection" width="40" :selectable="selectable" />
                <el-table-column property="id" label="ID" width="70" fixed />
                <el-table-column property="userName" label="用户名" show-overflow-tooltip sortable="custom" />
                <el-table-column property="account" label="账号" show-overflow-tooltip sortable="custom" />
                <el-table-column label="用户角色" width="160" show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ getRoleName(scope.row.roles) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="80" property="status" sortable="custom">
                    <template #default="scope">
                        <el-switch inline-prompt active-text="启用" inactive-text="禁用" active-value="1" inactive-value="0"
                            :disabled="getMaxPermission(userStore.userInfo.roles) >= getMaxPermission(scope.row.roles)"
                            v-model="scope.row.status" @change="changeStatus(scope.row.id, scope.row.status)" />
                    </template>
                </el-table-column>
                <el-table-column property="createTime" label="创建时间" width="200" sortable="custom">
                    <template #default="scope">
                        <p>{{ dateParse(scope.row.createTime) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                    <template #default="scope">
                        <div v-if="getMaxPermission(userStore.userInfo.roles) < getMaxPermission(scope.row.roles)">
                            <el-button link type="primary" size="small"
                                @click="addOrModifyUser('编辑用户', scope.row)">编辑</el-button>
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
            <div class="pagination">
                <p>共&nbsp;{{ total }}&nbsp;条</p>
                &nbsp;
                <el-pagination layout="prev, pager, next" :total="total" v-model:current-page="currentpage" background
                    :default-page-size="10" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onBeforeMount, watch } from 'vue';
import { Plus, Delete, Search, Refresh, WarningFilled } from '@element-plus/icons-vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
// @ts-ignore
import { dateParse } from '@/utils/dateHandler';
// @ts-ignore
import { getMaxPermission } from '@/utils/otherHandler';
// @ts-ignore
import { useUserStore } from '@/stores/user';
// @ts-ignore
import { UserStatusList } from '@/variables/common';
// @ts-ignore
import { useRoleStore } from '@/stores/role';
const defaultTime = ref<[Date, Date]>([
    new Date(2000, 1, 1, 0, 0, 0),
    new Date(2000, 2, 1, 23, 59, 59),
])
const addOrModifyVisiable = ref(false);
const deleteUsersVisible = ref(false);
const userStore = useUserStore();
const roleStore = useRoleStore();
const ruleFormRef = ref<FormInstance>();
const ruleFormRef2 = ref<FormInstance>();
const stopClick2 = ref(false);
const tableLoading = ref(false);
const addOrModifyTitle = ref('添加用户');
// 筛选的表单选项
const formInline = reactive({
    keyword: '',
    roleId: '9999',
    status: '99',
    timeList: [],
    orderBy: 'createTime',
    orderType: 'desc'
})
interface IRoleProps {
    id: number,
    roleType: number,
    roleName: string
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
// 选中条件：有权限
const selectable = (row: userItem) => getMaxPermission(userStore.userInfo.roles) < getMaxPermission(row.roles);
// 用户列表
const userList = ref<userItem[]>();
// 后台用户数据总量
const total = ref(0);
// 获取用户列表
const getUserList = async (pageNum: number = 1, pageSize: number = 10) => {
    tableLoading.value = true;
    const data = await userStore.getUserListAsync({
        keyword: formInline.keyword,
        roleId: formInline.roleId == '9999' ? undefined : formInline.roleId,
        status: formInline.status == '99' ? undefined : formInline.status,
        startTime: formInline.timeList[0],
        endTime: formInline.timeList[1],
        pageNum,
        pageSize,
        orderBy: formInline.orderBy,
        orderType: formInline.orderType
    });
    if (data) {
        total.value = data.total;
        userList.value = data.list.map((item: userItem) => {
            item.status = item.status.toString();
            return item;
        });
        tableLoading.value = false;
    };
    tableLoading.value = false;

}
// 重置筛选的表单内容
const resetForm = async () => {
    formInline.keyword = '';
    formInline.roleId = '9999';
    formInline.status = '99';
    formInline.timeList = [];
    if (currentpage.value === 1) {
        await getUserList(1)
    } else {
        currentpage.value = 1;
    }
}
// 分页功能 切换到某一页
const currentpage = ref(1);
watch(currentpage, async (value: number) => {
    await getUserList(value);
})
// 表单排序
interface ISortProps {
    column: object,
    prop: string,
    order: string | null
}
const handleSortChange = async (data: ISortProps) => {
    let { prop, order } = data;
    if (!order) order = 'descending';
    formInline.orderBy = prop;
    formInline.orderType = order.replace('ending', '');
    await getUserList(currentpage.value);
}
// 新增或编辑用户的表单
const ruleForm = reactive({
    account: '',
    userName: '',
    roleId: [] as number[] | number,
    password: '12345678'
})
// 打开新增或编辑用户表单
const addOrModifyUser = (title: string, item?: userItem) => {
    addOrModifyVisiable.value = true;
    addOrModifyTitle.value = title;
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
// 新增或编辑用户表单的取消按钮
const cancelAddUser = () => {
    ruleFormRef2.value?.resetFields();
    addOrModifyVisiable.value = false;
}
// 新增或编辑用户表单的保存按钮
const saveAddUser = async () => {
    if (!ruleFormRef2.value) return
    await ruleFormRef2.value.validate(async (valid) => {
        if (valid) {
            stopClick2.value = true;
            let data: any;
            if (addOrModifyTitle.value === '编辑用户') {
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
                if (addOrModifyTitle.value === '编辑用户') {
                    await getUserList(currentpage.value);
                } else {
                    if (currentpage.value === 1) {
                        await getUserList(1)
                    } else {
                        currentpage.value = 1;
                    }
                }
                ElMessage({
                    message: addOrModifyTitle.value === '编辑用户' ? '编辑成功' : '添加成功',
                    type: 'success'
                })
                stopClick2.value = false;
                addOrModifyVisiable.value = false;
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
        if (currentpage.value === 1) {
            await getUserList(1)
        } else {
            currentpage.value = 1;
        }
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
    }
}
// 选中时存入选项
const selectIds = ref();
const handleSelectionChange = (items: userItem[]) => {
    if (items?.length === 0) {
        selectIds.value = '';
        return;
    }
    selectIds.value = items.map(item => item.id);
}
// 批量删除
const deleteUsers = () => {
    if (!selectIds.value) {
        ElMessage({
            message: '未选择任何数据',
            type: 'warning'
        });
        return;
    }
    deleteUsersVisible.value = true;
}
const confirmDeleteUsers = () => {
    deleteUser(selectIds.value);
    deleteUsersVisible.value = false;
}
// 改变用户状态
const changeStatus = async (userId: string, status: number) => {
    const data = await userStore.updateUserInfoAsync(userId, undefined, status);
    if (data) {
        ElMessage({
            message: '切换成功',
            type: 'success'
        })
    } else {
        ElMessage({
            message: '切换失败',
            type: 'error'
        })
        userList.value = userList.value?.map(k => {
            if (k.id === userId) {
                k.status = status == 0 ? 1 : 0
            }
            return k;
        })
    }
}
// 页面刷新前获取数据
onBeforeMount(() => {
    getUserList();
})
</script>

<style scoped lang="scss">
.home {
    .filter {
        display: flex;
        justify-content: space-between;

        .form {
            width: 80%;
            margin: 10px 0;

            .demo-form-inline .el-input {
                --el-input-width: 160px;
            }

            .demo-form-inline .el-select {
                --el-select-width: 150px;
            }

        }

        .filter_right {
            width: 250px;
            margin: 10px 0;
            display: flex;
            justify-content: end;

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

    .lists {
        .pagination {
            margin-top: 10px;
            width: 100%;
            display: flex;
            justify-content: end;
            align-items: center;
        }
    }
}
</style>