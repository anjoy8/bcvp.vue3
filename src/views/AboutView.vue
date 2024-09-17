<template>
  <div class="about">
    <h1>This is an about page</h1>
    <br />
    <p v-if="token" class="token">Token: {{ token }}</p>
    <p v-else>No token available.</p>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const token = authStore.token;
</script>

<style>
@media (min-width: 1024px) {
  .about {
    /* min-height: 100vh; */
    /* display: flex; */
    align-items: center;
  }
  .token{
    word-wrap: break-word;
    width: 500px;
  }
}
</style>