<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div style="display: flex; align-items: center;">
          <h5>待办列表</h5>
          <el-checkbox v-model="onlyShowToday" style="margin-left: 15px;" label="仅展示今晚前截止的待办" size="large" @change="showTheTodayTodo" />
        </div>
        <div style="display: flex; align-items: center;">
          <el-button :icon="Refresh" round @click="onRefreshCycleTodo">刷新循环待办</el-button>
          <el-button class="add-btn" type="primary" round @click="handleAdd">新增待办</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <el-table ref="tableRef" row-key="date" :data="tableList">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="content" label="待办内容" min-width="150">
            <template #default="scope">
              <div class="link-style" @click="handleEdit(scope.row, PageTypeMap.View)">{{ scope.row.content }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="deadline" label="截止时间（倒计时）" width="230">
            <template #default="scope">
              <span>
                {{ scope.row.deadline.slice(0, 16) }}
                <span v-if="getDeadlineExtraText(scope.row)" :style="{ color: getDeadlineExtraText(scope.row).color }">{{ `（${getDeadlineExtraText(scope.row).text}天）` }}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="type" :label="`分类${showPoint ? '（积分）': ''}`" :formatter="formatter" width="160" />
          <el-table-column prop="desc" label="待办详情" min-width="220">
            <template #default="scope">
              {{ scope.row.desc || '--' }}
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作" width="200px">
            <template #default="scope">
              <el-button size="small" @click="handleEdit(scope.row, PageTypeMap.Edit)">编辑</el-button>
              <el-popconfirm title="是否确认删除？" @confirm="handleDelete(scope.row)">
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button size="small" type="success" plain @click="completeTodo(scope.row)">完成</el-button>
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
import { Refresh } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { PointEventTypeMap, PageTypeMap } from '../../constant';
import {  TodoTypeLabel, TodoTypeScore, TodoStatusMap, CycleMap } from './constant';
import { deleteTodo , getTodoList, updateTodo, addPoint } from './serve';
import { getConfigByKey } from '../systemConfig/serve';

const router = useRouter();

const onlyShowToday = ref(false);
const tableList = ref([]);
const showPoint = ref(false);
let totalList;

onMounted(() => {
  getData(true);
  getPointFlag();
})

const getPointFlag = async () => {
  const config = await getConfigByKey('showPoint');
  showPoint.value = config.value;
}

const updateView = () => {
  getData();
}

const getData = async (isInit) => {
  const data = await getTodoList();
  tableList.value = data.filter((item) => [TodoStatusMap.Undo, TodoStatusMap.Overdue].includes(item.status)).sort((a, b) => dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf());
  totalList = tableList.value;
  if (!isInit && onlyShowToday.value) showTheTodayTodo(true);
}

const onRefreshCycleTodo = async () => {
  const now = Date.now();
  const data = await getTodoList();
  for (let i = 0; i< data.length; i++) {
    const { key, cycleType } = data[i];
    const deadline = dayjs(data[i].deadline).valueOf();
    if ([CycleMap.Everyday].includes(cycleType) && now > deadline) {
      const todoInfo =  { status: TodoStatusMap.Undo, deadline: dayjs(now).add(1, 'day').format('YYYY-MM-DD 00:00:00') };
      await updateTodo(key, todoInfo);
    }
  }
  updateView();
  ElMessage.success('刷新完成');
}

const showTheTodayTodo = (value) => {
  onlyShowToday.value = value;
  if (value) {
    tableList.value = totalList.filter((item) => {
      const { deadline, status } = item;
      const todayEnding = dayjs().add(1, 'day').format('YYYY-MM-DD 00:00:01');
      const isComplete = [TodoStatusMap.Done, TodoStatusMap.DoneButOverdue].includes(status);
      return dayjs(todayEnding).valueOf() > dayjs(deadline).valueOf() && !isComplete;
    })
  } else {
    tableList.value = totalList;
  }
}

const formatter = (row) => {
  const { type, score } = row;
  const types = type.map((item) => TodoTypeLabel[item]).join(',');
  const scoreNew = score ?? type.reduce((a, b) => a + TodoTypeScore[b], 0);
  return `${types}${showPoint.value ? `（+${scoreNew}）` : ''}`;
}

const getDeadlineExtraText = (row) => {
  const { deadline, status } = row;
  const diffDays = dayjs(deadline).diff(dayjs(), 'day');
  let diffDaysText = diffDays;
  let color = 'black';
  if (diffDays < 0) {
    diffDaysText = '逾期' + Math.abs(diffDays);
    color = 'red';
  } else if (diffDays === 0) {
    diffDaysText = '<1';
    color = 'red';
    if (dayjs(deadline).valueOf() < Date.now()) {
      diffDaysText = '逾期' + diffDaysText;
    }
  }
  const isComplete = [TodoStatusMap.Done, TodoStatusMap.DoneButOverdue].includes(status);
  return isComplete ? undefined : { text: diffDaysText, color };
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
      pageType: PageTypeMap.Add
    }
  })
}

const handleEdit = (row, pageType) => {
  const { key } = row;
  router.push({
    path: '/todoEdit',
    query: {
      id: key,
      pageType
    }
  })
};

const completeTodo = async (row) => {
  const { key: id, deadline, type, score, cycleType } = row;
  const now = Date.now();
  const isOverdue = now > dayjs(deadline).valueOf();
  const status = isOverdue ? TodoStatusMap.DoneButOverdue : TodoStatusMap.Done;
  const pointInfo = {
    eventId: id,
    eventType: PointEventTypeMap.Todo,
    score: score ?? type.reduce((a, b) => a + TodoTypeScore[b], 0)
  }
  if (isOverdue) {
    pointInfo.score = pointInfo.score / 2;
  }
  if (cycleType !== CycleMap.UnCycle) {
    pointInfo.createTime = now;
  }
  await updateTodo(id, { status, finishTime: now });
  await addPoint(pointInfo);
  await updateView();
  ElMessage({
    message: '已更新',
    type: 'success',
  });
}

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

.link-style {
  cursor: pointer;
}
</style>
