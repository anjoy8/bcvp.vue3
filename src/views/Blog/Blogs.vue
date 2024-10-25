<template>
    <section>
        <!-- 工具条 -->
        <toolbar :button-list="buttonList"></toolbar>

        <!-- 列表 -->
        <el-table :data="blogs" ref="tableRef" v-loading="listLoading" @select="dialogCheck"
            @row-click="selectCurrentRow" row-key="Id" border style="width: 100%" class="custom-tbl">
            <el-table-column type="selection" width="50"> </el-table-column>
            <el-table-column type="index" width="80"> </el-table-column>
            <el-table-column prop="bID" label="ID" width="100" sortable>
            </el-table-column>
            <el-table-column prop="btitle" label="标题" width="" sortable>
            </el-table-column>
            <el-table-column prop="bcontent" label="内容" width="400" sortable>
                <template #default="{ row }">
                    <span v-html="row.bcontent.substring(0, 100)"></span>
                </template>
            </el-table-column>
            <el-table-column prop="bCreateTime" label="创建时间" :formatter="formatCreateTime" width="250" sortable>
            </el-table-column>
        </el-table>
        <!-- 分页工具条 -->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange"
                :page-size="pageSize" :total="total" :page-sizes="[10, 20, 50, 100]" :current-page="page"
                style="float: right">
            </el-pagination>
        </el-col>

    </section>
</template>

<script setup lang="ts" name="blog">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElForm, ElTable } from 'element-plus';
import Toolbar from "@/components/toolbar.vue";
import mittBusT from "@/utils/mittBusT";
import { getButtonList } from "@/utils";
import { useAuthMenuStore } from "@/stores/modules/authMenu";
import { getBlogListApi, type Blog, type BlogRequest } from '@/api/blogApi';

// 从 blogFunctions.ts 导入
import {
    handleQuery, handleAdd, handleEdit, handleDel, blogs, listLoading, isResouceShow,
    page, pageSize, total, addLoading, addFormRef, addFormVisible, addForm,
    currentRow, editFormVisible, editLoading, editFormRef
} from './blogsFunctions';
// 定义 filters
const filters = ref<{ name: string }>({ name: '' });
// 加载按钮
const buttonList = ref<Menu.MenuOptions[]>([]);

const addFormRules = {
    LinkUrl: [{ required: true, message: "请输入接口地址", trigger: "blur" }],
};
// 树的默认属性
const defaultProps = {
    children: "children",
    label: "label",
};

// 创建函数映射表
const functionMap: Record<string, Function> = {
    handleQuery,
    handleAdd,
    handleEdit,
    handleDel,
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

// 格式化时间
const formatCreateTime = (row: Blog) => row.bCreateTime;

// 定义表格数据的类型
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);

// 选中当前行
const dialogCheck = async (selection: Blog[], row?: Blog) => {
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
const selectCurrentRow = (val: Blog) => {
    if (!val) return;
    currentRow.value = val;
    if (tableRef.value) {
        tableRef.value.clearSelection();
        tableRef.value.toggleRowSelection(val, true);
    }
};

// 数据分页
const handleCurrentChange = async (val: number) => {
    page.value = val;

    const para = ref<BlogRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.value.name,
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