<template>
  <header>
    <div class="box" @click="goHome">
      <img width="40" height="40" class="home-logo" src="./assets/logo.png" />
      <span class="home-title">{{ systemName }}</span>
    </div>
    <div class="quick-entry-box">
      <router-link v-for="item in QuickEntry" :to="item.path">{{ item.title }}</router-link>
    </div>
  </header>
  <router-view v-show="route.name" />
  <div v-show="!route.name" id="container" />
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import QuickEntry from './constant/quickEntry';
import { getDb } from './database';

const route = useRoute();
const systemName = ref('')

onMounted(() => {
  init();
})

const init = async () => {
  const db = await getDb();
  const name = await db.get('config', 'systemName');
  systemName.value = name.value ?? '婷的空间';
}

const goHome = () => {
  window.location.replace('/')
};
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 55px;
  padding: 0 15px;
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
.quick-entry-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
a {
  color: #ffffff;
  font-size: 15px;
  text-decoration: none;
}
</style>
