// userFunctions.ts

import { reactive, toRaw, ref } from 'vue';
import { getDepartmentTree, type DepartmentNode } from '@/api/departmentApi';
import { getUserListApi, addUser, editUser, removeUser } from '@/api/userApi'; // 接口
import type { UserRequest, User } from '@/api/userApi';// 模型类
import { ElMessage, ElForm, ElMessageBox, ElTree } from "element-plus";
import { formatDate } from "@/utils";
import { useUserInfoStore } from '@/stores/userInfo';
import { getRoleListApi, type Role, type RoleRequest } from '@/api/roleApi';

export const departOptions = ref<DepartmentNode[]>([]);
export const users = ref<User[]>([]);// 数据数组
export const roleOptions = ref<Role[]>([]);// 数据数组
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
export const currentRow = ref<User | null>(null);

// ↓↓↓↓↓ 查询 ↓↓↓↓↓
export const handleQuery = async (filters: { name: string }) => {
    currentRow.value = null;
    page.value = 1;

    const para = ref<UserRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.name,
    });

    listLoading.value = true;
    try {
        const { response } = await getUserListApi(para.value);
        users.value = response.data ?? [];
        total.value = response.dataCount;
    } finally {
        listLoading.value = false;
    }
};
// ↑↑↑↑↑ 查询 ↑↑↑↑↑


// ↓↓↓↓↓ 新增 ↓↓↓↓↓
export const addForm = reactive<User>({
    uLoginName: "",  // 默认登录名为空字符串
    uLoginPWD: "",  // 默认密码为空字符串
    uRealName: "",  // 默认真实姓名为空字符串
    uStatus: 0,  // 默认状态为 0
    DepartmentId: "",  // 默认部门 ID 为空字符串
    uRemark: "",  // 默认备注为空字符串
    uCreateTime: null,  // 默认创建时间为空字符串
    uUpdateTime: null,  // 默认更新时间为空字符串
    uLastErrTime: null,  // 默认上次错误时间为空字符串
    uErrorCount: 0,  // 默认错误计数为 0
    name: null,  // 默认名称为 null
    sex: 0,  // 默认性别为 0
    age: 0,  // 默认年龄为 0
    birth: "",  // 默认生日为空字符串
    addr: null,  // 默认地址为 null
    tdIsDelete: false,  // 默认未删除
    RoleNames: [],  // 默认角色名称为空数组
    Dids: [],  // 默认部门 ID 数组为空
    DepartmentName: "",  // 默认部门名称为空字符串
    uID: "",  // 默认用户 ID 为空字符串
    RIDs: []  // 默认角色 ID 数组为空
});
export const handleAdd = async () => {
    departOptions.value = [];
    addFormVisible.value = true;
    // 使用引用重置表单
    if (addFormRef.value) {
        addFormRef.value.resetFields();
    }

    try {
        const { response } = await getDepartmentTree('0');
        isResouceShow.value++;
        departOptions.value.push(response);
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

            postData.birth = !postData.birth || postData.birth == "" ? formatDate(new Date(), "yyyy-MM-dd") : formatDate(new Date(postData.birth), "yyyy-MM-dd");
            postData.DepartmentId = postData.Dids?.pop() ?? '';

            postData.uCreateTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");
            postData.uUpdateTime = postData.uCreateTime;
            postData.uLastErrTime = postData.uCreateTime;

            console.log(postData);
            const { success, msg } = await addUser(postData);
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
export const editForm = reactive<User>({
    uLoginName: "",  // 默认登录名为空字符串
    uLoginPWD: "",  // 默认密码为空字符串
    uRealName: "",  // 默认真实姓名为空字符串
    uStatus: 0,  // 默认状态为 0
    DepartmentId: "",  // 默认部门 ID 为空字符串
    uRemark: "",  // 默认备注为空字符串
    uCreateTime: null,  // 默认创建时间为空字符串
    uUpdateTime: null,  // 默认更新时间为空字符串
    uLastErrTime: null,  // 默认上次错误时间为空字符串
    uErrorCount: 0,  // 默认错误计数为 0
    name: null,  // 默认名称为 null
    sex: 0,  // 默认性别为 0
    age: 0,  // 默认年龄为 0
    birth: "",  // 默认生日为空字符串
    addr: null,  // 默认地址为 null
    tdIsDelete: false,  // 默认未删除
    RoleNames: [],  // 默认角色名称为空数组
    Dids: [],  // 默认部门 ID 数组为空
    DepartmentName: "",  // 默认部门名称为空字符串
    uID: "",  // 默认用户 ID 为空字符串
    RIDs: []  // 默认角色 ID 数组为空
});
export const handleEdit = async () => {
    if (!(currentRow.value && currentRow.value?.uID)) {
        ElMessage.error('请选择要编辑的一行数据！');
        return;
    }
    departOptions.value = [];
    roleOptions.value = [];
    editFormVisible.value = true;
    editLoading.value = true;
    if (currentRow.value) {
        Object.assign(editForm, currentRow.value);
    }

    try {
        const roleReq = ref<RoleRequest>({
            page: 0,
            pageSize: 9999,
            f: '0',
            key: '',
        });
        const roleRsp = await getRoleListApi(roleReq.value);
        roleOptions.value = roleRsp.response?.data ?? [];

        const { response } = await getDepartmentTree('0');
        departOptions.value.push(response);

        isResouceShow.value++;
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

                postData.birth = !postData.birth || postData.birth == "" ? formatDate(new Date(), "yyyy-MM-dd") : formatDate(new Date(postData.birth), "yyyy-MM-dd");
                postData.DepartmentId = postData.Dids?.pop() ?? '';

                console.log(postData);
                const { success, msg } = await editUser(postData);
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
    if (!(currentRow.value && currentRow.value?.uID)) {
        ElMessage.error('请选择要删除的一行数据！');
        return;
    }
    ElMessageBox.confirm("确认删除该记录吗？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        const { success, msg } = await removeUser(currentRow.value?.uID || '0');
        if (success) {
            ElMessage.success('删除成功');
            await handleQuery({ name: '' });
        } else {
            ElMessage.error('提交失败' + msg);
        }
    });
};
// ↑↑↑↑↑ 删除 ↑↑↑↑↑