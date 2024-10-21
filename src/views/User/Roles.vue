<template>
    <section>
        <!-- 工具条 -->
        <toolbar :button-list="buttonList"></toolbar>

        <!-- 列表 -->
        <el-table :data="roles" ref="tableRef" v-loading="listLoading" @select="dialogCheck"
            @row-click="selectCurrentRow" row-key="Id" border style="width: 100%">
            <el-table-column type="selection" width="50"></el-table-column>
            <el-table-column type="index" width="80"></el-table-column>
            <el-table-column prop="Name" label="角色名" width sortable></el-table-column>

            <el-table-column prop="AuthorityScope" label="权限范围" width sortable>
                <template #default="{ row }">
                    <el-tag type="danger" v-if="row.AuthorityScope === -1">无任何数据权限</el-tag>
                    <el-tag v-if="row.AuthorityScope === 1">
                        自定义数据权限
                        <br />
                        {{ row.Dids }}
                    </el-tag>
                    <el-tag v-if="row.AuthorityScope === 2">本部门数据权限</el-tag>
                    <el-tag type="warning" v-if="row.AuthorityScope === 3">本部门及以下所有部门</el-tag>
                    <el-tag v-if="row.AuthorityScope === 4">仅自己数据权限</el-tag>
                    <el-tag type="success" v-if="row.AuthorityScope === 9">全部数据权限</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="Description" label="说明" width sortable></el-table-column>
            <el-table-column prop="CreateTime" label="创建时间" :formatter="formatCreateTime" width
                sortable></el-table-column>
            <el-table-column prop="Enabled" label="状态" width="200" sortable>
                <template #default="{ row }">
                    <el-tag :type="row.Enabled ? 'success' : 'danger'" disable-transitions>
                        {{ row.Enabled ? '正常' : '禁用' }}
                    </el-tag>
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
                <el-form-item label="角色名" prop="Name">
                    <el-input v-model="addForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限范围" prop="AuthorityScope">
                    <el-select v-model="addForm.AuthorityScope" placeholder="请选择权限范围">
                        <el-option label="无任何数据权限" :value="-1"></el-option>
                        <el-option label="自定义数据权限" :value="1"></el-option>
                        <el-option label="本部门数据权限" :value="2"></el-option>
                        <el-option label="本部门及以下所有部门" :value="3"></el-option>
                        <el-option label="仅自己数据权限" :value="4"></el-option>
                        <el-option label="全部数据权限" :value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="Dids" v-if="addForm.AuthorityScope == 1" label="部门权限" width sortable>
                    <el-tree :data="options" ref="treeAddRef" default-expand-all show-checkbox node-key="value"
                        :expand-on-click-node="true" :check-strictly="true" :props="defaultProps">
                    </el-tree>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="addForm.Enabled" placeholder="请选择角色状态">
                        <el-option label="激活" :value="true"></el-option>
                        <el-option label="禁用" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" prop="Description">
                    <el-input v-model="addForm.Description" auto-complete="off"></el-input>
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
                <el-form-item label="角色名" prop="Name">
                    <el-input disabled v-model="editForm.Name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="权限范围" prop="AuthorityScope">
                    <el-select v-model="editForm.AuthorityScope" placeholder="请选择权限范围">
                        <el-option label="无任何数据权限" :value="-1"></el-option>
                        <el-option label="自定义数据权限" :value="1"></el-option>
                        <el-option label="本部门数据权限" :value="2"></el-option>
                        <el-option label="本部门及以下所有部门" :value="3"></el-option>
                        <el-option label="仅自己数据权限" :value="4"></el-option>
                        <el-option label="全部数据权限" :value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="Dids" v-if="editForm.AuthorityScope == 1" label="部门权限" width sortable>
                    <el-tree :data="options" ref="treeEditRef" default-expand-all show-checkbox node-key="value"
                        :expand-on-click-node="true" :check-strictly="true" :props="defaultProps">
                    </el-tree>
                </el-form-item>
                <el-form-item label="状态" prop="Enabled">
                    <el-select v-model="editForm.Enabled" placeholder="请选择角色状态">
                        <el-option label="激活" :value="true"></el-option>
                        <el-option label="禁用" :value="false"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明" prop="Description">
                    <el-input v-model="editForm.Description" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


    </section>
</template>

<script setup lang="ts" name="role">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElForm, ElTable } from 'element-plus';
import Toolbar from "@/components/toolbar.vue";
import mittBusT from "@/utils/mittBusT";
import { getButtonList } from "@/utils";
import { useAuthMenuStore } from "@/stores/modules/authMenu";
import { getRoleListApi, type Role, type RoleRequest } from '@/api/roleApi';

// 从 roleFunctions.ts 导入
import {
    handleQuery, handleAdd, handleEdit, handleDel, roles, listLoading, isResouceShow,
    page, pageSize, total, addLoading, addFormRef, addSubmit, addFormVisible, addForm, options, treeAddRef,
    currentRow, editFormVisible, editLoading, editFormRef, editSubmit, editForm, treeEditRef
} from './rolesFunctions';
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
const formatCreateTime = (row: Role) => row.CreateTime;
const formatModifyTime = (row: Role) => row.ModifyTime;

// 定义表格数据的类型
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);

// 选中当前行
const dialogCheck = async (selection: Role[], row?: Role) => {
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
const selectCurrentRow = (val: Role) => {
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

    const para = ref<RoleRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.value.name,
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
</script>@/api/roleApi