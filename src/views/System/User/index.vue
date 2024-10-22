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
            <div class="listName">
                <div><el-checkbox></el-checkbox></div>
                <div>id</div>
                <div>用户名</div>
                <div>账号</div>
                <div>用户角色</div>
                <div>状态</div>
                <div>创建时间</div>
                <div>操作</div>
            </div>
            <template v-for="(item) in userList" :key="item.id">
                <div>
                    <div><el-checkbox></el-checkbox></div>
                    <div>{{ item.id }}</div>
                    <div>{{ item.userName }}</div>
                    <div>{{ item.account }}</div>
                    <div>{{ getRoleName(item.roles) }}</div>
                    <div><el-switch inline-prompt active-text="启用" inactive-text="禁用" active-value="1"
                            :disabled="getMaxPermission(userStore.userInfo.roles) >= getMaxPermission(item.roles)"
                            inactive-value="0" v-model="item.status" />
                    </div>
                    <div>{{ item.createTime.toString().slice(0, 19).replace('T', ' ') }}</div>
                    <div>
                        <div v-if="getMaxPermission(userStore.userInfo.roles) < getMaxPermission(item.roles)">
                            <p>编辑</p>
                            &nbsp;
                            <el-popover placement="top" :width="200" :visible="deleteUserVisible">
                                <div
                                    style="display: flex;flex-direction: column; justify-content: space-around; width: 168px; height: 96px;">
                                    <div style="display: flex;align-items: center;justify-content: space-around">
                                        <el-icon color="red">
                                            <WarningFilled />
                                        </el-icon>
                                        <p>确定删除该记录吗？</p>
                                    </div>
                                    <div style="display: flex;justify-content: flex-end;">
                                        <el-button @click="deleteUserVisible = false">取消</el-button>
                                        <el-button type="danger">确定</el-button>
                                    </div>
                                </div>
                                <template #reference>
                                    <p @click="deleteUserVisible = true">删除</p>
                                </template>
                            </el-popover>
                        </div>

                    </div>
                </div>
            </template>
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
const deleteUserVisible = ref(false);
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
// 获取用户的最高权限id
const getMaxPermission = (roleArray: IRoleProps[]) => {
    let max = Number(roleArray[0].id);
    for(let k of roleArray) {
        if(Number(k.id) < max) max = Number(k.id);
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

    .lists {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 58vh;

        >div {
            width: 100%;
            height: 39px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgb(207, 202, 202);

            >div {
                width: 120px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            >div:nth-child(1) {
                margin-left: 10px;
                width: 20px;
            }

            >div:nth-child(2) {
                width: 50px;
            }

            >div:nth-child(6) {
                width: 50px;
            }

            >div:nth-child(7) {
                width: 200px;
            }

            >div:nth-child(8) {
                >div {
                    display: flex;

                    >p:nth-child(1) {
                        color: #5995FD
                    }

                    >p:nth-child(2) {
                        color: #F33A15
                    }

                    >p:hover {
                        cursor: default;
                    }
                }
            }
        }

        .listName {
            background: #EEEEEE;
            z-index: 0;

            >p {
                font-family: 思源黑体;
                font-size: 16px;
                font-weight: normal;
                line-height: normal;
                letter-spacing: 0px;
                color: #1A1A1A;
                z-index: 1;
            }
        }
    }
}
</style>