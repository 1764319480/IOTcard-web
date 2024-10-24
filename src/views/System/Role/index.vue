<template>
    <div class="home">
        <div class="filter">
            <div class="form">
                <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
                    <el-form-item label="关键字">
                        <el-input v-model="formInline.keyword" placeholder="搜索用户名/账号" clearable />
                    </el-form-item>
                    <el-form-item label="类型">
                        <el-select v-model="formInline.roleId">
                            <el-option label="全部" value="9999" />
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
                <el-button type="primary" :icon="Plus">添加</el-button>
                &nbsp;
                <el-button type="danger" :icon="Delete" :plain=true disabled>删除</el-button>
            </div>
        </div>
        <div class="lists">
            <el-table :data="roleList" style="width: 100%" @selection-change="handleSelectionChange" 
            @sort-change="handleSortChange" >
                <el-table-column type="selection" width="40" :selectable="selectable"/>
                <el-table-column label="id" width="70"/>
                <el-table-column property="roleName" label="名称" width="160" show-overflow-tooltip sortable="custom"/>
                <el-table-column property="roleType" label="类型" width="160" show-overflow-tooltip sortable="custom"/>
                <el-table-column label="描述" width="160" show-overflow-tooltip/>
                <el-table-column label="用户数" width="100" property="userCount" sortable="custom"/>
                <el-table-column property="createTime" label="创建时间" width="200" sortable="custom">
                    <template #default="scope">
                        <p>{{ dateParse(scope.row.createTime) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140">
                    <template #default>
                        <div>
                            <el-button link type="primary" size="small">编辑</el-button>
                            <el-button link type="danger" size="small">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination layout="prev, pager, next" :total="total" v-model:current-page="currentpage" :default-page-size="6"/>
            </div>    
        </div>
    </div>
</template>

<script setup lang="ts">
import { Delete, Plus, Refresh, Search } from '@element-plus/icons-vue';
import { reactive, ref, watch } from 'vue';
// @ts-ignore
import { getMaxPermission } from '@/utils/otherHandler';
// @ts-ignore
import { dateParse } from '@/utils/dateHandler';
// @ts-ignore
import { RoleTypeList } from '@/variables/common'
// @ts-ignore
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
// 筛选角色的表单选项
const formInline = reactive({
    keyword: '',
    roleId: '9999',
})
// 重置筛选角色的表单
const resetForm = () => {

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
// 选中条件：有权限
const selectable = (row :roleItem) => getMaxPermission(userStore.userInfo.roles) < row.roleType;
// 角色列表
const roleList = ref<roleItem>();
// 获取角色列表
const getRoleList = async () => {

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
const total = ref(6);
// 分页功能 切换到某一页
const currentpage = ref(1);
watch(currentpage, async () => {
    await getRoleList();
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
            position: absolute;
            bottom: 0;
            right: 0;
        }
    }
}
</style>