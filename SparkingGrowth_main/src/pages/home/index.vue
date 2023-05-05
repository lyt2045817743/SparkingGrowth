<template>
  <div class="home">
    <div class="tip">以一点点火花为起点，开启下一个大的想法</div>
    <div class="sub-apps__box">
      <div v-for="item in microConfigs" class="sub-apps__item" @click="() => goPage(item.activeRule)">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { microConfigs } from '../../constant/micro';
const router = useRouter();
const goPage = (to) => {
  router.push({
    path: to
  })
}
</script>

<style scoped>
.home {
  margin-top: 100px;
}
.tip {
  text-align: center;
  font-size: 30px;
  color: #4c8dae;
  font-weight: bolder;
  font-family: cursive;
}
.sub-apps__box {
  display: flex;
  padding: 50px 150px;
}
.sub-apps__item {
  width: 250px;
  height: 180px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ADD8E6;
  border-radius: 40px;
  cursor: pointer;
}
.sub-apps__item:hover {
  transform: scale(1.1);
}
</style>
