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
          <el-table-column prop="status" label="状态" min-width="80" :filters="TodoStatusTagConfig"
            :filter-method="filterTag" filter-placement="bottom-end">
            <template #default="scope">
              <el-tag :type="TodoStatusTagType[scope.row.status]" disable-transitions>{{ TodoStatusLabel[scope.row.status]
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="deadline" label="截止时间(倒计时)" min-width="130" :formatter="deadlineFormatter" />
          <el-table-column prop="type" label="分类(积分)" :formatter="formatter" min-width="70" />
          <el-table-column prop="desc" label="待办详情" min-width="220">
            <template #default="scope">
              {{ scope.row.desc || '--' }}
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作" min-width="135px">
            <template #default="scope">
              <div v-if="![TodoStatusMap.Done, TodoStatusMap.DoneButOverdue].includes(scope.row.status)">
                <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                <el-button size="small" type="success" plain @click="completeTodo(scope.row)">完成</el-button>
              </div>
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
import { TodoStatusTagConfig, TodoStatusTagType, TodoStatusLabel, TodoTypeLabel, TodoTypeScore, TodoStatusMap, PointEventTypeMap } from './constant';
import { deleteTodo, getTodoList, updateTodo, addPoint } from './serve'

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
  const { type } = row;
  const types = type.map((item) => TodoTypeLabel[item]).join(',');
  const score = type.reduce((a, b) => a + TodoTypeScore[b], 0);
  return `${types}(+${score})`;
}

const deadlineFormatter = (row) => {
  return `${row.deadline}`;
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

const completeTodo = async (row) => {
  const { key: id, deadline, type } = row;
  const now = Date.now();
  const isOverdue = now > dayjs(deadline).valueOf();
  const status = isOverdue ? TodoStatusMap.DoneButOverdue : TodoStatusMap.Done;
  const pointInfo = {
    eventId: id,
    eventType: PointEventTypeMap.Todo,
    score: type.reduce((a, b) => a + TodoTypeScore[b], 0)
  }
  if (isOverdue) {
    pointInfo.score = pointInfo.score / 2;
  }
  await updateTodo(id, { status, finishTime: now })
  await addPoint(pointInfo)
  ElMessage({
    message: '已更新',
    type: 'success',
  });
  updateView();
}

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
