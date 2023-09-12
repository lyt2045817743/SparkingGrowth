<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div style="display: flex; align-items: center;">
          <h5>书籍列表</h5>
        </div>
        <div style="display: flex; align-items: center;">
          <el-button round>类型管理</el-button>
          <el-button class="add-btn" type="primary" round @click="addHandle">新增书籍</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <el-table :data="tableList" row-key="id">
          <el-table-column type="index" label="序号" min-width="60" />
          <el-table-column prop="name" label="书籍名称" min-width="150" />
          <el-table-column prop="author" label="作者" min-width="80" />
          <el-table-column prop="type" label="书籍类型" min-width="100">
            <template #default>
              {{ '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="书籍状态" min-width="100">
            <template #default>
              {{ '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="percent" label="当前阅读进度" min-width="180" :formatter="formatter" />
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
// import {  } from './serve';
// import { } from '../todoConfig/serve'
// import {  } from '../../constant';
// import {  } from './constant';

const router = useRouter();

const tableList = ref([]);

onMounted(() => {
  getData();
})

const getData = async () => {
  // const { data, total } = await getPointList();
  tableList.value = [];
}

const formatter = () => {
  return '';
}

const addHandle = () => {
  router.push({
    path: '/bookAdd',
    query: {
      pageType: 'add'
    }
  })
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

.extra-point-dialog {
  padding-top: 0;
}

.common-layout {
  :deep(.el-table .cell) {
    white-space: pre-line;
  }
}
</style>
