<!-- 💥 这里是一次性加载 LayoutComponents -->
<template>
  <component :is="LayoutComponents['vertical']" />
</template>

<script setup lang="ts" name="layout">
import { type Component } from "vue";
import type { LayoutType } from "@/stores/interface";
import LayoutVertical from "./LayoutVertical/index.vue";

const LayoutComponents: Record<LayoutType, Component> = {
  vertical: LayoutVertical
};

</script>

<style scoped lang="scss">
.layout {
  min-width: 600px;
}
</style>
