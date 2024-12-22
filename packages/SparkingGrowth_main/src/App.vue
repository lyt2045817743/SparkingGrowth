<template>
  <header>
    <Menu />
  </header>
  <router-view v-show="route.name" />
  <div v-show="!route.name" id="container" />
</template>

<script setup>
import { useRoute } from 'vue-router';
import Menu from './components/Menu/index.vue'

const route = useRoute();
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 55px;
  background-color: #4c8dae;
  font-family: cursive;
  color: white;
  font-weight: bold;
}
div {
  font-family: cursive;
  font-size: 20px;
}
</style>
