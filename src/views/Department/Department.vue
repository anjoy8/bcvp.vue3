<template>
    <section>
        <!--工具条-->
        <toolbar :button-list="buttonList"></toolbar>

        <!-- 列表 -->
        <el-table :data="departments" v-loading="listLoading" row-key="Id" :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" border lazy style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column prop="Name" label="部门" width="200"></el-table-column>
            <el-table-column prop="Id" label="Id" width="80"></el-table-column>
            <el-table-column prop="CodeRelationship" label="上级关系"></el-table-column>
            <el-table-column prop="Leader" label="负责人"></el-table-column>
            <el-table-column prop="OrderSort" label="Sort"></el-table-column>
            <el-table-column prop="Status" label="是否有效" width="100">
                <template #default="{ row }">
                    <el-tag :type="row.Status ? 'success' : 'danger'">{{ row.Status ? '是' : '否' }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="CreateTime" label="创建时间" :formatter="formatCreateTime" width="250"
                sortable></el-table-column>
            <el-table-column prop="ModifyTime" label="更新时间" :formatter="formatModifyTime" width="250"
                sortable></el-table-column>
        </el-table>
    </section>
</template>

<script setup lang="ts" name="department">
import { ref, onMounted, onUnmounted } from 'vue';
import Toolbar from "@/components/toolbar.vue";
import mittBusT from "@/utils/mittBusT";
import { getButtonList } from "@/utils";
import { useAuthMenuStore } from "@/stores/modules/authMenu";
import { getDepartmentListApi } from '@/api/departmentApi';
import type { Department, DepartmentRequest } from "@/api/departmentApi";
// 从 departmentFunctions.ts 导入
import { handleQuery, departments, listLoading, page } from './departmentFunctions';
// 定义 filters
const filters = ref<{ name: string }>({ name: '' });
// 加载按钮
const buttonList = ref<Menu.MenuOptions[]>([]);

// 创建函数映射表
const functionMap: Record<string, Function> = {
    handleQuery,
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

// 实现懒加载数据功能
const load = async (tree: Department, treeNode: any, resolve: (data: Department[]) => void) => {
    const para = ref<DepartmentRequest>({
        page: page.value,
        f: tree.Id,
        key: filters.value.name,
    });

    try {
        const { response } = await getDepartmentListApi(para.value);
        resolve(response);
    } catch (error) {
        console.error('Error loading data:', error);
        resolve([]); // 在错误情况下返回空数据以继续渲染
    }
};

// 格式化时间
const formatCreateTime = (row: Department) => row.CreateTime;
const formatModifyTime = (row: Department) => row.ModifyTime;

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