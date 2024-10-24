<template>
    <section>
        <!-- 工具条 -->
        <toolbar :button-list="buttonList"></toolbar>

        <!-- 列表 -->
        <el-table :data="quartzJobs" ref="tableRef" v-loading="listLoading" @select="dialogCheck"
            @row-click="selectCurrentRow" row-key="Id" border style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column prop="JobGroup" label="任务组" width="150" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="Name" label="名称" width="150" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="TriggerType" label="任务类型" width="150" show-overflow-tooltip sortable>
                <template #default="{ row }">
                    <el-tag :type="row.TriggerType == 1 ? 'success' : ''" disable-transitions>{{ row.TriggerType == 1 ?
            "Cron" : "Simple" }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="Cron" label="Cron表达式" width="200" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="RunTimes" label="累计运行(次)" width="150" show-overflow-tooltip
                sortable></el-table-column>
            <el-table-column prop="IntervalSecond" label="循环周期(秒)" width="150" show-overflow-tooltip
                sortable></el-table-column>
            <el-table-column prop="CycleRunTimes" label="循环(次)" width="150" show-overflow-tooltip
                sortable></el-table-column>
            <el-table-column prop="CycleHasRunTimes" label="已循环(次)" width="150" show-overflow-tooltip
                sortable></el-table-column>
            <el-table-column prop="AssemblyName" label="程序集" width="150" show-overflow-tooltip
                sortable></el-table-column>
            <el-table-column prop="ClassName" label="执行类" width="150" show-overflow-tooltip sortable></el-table-column>
            <el-table-column prop="BeginTime" label="开始时间" width="200" show-overflow-tooltip
                :formatter="formatBeginTime" sortable></el-table-column>
            <el-table-column prop="EndTime" label="结束时间" width="200" show-overflow-tooltip :formatter="formatEndTime"
                sortable></el-table-column>
            <el-table-column prop="IsStart" label="状态-数据库" width="150" show-overflow-tooltip sortable>
                <template #default="{ row }">
                    <el-tag :type="row.IsStart ? 'success' : 'danger'" disable-transitions>{{ row.IsStart ?
            "运行中" :
            "停止"
                        }}</el-tag>
                </template>
            </el-table-column>

            <el-table-column prop="Triggers" label="状态-内存" width="150" show-overflow-tooltip sortable>
                <template #default="{ row }">
                    <el-tag :type="row.Triggers[0].triggerStatus == '正常'
            ? 'success'
            : 'danger'
            " disable-transitions>{{ row.Triggers[0].triggerStatus }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="日志" fixed="right">
                <template #default="{ row }">
                    <el-popover trigger="hover" placement="top">
                        <p v-html="row.Remark"></p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>Log</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页工具条 -->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange"
                :page-size="pageSize" :total="total" :page-sizes="[10, 20, 50, 100]" :current-page="page"
                style="float: right">
            </el-pagination>
        </el-col>

        <!-- 新增 -->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addFormRef">
                <el-form-item label="任务组" prop="JobGroup">
                    <el-input v-model="addForm.JobGroup" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="Name">
                    <el-input v-model="addForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="程序集" prop="AssemblyName">
                    <el-col :span="20"><el-input v-model="addForm.AssemblyName" auto-complete="off"></el-input></el-col>

                    <el-col :span="4"><el-button style="width: 100%; overflow: hidden">选择任务</el-button></el-col>
                </el-form-item>
                <el-form-item label="执行类名" prop="ClassName">
                    <el-input v-model="addForm.ClassName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="执行参数" prop="JobParams">
                    <el-input class="textarea" type="textarea" :rows="6" v-model="addForm.JobParams"></el-input>
                </el-form-item>
                <el-form-item prop="TriggerTypeBl" label="是否Cron" width="" sortable>
                    <el-switch v-model="addForm.TriggerTypeBl"> </el-switch>
                    <span style="float: right; color: #aaa">(1：Cron模式，0：Simple模式)</span>
                </el-form-item>

                <el-form-item label="Cron表达式" v-if="addForm.TriggerTypeBl" prop="Cron">
                    <el-tooltip placement="top" content="<div>每隔5秒执行一次：*/5 * * * * ?<br />
                            每隔1分钟执行一次：0 */1 * * * ?<br />
                            每天23点执行一次：0 0 23 * * ?<br />
                            每天凌晨1点执行一次：0 0 1 * * ?<br />
                            每月1号凌晨1点执行一次：0 0 1 1 * ?<br />
                            每月最后一天23点执行一次：0 0 23 L * ?<br />
                            每周星期天凌晨1点实行一次：0 0 1 ? * L<br />
                            在26分、29分、33分执行一次：0 26,29,33 * * * ?<br />
                            每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * ?<br /></div>" raw-content>
                        <el-input style="margin-bottom: 10px;" v-model="addForm.Cron" auto-complete="off"> <el-button
                                slot="append" icon="el-icon-search" @click="showDialog"></el-button></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="循环周期" v-else prop="IntervalSecond">
                    <el-input-number v-model="addForm.IntervalSecond" :min="1" style="width: 200px"
                        auto-complete="off"></el-input-number>
                    <span style="float: right; color: #aaa">(单位：秒)</span>
                </el-form-item>
                <el-form-item label="循环次数" v-if="!addForm.TriggerTypeBl" prop="CycleRunTimes">
                    <el-tooltip placement="top" content="<div>设置成0时,就意味着无限制次数运行</div>" raw-content>
                        <el-input-number v-model="addForm.CycleRunTimes" :min="0" style="width: 200px"
                            auto-complete="off"></el-input-number>
                    </el-tooltip>
                    <span style="float: right; color: #aaa">(单位：次)</span>
                </el-form-item>
                <el-form-item label="已循环次数" v-if="!addForm.TriggerTypeBl" prop="CycleRunTimes">
                    <el-input-number v-model="addForm.CycleHasRunTimes" :min="0" style="width: 200px"
                        auto-complete="off"></el-input-number>
                    <span style="float: right; color: #aaa">(单位：次)</span>
                </el-form-item>
                <el-form-item label="是否激活" prop="IsStart">
                    <el-switch v-model="addForm.IsStart"> </el-switch>
                </el-form-item>

                <el-form-item label="开始时间" prop="BeginTime">
                    <el-date-picker type="datetime" placeholder="选择日期" v-model="addForm.BeginTime"
                        format="YYYY/MM/DD HH:mm:ss" />
                </el-form-item>
                <el-form-item label="结束时间" prop="EndTime">
                    <el-date-picker type="datetime" placeholder="选择日期" v-model="addForm.EndTime"
                        format="YYYY/MM/DD HH:mm:ss" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


        <!-- 编辑 -->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="120px" :rules="addFormRules" ref="editFormRef">
                <el-form-item label="任务组" prop="JobGroup">
                    <el-input v-model="editForm.JobGroup" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="名称" prop="Name">
                    <el-input v-model="editForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="程序集" prop="AssemblyName">
                    <el-col :span="20"><el-input v-model="editForm.AssemblyName"
                            auto-complete="off"></el-input></el-col>

                    <el-col :span="4"><el-button style="width: 100%; overflow: hidden">选择任务</el-button></el-col>
                </el-form-item>
                <el-form-item label="执行类名" prop="ClassName">
                    <el-input v-model="editForm.ClassName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="执行参数" prop="JobParams">
                    <el-input class="textarea" type="textarea" :rows="6" v-model="editForm.JobParams"></el-input>
                </el-form-item>
                <el-form-item prop="TriggerTypeBl" label="是否Cron" width="" sortable>
                    <el-switch v-model="editForm.TriggerTypeBl"> </el-switch>
                    <span style="float: right; color: #aaa">(1：Cron模式，0：Simple模式)</span>
                </el-form-item>

                <el-form-item label="Cron表达式" v-if="editForm.TriggerTypeBl" prop="Cron">
                    <el-tooltip placement="top" content="<div>每隔5秒执行一次：*/5 * * * * ?<br />
                            每隔1分钟执行一次：0 */1 * * * ?<br />
                            每天23点执行一次：0 0 23 * * ?<br />
                            每天凌晨1点执行一次：0 0 1 * * ?<br />
                            每月1号凌晨1点执行一次：0 0 1 1 * ?<br />
                            每月最后一天23点执行一次：0 0 23 L * ?<br />
                            每周星期天凌晨1点实行一次：0 0 1 ? * L<br />
                            在26分、29分、33分执行一次：0 26,29,33 * * * ?<br />
                            每天的0点、13点、18点、21点都执行一次：0 0 0,13,18,21 * * ?<br /></div>" raw-content>
                        <el-input style="margin-bottom: 10px;" v-model="editForm.Cron" auto-complete="off"> <el-button
                                slot="append" icon="el-icon-search" @click="showDialog"></el-button></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="循环周期" v-else prop="IntervalSecond">
                    <el-input-number v-model="editForm.IntervalSecond" :min="1" style="width: 200px"
                        auto-complete="off"></el-input-number>
                    <span style="float: right; color: #aaa">(单位：秒)</span>
                </el-form-item>
                <el-form-item label="循环次数" v-if="!editForm.TriggerTypeBl" prop="CycleRunTimes">
                    <el-tooltip placement="top" content="<div>设置成0时,就意味着无限制次数运行</div>" raw-content>
                        <el-input-number v-model="editForm.CycleRunTimes" :min="0" style="width: 200px"
                            auto-complete="off"></el-input-number>
                    </el-tooltip>
                    <span style="float: right; color: #aaa">(单位：次)</span>
                </el-form-item>
                <el-form-item label="已循环次数" v-if="!editForm.TriggerTypeBl" prop="CycleRunTimes">
                    <el-input-number v-model="editForm.CycleHasRunTimes" :min="0" style="width: 200px"
                        auto-complete="off"></el-input-number>
                    <span style="float: right; color: #aaa">(单位：次)</span>
                </el-form-item>
                <el-form-item label="是否激活" prop="IsStart">
                    <el-switch v-model="editForm.IsStart"> </el-switch>
                </el-form-item>

                <el-form-item label="开始时间" prop="BeginTime">
                    <el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.BeginTime"
                        format="YYYY/MM/DD HH:mm:ss" />
                </el-form-item>
                <el-form-item label="结束时间" prop="EndTime">
                    <el-date-picker type="datetime" placeholder="选择日期" v-model="editForm.EndTime"
                        format="YYYY/MM/DD HH:mm:ss" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


    </section>
</template>

<script setup lang="ts" name="quartzJob">
import { ref, onMounted, onUnmounted, reactive } from 'vue';
import { ElForm, ElTable } from 'element-plus';
import Toolbar from "@/components/toolbar.vue";
import mittBusT from "@/utils/mittBusT";
import { formatDate, getButtonList } from "@/utils";
import { useAuthMenuStore } from "@/stores/modules/authMenu";
import { getQuartzJobListApi, type QuartzJob, type QuartzJobRequest } from '@/api/quartzJobApi';

// 从 quartzJobFunctions.ts 导入
import {
    handleQuery, handleAdd, handleEdit, handleDel, quartzJobs, listLoading, isResouceShow,
    page, pageSize, total, addLoading, addFormRef, addSubmit, addFormVisible, addForm,
    currentRow, editFormVisible, editLoading, editFormRef, editSubmit, editForm,
    handleStartJob, handleStopJob, handleReCoveryJob, handlePauseJob, handleResumeJob, handleLog,handleOverview
} from './quartzJobFunctions';
// 定义 filters
const filters = ref<{ name: string }>({ name: '' });
// 加载按钮
const buttonList = ref<Menu.MenuOptions[]>([]);

const showCron = ref<boolean>(false);
const expression = ref<string>('');


// 定义响应式对象
const pickerOptions = reactive({
    shortcuts: [
        {
            text: "今天",
            onClick(picker: any) {
                picker.$emit("pick", new Date());
            },
        },
        {
            text: "明天",
            onClick(picker: any) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24);
                picker.$emit("pick", date);
            },
        },
        {
            text: "一周后",
            onClick(picker: any) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit("pick", date);
            },
        },
        {
            text: "一月后(30)",
            onClick(picker: any) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
                picker.$emit("pick", date);
            },
        },
        {
            text: "一年后(365)",
            onClick(picker: any) {
                const date = new Date();
                date.setTime(date.getTime() + 3600 * 1000 * 24 * 365);
                picker.$emit("pick", date);
            },
        },
    ],
});

const namespace = reactive({
    tableData: [] as any[],
    currentRow: null as any | null,
    editFormVisible: false,
    editLoading: false,
});

const taskLog = reactive({
    visible: false,
    loading: false,
    tableData: [] as any[],
    page: 1,
    dataCount: 0,
});

const taskOverview = reactive({
    runTimeStart: '2023-01-01',
    type: 'month',
    visible: false,
    data: {
        columns: ["执行次数"],
        rows: [] as any[],
    },
    extend: {
        series: {
            label: {
                normal: {
                    show: true,
                },
            },
        },
    },
    settings: {
        metrics: ["执行次数"],
        dimension: ["date"],
        yAxisName: ["执行次数"],
    },
});

const addFormRules = {
    JobGroup: [{ required: true, message: "请输入组名", trigger: "blur" }],
    Name: [{ required: true, message: "请输入Job名", trigger: "blur" }],
    BeginTime: [{ required: true, message: "请选择开始时间", trigger: "blur" },],
    EndTime: [{ required: true, message: "请选择结束时间", trigger: "blur" },],
    AssemblyName: [{ required: true, message: "请输入程序集名", trigger: "blur" },],
    ClassName: [{ required: true, message: "请输入执行的Job类名", trigger: "blur" },],
};

const formatBeginTime = (row: any) => {
    return (!row.BeginTime || row.BeginTime == '') ? '' : formatDate(new Date(row.BeginTime), 'yyyy-MM-dd hh:mm:ss')
}

const formatEndTime = (row: any) => {
    return (!row.EndTime || row.EndTime == '') ? '' : formatDate(new Date(row.EndTime), 'yyyy-MM-dd hh:mm:ss')
}

// 创建函数映射表
const functionMap: Record<string, Function> = {
    handleQuery,
    handleAdd,
    handleEdit,
    handleDel,

    handleStartJob,
    handleStopJob,
    handleReCoveryJob,
    handlePauseJob,
    handleResumeJob,
    handleLog,
    handleOverview,

    // 可以在此添加其他需要调用的函数
};
const callFunction = (item: Menu.MenuOptions) => {
    const filters = {
        name: item.search,
    };

    if (item.Func && typeof item.Func === 'string') {
        // 假设所有可用函数都在 functionMap 中定义
        const func = functionMap[item.Func];
        if (typeof func === 'function') {
            func(filters);
        } else {
            console.error(`Function ${item.Func} is not defined in functionMap.`);
        }
    } else {
        console.error('Func property is not a valid string.');
    }
};

// 定义表格数据的类型
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);

// 选中当前行
const dialogCheck = async (selection: QuartzJob[], row?: QuartzJob) => {
    currentRow.value = null;
    if (tableRef.value) {
        tableRef.value.clearSelection();
    }
    if (selection.length === 0) {
        return;
    }
    if (row) {
        selectCurrentRow(row);
    }
};
const selectCurrentRow = (val: QuartzJob) => {
    if (!val) return;
    currentRow.value = val;
    if (tableRef.value) {
        tableRef.value.clearSelection();
        tableRef.value.toggleRowSelection(val, true);
    }
};

const showDialog = () => {
    expression.value = editForm.Cron;//传入的 cron 表达式，可以反解析到 UI 上
    showCron.value = true;
};

// 数据分页
const handleCurrentChange = async (val: number) => {
    page.value = val;
    const para = ref<QuartzJobRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.value.name,
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

// 钩子函数
onMounted(async () => {
    const authStore = useAuthMenuStore();
    const routers = authStore.authMenuListGet;
    buttonList.value = getButtonList(window.location.pathname, routers);

    // 监听事件
    mittBusT.on('callFunction', callFunction);

    // 获取数据
    await handleQuery(filters.value);
});

// 在组件卸载时移除监听
onUnmounted(() => {
    mittBusT.off('callFunction', callFunction);
});
</script>