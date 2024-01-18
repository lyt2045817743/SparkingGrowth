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
          <el-switch v-model="form.showPoint" @change="(val) => changeConfig(val, 'showPoint')" />
        </el-form-item>
        <el-form-item label="数据来源：" required>
          <el-radio-group v-model="form.dataSourceType" style="margin-top: -4px;" @change="(val) => changeConfig(val, 'dataSourceType')">
            <el-radio v-for="item in DataSourceTypeOptions" :key="item.value" :label="item.value" size="large">{{ item.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { DataSourceTypeOptions } from './constant';
import { DataSourceType } from '@sparking/common';
import apis from '../../api';

const form = ref({
  systemName: '',
  showPoint: undefined,
  dataSourceType: undefined
})

onMounted(() => {
  init();
})

const init = async () => {
  const { systemName = '婷的空间', showPoint = true, dataSourceType } = await apis.getConfigMap();
  form.value.systemName = systemName;
  form.value.showPoint = showPoint;
  form.value.dataSourceType = dataSourceType ?? DataSourceType.getDefault();
};

const changeConfig = async (val, key) => {
  await apis.updateConfig(key, val);
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
