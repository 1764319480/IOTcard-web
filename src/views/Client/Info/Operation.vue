<template>
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
</template>
<script setup lang="ts">
import { Delete, Plus, WarningFilled } from '@element-plus/icons-vue'
import { ref, reactive, watch, toRefs, onBeforeMount } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { useCommonStore } from '@/stores/common'
import { useClientStore } from '@/stores/client'
import { ClientItemType } from '@/variables/type'
const ruleFormRef2 = ref<FormInstance>();
const userStore = useUserStore();
const commonStore = useCommonStore();
const clientStore = useClientStore();
const addOrModifyVisiable = ref(false);
const deleteClientsVisible = ref(false);
const addOrModifyTitle = ref(1);
const provinces = ref();
const cities = ref();
const areas = ref();
const streets = ref();
const stopClick2 = ref(false);
let timer:any = null;
const { selectIds, currentpage } = defineProps(['selectIds', 'currentpage']);
const emits = defineEmits(['getClientList', 'changePage', 'deleteClient']);
const ruleForm = reactive<ClientFormType>({// 新增或编辑客户的表单
    id: '',
    clientName: '',
    clientType: '',
    contact: '',
    contactPhone: '',
    contactProvince: undefined,
    contactCity: undefined,
    contactArea: undefined,
    contactStreet: undefined,
    contactAddress: undefined,
    salesman: '' as string | number
})
const { contactProvince, contactCity, contactArea } = toRefs(ruleForm);
type ClientFormType = {// 新增或编辑客户的表单
    id: string,
    clientName: string,
    clientType: string,
    contact: string,
    contactPhone: string,
    contactProvince: number | undefined,
    contactCity: number | undefined,
    contactArea: number | undefined,
    contactStreet: number | undefined,
    contactAddress: string | undefined,
    salesman: string | number
}
// 获取业务员列表
const getUsers = (value:string) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
        userStore.getAllUserAsync(value);
    }, 500) 
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
    ruleFormRef2.value?.resetFields();
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
                addOrModifyVisiable.value = false;
                ElMessage({
                    message: addOrModifyTitle.value === 2 ? '编辑成功' : '添加成功',
                    type: 'success'
                })
                if (addOrModifyTitle.value === 2) {
                    emits('getClientList', currentpage);
                } else {
                    if (currentpage === 1) {
                        emits('getClientList');
                    } else {
                        emits('changePage', 1);
                    }
                }
            }
            stopClick2.value = false;
        } else {
            console.log('error submit!')
        }
    })
}
// 批量删除
const deleteClients = () => {
    if (!selectIds) {
        ElMessage({
            message: '未选择任何数据',
            type: 'warning'
        });
        return;
    }
    deleteClientsVisible.value = true;
}
const confirmDeleteUsers = () => {
    emits('deleteClient', selectIds);
    deleteClientsVisible.value = false;
}
// 地址选择
watch(contactProvince, async (value: any) => {
    if (!value) return;
    cities.value = await commonStore.getCitiesAsync(Number(value));
    if (!cities.value.find((item: any) => item.id === ruleForm.contactCity)) {
        ruleForm.contactCity = undefined;
        ruleForm.contactArea = undefined;
        areas.value = [];
        ruleForm.contactStreet = undefined;
        streets.value = [];
    }
});
watch(contactCity, async (value: any) => {
    if (!value) return;
    areas.value = await commonStore.getAreasAsync(Number(value));
    if (!areas.value.find((item: any) => item.id === ruleForm.contactArea)) {
        ruleForm.contactArea = undefined;
        ruleForm.contactStreet = undefined;
        streets.value = [];
    }
})
watch(contactArea, async (value: any) => {
    if (!value) return;
    streets.value = await commonStore.getStreetsAsync(Number(value));
    if (!streets.value.find((item: any) => item.id === ruleForm.contactStreet)) {
        ruleForm.contactStreet = undefined;
    }
})
onBeforeMount(async () => {
    await userStore.getAllUserAsync();
    provinces.value = await commonStore.getProvincesAsync();
})
defineExpose({
    addOrModifyClient
})
</script>
<script lang="ts">
export default {
    name: 'operation'
}
</script>