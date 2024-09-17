<template>
  <el-config-provider :locale="locale" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { ElConfigProvider } from "element-plus";

// element button config
const buttonConfig = reactive({ autoInsertSpace: false });
</script>
