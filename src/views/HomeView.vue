<script setup lang="ts">
import { computed } from 'vue'
import TheWelcome from '@/components/TheWelcome.vue'
import { useCounterStore } from "../stores/counter";

// 获取 store
const counterStore = useCounterStore()

// 使用 store 中的状态和方法，不使用解构来保持响应性
const count = computed(() => counterStore.count)
const doubleCount = computed(() => counterStore.doubleCount)
const increment = counterStore.increment
</script>

<template>
  <main>
    <TheWelcome />
    <p>Count: {{ count }}</p>
    <p>Double Count: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
  </main>
</template>
