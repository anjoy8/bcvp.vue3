<template>
    <section style="display: flex;">
        <el-col :span="8" class="toolbar roles">
            <el-card class="box-card">
                <div class="clearfix">
                    <span>权限</span>
                    <el-button @click="handleQuery" style="float: right; padding: 3px 0">刷新</el-button>
                </div>
                <div v-for="o in roles" :key="o.Id" @click="operate(o.Id)" :class="o.Id === roleid ? 'active' : ''"
                    class="text item role-item">
                    {{ o.Name }}
                </div>
            </el-card>
        </el-col>
        <el-col :span="16" class="toolbar perms morechildren">
            <el-card class="box-card">
                <div class="clearfix">
                    <span>菜单</span>
                    <el-button :loading="loadingSave" @click="saveAssign" style="float: right; padding: 3px 0">
                        保存
                    </el-button>
                </div>
                <div class="block">
                    <el-tree :data="data5" show-checkbox node-key="value" ref="treeRef" default-expand-all
                        :expand-on-click-node="true" :check-strictly="true">
                        <template #default="{ node, data }">
                            <span class="custom-tree-node">
                                <span>
                                    {{ node.label }}
                                    <el-button @click.prevent="reverse(data.btns)"
                                        v-if="data.btns && data.btns.length > 1"
                                        style="padding:5px 8px;margin-left:5px;" size="small">
                                        反选
                                    </el-button>
                                </span>
                                <span>
                                    <el-checkbox-group v-model="assignBtns">
                                        <el-checkbox v-for="btn in data.btns" :key="btn.value"
                                            :value="btn.value.toString()">
                                            {{ btn.label }}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </span>
                            </span>
                        </template>
                    </el-tree>
                </div>
            </el-card>
        </el-col>
    </section>
</template>

<script setup lang="ts" name="assign">
import { ref, onMounted } from 'vue'
import { getPermissionTreeNobtn, getPermissionIdsApi, addRolePermission, type PermissionNode } from '@/api/permissionApi' // 假设你有相应的API文件
import { ElMessage, ElTree } from 'element-plus'
import { getRoleListApi, type Role, type RoleRequest } from '@/api/roleApi';// 模型类
import { formatDate } from '@/utils';
import type { AssignRequest } from '@/api/permissionApi';

// 数据初始化
const roles = ref<Role[]>([]);// 数据数组
const roleid = ref<string | null>(null)
const assignBtns = ref<string[]>([])
const loadingSave = ref(false)

const treeRef = ref<InstanceType<typeof ElTree> | null>(null);

const data = ref<PermissionNode[]>([]);
const data5 = ref<PermissionNode[]>([]);

// Methods
const reverse = (ls: any[]) => {
    if (ls && ls.length) {
        ls.forEach(btn => {
            const findBtnIndex = assignBtns.value.findIndex(t => t === btn.value.toString())
            if (findBtnIndex > -1) {
                assignBtns.value.splice(findBtnIndex, 1)
            } else {
                assignBtns.value.push(btn.value.toString())
            }
        })
    }
}

const formatEnabled = (row: any) => row.Enabled ? '正常' : '未知'

const formatCreateTime = (row: any) => {
    return (!row.CreateTime || row.CreateTime == '') ? '' : formatDate(new Date(row.CreateTime), 'yyyy-MM-dd')
}

const handleQuery = async () => {
    const rolePara = ref<RoleRequest>({
        page: 1,
        pageSize: 999,
        f: '0',
        key: '',
    });
    const { response } = await getRoleListApi(rolePara.value);
    roles.value = response.data ?? [];

    getPermissions();
}

const getPermissions = async () => {

    const { response } = await getPermissionTreeNobtn();
    loadingSave.value = false
    data.value = response.children ?? [];
    data5.value = JSON.parse(JSON.stringify(data.value))

}

const getPermissionIds = async (rid: string) => {
    assignBtns.value = []
    const { response } = await getPermissionIdsApi(rid);
    loadingSave.value = false
    setTimeout(() => {
        if (treeRef.value) {
            treeRef.value.setCheckedKeys(response.permissionids ?? []);
        }
    }, 100);
    assignBtns.value = response.assignbtns ?? [];


}

const operate = (id: string) => {
    loadingSave.value = true;
    roleid.value = id;
    getPermissionIds(id);
}

const saveAssign = async () => {
    loadingSave.value = true;

    // 左侧的菜单树
    let pids: string[] = [];
    if (treeRef.value) {
        pids = treeRef.value.getCheckedKeys().map((key: any) => key.toString());
    }

    // 每个菜单树右侧的按钮列表
    try {
        assignBtns.value.forEach(btn => {
            if (btn && parseInt(btn) > 0) {
                pids.push(btn)
            }
        })
    } catch (e) {
        ElMessage({
            message: "操作异常",
            type: "error",
        })
        return
    }

    const para = { pids, rid: roleid.value }
    if (para.pids && para.rid && parseInt(para.rid) > 0) {

        const postData: AssignRequest = {
            pids: para.pids,
            rid: para.rid,
        };
        console.log(postData);
        const { success, msg } = await addRolePermission(postData);
        loadingSave.value = false;
        if (success) {
            ElMessage.success('提交成功');
        } else {
            ElMessage.error('提交失败' + msg);
        }

    } else {
        loadingSave.value = false
        ElMessage.error('请选择要操作的角色');
    }
}


// 钩子函数
onMounted(async () => {
    // 获取数据
    await handleQuery();
});
</script>
<style scoped lang="scss">
.role-item {
    cursor: pointer;
    padding: 10px;
}

.role-item.active {
    background: #ebf5ff;
}

.role-item:hover {
    background: #ebf5ff;
}

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}

.text {
    font-size: 14px;
}

.clearfix:before,
.clearfix:after {
    display: table;
    content: "";
}

.clearfix:after {
    clear: both
}

.box-card {
    width: 90%;
}


.morechildren .el-checkbox {
    margin-right: 5px !important;
    float: left;
}

.morechildren .el-checkbox-group {
    margin-left: 50px;
    padding: 5px;
}

.morechildren .el-tree-node__content {
    height: auto !important;
}
</style>