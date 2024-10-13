<template>
    <section>
        <!--工具条-->
        <toolbar :button-list="buttonList"></toolbar>

        <!-- 列表 -->
        <el-table :data="departments" ref="tableRef" v-loading="listLoading" @select="dialogCheck"
            @row-click="selectCurrentRow" row-key="Id" :load="load"
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


        <!-- 新增 -->
        <el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                <el-form-item label="部门名称" prop="Name">
                    <el-input v-model="addForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级关系" prop="CodeRelationship">
                    <el-tooltip content="以','号结尾，方便下属部门统一查询" placement="top">
                        <el-input v-model="addForm.CodeRelationship" disabled auto-complete="off"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="负责人" prop="Leader">
                    <el-input v-model="addForm.Leader" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="OrderSort">
                    <el-input v-model="addForm.OrderSort" type="number" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否有效" prop="Status">
                    <el-switch v-model="addForm.Status"></el-switch>
                </el-form-item>
                <el-form-item v-if="options.length > 0" label="父级部门" prop="PidArr">
                    <el-cascader v-model="addForm.PidArr" :options="options" filterable placeholder="请选择，支持搜索功能"
                        style="width: 400px" :props="{ checkStrictly: true, expandTrigger: 'hover' }"></el-cascader>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click="addSubmit" :loading="addLoading">提交</el-button>
            </template>
        </el-dialog>

        <!-- 编辑 -->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" label-width="80px">
                <el-form-item label="部门名称" prop="Name">
                    <el-input v-model="editForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="上级关系" prop="CodeRelationship">
                    <el-tooltip content="以','号结尾，方便下属部门统一查询" placement="top">
                        <el-input v-model="editForm.CodeRelationship" disabled auto-complete="off"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="负责人" prop="Leader">
                    <el-input v-model="editForm.Leader" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="OrderSort">
                    <el-input type="number" v-model="editForm.OrderSort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否有效" prop="Status">
                    <el-switch v-model="editForm.Status"></el-switch>
                </el-form-item>
                <el-form-item prop="PidArr" v-if="options && options.length > 0" label="父级部门">
                    <el-cascader v-if="!editLoading" placeholder="请选择，支持搜索功能" style="width: 400px"
                        v-model="editForm.PidArr" :options="options" filterable :key="isResouceShow"
                        :props="{ checkStrictly: true, expandTrigger: 'hover' }"></el-cascader>
                    <el-cascader v-if="editLoading" placeholder="加载中..." style="width: 400px"></el-cascader>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="editSubmit" :loading="editLoading">提交</el-button>
                </div>
            </template>
        </el-dialog>
    </section>
</template>

<script setup lang="ts" name="department">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElForm, ElTable } from 'element-plus';
import Toolbar from "@/components/toolbar.vue";
import mittBusT from "@/utils/mittBusT";
import { getButtonList } from "@/utils";
import { useAuthMenuStore } from "@/stores/modules/authMenu";
import { getDepartmentListApi, type Department, type DepartmentRequest } from '@/api/departmentApi';

// 从 departmentFunctions.ts 导入
import {
    handleQuery, handleAdd, handleEdit, handleDel, departments, listLoading, isResouceShow,
    page, addFormVisible, options, addLoading, addFormRef, addSubmit, addForm,
    currentRow, editFormVisible, editForm, editLoading, editFormRef, editSubmit
} from './departmentFunctions';
// 定义 filters
const filters = ref<{ name: string }>({ name: '' });
// 加载按钮
const buttonList = ref<Menu.MenuOptions[]>([]);


const addFormRules = {
    Name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
    PidArr: [{ required: true, message: "请选择父节点", trigger: "blur" }],
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

// 定义表格数据的类型
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);

// 选中当前行
const dialogCheck = async (selection: Department[], row?: Department) => {
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
const selectCurrentRow = (val: Department) => {
    if (!val) return;
    currentRow.value = val;
    if (tableRef.value) {
        tableRef.value.clearSelection();
        tableRef.value.toggleRowSelection(val, true);
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