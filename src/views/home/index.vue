<template>
  <div class="home card">
    <img class="home-bg" src="@/assets/images/welcome.png" alt="welcome" />
  </div>
</template>

<script setup lang="ts" name="home"></script>

<style scoped lang="scss">
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .home-bg {
    width: 70%;
    max-width: 1200px;
    margin-bottom: 20px;
  }
}
</style>
