// roleFunctions.ts

import { reactive, toRaw, ref } from 'vue';
import { getDepartmentTree, type DepartmentNode } from '@/api/departmentApi';
import { getRoleListApi, addRole, editRole, removeRole } from '@/api/roleApi'; // 接口
import type { RoleRequest, Role } from '@/api/roleApi';// 模型类
import { ElMessage, ElForm, ElMessageBox, ElTree } from "element-plus";
import { formatDate } from "@/utils";
import { useUserInfoStore } from '@/stores/userInfo';

export const options = ref<DepartmentNode[]>([]);
export const roles = ref<Role[]>([]);// 数据数组
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
export const currentRow = ref<Role | null>(null);
// 引用树组件
export const treeAddRef = ref<InstanceType<typeof ElTree> | null>(null);
export const treeEditRef = ref<InstanceType<typeof ElTree> | null>(null);

// ↓↓↓↓↓ 查询 ↓↓↓↓↓
export const handleQuery = async (filters: { name: string }) => {
    currentRow.value = null;
    page.value = 1;

    const para = ref<RoleRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.name,
    });

    listLoading.value = true;
    try {
        const { response } = await getRoleListApi(para.value);
        roles.value = response.data ?? [];
        total.value = response.dataCount;
    } finally {
        listLoading.value = false;
    }
};
// ↑↑↑↑↑ 查询 ↑↑↑↑↑


// ↓↓↓↓↓ 新增 ↓↓↓↓↓
export const addForm = reactive<Role>({
    IsDeleted: false,
    Name: "",
    Description: "",
    OrderSort: 0,
    Dids: null,
    AuthorityScope: -1,
    Enabled: false,
    CreateId: "",
    CreateBy: "",
    CreateTime: "",
    ModifyId: null,
    ModifyBy: null,
    ModifyTime: "",
    Id: ""
});
export const handleAdd = async () => {
    options.value = [];
    addFormVisible.value = true;
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

            const userStore = useUserInfoStore();
            postData.CreateId = userStore.user?.uID ?? '';
            postData.CreateBy = userStore.user?.uRealName ?? '';

            if (treeAddRef.value) {
                const pids = treeAddRef.value.getCheckedKeys();
                console.log('勾选的节点值:', pids);
                postData.Dids = pids.join(",");
            }

            console.log(postData);
            const { success, msg } = await addRole(postData);
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
export const editForm = reactive<Role>({
    IsDeleted: false,
    Name: "",
    Description: "",
    OrderSort: 0,
    Dids: null,
    AuthorityScope: -1,
    Enabled: false,
    CreateId: "",
    CreateBy: "",
    CreateTime: "",
    ModifyId: null,
    ModifyBy: null,
    ModifyTime: "",
    Id: ""
});
export const handleEdit = async () => {
    if (!(currentRow.value && currentRow.value?.Id)) {
        ElMessage.error('请选择要编辑的一行数据！');
        return;
    }
    options.value = [];
    editFormVisible.value = true;
    editLoading.value = true;
    if (currentRow.value) {
        Object.assign(editForm, currentRow.value);
    }

    try {
        const { response } = await getDepartmentTree('0');
        isResouceShow.value++;
        options.value.push(response);
        editLoading.value = false;

        // 部门树赋值
        setTimeout(() => {
            if (treeEditRef.value) {
                treeEditRef.value.setCheckedKeys(editForm.Dids?.split(",") ?? []);
            }
        }, 100);

    } catch (error) {
        ElMessage.error("加载机构树失败");
    } finally {
        editLoading.value = false;
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

                if (treeEditRef.value) {
                    const pids = treeEditRef.value.getCheckedKeys();
                    console.log('勾选的节点值:', pids);
                    postData.Dids = pids.join(",");
                }
                console.log(postData);
                const { success, msg } = await editRole(postData);
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
        const { success, msg } = await removeRole(currentRow.value?.Id || '0');
        if (success) {
            ElMessage.success('删除成功');
            await handleQuery({ name: '' });
        } else {
            ElMessage.error('提交失败' + msg);
        }
    });
};
// ↑↑↑↑↑ 删除 ↑↑↑↑↑