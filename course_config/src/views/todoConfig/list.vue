<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <h5>待办列表</h5>
        <el-button class="add-btn" type="primary" round @click="handleAdd">新增待办</el-button>
      </el-header>
      <el-main class="main">
        <el-table ref="tableRef" row-key="date" :data="tableList">
          <el-table-column type="index" label="序号" min-width="60" />
          <el-table-column prop="content" label="待办内容" min-width="130" />
          <el-table-column
            prop="status"
            label="状态"
            min-width="80"
            :filters="TodoStatusTagConfig"
            :filter-method="filterTag"
            filter-placement="bottom-end"
          >
            <template #default="scope">
              <el-tag
                :type="TodoStatusTagType[scope.row.status]"
                disable-transitions
                >{{ TodoStatusLabel[scope.row.status] }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="deadline" label="截止时间" min-width="130" />
          <el-table-column prop="type" label="分类" :formatter="formatter" min-width="60" />
          <el-table-column prop="createTime" label="创建时间" min-width="80" :formatter="dateFormatter" />
          <el-table-column prop="desc" label="待办详情" min-width="180">
            <template #default="scope">
              {{ scope.row.desc || '--' }}
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作" width="135px">
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
import { ElMessage, dayjs } from 'element-plus';
import { useRouter } from 'vue-router';
import { TodoStatusTagConfig, TodoStatusTagType, TodoStatusLabel, TodoTypeLabel } from './constant';
import { deleteTodo, getTodoList } from './serve'

const router = useRouter();

const tableList = ref([]);

onMounted(() => {
  getData();
})

const updateView = () => {
  getData();
}

const getData = async () => {
  tableList.value = await getTodoList();
}

const formatter = (row) => {
  return TodoTypeLabel[row.type]
}

const dateFormatter = (row) => {
  if (!row.createTime) return '';
  return dayjs(row.createTime).format('YYYY-MM-DD');
}

const handleDelete = async (row) => {
  const { key } = row;
  await deleteTodo(key);
  ElMessage({
    message: '删除成功！',
    type: 'success',
  })
  updateView();
}

const handleAdd = () => {
  router.push({
    path: '/todoAdd',
    query: {
      pageType: 'add'
    }
  })
}

const handleEdit = (row) => {
  const { key } = row;
  router.push({
    path: '/todoEdit',
    query: {
      id: key,
      pageType: 'edit'
    }
  })
};

const filterTag = (value, row) => {
  return +row.status === +value
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
.common-layout {
  :deep(.el-table .cell) {
    white-space: pre-line;
  }
}
</style>
