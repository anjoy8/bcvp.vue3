// moduleFunctions.ts

import { reactive, toRaw, ref } from 'vue';
import { getModuleListApi } from '@/api/moduleApi'; // 接口
import type { ModuleRequest, Module } from '@/api/moduleApi';// 模型类
import { ElMessage, ElForm, ElMessageBox } from "element-plus";
import { formatDate } from "@/utils";

export const modules = ref<Module[]>([]);// 数据数组
export const listLoading = ref<boolean>(false);// 表格loading
export const total = ref<number>(0);// 总数据条数
export const page = ref<number>(1);//当前页
export const pageSize = ref<number>(20);// 每页数据条数

export const addFormVisible = ref(false);
export const addLoading = ref(false);
export const editFormVisible = ref(false);
export const editLoading = ref(false);
export const isResouceShow = ref(0);
// 创建一个 ref 引用 el-form
export const addFormRef = ref<InstanceType<typeof ElForm> | null>(null);
export const editFormRef = ref<InstanceType<typeof ElForm> | null>(null);
export const currentRow = ref<Module | null>(null);

// ↓↓↓↓↓ 查询 ↓↓↓↓↓
export const handleQuery = async (filters: { name: string }) => {
    currentRow.value = null;
    page.value = 1;

    const para = ref<ModuleRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.name,
    });

    listLoading.value = true;
    try {
        const { response } = await getModuleListApi(para.value);
        modules.value = response.data ?? [];
        total.value = response.dataCount;
    } finally {
        listLoading.value = false;
    }
};
// ↑↑↑↑↑ 查询 ↑↑↑↑↑


// ↓↓↓↓↓ 新增 ↓↓↓↓↓

export const handleAdd = async () => {
    ElMessage.warning('handleAdd');

};

export const addSubmit = async () => {
    ElMessage.warning('addSubmit');

};

// ↑↑↑↑↑ 新增 ↑↑↑↑↑


// ↓↓↓↓↓ 编辑 ↓↓↓↓↓

export const handleEdit = async () => {
    ElMessage.warning('handleEdit');

};
export const editSubmit = async () => {
    ElMessage.warning('editSubmit');

};

// ↑↑↑↑↑ 编辑 ↑↑↑↑↑

// ↓↓↓↓↓ 删除 ↓↓↓↓↓
// 删除数据
export const handleDel = async () => {
    ElMessage.warning('handleDel');

};
// ↑↑↑↑↑ 删除 ↑↑↑↑↑