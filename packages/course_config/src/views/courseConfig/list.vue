<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <h5>学习资源列表</h5>
        <el-button class="add-btn" type="primary" round @click="handleAdd">新增学籍资源</el-button>
      </el-header>
      <el-main class="main">
        <el-table :data="tableList">
          <el-table-column type="index" label="序号" width="80" />
          <el-table-column prop="name" label="资源名称" />
          <el-table-column prop="type" label="资源类型">
            <template #default="scope">
              {{ CourseTitleMap[scope.row.type] }}
            </template>
          </el-table-column>
          <el-table-column align="right">
            <template #header>
              <el-input v-model="search" size="small" placeholder="搜索学习资源" />
            </template>
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { getCourseList, deleteCourse } from './sever';
import { CourseTitleMap } from '../../common';

const router = useRouter();

const tableList = ref([]);
const search = ref('');

onMounted(() => {
  getData();
})

const updateView = () => {
  getData();
}

const getData = async () => {
  tableList.value = await getCourseList();
}

const handleDelete = async (row) => {
  const { id } = row;
  await deleteCourse(id);
  ElMessage({
    message: '删除成功！',
    type: 'success',
  })
  updateView();
}

const handleAdd = () => {
  router.push({
    path: '/add',
    query: {
      pageType: 'add'
    }
  })
}

const handleEdit = (row) => {
  const { id } = row;
  router.push({
    path: '/edit',
    query: {
      id,
      pageType: 'edit'
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
</style>
