import router from "@/router";
import { defineStore } from "pinia";
import type { TabsState, TabsMenuProps } from "@/stores/interface";
import piniaPersistConfig from "@/stores/config/piniaPersist";
import { useKeepAliveStore } from "./keepAlive";

const keepAliveStore = useKeepAliveStore();

export const useTabsStore = defineStore({
  id: "blogvue3-tabs",
  state: (): TabsState => ({
    tabsMenuList: []
  }),
  actions: {
    // Add Tabs
    async addTabs(tabItem: TabsMenuProps) {
      if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
        this.tabsMenuList.push(tabItem);
      }
    },
    // Remove Tabs
    async removeTabs(tabPath: string, isCurrent: boolean = true) {
      const tabsMenuList = this.tabsMenuList;
      // 如果是删除当前路由
      if (isCurrent) {
        tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return;
          // 让页面自动加载前一个或者后一个路由页面
          const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
          if (!nextTab) return;
          router.push(nextTab.path);
        });
      }
      // 数据清理
      this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath);
    },
    // Close Tabs On Side
    async closeTabsOnSide(path: string, type: "left" | "right") {
      // 关闭左侧、右侧
      const currentIndex = this.tabsMenuList.findIndex(item => item.path === path);
      if (currentIndex !== -1) {
        const range = type === "left" ? [0, currentIndex] : [currentIndex + 1, this.tabsMenuList.length];
        this.tabsMenuList = this.tabsMenuList.filter((item, index) => {
          return index < range[0] || index >= range[1] || !item.close;
        });
      }
      keepAliveStore.setKeepAliveName(this.tabsMenuList.map(item => item.name));
    },
    // Close MultipleTab
    async closeMultipleTab(tabsMenuValue?: string) {
      // 关闭其他
      this.tabsMenuList = this.tabsMenuList.filter(item => {
        return item.path === tabsMenuValue || !item.close;
      });
      keepAliveStore.setKeepAliveName(this.tabsMenuList.map(item => item.name));
    },
    // Set Tabs
    async setTabs(tabsMenuList: TabsMenuProps[]) {
      this.tabsMenuList = tabsMenuList;
    },
    // Set Tabs Title
    async setTabsTitle(title: string) {
      const nowFullPath = location.hash.substring(1);
      this.tabsMenuList.forEach(item => {
        if (item.path == nowFullPath) item.title = title;
      });
    }
  },
  persist: piniaPersistConfig("blogvue3-tabs")
});
