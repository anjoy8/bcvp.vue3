<template>
    <el-col v-if="buttonList != null && buttonList.length > 0" :span="24" class="toolbar" style="padding-bottom: 0px;">
        <el-form :inline="true" @submit.prevent>
            <el-form-item>
                <el-input v-model="searchVal" clearable placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item v-for="item in buttonList" :key="item.id">
                <el-button :type="item.Func && (/handleDel|stop/i.test(item.Func) ? 'danger' : 'primary')"
                    v-if="!item.IsHide" @click="callFunc(item)">
                    {{ item.name }}
                </el-button>
            </el-form-item>
        </el-form>
    </el-col>
</template>

<script setup lang="ts">
import { ref, toRaw } from 'vue';
import { defineProps } from 'vue';
import mittBus from "@/utils/mittBusT";

const props = defineProps<{
    buttonList: Menu.MenuOptions[]
}>();

const searchVal = ref('');

const callFunc = (cnt: Menu.MenuOptions) => {
    // 使用 toRaw 获取原始对象
    const rawItem = toRaw(cnt);
    rawItem.search = searchVal.value;
    mittBus.emit("callFunction", rawItem);
};
</script>