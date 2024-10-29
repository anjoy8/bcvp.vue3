// permissionFunctions.ts

import { reactive, toRaw, ref } from 'vue';
import { getDepartmentTree, type DepartmentNode } from '@/api/departmentApi';
import { getPermissionListApi, addPermission, editPermission, removePermission, getPermissionTree } from '@/api/permissionApi'; // 接口
import type { PermissionRequest, Permission, PermissionNode } from '@/api/permissionApi';// 模型类
import { ElMessage, ElForm, ElMessageBox, ElTree } from "element-plus";
import { formatDate } from "@/utils";
import { useUserInfoStore } from '@/stores/userInfo';
import { getModuleListApi, type Module, type ModuleRequest } from '@/api/moduleApi';

export const modules = ref<Module[]>([]);// 数据数组
export const options = ref<PermissionNode[]>([]);
export const permissions = ref<Permission[]>([]);// 数据数组
export const listLoading = ref<boolean>(false);// 表格loading
export const total = ref<number>(0);// 总数据条数
export const page = ref<number>(1);//当前页
export const pageSize = ref<number>(20);// 每页数据条数

export const addFormVisible = ref(false);
export const addLoading = ref(false);
export const editFormVisible = ref(false);
export const editLoading = ref(false);
export const isResouceShow = ref(0);
export const addCodeDisabled = ref(false);
export const editCodeDisabled = ref(false);
// 创建一个 ref 引用 el-form
export const addFormRef = ref<InstanceType<typeof ElForm> | null>(null);
export const editFormRef = ref<InstanceType<typeof ElForm> | null>(null);
export const currentRow = ref<Permission | null>(null);
// 引用树组件
export const treeAddRef = ref<InstanceType<typeof ElTree> | null>(null);
export const treeEditRef = ref<InstanceType<typeof ElTree> | null>(null);

// ↓↓↓↓↓ 查询 ↓↓↓↓↓
export const handleQuery = async (filters: { name: string }) => {
    currentRow.value = null;
    page.value = 1;

    const para = ref<PermissionRequest>({
        page: page.value,
        pageSize: 999,
        f: '0',
        key: filters.name,
    });

    listLoading.value = true;
    try {
        const moduleReq = ref<ModuleRequest>({
            page: 0,
            pageSize: 999,
            f: '0',
            key: '',
        });
        const moduleRlt = await getModuleListApi(moduleReq.value);
        modules.value = moduleRlt.response?.data ?? [];

        const { response } = await getPermissionListApi(para.value);
        permissions.value = response ?? [];
    } finally {
        listLoading.value = false;
    }
};
// ↑↑↑↑↑ 查询 ↑↑↑↑↑


// ↓↓↓↓↓ 新增 ↓↓↓↓↓
export const addForm = reactive<Permission>({
    MenuType: "",
    Code: "",  // 默认代码为空字符串
    Name: "",  // 默认名称为空字符串
    IsButton: false,  // 默认不是按钮
    IsHide: false,  // 默认不隐藏
    IskeepAlive: false,  // 默认不保持活跃
    Func: null,  // 默认没有功能
    OrderSort: 0,  // 默认排序为 0
    IconNew: "",  // 默认图标为空字符串
    Description: "",  // 默认描述为空字符串
    Enabled: true,  // 默认启用
    CreateId: "",  // 默认创建 ID 为空字符串
    CreateBy: "",  // 默认创建者为空字符串
    CreateTime: "",  // 默认创建时间为空字符串
    ModifyId: null,  // 默认没有修改 ID
    ModifyBy: null,  // 默认没有修改者
    ModifyTime: "",  // 默认修改时间为空字符串
    IsDeleted: false,  // 默认未删除
    PnameArr: [],  // 默认上级名称数组为空
    PCodeArr: [],  // 默认上级代码数组为空
    MName: null,  // 默认没有模块名称
    hasChildren: false,  // 默认没有子菜单
    Children: [],  // 默认子菜单数组为空
    Module: null,  // 默认没有模块
    Pid: "",  // 默认上级 ID 为空字符串
    Mid: "",  // 默认模块 ID 为空字符串
    PidArr: [],  // 默认上级 ID 数组为空
    Id: ""  // 默认菜单 ID 为空字符串
});
export const handleAdd = async () => {
    options.value = [];
    addFormVisible.value = true;
    // 使用引用重置表单
    if (addFormRef.value) {
        addFormRef.value.resetFields();
    }

    try {
        const { response } = await getPermissionTree('0');
        isResouceShow.value++;
        options.value.push(response);
        addLoading.value = false;
    } catch (error) {
        ElMessage.error("加载菜单树失败");
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

            postData.Pid = postData.PidArr?.pop() ?? '';


            console.log(postData);
            const { success, msg } = await addPermission(postData);
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
export const editForm = reactive<Permission>({
    MenuType: "",
    Code: "",  // 默认代码为空字符串
    Name: "",  // 默认名称为空字符串
    IsButton: false,  // 默认不是按钮
    IsHide: false,  // 默认不隐藏
    IskeepAlive: false,  // 默认不保持活跃
    Func: null,  // 默认没有功能
    OrderSort: 0,  // 默认排序为 0
    IconNew: "",  // 默认图标为空字符串
    Description: "",  // 默认描述为空字符串
    Enabled: true,  // 默认启用
    CreateId: "",  // 默认创建 ID 为空字符串
    CreateBy: "",  // 默认创建者为空字符串
    CreateTime: "",  // 默认创建时间为空字符串
    ModifyId: null,  // 默认没有修改 ID
    ModifyBy: null,  // 默认没有修改者
    ModifyTime: "",  // 默认修改时间为空字符串
    IsDeleted: false,  // 默认未删除
    PnameArr: [],  // 默认上级名称数组为空
    PCodeArr: [],  // 默认上级代码数组为空
    MName: null,  // 默认没有模块名称
    hasChildren: false,  // 默认没有子菜单
    Children: [],  // 默认子菜单数组为空
    Module: null,  // 默认没有模块
    Pid: "",  // 默认上级 ID 为空字符串
    Mid: "",  // 默认模块 ID 为空字符串
    PidArr: [],  // 默认上级 ID 数组为空
    Id: ""  // 默认菜单 ID 为空字符串
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
        const { response } = await getPermissionTree('0');
        isResouceShow.value++;
        options.value.push(response);
        editLoading.value = false;
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
                postData.Pid = postData.PidArr?.pop() ?? '';

                console.log(postData);
                const { success, msg } = await editPermission(postData);
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
        const { success, msg } = await removePermission(currentRow.value?.Id || '0');
        if (success) {
            ElMessage.success('删除成功');
            await handleQuery({ name: '' });
        } else {
            ElMessage.error('提交失败' + msg);
        }
    });
};
// ↑↑↑↑↑ 删除 ↑↑↑↑↑

export const handleSync = async () => {
    ElMessage.warning('暂不提供此功能');
};