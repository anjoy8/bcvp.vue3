<template>
    <section>
        <!-- 工具条 -->
        <toolbar :button-list="buttonList"></toolbar>

        <!-- 列表 -->
        <el-table :data="users" ref="tableRef" v-loading="listLoading" @select="dialogCheck"
            @row-click="selectCurrentRow" row-key="Id" border style="width: 100%">
            <el-table-column type="selection" width="50"> </el-table-column>
            <el-table-column type="index" width="80"> </el-table-column>
            <el-table-column prop="uRealName" label="昵称" width="" sortable>
            </el-table-column>
            <el-table-column prop="uLoginName" label="登录名" width="" sortable>
            </el-table-column>
            <el-table-column prop="RoleNames" label="角色" width="" sortable>
                <template #default="{ row }">
                    <el-tag v-for="item in row.RoleNames" :key="item.Id">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="DepartmentName" label="所属部门" width="" sortable>
            </el-table-column>
            <el-table-column prop="sex" label="性别" width="" :formatter="formatSex" sortable>
            </el-table-column>
            <el-table-column prop="birth" label="生日" :formatter="formatBirth" width="" sortable>
            </el-table-column>
            <el-table-column prop="uStatus" label="状态" width="" sortable>
                <template #default="{ row }">
                    <el-tag :type="row.uStatus == 0 ? 'success' : 'danger'" disable-transitions>{{ row.uStatus == 0 ?
            "正常" : "禁用" }}
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
                <el-form-item label="昵称" prop="uRealName">
                    <el-input v-model="addForm.uRealName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="uLoginName">
                    <el-input v-model="addForm.uLoginName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="uLoginPWD">
                    <el-input v-model="addForm.uLoginPWD" show-password auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="所属部门" v-if="departOptions && departOptions.length > 0" prop="Dids">
                    <el-cascader placeholder="请选择，支持搜索功能" style="width: 100%" v-model="addForm.Dids"
                        :options="departOptions" filterable :key="isResouceShow"
                        :props="{ checkStrictly: true, expandTrigger: 'hover' }"></el-cascader>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="addForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="addForm.addr"></el-input>
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
                <el-form-item label="昵称" prop="uRealName">
                    <el-input v-model="editForm.uRealName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="登录名" prop="uLoginName">
                    <el-input v-model="editForm.uLoginName" auto-complete="off"></el-input>
                </el-form-item>

                <el-form-item label="角色" prop="RIDs">
                    <el-select multiple v-model="editForm.RIDs" placeholder="请选择角色">
                        <el-option :key="0" :label="'未选择角色'" :value="0"></el-option>
                        <el-option v-for="item in roleOptions" :key="item.Id" :label="item.Name"
                            :value="item.Id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="所属部门" v-if="departOptions && departOptions.length > 0" prop="Dids">
                    <el-cascader placeholder="请选择，支持搜索功能" style="width: 100%" v-model="editForm.Dids"
                        :options="departOptions" filterable :key="isResouceShow"
                        :props="{ checkStrictly: true, expandTrigger: 'hover' }"></el-cascader>
                </el-form-item>
                <el-form-item label="性别">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio class="radio" :label="1">男</el-radio>
                        <el-radio class="radio" :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
                </el-form-item>
                <el-form-item label="生日">
                    <el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input type="textarea" v-model="editForm.addr"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>
        </el-dialog>


    </section>
</template>

<script setup lang="ts" name="user">
import { ref, onMounted, onUnmounted } from 'vue';
import { ElForm, ElTable } from 'element-plus';
import Toolbar from "@/components/toolbar.vue";
import mittBusT from "@/utils/mittBusT";
import { formatDate, getButtonList } from "@/utils";
import { useAuthMenuStore } from "@/stores/modules/authMenu";
import { getUserListApi, type User, type UserRequest } from '@/api/userApi';

// 从 userFunctions.ts 导入
import {
    handleQuery, handleAdd, handleEdit, handleDel, users, listLoading, isResouceShow,
    page, pageSize, total, addLoading, addFormRef, addSubmit, addFormVisible, addForm, departOptions, roleOptions,
    currentRow, editFormVisible, editLoading, editFormRef, editSubmit, editForm
} from './usersFunctions';
// 定义 filters
const filters = ref<{ name: string }>({ name: '' });
// 加载按钮
const buttonList = ref<Menu.MenuOptions[]>([]);

const addFormRules = {
    uLoginName: [{ required: true, message: "请输入登录名", trigger: "blur" },],
    uRealName: [{ required: true, message: "请输入昵称", trigger: "blur" }],
    uLoginPWD: [{ required: true, message: "请输入密码", trigger: "blur" }],
    birth: [{ required: true, message: "请填写生日", trigger: "blur" }],
};
// 树的默认属性
const defaultProps = {
    children: "children",
    label: "label",
};

const formatSex = (row: User) => {
    return row.sex === 1 ? "男" : row.sex === 0 ? "女" : "未知";
};

const formatBirth = (row: User) => {
    return !row.birth || row.birth == "" ? "" : formatDate(new Date(row.birth), "yyyy-MM-dd");
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

// 定义表格数据的类型
const tableRef = ref<InstanceType<typeof ElTable> | null>(null);

// 选中当前行
const dialogCheck = async (selection: User[], row?: User) => {
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
const selectCurrentRow = (val: User) => {
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

    const para = ref<UserRequest>({
        page: page.value,
        pageSize: 20,
        f: '0',
        key: filters.value.name,
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