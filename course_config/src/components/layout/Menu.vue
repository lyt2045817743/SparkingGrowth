<template>
  <el-menu
    active-text-color="#006699"
    class="menu"
    :default-active="activePath"
    @select="handleOpen"
  >
    <div v-if="!loading">
      <div v-for="item in routesRef" :key="item.path">
        <el-menu-item  v-if="!item.meta.hidden" :index="item.path">
          <span>{{ item.meta.title }}</span>
        </el-menu-item>
      </div>
    </div>
  </el-menu>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { routes } from '../../router/routes';
import { getConfigByKey } from '../../views/systemConfig/serve';

const routesRef = reactive(routes);
const loading = ref(true);

const initRoutes = async () => {
  for (let i = 0; i < routesRef.length; i++) {
    if (routesRef[i].meta.hiddenKey) {
      const item = await getConfigByKey(routesRef[i].meta.hiddenKey);
      console.log(item);
      routesRef[i].meta.hidden = !item;
    }
  }
  loading.value = false;
}

initRoutes();

const router = useRouter();
const activePath = ref(`/${window.location.pathname.split('/')[2]}`);

function handleOpen(key) {
  router.push({
    path: key
  })
}
</script>

<style scoped>
.menu {
  padding-top: 15px;
}
</style>
