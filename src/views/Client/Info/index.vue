<template>
    <div class="home">
        <div class="filter">
            <div class="form">
                <el-form :inline="true" :model="formInline" ref="ruleFormRef" class="demo-form-inline">
                    <el-form-item label="客户名称">
                        <el-input v-model="formInline.clientName" placeholder="搜索客户名称" clearable />
                    </el-form-item>
                    <el-form-item label="客户类型">
                        <el-select v-model="formInline.clientType">
                            <el-option label="全部" value="9999" />
                            <el-option label="个人客户" value="1" />
                            <el-option label="企业客户" value="2" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="联系人">
                        <el-input v-model="formInline.contact" placeholder="联系人" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="联系号码">
                        <el-input v-model="formInline.contactPhone" placeholder="联系号码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :icon="Search" @click="getClientList()">搜索</el-button>
                        <el-button :icon="Refresh" type="primary" :plain=true @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="filter_right">
                <div>
                    <el-button type="primary" :icon="Plus" @click="addOrModifyClient(1)">添加</el-button>
                    <el-button type="danger" :icon="Delete" :plain=true @click="deleteClients">删除</el-button>
                </div>
                <el-dialog v-model="addOrModifyVisiable" width="630" :title="addOrModifyTitle === 1 ? '添加客户' : '编辑客户'" :show-close="false"
                    :close-on-click-modal="false" :close-on-press-escape="false">
                    <div class="form-items">
                        <el-form :inline="true" ref="ruleFormRef2" :model="ruleForm" :rules="rules"
                            label-position="left" label-width="auto" class="demo-ruleForm">
                            <el-form-item label="客户名称:" prop="clientName">
                                <el-input v-model="ruleForm.clientName" style="width: 180px;" autocomplete="off"
                                    placeholder="请输入客户名称" />
                            </el-form-item>
                            <el-form-item label="客户类型:" prop="clientType">
                                <el-select v-model="ruleForm.clientType" style="width: 180px" collapse-tags
                                    collapse-tags-tooltip placeholder="请选择客户类型">
                                    <el-option label="个人客户" value="1" />
                                    <el-option label="企业客户" value="2" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系人:" prop="contact">
                                <el-input v-model="ruleForm.contact" style="width: 180px;" autocomplete="off"
                                    placeholder="请输入联系人" />
                            </el-form-item>
                            <el-form-item label="联系号码:" prop="contactPhone">
                                <el-input v-model="ruleForm.contactPhone" style="width: 180px;" autocomplete="off"
                                    placeholder="请输入联系人手机号" />
                            </el-form-item>
                            <el-form-item label="业务员:" prop="salesman">
                                <el-select v-model="ruleForm.salesman" filterable :filter-method="getUsers"
                                 placeholder="请选择客户类型" style="width: 180px;">
                                    <el-option v-for="item of userStore.users" :label="item.userName + '(' + item.account + ')'"
                                        :value="item.id" :key="item.id" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系地址:">
                                <el-select v-model="ruleForm.contactProvince" placeholder="请选择省份" style="width: 115px;"
                                    no-data-text="获取省份失败">
                                    <el-option v-for="item of provinces" :label="item.name" :value="item.id"
                                        :key="item.id" />
                                </el-select>
                                &nbsp;
                                <el-select v-model="ruleForm.contactCity" placeholder="请选择城市" style="width: 115px;"
                                    no-data-text="请先选择省份">
                                    <el-option v-for="item of cities" :label="item.name" :value="item.id"
                                        :key="item.id" />
                                </el-select>
                                &nbsp;
                                <el-select v-model="ruleForm.contactArea" placeholder="请选择区域" style="width: 115px;"
                                    no-data-text="请先选择城市">
                                    <el-option v-for="item of areas" :label="item.name" :value="item.id"
                                        :key="item.id" />
                                </el-select>
                                &nbsp;
                                <el-select v-model="ruleForm.contactStreet" placeholder="请选择街道" style="width: 115px;"
                                    no-data-text="请先选择区域">
                                    <el-option v-for="item of streets" :label="item.name" :value="item.id"
                                        :key="item.id" />
                                </el-select>
                                <el-input v-model="ruleForm.contactAddress" type="textarea" :rows="3"
                                    placeholder="请输入详细地址" style="margin-top: 10px;"></el-input>
                            </el-form-item>
                            <div style="display: flex; justify-content: end;">
                                <el-button @click="addOrModifyVisiable = false;" style="width:80px">取消</el-button>
                                <el-button type="primary" @click="saveAddClient" :loading="stopClick2"
                                    style="width: 80px;">保存</el-button>
                            </div>
                        </el-form>
                    </div>
                </el-dialog>
                <el-dialog v-model="deleteClientsVisible" width="250" :show-close="false">
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
                            <el-button @click="deleteClientsVisible = false">取消</el-button>
                            <el-button type="danger" @click="confirmDeleteUsers">
                                确认
                            </el-button>
                        </div>
                    </template>
                </el-dialog>
            </div>
        </div>
        <div class="lists">
            <el-table :data="clientList" style="width: 100%" @selection-change="handleSelectionChange"
                @sort-change="handleSortChange" v-loading="tableLoading" max-height="calc(100vh - 270px)">
                <el-table-column type="selection" width="40" />
                <el-table-column property="id" label="ID" width="70" fixed />
                <el-table-column property="clientNo" label="客户编号" width="150" show-overflow-tooltip sortable="custom" />
                <el-table-column property="clientName" label="客户名称" width="220" show-overflow-tooltip
                    sortable="custom" />
                <el-table-column property="clientType" label="客户类型" width="120" sortable="custom">
                    <template #default="scope">
                        <p>{{ scope.row.clientType === 1 ? '个人客户' : '企业用户' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="contact" label="联系人" sortable="custom" width="120" show-overflow-tooltip />
                <el-table-column property="contactPhone" label="联系号码" sortable="custom" width="120" />
                <el-table-column label="联系地址" width="250" show-overflow-tooltip>
                    <template #default="scope">
                        <p>{{ (scope.row.contactProvinceName || '') + (scope.row.contactCityName || '')+ (scope.row.contactAreaName || '') +
                            (scope.row.contactStreetName || '') + (scope.row.contactAddress || '') || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column property="salesmanName" label="业务员" width="150"
                    show-overflow-tooltip="" />
                <el-table-column property="createTime" label="创建时间" width="200" sortable="custom">
                    <template #default="scope">
                        <p>{{ dateParse(scope.row.createTime) }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="140" fixed="right">
                    <template #default="scope">
                        <div>
                            <el-button link type="primary" size="small"
                                @click="addOrModifyClient(2, scope.row)">编辑</el-button>
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
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
// @ts-ignore
import { useClientStore } from '@/stores/client';
// @ts-ignore
import { useUserStore } from '@/stores/user';
// @ts-ignore
import { useCommonStore } from '@/stores/common';
// @ts-ignore
import { dateParse } from '@/utils/dateHandler';
import { Delete, Plus, Refresh, Search, WarningFilled } from '@element-plus/icons-vue';
import { ref, reactive, onBeforeMount, watch, toRefs } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

const clientStore = useClientStore();
const commonStore = useCommonStore();
const userStore = useUserStore();
const tableLoading = ref(false);
const addOrModifyVisiable = ref(false);
const deleteClientsVisible = ref(false);
const addOrModifyTitle = ref(1);
const ruleFormRef = ref<FormInstance>();
const ruleFormRef2 = ref<FormInstance>();
const stopClick2 = ref(false);
const clientList = ref<ClientItemType[]>();
const total = ref(0);// 客户列表数据总数
const selectIds = ref();// 多选时选中的id集合
const currentpage = ref(1);
const provinces = ref();
const cities = ref();
const areas = ref();
const streets = ref();
let timer:any = null;
const ruleForm = reactive({// 新增或编辑客户的表单
    id: '',
    clientName: '',
    clientType: '',
    contact: '',
    contactPhone: '',
    contactProvince: undefined as string | number | undefined,
    contactCity: undefined as string | number | undefined,
    contactArea: undefined as string | number | undefined,
    contactStreet: undefined as string | number | undefined,
    contactAddress: undefined as string | number | undefined,
    salesman: '' as string | number
})
const { contactProvince, contactCity, contactArea } = toRefs(ruleForm);
const formInline = reactive({// 筛选的选项
    clientName: '',
    clientType: '9999',
    contact: '',
    contactPhone: '',
    timeList: [],
    orderBy: 'createTime',
    orderType: 'desc'
})
interface ISortProps {// 排序选项结构
    column: object,
    prop: string,
    order: string | null
}
type ClientItemType = {// 客户数据结构
    id: number,
    clientNo: string,
    clientName: string,
    clientType: number,
    contact: string,
    contactPhone: string,
    contactProvince: number,
    contactProvinceName: string,
    contactCity: number,
    contactCityName: string,
    contactArea: number,
    contactAreaName: string,
    contactStreet: number,
    contactStreetName: string,
    contactAddress: string,
    salesman: number,
    selesmanName: string,
    createTime: string
}
// 选中条件：有权限
// const selectable = ref(true);
// 选中时存入选项
const handleSelectionChange = (items: ClientItemType[]) => {
    if (items?.length === 0) {
        selectIds.value = '';
        return;
    }
    selectIds.value = items.map(item => item.id);
}
// 获取客户列表
const getClientList = async (pageNum: number = 1, pageSize: number = 20) => {
    tableLoading.value = true;
    const data = await clientStore.getClientListAsync({
        clientName: formInline.clientName,
        clientType: formInline.clientType === '9999' ? undefined : formInline.clientType,
        contact: formInline.contact,
        contactPhone: formInline.contactPhone,
        pageNum,
        pageSize,
        orderBy: formInline.orderBy,
        orderType: formInline.orderType
    })
    if (data) {
        total.value = data.total;
        clientList.value = data.list;
    }
    tableLoading.value = false;
}
// 重置筛选的表单内容
const resetForm = async () => {
    formInline.clientName = '';
    formInline.clientType = '9999';
    formInline.contact = '';
    formInline.contactPhone = '';
    if (currentpage.value === 1) {
        await getClientList()
    } else {
        currentpage.value = 1;
    }
}
// 获取业务员列表
const getUsers = (value:string) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        userStore.getAllUserAsync(value);
    }, 500) 
}
// 表单排序
const handleSortChange = async (data: ISortProps) => {
    let { prop, order } = data;
    if (!order) order = 'descending';
    formInline.orderBy = prop;
    formInline.orderType = order.replace('ending', '');
    await getClientList(currentpage.value);
}
// 新增或编辑客户表单的格式验证规则
const rules = reactive<FormRules<typeof ruleForm>>({
    clientName: [
        { required: true, message: '请输入客户名称', trigger: 'blur' },
        { min: 1, max: 128, message: '名称长度最多 128 个字符', trigger: 'blur' },
    ],
    clientType: [
        { required: true, message: '请选择客户类型', trigger: 'change' },
    ],
    contact: [
        { required: true, message: '请输入联系人', trigger: 'blur' },
        { min: 1, max: 32, message: '联系人长度最多 32 个字符', trigger: 'blur' },
    ],
    contactPhone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { min: 11, max: 11, message: '手机号必须11位号码', trigger: 'blur' },
        { pattern: /^[0-9]+$/, message: '手机号只能包含数字', trigger: 'blur' },
    ],
    salesman: [
        { required: true, message: '请选择业务员', trigger: 'change' },
    ]
})
// 清空新增或编辑客户表单
const resetForm1 = () => {
    ruleFormRef2.value?.resetFields();
    ruleForm.clientName = '';
    ruleForm.clientType = '';
    ruleForm.contact = '';
    ruleForm.contactPhone = '';
    ruleForm.salesman = '';
    ruleForm.contactProvince = undefined;
    ruleForm.contactCity = undefined;
    ruleForm.contactArea = undefined;
    ruleForm.contactStreet = undefined;
    ruleForm.contactAddress = undefined;
    cities.value = [];
    areas.value = [];
    streets.value = [];
}
// 打开新增或编辑客户表单
const addOrModifyClient = (title: number, item?: ClientItemType) => {
    addOrModifyTitle.value = title;
    if (item) {
        ruleForm.id = item.id.toString();
        ruleForm.clientName = item.clientName;
        ruleForm.clientType = item.clientType.toString();
        ruleForm.contact = item.contact;
        ruleForm.contactPhone = item.contactPhone;
        ruleForm.salesman = item.salesman;
        ruleForm.contactProvince = item.contactProvince;
        ruleForm.contactCity = item.contactCity;
        ruleForm.contactArea = item.contactArea;
        ruleForm.contactStreet = item.contactStreet;
        ruleForm.contactAddress = item.contactAddress;
    } else {
        resetForm1();
    }
    addOrModifyVisiable.value = true;
}
// 新增或编辑客户表单的保存按钮
const saveAddClient = async () => {
    if (!ruleFormRef2.value) return
    await ruleFormRef2.value.validate(async (valid) => {
        if (valid) {
            stopClick2.value = true;
            let data: any;
            if (addOrModifyTitle.value === 2) {
                data = await clientStore.updateClientAsync(ruleForm)
            } else {
                data = await clientStore.addClientAsync({
                    clientName: ruleForm.clientName,
                    clientType: ruleForm.clientType,
                    contact: ruleForm.contact,
                    contactPhone: ruleForm.contactPhone,
                    contactProvince: ruleForm.contactProvince || undefined,
                    contactCity: ruleForm.contactCity || undefined,
                    contactArea: ruleForm.contactArea || undefined,
                    contactStreet: ruleForm.contactStreet || undefined,
                    contactAddress: ruleForm.contactAddress || undefined,
                    salesman: ruleForm.salesman
                });
            }
            if (data) {
                if (addOrModifyTitle.value === 2) {
                    await getClientList(currentpage.value);
                } else {
                    if (currentpage.value === 1) {
                        await getClientList()
                    } else {
                        currentpage.value = 1;
                    }
                }
                ElMessage({
                    message: addOrModifyTitle.value === 2 ? '编辑成功' : '添加成功',
                    type: 'success'
                })
            }
            stopClick2.value = false;
        } else {
            console.log('error submit!')
        }
    })
}
// 删除客户
const deleteClient = async (clientIds: string[] | number[] | string | number) => {
    let ids = Array.isArray(clientIds) ? clientIds : [clientIds];
    let data = await clientStore.deleteClientAsync(ids);
    if (data) {
        if (currentpage.value === 1) {
            await getClientList()
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
const deleteClients = () => {
    if (!selectIds.value) {
        ElMessage({
            message: '未选择任何数据',
            type: 'warning'
        });
        return;
    }
    deleteClientsVisible.value = true;
}
const confirmDeleteUsers = () => {
    deleteClient(selectIds.value);
    deleteClientsVisible.value = false;
}
// 分页功能 切换到某一页
watch(currentpage, async (value: number) => {
    await getClientList(value);
})
// 地址选择
watch(contactProvince, async (value: any) => {
    if (!value) return;
    cities.value = await commonStore.getCitiesAsync(Number(value));
    if (!cities.value.find((item: any) => item.id === ruleForm.contactCity)) {
        ruleForm.contactCity = '';
        ruleForm.contactArea = '';
        areas.value = [];
        ruleForm.contactStreet = '';
        streets.value = [];
    }
});
watch(contactCity, async (value: any) => {
    if (!value) return;
    areas.value = await commonStore.getAreasAsync(Number(value));
    if (!areas.value.find((item: any) => item.id === ruleForm.contactArea)) {
        ruleForm.contactArea = '';
        ruleForm.contactStreet = '';
        streets.value = [];
    }
})
watch(contactArea, async (value: any) => {
    if (!value) return;
    streets.value = await commonStore.getStreetsAsync(Number(value));
    if (!streets.value.find((item: any) => item.id === ruleForm.contactStreet)) {
        ruleForm.contactStreet = '';
    }
})
// 进入页面前获取一次数据
onBeforeMount(async () => {
    await getClientList();
    await userStore.getAllUserAsync();
    provinces.value = await commonStore.getProvincesAsync();
})

</script>

<style scoped lang="scss" src="@/assets/css/manage.scss"></style>