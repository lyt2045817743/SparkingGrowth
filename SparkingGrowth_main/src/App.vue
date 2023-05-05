<template>
  <header>
    <img width="40" height="40" class="home-logo" src="./assets/logo.png" @click="goHome" />
    <span class="home-title">婷的博客</span>
  </header>
  <router-view v-show="route.name" />
  <div v-show="!route.name" id="container" />
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
const route = useRoute();
const router = useRouter();

const goHome = () => {
  router.push({
    path: '/'
  })
}
</script>

<style scoped>
header {
  height: 55px;
  padding-left: 15px;
  display: flex;
  align-items: center;
  background-color: #4c8dae;
  font-size: 28px;
  font-family: cursive;
  color: white;
  font-weight: bold;
}
.home-logo {
  margin-right: 5px;
  cursor: pointer;
}
.home-title {
  margin-top: -2px;
}
div {
  font-family: cursive;
  font-size: 20px;
}
</style>
