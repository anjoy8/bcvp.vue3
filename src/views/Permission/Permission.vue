<template>
    <section>
        <!-- 工具条 -->
        <toolbar :button-list="buttonList"></toolbar>

        <!-- 列表 -->
        <el-table :data="permissions" ref="tableRef" v-loading="listLoading" @select="dialogCheck"
            @row-click="selectCurrentRow" lazy :load="load"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" row-key="Id" border style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column label="菜单/按钮" width="200">
                <template #default="{ row }">
                    <i class="fa" :class="row.Icon"></i>
                    {{ row.Name }}
                </template>
            </el-table-column>
            <el-table-column prop="Code" label="路由地址" width></el-table-column>
            <el-table-column prop="MName" label="API接口" width></el-table-column>
            <el-table-column prop="OrderSort" label="Sort" width></el-table-column>
            <el-table-column prop="IsButton" label="是否按钮" width="100">
                <template #default="{ row }">
                    <el-tag :type="!row.IsButton ? 'success' : 'danger'" disable-transitions>{{ !row.IsButton ? "否" :
            "是" }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="Func" label="按钮事件" width></el-table-column>
            <el-table-column prop="IsHide" label="是否隐藏" width="100">
                <template #default="{ row }">
                    <el-tag :type="!row.IsHide ? 'success' : 'danger'" disable-transitions>{{ !row.IsHide ? "否" : "是"
                        }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="IskeepAlive" label="keepAlive" width="100">
                <template #default="{ row }">
                    <el-tag :type="!row.IskeepAlive ? 'success' : 'danger'" disable-transitions>{{
            !row.IskeepAlive ?
                "否" : "是" }}</el-tag>
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
            <el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addFormRef">
                <el-form-item label="菜单名称" prop="Name">
                    <el-input v-model="addForm.Name" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="菜单类型">
                    <el-radio-group @change="clkType" v-model="addForm.MenuType">
                        <el-radio label="目录"></el-radio>
                        <el-radio label="页面"></el-radio>
                        <el-radio label="按钮"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="路由地址" prop="Code">
                    <el-tooltip placement="top"
                        content="<div>如果是目录，请填‘-’字符<br />如果是按钮，请输入空格即可<br />如果是外链，请带上协议，比如 https://www.baidu.com<br /></div>"
                        raw-content>
                        <el-input v-model="addForm.Code" :disabled="addCodeDisabled" auto-complete="off"></el-input>
                    </el-tooltip>

                </el-form-item>
                <el-form-item label="描述" prop="Description">
                    <el-input v-model="addForm.Description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="addForm.Enabled" placeholder="请选择状态">
                        <el-option label="激活" :value="true"></el-option>
                        <el-option label="禁用" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="OrderSort">
                    <el-input v-model="addForm.OrderSort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="IsButton" label="是否按钮" width sortable>
                    <el-switch v-model="addForm.IsButton"></el-switch>
                </el-form-item>
                <el-form-item label="按钮事件" prop="Func">
                    <el-input v-model="addForm.Func" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="IsHide" label="隐藏菜单" width sortable>
                    <el-switch v-model="addForm.IsHide"></el-switch>
                </el-form-item>
                <el-form-item prop="IskeepAlive" label="keepAlive" width sortable>
                    <el-switch v-model="addForm.IskeepAlive"></el-switch>
                </el-form-item>
                <el-form-item prop="PidArr" v-if="options && options.length > 0" label="父级菜单" width sortable>
                    <el-cascader placeholder="请选择，支持搜索功能" style="width: 400px" v-model="addForm.PidArr"
                        :options="options" filterable :key="isResouceShow"
                        :props="{ checkStrictly: true, expandTrigger: 'hover' }" v-if="!editLoading"></el-cascader>
                    <el-cascader placeholder="加载中..." style="width: 400px" v-if="editLoading"></el-cascader>
                </el-form-item>

                <el-form-item prop="Mid" label="API接口" width sortable>
                    <el-select style="width: 100%" v-model="addForm.Mid" placeholder="请选择API">
                        <el-option :key="0" :value="0" :label="'无需api'"></el-option>
                        <el-option v-for="item in modules" :key="item.Id" :value="item.Id" :label="item.LinkUrl">
                            <span style="float: left">{{ item.LinkUrl }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.Name
        }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>


        <!-- 编辑 -->
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :model="editForm" label-width="80px" :rules="addFormRules" ref="editFormRef">
                <el-form-item label="菜单名称" prop="Name">
                    <el-input v-model="editForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型">
                    <el-radio-group @change="clkTypeEdit" v-model="editForm.MenuType">
                        <el-radio label="目录"></el-radio>
                        <el-radio label="页面"></el-radio>
                        <el-radio label="按钮"></el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="路由地址" prop="Code">
                    <el-tooltip placement="top"
                        content="<div>如果是目录，请填‘-’字符<br />如果是按钮，请输入空格即可<br />如果是外链，请带上协议，比如 https://www.baidu.com<br /></div>"
                        raw-content>
                        <el-input v-model="editForm.Code" :disabled="editCodeDisabled" auto-complete="off"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="描述" prop="Description">
                    <el-input v-model="editForm.Description" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="Icon" prop="Icon">
                    <el-input v-model="editForm.Icon" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="editForm.Enabled" placeholder="请选择状态">
                        <el-option label="激活" :value="true"></el-option>
                        <el-option label="禁用" :value="false"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="排序" prop="OrderSort">
                    <el-input type="number" v-model="editForm.OrderSort" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item prop="IsButton" label="是否按钮" width sortable>
                    <el-switch v-model="editForm.IsButton"></el-switch>
                </el-form-item>
                <el-form-item label="按钮事件" prop="Func">
                    <el-tooltip class="item" effect="dark" content="只写方法名即可，不用带括号，比如：handleEdit" placement="top-start">
                        <el-input v-model="editForm.Func" auto-complete="off"></el-input>
                    </el-tooltip>
                </el-form-item>
                <el-form-item prop="IsHide" label="隐藏菜单" width sortable>
                    <el-switch v-model="editForm.IsHide"></el-switch>
                </el-form-item>
                <el-form-item prop="IskeepAlive" label="keepAlive" width sortable>
                    <el-switch v-model="editForm.IskeepAlive"></el-switch>
                </el-form-item>
                <el-form-item prop="PidArr" label="父级菜单" width sortable>
                    <el-cascader placeholder="请选择，支持搜索功能" style="width: 400px" v-model="editForm.PidArr"
                        :options="options" filterable :key="isResouceShow"
                        :props="{ checkStrictly: true, expandTrigger: 'hover' }" v-if="!editLoading"></el-cascader>
                    <el-cascader placeholder="加载中..." style="width: 400px" v-if="editLoading"></el-cascader>
                </el-form-item>
                <el-form-item prop="Mid" label="API接口" width sortable>
                    <el-select style="width: 100%" v-model="editForm.Mid" placeholder="请选择API">
                        <el-option :key="0" :value="0" :label="'无需api'"></el-option>
                        <el-option v-for="item in modules" :key="item.Id" :value="item.Id" :label="item.LinkUrl">
                            <span style="float: left">{{ item.LinkUrl }}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{
            item.Name
                                }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


    </section>
</template>

<script setup lang="ts" name="permission">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElForm, ElTable } from 'element-plus';
import Toolbar from "@/components/toolbar.vue";
import mittBusT from "@/utils/mittBusT";
import { getButtonList } from "@/utils";
import { useAuthMenuStore } from "@/stores/modules/authMenu";
import { getPermissionListApi, type Permission, type PermissionRequest } from '@/api/permissionApi';

// 从 permissionFunctions.ts 导入
import {
    handleQuery, handleAdd, handleEdit, handleDel, permissions, listLoading, isResouceShow, modules, handleSync,
    page, pageSize, total, addLoading, addFormRef, addSubmit, addFormVisible, addForm, options, treeAddRef, addCodeDisabled,
    currentRow, editFormVisible, editLoading, editFormRef, editSubmit, editForm, treeEditRef, editCodeDisabled
} from './permissionFunctions';
// 定义 filters
const filters = ref<{ name: string }>({ name: '' });
// 加载按钮
const buttonList = ref<Menu.MenuOptions[]>([]);

const addFormRules = {
    Name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
    Code: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
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
    handleSync
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

// 方法定义
const clkType = () => {
    addForm.IsButton = false;
    addCodeDisabled.value = false;

    if (addForm.MenuType === "页面") {
        addForm.Code = "";
    } else if (addForm.MenuType === "目录") {
        addForm.Code = "-";
        addCodeDisabled.value = true;
    } else if (addForm.MenuType === "按钮") {
        addForm.Code = " ";
        addForm.IsButton = true;
        addCodeDisabled.value = true;
    }
};

// 方法定义
const clkTypeEdit = () => {
    editForm.IsButton = false;
    editCodeDisabled.value = false;

    if (editForm.MenuType === "页面") {
        editForm.Code = "";
    } else if (editForm.MenuType === "目录") {
        editForm.Code = "-";
        editCodeDisabled.value = true;
    } else if (editForm.MenuType === "按钮") {
        editForm.Code = " ";
        editForm.IsButton = true;
        editCodeDisabled.value = true;
    }
};

// 定义表格数据的类型
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);

// 选中当前行
const dialogCheck = async (selection: Permission[], row?: Permission) => {
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
const selectCurrentRow = (val: Permission) => {
    if (!val) return;
    currentRow.value = val;
    if (tableRef.value) {
        tableRef.value.clearSelection();
        tableRef.value.toggleRowSelection(val, true);
    }
};

// 实现懒加载数据功能
const load = async (tree: Permission, treeNode: any, resolve: (data: Permission[]) => void) => {
    const para = ref<PermissionRequest>({
        page: page.value,
        pageSize: 999,
        f: tree.Id,
        key: filters.value.name,
    });

    try {
        const { response } = await getPermissionListApi(para.value);
        resolve(response);
    } catch (error) {
        console.error('Error loading data:', error);
        resolve([]); // 在错误情况下返回空数据以继续渲染
    }
};

// 数据分页
const handleCurrentChange = async (val: number) => {
    page.value = val;

    const para = ref<PermissionRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.value.name,
    });

    listLoading.value = true;
    try {
        const { response } = await getPermissionListApi(para.value);
        permissions.value = response ?? [];
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
</script>@/api/permissionApi