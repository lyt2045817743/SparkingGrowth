<template>
  <header>
    <div class="box" @click="goHome">
      <img width="40" height="40" class="home-logo" src="./assets/logo.png" />
      <span class="home-title">婷的空间</span>
    </div>
  </header>
  <router-view v-show="route.name" />
  <div v-show="!route.name" id="container" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
const route = useRoute();

const goHome = () => {
  window.location.replace('/')
}
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  height: 55px;
  padding-left: 15px;
  background-color: #4c8dae;
  font-family: cursive;
  color: white;
  font-weight: bold;
}
.box {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.home-logo {
  margin-right: 5px;
}
.home-title {
  margin-top: -2px;
  font-size: 28px;
}
div {
  font-family: cursive;
  font-size: 20px;
}
</style>
