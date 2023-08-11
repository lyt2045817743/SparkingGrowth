<template>
  <el-menu
    active-text-color="#006699"
    class="menu"
    :default-active="activePath"
    @select="handleOpen"
  >
    <div v-for="item in routes" :key="item.path">
      <el-menu-item  v-if="!item.meta.hidden" :index="item.path">
        <span>{{ item.meta.title }}</span>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { routes } from '../../router/routes';

const router = useRouter();
const activePath = ref(`/${window.location.pathname.split('/')[2]}`);

function handleOpen(key) {
  router.push({
    path: key
  })
}
</script>

<style lang="scss" scoped></style>
