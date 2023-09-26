<template>
  <el-container>
    <el-header class="header">
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/todo' }">系统配置</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main>
      <el-form :model="form" label-width="120px">
        <el-form-item label="系统名称：" required>
          <el-input v-model="form.systemName" style="width:300px" @change="(val) => changeConfig(val, 'systemName')" />
        </el-form-item>
        <el-form-item label="积分模块：" required>
          <el-switch v-model="form.showTodo" @change="(val) => changeConfig(val, 'showTodo')" />
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getConfigMap, updateConfig } from './serve.js';

const form = ref({
  systemName: '',
  showTodo: undefined
})
onMounted(() => {
  init();
})

const init = async () => {
  const { systemName = '婷的空间', showTodo = true } = await getConfigMap();
  form.value.systemName = systemName;
  form.value.showTodo = showTodo;
};

const changeConfig = async (val, key) => {
  await updateConfig(key, val);
  ElMessage.success('修改成功');
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  border-bottom: 1px solid #dcdfe6;
}

.main {
  padding-top: 0;
}
</style>
