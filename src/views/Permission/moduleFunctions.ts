// moduleFunctions.ts

import { reactive, toRaw, ref } from 'vue';
import { getModuleListApi, addModule, editModule, removeModule } from '@/api/moduleApi'; // 接口
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
export const addForm = reactive<Module>({
    IsDeleted: false,     // 默认为false表示未删除
    Name: "",
    LinkUrl: "",
    Area: null,           // 可以根据需要初始化为null或其它值
    Controller: null,
    Action: null,
    Icon: null,
    Code: null,
    OrderSort: 0,         // 根据你的需求初始化数值
    Description: null,
    IsMenu: false,        // 根据需求设置默认值
    Enabled: true,        // 例如设置为true以允许功能
    CreateId: "",
    CreateBy: "",
    CreateTime: "",
    ModifyId: null,
    ModifyBy: null,
    ModifyTime: "",
    ParentId: "",         // 初始化为合适的字符串，可能是"0"或"根"
    Id: ""
});
export const handleAdd = async () => {
    addFormVisible.value = true;
    // 使用引用重置表单
    if (addFormRef.value) {
        addFormRef.value.resetFields();
    }
};

export const addSubmit = async () => {
    const formEl = addFormRef.value; // 获取表单实例
    if (!formEl) return;

    await formEl.validate(async (isValid) => {
        if (isValid) {
            addLoading.value = true;
            const postData = toRaw(addForm);
            postData.CreateTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
            postData.ModifyTime = postData.CreateTime;
            postData.IsDeleted = false;
            console.log(postData);
            const { success, msg } = await addModule(postData);
            if (success) {
                ElMessage.success('提交成功');
                await handleQuery({ name: '' });
            } else {
                ElMessage.error('提交失败' + msg);
            }

            addLoading.value = false;
            addFormVisible.value = false;
        } else {
            ElMessage.error('验证失败，请检查输入项');
        }
    });
};

// ↑↑↑↑↑ 新增 ↑↑↑↑↑


// ↓↓↓↓↓ 编辑 ↓↓↓↓↓
export const editForm = reactive<Module>({
    IsDeleted: false,     // 默认为false表示未删除
    Name: "",
    LinkUrl: "",
    Area: null,           // 可以根据需要初始化为null或其它值
    Controller: null,
    Action: null,
    Icon: null,
    Code: null,
    OrderSort: 0,         // 根据你的需求初始化数值
    Description: null,
    IsMenu: false,        // 根据需求设置默认值
    Enabled: true,        // 例如设置为true以允许功能
    CreateId: "",
    CreateBy: "",
    CreateTime: "",
    ModifyId: null,
    ModifyBy: null,
    ModifyTime: "",
    ParentId: "",         // 初始化为合适的字符串，可能是"0"或"根"
    Id: ""
});
export const handleEdit = async () => {
    if (!(currentRow.value && currentRow.value?.Id)) {
        ElMessage.error('请选择要编辑的一行数据！');
        return;
    }

    editFormVisible.value = true;
    editLoading.value = true;
    if (currentRow.value) {
        Object.assign(editForm, currentRow.value);
    }
    editLoading.value = false;
    isResouceShow.value++;
};
export const editSubmit = async () => {
    const formEl = editFormRef.value; // 获取表单实例
    if (!formEl) return;

    await formEl.validate(async (isValid) => {
        if (isValid) {
            ElMessageBox.confirm("确认提交吗？", "温馨提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(async () => {
                const postData = toRaw(editForm);
                postData.ModifyTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
                console.log(postData);
                const { success, msg } = await editModule(postData);
                if (success) {
                    ElMessage.success('提交成功');
                    await handleQuery({ name: '' });
                } else {
                    ElMessage.error('提交失败' + msg);
                }
            });

            editFormVisible.value = false;

        } else {
            ElMessage.error('验证失败，请检查输入项');
        }
    });
};

// ↑↑↑↑↑ 编辑 ↑↑↑↑↑

// ↓↓↓↓↓ 删除 ↓↓↓↓↓
// 删除数据
export const handleDel = async () => {
    if (!(currentRow.value && currentRow.value?.Id)) {
        ElMessage.error('请选择要删除的一行数据！');
        return;
    }
    ElMessageBox.confirm("确认删除该记录吗？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        const { success, msg } = await removeModule(currentRow.value?.Id || '0');
        if (success) {
            ElMessage.success('删除成功');
            await handleQuery({ name: '' });
        } else {
            ElMessage.error('提交失败' + msg);
        }
    });
};
// ↑↑↑↑↑ 删除 ↑↑↑↑↑