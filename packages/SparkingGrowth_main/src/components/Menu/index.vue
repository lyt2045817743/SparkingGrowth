<template>
  <el-menu
    class="el-menu"
    mode="horizontal"
    router
    :ellipsis="false"
    background-color="#4c8dae"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <el-menu-item @click="goHome">
      <img
        width="40"
        height="40"
        class="home-logo"
        src="../../assets/logo.png"
        alt="logo"
      />
      <span class="home-title">{{ systemName }}</span>
    </el-menu-item>
    <el-menu-item v-for="item in QuickEntry" :key="item.path" :index="item.path">{{ item.title }}</el-menu-item>
    <el-sub-menu index="/">
      <template #title><span style="font-size: 15px;">更多</span></template>
      <el-menu-item @click="openLink('systemBookUrl')">系统说明书</el-menu-item>
      <el-menu-item @click="openLink('systemFeedbackUrl')">问题反馈</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { onMounted, ref } from "vue";
import QuickEntry from "../../constant/quickEntry";
import { getDb } from "../../database";

onMounted(() => init());

const systemName = ref("");
const init = async () => {
  const db = await getDb();
  const name = await db.get("config", "systemName");
  systemName.value = name?.value ?? "婷的空间";
};

const goHome = () => {
  window.location.replace("/");
};

const openLink = (key) => {
    const urlMap = {
        systemBookUrl: 'https://a9frikoi3i.feishu.cn/docx/LW98d2ygTo0WSjxSnJ8cGplGnbf',
        systemFeedbackUrl: 'https://a9frikoi3i.feishu.cn/docx/LW98d2ygTo0WSjxSnJ8cGplGnbf'
    }
    window.open(urlMap[key], '_blank')
}
</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
.home-logo {
  margin-right: 5px;
}
.el-menu {
  flex: 1;
}
.el-menu-item, .el-menu--horizontal>.el-sub-menu .el-sub-menu__title {
    font-size: 16px;
    font-family: cursive;
}
.home-title {
  margin-top: -2px;
  font-size: 28px;
}
</style>
