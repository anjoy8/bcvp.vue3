// departmentFunctions.ts

import { reactive, toRaw, ref } from 'vue';
import { getDepartmentListApi, addDepartment, editDepartment, removeDepartment, getDepartmentTree } from '@/api/departmentApi';
import type { DepartmentRequest, Department, DepartmentNode } from '@/api/departmentApi';
import { ElMessage, ElForm, ElMessageBox } from "element-plus";
import { formatDate } from "@/utils";

export const departments = ref<Department[]>([]);
export const listLoading = ref<boolean>(false);
export const page = ref<number>(1);

export const options = ref<DepartmentNode[]>([]);
export const addFormVisible = ref(false);
export const addLoading = ref(false);
export const editFormVisible = ref(false);
export const editLoading = ref(false);
export const isResouceShow = ref(0);
// 创建一个 ref 引用 el-form
export const addFormRef = ref<InstanceType<typeof ElForm> | null>(null);
export const editFormRef = ref<InstanceType<typeof ElForm> | null>(null);
export const currentRow = ref<Department | null>(null);

// ↓↓↓↓↓ 查询 ↓↓↓↓↓
export const handleQuery = async (filters: { name: string }) => {
    currentRow.value = null;

    const para = ref<DepartmentRequest>({
        page: page.value,
        f: '0',
        key: filters.name,
    });

    listLoading.value = true;
    try {
        const { response } = await getDepartmentListApi(para.value);
        departments.value = response ?? [];
    } finally {
        listLoading.value = false;
    }
};
// ↑↑↑↑↑ 查询 ↑↑↑↑↑

// ↓↓↓↓↓ 新增 ↓↓↓↓↓
// 定义addForm数据并指定其类型为Department
export const addForm = reactive<Department>({
    CodeRelationship: "",
    Name: "",
    Leader: "",
    OrderSort: 0,
    Enabled: true,  // 可以根据需要设置初始值
    Status: false,
    IsDeleted: false, // 默认为false表示未删除
    CreateBy: "",
    CreateTime: "",
    ModifyBy: null,
    ModifyTime: "",
    hasChildren: false, // 初始设为false，可以根据上下文修改
    Pid: "",
    PidArr: [],
    Id: "" // 或使用字符串初始化如“0”以符号根节点 
});
export const handleAdd = async () => {
    options.value = [];
    addFormVisible.value = true;
    addLoading.value = true;
    // 使用引用重置表单
    if (addFormRef.value) {
        addFormRef.value.resetFields();
    }

    try {
        const { response } = await getDepartmentTree('0');
        isResouceShow.value++;
        options.value.push(response);
        addLoading.value = false;
    } catch (error) {
        ElMessage.error("加载机构树失败");
    } finally {
        addLoading.value = false;
    }
};

// 新增提交表单
export const addSubmit = async () => {
    const formEl = addFormRef.value; // 获取表单实例
    if (!formEl) return;

    await formEl.validate(async (isValid) => {
        if (isValid) {
            const postData = toRaw(addForm);
            postData.CodeRelationship = postData.PidArr.join() + ",";
            postData.CreateTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
            postData.ModifyTime = postData.CreateTime;
            postData.IsDeleted = false;
            postData.Pid = postData.PidArr.pop() ?? '';
            console.log(postData);
            const { success, msg } = await addDepartment(postData);
            if (success) {
                ElMessage.success('提交成功');
                await handleQuery({ name: '' });
            } else {
                ElMessage.error('提交失败' + msg);
            }

            addFormVisible.value = false;
        } else {
            ElMessage.error('验证失败，请检查输入项');
        }
    });
};
// ↑↑↑↑↑ 新增 ↑↑↑↑↑

// ↓↓↓↓↓ 编辑 ↓↓↓↓↓

// 定义addForm数据并指定其类型为Department
export const editForm = reactive<Department>({
    CodeRelationship: "",
    Name: "",
    Leader: "",
    OrderSort: 0,
    Enabled: true,  // 可以根据需要设置初始值
    Status: false,
    IsDeleted: false, // 默认为false表示未删除
    CreateBy: "",
    CreateTime: "",
    ModifyBy: null,
    ModifyTime: "",
    hasChildren: false, // 初始设为false，可以根据上下文修改
    Pid: "",
    PidArr: [],
    Id: "" // 或使用字符串初始化如“0”以符号根节点 
});
export const handleEdit = async () => {
    if (!(currentRow.value && currentRow.value?.Id)) {
        ElMessage.error('请选择要编辑的一行数据！');
        return;
    }

    options.value = [];
    editFormVisible.value = true;
    editLoading.value = true;

    try {
        const { response } = await getDepartmentTree(currentRow.value?.Id);
        if (currentRow.value) {
            Object.assign(editForm, currentRow.value);
        }
        isResouceShow.value++;
        options.value.push(response);
        editLoading.value = false;
    } catch (error) {
        ElMessage.error("加载机构树失败");
    } finally {
        editLoading.value = false;
    }
};
// 编辑提交表单
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
                postData.CodeRelationship = postData.PidArr.join() + ",";
                postData.ModifyTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
                postData.Pid = postData.PidArr.pop() ?? '';
                console.log(postData);
                const { success, msg } = await editDepartment(postData);
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
        const { success, msg } = await removeDepartment(currentRow.value?.Id || '0');
        if (success) {
            ElMessage.success('删除成功');
            await handleQuery({ name: '' });
        } else {
            ElMessage.error('提交失败' + msg);
        }
    });


};
// ↑↑↑↑↑ 删除 ↑↑↑↑↑