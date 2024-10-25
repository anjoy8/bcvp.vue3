// blogFunctions.ts

import { reactive, toRaw, ref } from 'vue';
import { getBlogListApi, addBlog, editBlog, removeBlog } from '@/api/blogApi'; // 接口
import type { BlogRequest, Blog } from '@/api/blogApi';// 模型类
import { ElMessage, ElForm, ElMessageBox, ElTree } from "element-plus";
import { formatDate } from "@/utils";
import { useUserInfoStore } from '@/stores/userInfo';

export const blogs = ref<Blog[]>([]);// 数据数组
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
export const currentRow = ref<Blog | null>(null);

// ↓↓↓↓↓ 查询 ↓↓↓↓↓
export const handleQuery = async (filters: { name: string }) => {
    currentRow.value = null;
    page.value = 1;

    const para = ref<BlogRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.name,
    });

    listLoading.value = true;
    try {
        const { response } = await getBlogListApi(para.value);
        blogs.value = response.data ?? [];
        total.value = response.dataCount;
    } finally {
        listLoading.value = false;
    }
};
// ↑↑↑↑↑ 查询 ↑↑↑↑↑


// ↓↓↓↓↓ 新增 ↓↓↓↓↓
export const addForm = reactive<Blog>({
    bID: "",
    bsubmitter: "",
    User: null,
    btitle: "",
    bcategory: "",
    bcontent: "",
    btraffic: 0,
    bcommentNum: 0,
    bUpdateTime: "",
    bCreateTime: "",
    bRemark: "",
    IsDeleted: false,
    Comments: null
});
export const handleAdd = async () => {
    addFormVisible.value = true;
    // 使用引用重置表单
    if (addFormRef.value) {
        addFormRef.value.resetFields();
    }

};


// ↑↑↑↑↑ 新增 ↑↑↑↑↑


// ↓↓↓↓↓ 编辑 ↓↓↓↓↓

export const handleEdit = async () => {
    ElMessage.warning('编辑-非核心功能-该功能未开放');
};

// ↑↑↑↑↑ 编辑 ↑↑↑↑↑

// ↓↓↓↓↓ 删除 ↓↓↓↓↓
// 删除数据
export const handleDel = async () => {
    if (!(currentRow.value && currentRow.value?.bID)) {
        ElMessage.error('请选择要删除的一行数据！');
        return;
    }
    ElMessageBox.confirm("确认删除该记录吗？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
    }).then(async () => {
        const { success, msg } = await removeBlog(currentRow.value?.bID || '0');
        if (success) {
            ElMessage.success('删除成功');
            await handleQuery({ name: '' });
        } else {
            ElMessage.error('提交失败' + msg);
        }
    });
};
// ↑↑↑↑↑ 删除 ↑↑↑↑↑