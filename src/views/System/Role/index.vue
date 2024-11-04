<template>
    <div class="home">
        <div class="filter">
            <FilterForm :form-inline="formInline" @get-role-list="getRoleList" @reset-form="resetForm"></FilterForm>
            <Operation ref="operation" :currentpage="currentpage" :select-ids="selectIds" @change-page="changePage"
            @delete-role="deleteRole" @get-role-list="getRoleList"></Operation>
        </div>
        <div class="lists">
            <el-table :data="roleList" style="width: 100%" @selection-change="handleSelectionChange"
                @sort-change="handleSortChange" v-loading="tableLoading" max-height="calc(100vh - 220px)">
                <el-table-column type="selection" width="40" :selectable="selectable" />
                <el-table-column property="id" label="ID" width="70" />
                <el-table-column property="roleName" label="名称" show-overflow-tooltip sortable="custom" />
                <el-table-column property="roleType" label="类型" show-overflow-tooltip sortable="custom">
                    <template #default="scope">
                        <p>{{ getRoleTypeFont(scope.row.roleType) }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="remark" label="描述" show-overflow-tooltip>
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
                            <el-button link type="primary" size="small"
                                @click="operation.addOrModifyRole(2, scope.row)">编辑</el-button>
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
                <p>共&nbsp;{{ total }}&nbsp;条</p>
                &nbsp;
                <el-pagination layout="prev, pager, next" background :total="total" v-model:current-page="currentpage"
                    :default-page-size="20" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import FilterForm from './FilterForm.vue'
import Operation from './Operation.vue'
import { WarningFilled } from '@element-plus/icons-vue'
import { onBeforeMount, reactive, ref, watch } from 'vue'
// @ts-ignore
import { getMaxPermission, getRoleTypeFont } from '@/utils/otherHandler'
// @ts-ignore
import { dateParse } from '@/utils/dateHandler'
// @ts-ignore
import { RoleItemType, ISortProps } from '@/variables/type'
// @ts-ignore
import { useUserStore } from '@/stores/user'
// @ts-ignore
import { useRoleStore } from '@/stores/role'
import { ElMessage } from 'element-plus'
const operation = ref();
const userStore = useUserStore();
const roleStore = useRoleStore();
const tableLoading = ref(false);
const roleList = ref<RoleItemType>();// 角色列表
const selectIds = ref();
const total = ref(0);// 后台角色数据总量
const currentpage = ref(1);
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
// 删除角色
const deleteRole = async (roleIds: number | number[]) => {
    if (!Array.isArray(roleIds)) roleIds = [roleIds];
    const data = await roleStore.deleteRoleAsync(roleIds);
    if (data) {
        ElMessage({
            message: '删除成功',
            type: 'success'
        })
        if (currentpage.value === 1) {
            await getRoleList(1)
        } else {
            currentpage.value = 1;
        }
    }
}
// 选中条件：有权限且用户数为0
const selectable = (row: RoleItemType) => getMaxPermission(userStore.userInfo.roles) < row.roleType && row.userCount === 0;
// 获取角色列表
const getRoleList = async (pageNum: number = 1, pageSize: number = 20) => {
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
const handleSortChange = async (data: ISortProps) => {
    let { prop, order } = data;
    if (!order) order = 'descending';
    formInline.orderBy = prop;
    formInline.orderType = order.replace('ending', '');
    await getRoleList(currentpage.value);
}
// 选中时存入选项
const handleSelectionChange = (items: RoleItemType[]) => {
    if (items?.length === 0) {
        selectIds.value = '';
        return;
    }
    selectIds.value = items.map(item => item.id);
}
// 分页功能 切换到某一页
const changePage = (value: number) => {
    currentpage.value = value;
}
watch(currentpage, async () => {
    await getRoleList(currentpage.value);
})
// 页面刷新前获取数据
onBeforeMount(() => {
    getRoleList();
})
</script>

<style lang="scss" src="@/assets/css/manage.scss"></style>