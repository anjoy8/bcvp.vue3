<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
  <component :is="LayoutComponents[layout]" />
  <ThemeDrawer />
</template>

<script setup lang="ts" name="layout">
import { computed, type Component } from "vue";
import type { LayoutType } from "@/stores/interface";
import LayoutVertical from "./LayoutVertical/index.vue";
import LayoutTransverse from "./LayoutTransverse/index.vue";
import ThemeDrawer from "./components/ThemeDrawer/index.vue";
import { useGlobalStore } from "@/stores/modules/global";

const LayoutComponents: Record<LayoutType, Component> = {
  vertical: LayoutVertical,
  transverse: LayoutTransverse
};

const globalStore = useGlobalStore();
const layout = computed(() => globalStore.layout);
</script>

<style scoped lang="scss">
.layout {
  min-width: 600px;
}
</style>
