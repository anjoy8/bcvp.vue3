// quartzJobFunctions.ts

import { reactive, toRaw, ref } from 'vue';
import { getQuartzJobListApi, addQuartzJob, editQuartzJob, removeQuartzJob } from '@/api/quartzJobApi'; // 接口
import type { QuartzJobRequest, QuartzJob } from '@/api/quartzJobApi';// 模型类
import { ElMessage, ElForm, ElMessageBox, ElTree } from "element-plus";
import { formatDate } from "@/utils";
import { useUserInfoStore } from '@/stores/userInfo';

export const quartzJobs = ref<QuartzJob[]>([]);// 数据数组
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
export const currentRow = ref<QuartzJob | null>(null);

// ↓↓↓↓↓ 查询 ↓↓↓↓↓
export const handleQuery = async (filters: { name: string }) => {
    currentRow.value = null;
    page.value = 1;

    const para = ref<QuartzJobRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.name,
    });

    listLoading.value = true;
    try {
        const { response } = await getQuartzJobListApi(para.value);
        quartzJobs.value = response.data ?? [];
        total.value = response.dataCount;
    } finally {
        listLoading.value = false;
    }
};
// ↑↑↑↑↑ 查询 ↑↑↑↑↑


// ↓↓↓↓↓ 新增 ↓↓↓↓↓
export const addForm = reactive<QuartzJob>({
    Name: "",
    JobGroup: "",
    Cron: "",
    AssemblyName: "",
    ClassName: "",
    Remark: "",
    RunTimes: 0,
    BeginTime: "",
    EndTime: "",
    TriggerType: 1, // 根据需要调整默认值
    TriggerTypeBl: true, // 根据需要调整默认值
    IntervalSecond: 0, // 默认间隔为0秒
    CycleRunTimes: 0,
    CycleHasRunTimes: 0,
    IsStart: false, // 默认为未开始状态
    JobParams: "",
    IsDeleted: false, // 默认为false表示未删除
    CreateTime: "",
    Triggers: [], // 初始化为空数组
    Id: ""
});
export const handleAdd = async () => {
    addFormVisible.value = true;
    // 使用引用重置表单
    if (addFormRef.value) {
        addFormRef.value.resetFields();
    }
    addForm.TriggerTypeBl = addForm.TriggerType == 1;
};

export const addSubmit = async () => {
    const formEl = addFormRef.value; // 获取表单实例
    if (!formEl) return;

    await formEl.validate(async (isValid) => {
        if (isValid) {
            addLoading.value = true;
            const postData = toRaw(addForm);

            postData.TriggerType = postData.TriggerTypeBl ? 1 : 0;
            postData.CreateTime = formatDate(new Date(), "yyyy-MM-dd hh:mm:ss");

            console.log(postData);
            const { success, msg } = await addQuartzJob(postData);
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
export const editForm = reactive<QuartzJob>({
    Name: "",
    JobGroup: "",
    Cron: "",
    AssemblyName: "",
    ClassName: "",
    Remark: "",
    RunTimes: 0,
    BeginTime: "",
    EndTime: "",
    TriggerType: 1, // 根据需要调整默认值
    TriggerTypeBl: true, // 根据需要调整默认值
    IntervalSecond: 0, // 默认间隔为0秒
    CycleRunTimes: 0,
    CycleHasRunTimes: 0,
    IsStart: false, // 默认为未开始状态
    JobParams: "",
    IsDeleted: false, // 默认为false表示未删除
    CreateTime: "",
    Triggers: [], // 初始化为空数组
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

    editForm.TriggerTypeBl = editForm.TriggerType == 1;

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

                postData.TriggerType = postData.TriggerTypeBl ? 1 : 0;

                console.log(postData);
                const { success, msg } = await editQuartzJob(postData);
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
        const { success, msg } = await removeQuartzJob(currentRow.value?.Id || '0');
        if (success) {
            ElMessage.success('删除成功');
            await handleQuery({ name: '' });
        } else {
            ElMessage.error('提交失败' + msg);
        }
    });
};
// ↑↑↑↑↑ 删除 ↑↑↑↑↑

export const handleStartJob = async () => {
    ElMessage.warning('开启-该功能未开放');
};
export const handleStopJob = async () => {
    ElMessage.warning('停止-该功能未开放');
};
export const handleReCoveryJob = async () => {
    ElMessage.warning('重启-该功能未开放');
};
export const handlePauseJob = async () => {
    ElMessage.warning('暂停-该功能未开放');
};
export const handleResumeJob = async () => {
    ElMessage.warning('恢复-该功能未开放');
};
export const handleLog = async () => {
    ElMessage.warning('日志查询-该功能未开放');
};
export const handleOverview = async () => {
    ElMessage.warning('任务概括-该功能未开放');
};