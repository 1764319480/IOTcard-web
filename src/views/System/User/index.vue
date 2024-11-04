<template>
    <div class="home">
        <div class="filter">
            <FilterForm :form-inline="formInline" @get-user-list="getUserList" @reset-form="resetForm"></FilterForm>
            <Operation ref="operation" :currentpage="currentpage" :select-ids="selectIds" 
            @get-user-list="getUserList" @delete-user="deleteUser" @change-page="changePage"></Operation>
        </div>
        <div class="lists">
            <el-table :data="userList" style="width: 100%" @selection-change="handleSelectionChange"
                @sort-change="handleSortChange" v-loading="tableLoading" max-height="calc(100vh - 270px)">
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
                                @click="operation.addOrModifyUser(2, scope.row)">编辑</el-button>
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
                    :default-page-size="20" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import FilterForm from './FilterForm.vue'
import Operation from './Operation.vue'
import { ref, reactive, onBeforeMount, watch } from 'vue'
import { WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
// @ts-ignore
import { dateParse } from '@/utils/dateHandler'
// @ts-ignore
import { getMaxPermission } from '@/utils/otherHandler'
// @ts-ignore
import { useUserStore } from '@/stores/user'
// @ts-ignore
import { UserStatusList } from '@/variables/common'
// @ts-ignore
import { IRoleProps, UserItemType, ISortProps } from '@/variables/type'

const operation = ref();
const userStore = useUserStore();
const tableLoading = ref(false);
const userList = ref<UserItemType[]>();// 用户列表
const total = ref(0);// 后台用户数据总量
const currentpage = ref(1);
const selectIds = ref();
// 筛选的表单选项
const formInline = reactive({
    keyword: '',
    roleId: '9999',
    status: '99',
    timeList: [],
    orderBy: 'createTime',
    orderType: 'desc'
})
// 从数组中取出角色名称
const getRoleName = (roleArray: IRoleProps[]) => {
    return roleArray.map((e: any) => e.roleName).join(',')
}
// 选中条件：有权限
const selectable = (row: UserItemType) => getMaxPermission(userStore.userInfo.roles) < getMaxPermission(row.roles);
// 获取用户列表
const getUserList = async (pageNum: number = 1, pageSize: number = 20) => {
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
        userList.value = data.list.map((item: UserItemType) => {
            item.status = item.status.toString();
            return item;
        });
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
        await getUserList()
    } else {
        currentpage.value = 1;
    }
}
// 表单排序
const handleSortChange = async (data: ISortProps) => {
    let { prop, order } = data;
    if (!order) order = 'descending';
    formInline.orderBy = prop;
    formInline.orderType = order.replace('ending', '');
    await getUserList(currentpage.value);
}
// 删除用户
const deleteUser = async (userId: string[] | number[] | string | number) => {
    let userIds = Array.isArray(userId) ? userId : [userId]
    let data = await userStore.deleteUserAsync(userIds);
    if (data) {
        if (currentpage.value === 1) {
            await getUserList()
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
const handleSelectionChange = (items: UserItemType[]) => {
    if (items?.length === 0) {
        selectIds.value = '';
        return;
    }
    selectIds.value = items.map(item => item.id);
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
// 分页功能 切换到某一页
const changePage = (value:number) => {
    currentpage.value = value;
}
watch(currentpage, async (value: number) => {
    await getUserList(value);
})
// 页面刷新前获取数据
onBeforeMount(() => {
    getUserList();
})
</script>

<style lang="scss" src="@/assets/css/manage.scss"></style>