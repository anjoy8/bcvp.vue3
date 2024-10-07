<template>
  <el-drawer v-model="drawerVisible" title="布局设置" size="290px">
    <!-- 布局样式 -->
    <el-divider class="divider" content-position="center">
      <el-icon>
        <Notification />
      </el-icon>
      布局样式
    </el-divider>
    <div class="layout-box">
      <el-tooltip effect="dark" content="纵向" placement="top" :show-after="200">
        <div :class="['layout-item layout-vertical', { 'is-active': layout == 'vertical' }]"
          @click="setLayout('vertical')">
          <div class="layout-dark"></div>
          <div class="layout-container">
            <div class="layout-light"></div>
            <div class="layout-content"></div>
          </div>
          <el-icon v-if="layout == 'vertical'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
      <el-tooltip effect="dark" content="横向" placement="top" :show-after="200">
        <div :class="['layout-item layout-transverse', { 'is-active': layout == 'transverse' }]"
          @click="setLayout('transverse')">
          <div class="layout-dark"></div>
          <div class="layout-content"></div>
          <el-icon v-if="layout == 'transverse'">
            <CircleCheckFilled />
          </el-icon>
        </div>
      </el-tooltip>
    </div>

    <!-- 界面设置 -->
    <el-divider class="divider" content-position="center">
      <el-icon>
        <Setting />
      </el-icon>
      界面设置
    </el-divider>
    <div class="theme-item">
      <span>菜单折叠</span>
      <el-switch v-model="isCollapse" />
    </div>
    <div class="theme-item">
      <span>菜单手风琴</span>
      <el-switch v-model="accordion" />
    </div>
    <div class="theme-item">
      <span>面包屑</span>
      <el-switch v-model="breadcrumb" />
    </div>
    <div class="theme-item">
      <span>面包屑图标</span>
      <el-switch v-model="breadcrumbIcon" />
    </div>
    <div class="theme-item">
      <span>标签栏</span>
      <el-switch v-model="tabs" />
    </div>
    <div class="theme-item">
      <span>标签栏图标</span>
      <el-switch v-model="tabsIcon" />
    </div>
    <div class="theme-item">
      <span>页脚</span>
      <el-switch v-model="footer" />
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useGlobalStore } from "@/stores/modules/global";
import type { LayoutType } from "@/stores/interface";
import mittBus from "@/utils/mittBus";

const globalStore = useGlobalStore();
const { layout, isCollapse, accordion, breadcrumb, breadcrumbIcon, tabs, tabsIcon, footer } = storeToRefs(globalStore);

// 设置布局方式
const setLayout = (val: LayoutType) => {
  globalStore.setGlobalState("layout", val);
};

// 打开主题设置
const drawerVisible = ref(false);
mittBus.on("openThemeDrawer", () => {
  drawerVisible.value = true
});
</script>

<style scoped lang="scss">
@import "./index.scss";
</style>
