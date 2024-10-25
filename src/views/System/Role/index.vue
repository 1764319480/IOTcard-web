<template>
    <div class="home">
        <div class="filter">
            <div class="form">
                <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
                    <el-form-item label="关键字">
                        <el-input v-model="formInline.keyword" placeholder="搜索名称/描述" clearable />
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="formInline.roleType">
                            <el-option label="全部" value='9999' />
                            <el-option v-for="item of RoleTypeList" :label="item.label" :value="item.value"
                                :key="item.value" />
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="getRoleList()">搜索</el-button>
                        <el-button :icon="Refresh" type="primary" :plain=true @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="filter_right">
                <el-button type="primary" :icon="Plus" @click="addOrModifyRole('添加角色')">添加</el-button>
                <el-dialog v-model="addOrModifyVisiable" width="400" :title="addOrModifyTitle" :show-close="false"
                        :close-on-click-modal="false" :close-on-press-escape="false">
                        <div class="form-items">
                            <el-form ref="ruleFormRef2" style="max-width: 600px" :model="ruleForm" :rules="rules"
                                label-width="auto" class="demo-ruleForm">
                                <el-form-item label="名称:" prop="roleName">
                                    <el-input v-model="ruleForm.roleName" style="width: 200px;" autocomplete="off"
                                        placeholder="请输入名称" />
                                </el-form-item>
                                <el-form-item label="类型:" prop="roleType">
                                    <el-select v-model="ruleForm.roleType" style="width: 200px" collapse-tags collapse-tags-tooltip
                                        placeholder="请选择角色类型">
                                        <el-option v-for="item of RoleTypeList" :label="item.label"
                                            :value="item.value" :key="item.value"
                                            v-show="(addOrModifyTitle === '添加角色' && getMaxPermission(userStore.userInfo.roles) <= item.value)
                                                || (addOrModifyTitle === '编辑角色' && getMaxPermission(userStore.userInfo.roles) < item.value)" />
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="描述:" prop="remark">
                                    <el-input v-model="ruleForm.remark" type="textarea" style="width: 300px;" :rows="4" autocomplete="off" placeholder="描述（可选）"/>
                                </el-form-item>
                                <div style="display: flex; justify-content: end;">
                                    <el-button @click="cancelAddRole" style="width:80px">取消</el-button>
                                    <el-button type="primary" @click="saveAddRole" :loading="stopClick2"
                                        style="width: 80px;">保存</el-button>
                                </div>
                            </el-form>
                        </div>
                    </el-dialog>
                &nbsp;
                &nbsp;
                <el-button type="danger" :icon="Delete" :plain=true @click="deleteRoles">删除</el-button>
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
        </div>
        <div class="lists">
            <el-table class="table" :data="roleList" style="width: 100%" @selection-change="handleSelectionChange" 
            @sort-change="handleSortChange" v-loading="tableLoading">
                <el-table-column type="selection" width="40" :selectable="selectable"/>
                <el-table-column property="id" label="id" width="70"/>
                <el-table-column property="roleName" label="名称" width="160" show-overflow-tooltip sortable="custom"/>
                <el-table-column property="roleType" label="类型" width="160" show-overflow-tooltip sortable="custom">
                    <template #default="scope">
                        <p>{{ getRoleTypeFont(scope.row.roleType) }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="remark" label="描述" width="160" show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ scope.row.remark || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="用户数" width="100" property="userCount" sortable="custom">
                    <template #default="scope">
                        <p>{{ scope.row.userCount || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="createTime" label="创建时间" width="200" sortable="custom">
                    <template #default="scope">
                        <p>{{ dateParse(scope.row.createTime) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template #default="scope">
                        <div v-if="getMaxPermission(userStore.userInfo.roles) < scope.row.roleType">
                            <el-button link type="primary" size="small" @click="addOrModifyRole('编辑角色', scope.row)">编辑</el-button>
                            <el-button link type="danger" size="small" v-if="scope.row.userCount === 0">
                                <el-popconfirm width="220" :icon="WarningFilled" icon-color="red" title="确定删除该条记录吗?"
                                    @confirm="deleteRole(scope.row.id)">
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
                <p>共&nbsp;{{total}}&nbsp;条</p>
                &nbsp;
                <el-pagination layout="prev, pager, next" background :total="total" v-model:current-page="currentpage" :default-page-size="10"/>
            </div>    
        </div>
    </div>
</template>

<script setup lang="ts">
import { Delete, Plus, Refresh, Search, WarningFilled } from '@element-plus/icons-vue';
import { onBeforeMount, reactive, ref, watch } from 'vue';
// @ts-ignore
import { getMaxPermission, getRoleTypeFont } from '@/utils/otherHandler';
// @ts-ignore
import { dateParse } from '@/utils/dateHandler';
// @ts-ignore
import { RoleTypeList } from '@/variables/common'
// @ts-ignore
import { useUserStore } from '@/stores/user';
// @ts-ignore
import { useRoleStore } from '@/stores/role';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
const addOrModifyVisiable = ref(false);
const addOrModifyTitle = ref('添加角色');
const userStore = useUserStore();
const roleStore = useRoleStore();
const tableLoading = ref(false);
const deleteRolesVisible = ref(false);
const ruleFormRef = ref<FormInstance>();
const ruleFormRef2 = ref<FormInstance>();
const stopClick2 = ref(false);
// 筛选角色的表单选项
const formInline = reactive({
    keyword: '',
    roleType: '9999',
    orderBy: 'createTime',
    orderType: 'desc'
})
// 重置筛选角色的表单
const resetForm = async () => {
    formInline.keyword = '';
    formInline.roleType = '9999';
    if (currentpage.value === 1) {
        await getRoleList(1)
    } else {
        currentpage.value = 1;
    } 
}
// 角色数据结构
type roleItem = {
    id: number,
    roleType: number,
    roleName: string,
    remark: string,
    userCount: number,
    createTime: string
}
// 新增或编辑角色的表单
const ruleForm = reactive({
    roleId: 0,
    roleName: '',
    roleType: 3,
    remark: ''
})
// 打开新增或编辑角色表单
const addOrModifyRole = (title: string, item?: roleItem) => {
    addOrModifyVisiable.value = true;
    addOrModifyTitle.value = title;
    if (item) {
        ruleForm.roleId = item.id;
        ruleForm.roleName = item.roleName;
        ruleForm.roleType = item.roleType;
        ruleForm.remark = item.remark;
    } else {
        ruleForm.roleName = '';
        ruleForm.roleType = 3;
        ruleForm.remark = '';
    }

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
        { max: 256, message: '角色描述最多 256 个字符', trigger: 'blur'}
    ]
})
// 新增或编辑角色表单的取消按钮
const cancelAddRole = () => {
    ruleFormRef2.value?.resetFields();
    addOrModifyVisiable.value = false;
}
// 新增或编辑角色表单的保存按钮
const saveAddRole = async () => {
    if (!ruleFormRef2.value) return
    await ruleFormRef2.value.validate(async (valid) => {
        if (valid) {
            stopClick2.value = true;
            let data: any;
            if (addOrModifyTitle.value === '编辑角色') {
                data = await roleStore.updateRoleAsync(
                    ruleForm.roleId,
                    ruleForm.roleType,
                    ruleForm.roleName,
                    ruleForm.remark
                )
            } else {
                data = await roleStore.addRoleAsync(
                    ruleForm.roleType,
                    ruleForm.roleName,
                    ruleForm.remark
                );
            }
            if (data) {
                if (addOrModifyTitle.value === '编辑角色') {
                    await getRoleList(currentpage.value);
                } else {
                    if (currentpage.value === 1) {
                        await getRoleList(1)
                    } else {
                        currentpage.value = 1;
                    }
                }
                ElMessage({
                    message: addOrModifyTitle.value === '编辑角色' ? '编辑成功' : '添加成功',
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
// 删除角色
const deleteRole = async (roleIds: number | number[]) => {
    if (!Array.isArray(roleIds)) roleIds = [roleIds];
    const data = await roleStore.deleteRoleAsync(roleIds);
    if (data) {
        if (currentpage.value === 1) {
            await getRoleList(1)
        } else {
            currentpage.value = 1;
        }
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
    }
}
// 批量删除
const deleteRoles = () => {
    if (!selectIds.value) {
        ElMessage({
            message: '未选择任何数据',
            type: 'warning'
        });
        return;
    }
    deleteRolesVisible.value = true;
}
const confirmDeleteRoles = async () => {
    await deleteRole(selectIds.value);
    deleteRolesVisible.value = false;
}
// 选中条件：有权限且用户数为0
const selectable = (row :roleItem) => getMaxPermission(userStore.userInfo.roles) < row.roleType && row.userCount === 0;
// 角色列表
const roleList = ref<roleItem>();
// 获取角色列表
const getRoleList = async (pageNum: number = 1, pageSize: number = 10) => {
    tableLoading.value = true;
    const data = await roleStore.getRoleListAsync({
        keyword: formInline.keyword,
        roleType: formInline.roleType === '9999' ? undefined : formInline.roleType,
        pageNum,
        pageSize,
        orderBy: formInline.orderBy,
        orderType: formInline.orderType
    })
    if (data) {
        total.value = data.total;
        roleList.value = data.list;
        tableLoading.value = false;
    };
    tableLoading.value = false;
}
// 表单排序
interface ISortProps {
    column: object,
    prop: string,
    order: string | null
}
const handleSortChange = async (data: ISortProps) => {
    let { prop, order } = data;
    if(!order) order = 'descending';
    formInline.orderBy = prop;
    formInline.orderType = order.replace('ending', '');
    await getRoleList(currentpage.value);
}
// 选中时存入选项
const selectIds = ref();
const handleSelectionChange = (items: roleItem[]) => {
    if(items?.length === 0) {
        selectIds.value = '';
        return;
    }
    selectIds.value = items.map(item => item.id);
}
// 后台角色数据总量
const total = ref(0);
// 分页功能 切换到某一页
const currentpage = ref(1);
watch(currentpage, async () => {
    await getRoleList(currentpage.value);
})

// 页面刷新前获取数据
onBeforeMount(() => {
    getRoleList();
})
</script>

<style scoped lang="scss">
.home {
    .filter {
        display: flex;
        justify-content: space-between;

        .form {
            width: 80%;
            margin-top: 10px;

            .demo-form-inline .el-input {
                --el-input-width: 160px;
            }

            .demo-form-inline .el-select {
                --el-select-width: 150px;
            }

        }

        .filter_right {
            width: 250px;
            margin-top: 10px;
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
        .table {
            height: calc(100vh - 200px);
        }
    }
}
</style>