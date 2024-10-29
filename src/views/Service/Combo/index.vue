<template>
    <div class="home">
        <div class="filter">
            <div class="form">
                <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
                    <el-form-item label="套餐名称">
                        <el-input v-model="formInline.comboName" placeholder="搜索套餐名称" clearable />
                    </el-form-item>
                    <el-form-item label="套餐类型">
                        <el-select v-model="formInline.comboType">
                            <el-option label="全部" value="9999" />
                            <el-option label="个人客户" value="1" />
                            <el-option label="企业客户" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-select v-model="formInline.status">
                            <el-option label="全部" value="99" />
                            <el-option label="个人客户" value="1" />
                            <el-option label="企业客户" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间" v-show="showMoreItems">
                        <el-date-picker v-model="formInline.timeList" type="daterange" start-placeholder="开始时间"
                            end-placeholder="结束时间" style="width: 220px;" value-format="YYYY-MM-DD HH:mm:ss" />
                    </el-form-item>
                    <el-form-item label="标准资费" v-show="showMoreItems">
                        <el-input-number v-model="formInline.standardTariffRange[0]" class="mx-4" :min="0" :max="10"
                            controls-position="right" style="width: 90px;" placeholder="最低" />
                        &nbsp;-&nbsp;
                        <el-input-number v-model="formInline.standardTariffRange[1]" class="mx-4" :min="0" :max="10"
                            controls-position="right" style="width: 90px;" placeholder="最高" />
                    </el-form-item>
                    <el-form-item label="销售价格" v-show="showMoreItems">
                        <el-input-number v-model="formInline.salesPriceRange[0]" class="mx-4" :min="0" :max="10"
                            controls-position="right" style="width: 90px;" placeholder="最低" />
                        &nbsp;-&nbsp;
                        <el-input-number v-model="formInline.salesPriceRange[1]" class="mx-4" :min="0" :max="10"
                            controls-position="right" style="width: 90px;" placeholder="最高" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="getClientList()">搜索</el-button>
                        <el-button :icon="Refresh" type="primary" :plain=true @click="resetForm">重置</el-button>
                        <el-button :icon="showMoreItems ? ArrowUpBold : ArrowDownBold" type="primary" :plain=true
                            @click="showMoreItems = !showMoreItems">{{ showMoreItems ? '收起' : '更多' }}</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="filter_right">
                <div>
                    <el-button type="primary" :icon="Plus">添加</el-button>   
                    <el-button type="danger" :icon="Delete" :plain=true>删除</el-button>
                    <el-button type="primary" :icon="Top" :plain=true>上架</el-button>  
                    <el-button type="primary" :icon="Bottom" :plain=true>下架</el-button>
                </div>
            </div>
        </div>
        <div class="lists">
            <!-- <el-table :data="clientList" style="width: 100%" @selection-change="handleSelectionChange"
                @sort-change="handleSortChange" v-loading="tableLoading" max-height="calc(100vh - 270px)">
                <el-table-column type="selection" width="40" />
                <el-table-column property="id" label="ID" width="70" fixed />
                <el-table-column property="clientNo" label="客户编号" width="150" show-overflow-tooltip sortable="custom" />
                <el-table-column property="clientName" label="客户名称" width="220" show-overflow-tooltip sortable="custom" />
                <el-table-column label="客户类型" width="120" sortable="custom">
                    <template #default="scope">
                        <p>{{ scope.row.clientType === 1 ? '个人客户' : '企业用户' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="contact" label="联系人" sortable="custom" width="120" show-overflow-tooltip/>
                <el-table-column property="contactPhone" label="联系号码" sortable="custom" width="120"/>
                <el-table-column label="联系地址" width="250" show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ scope.row.contactProvinceName + scope.row.contactCityName + scope.row.contactAreaName + 
                            scope.row.contactStreetName + scope.row.contactAddress || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="salesmanName" label="业务员" width="150" sortable="custom" show-overflow-tooltip=""/>
                <el-table-column property="createTime" label="创建时间" width="200" sortable="custom">
                    <template #default="scope">
                        <p>{{ dateParse(scope.row.createTime) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                    <template #default="scope">
                        <div>
                            <el-button link type="primary" size="small"
                                @click="addOrModifyClient('编辑客户', scope.row)">编辑</el-button>
                            <el-button link type="danger" size="small">
                                <el-popconfirm width="220" :icon="WarningFilled" icon-color="red" title="确定删除该条记录吗?"
                                    @confirm="deleteClient(scope.row.id)">
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
            </div> -->
        </div>
    </div>
</template>

<script setup lang="ts">
import { ArrowDownBold, ArrowUpBold, Bottom, Delete, Plus, Refresh, Search, Top } from '@element-plus/icons-vue';
import { reactive, ref } from 'vue';
const showMoreItems = ref(false);

// 筛选表单
const formInline = reactive({
    comboName: '',
    comboType: '9999',
    status: '99',
    timeList: [],
    standardTariffRange: [],
    salesPriceRange: [],
    orderBy: 'createTime',
    orderType: 'desc'
})
// 搜索套餐
const getClientList = async () => {

}
// 重置筛选表单
const resetForm = () => {

}
</script>


<style lang="scss" scoped src="@/assets/css/manage.scss"></style>
<style lang="scss" scoped>
    .home {
        .filter {
            .filter_right {
                >div {
                    display: flex;
                }
                
            }
        }
    }
</style>