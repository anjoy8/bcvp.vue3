import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  // 定义状态
  state: () => ({
    count: 0,
  }),
  
  // 定义 actions，可以包含异步操作
  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
  },
  
  // 定义 getters，用来计算衍生的状态
  getters: {
    doubleCount: (state) => state.count * 2,
  },
})