<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <Menu />
      </el-aside>
      <el-main class="app-main">
        <router-view :key="$route.fullPath" />
      </el-main>
    </el-container>
    <el-backtop :right="20" :bottom="30" :visibility-height="150" />
  </div>
</template>

<script>
import Menu from './components/layout/Menu.vue';

export default {
  name: 'App',
  components: {
    Menu
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  display: flex;
}
.menu {
  height: calc(100vh - 55px);
}
.app-main {
  padding: 0;
}
</style>
