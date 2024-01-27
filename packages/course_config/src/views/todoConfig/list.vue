<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div style="display: flex; align-items: center">
          <h5>待办列表</h5>
          <el-checkbox
            v-model="onlyShowToday"
            style="margin-left: 15px"
            label="仅展示今晚前截止的待办"
            size="large"
            @change="showTheTodayTodo"
          />
        </div>
        <div style="display: flex; align-items: center">
          <!-- <el-button :icon="Refresh" round @click="onRefreshCycleTodo">刷新循环待办</el-button> -->
          <el-button class="add-btn" type="primary" round @click="handleAdd"
            >新增待办</el-button
          >
        </div>
      </el-header>
      <el-main class="main">
        <el-table ref="tableRef" row-key="key" :data="tableList">
          <el-table-column type="index" label="序号" width="60" />
          <el-table-column prop="content" label="待办内容" min-width="180">
            <template #default="scope">
              <div
                class="link-style"
                @click="handleEdit(scope.row, PageTypeMap.View)"
              >
                <div style="max-width: 140px">{{ scope.row.content }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="deadline"
            label="截止时间（倒计时）"
            min-width="200"
          >
            <template #default="scope">
              <span v-if="scope.row.deadline">
                {{ scope.row.deadline.slice(0, 16) }}
                <span
                  v-if="getDeadlineExtraText(scope.row)"
                  :style="{ color: getDeadlineExtraText(scope.row).color }"
                  >{{ `（${getDeadlineExtraText(scope.row).text}天）` }}</span
                >
              </span>
              <span v-else>-</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="type"
            :label="`分类${showPoint ? '（积分）' : ''}`"
            :formatter="formatter"
            min-width="140"
          />
          <el-table-column prop="desc" label="待办详情" min-width="220">
            <template #default="scope">
              {{ scope.row.desc || "--" }}
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作" width="300px">
            <template #default="scope">
              <el-button
                size="small"
                v-if="!scope.row.parentKey"
                @click="addChild(scope.row)"
                >新增子待办</el-button
              >
              <el-button
                size="small"
                plain
                type="primary"
                @click="handleEdit(scope.row, PageTypeMap.Edit)"
                >编辑</el-button
              >
              <el-popconfirm
                title="是否确认删除？"
                @confirm="handleDelete(scope.row)"
              >
                <template #reference>
                  <el-button size="small" plain type="danger">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button
                size="small"
                type="success"
                plain
                @click="completeTodo(scope.row)"
                >完成</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
  <el-dialog
    v-model="showDialog"
    :title="`【${currentParent?.content}】新增子待办：`"
  >
    <el-form :model="form">
      <el-form-item label="待办内容：" required>
        <el-input
          v-model="form.content"
          style="width: 350px"
          placeholder="请输入"
        />
      </el-form-item>
      <el-form-item label="待办详情：">
        <el-input
          v-model="form.desc"
          placeholder="请输入"
          type="textarea"
          :rows="4"
          style="width: 350px"
        />
      </el-form-item>
      <el-form-item label="待办类型：">
        <el-cascader
          v-model="form.type"
          :show-all-levels="false"
          :props="props"
          style="width: 250px"
          placeholder="请选择"
          :options="TypeCascadeOptions"
          @change="onTypeChange"
        />
      </el-form-item>
      <el-form-item label="截止时间：">
        <el-date-picker
          v-model="form.deadlineDate"
          type="date"
          placeholder="截止日期"
          style="width: 200px"
        />
        <span class="text-split">-</span>
        <el-time-select
          v-model="form.deadlineTime"
          start="00:00"
          step="00:30"
          end="23:30"
          placeholder="具体时间"
        />
      </el-form-item>
      <el-button :disabled="!form.content" type="primary" @click="onSubmit"
        >提交</el-button
      >
    </el-form>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { ElMessage, dayjs } from "element-plus";
import { useRouter } from "vue-router";
import api from "@/api";
import {
  TodoTypeScore,
  TodoTypeLabel,
  TodoStatusMap,
  TypeCascadeOptions,
  TodoTypeMap,
  PageTypeMap,
  formatCompletedTodo,
} from "@sparking/common";

const router = useRouter();

const onlyShowToday = ref(false);
const tableList = ref([]);
const showPoint = ref(false);
const currentParent = ref(null);
const showDialog = ref(false);
const form = ref({
  content: "",
  desc: "",
  type: [],
  score: undefined,
  deadlineTime: "",
  deadlineDate: "",
});
let totalList;

const props = {
  emitPath: false,
};

onMounted(() => {
  getData(true);
  getPointFlag();
});

const getPointFlag = async () => {
  const config = (await api.getConfigByKey("showPoint")) ?? true;
  showPoint.value = config;
};

const updateView = () => {
  getData();
};

const getData = async (isInit) => {
  const data = await api.getTodoList();
  tableList.value = formatData(data);
  totalList = tableList.value;
  if (!isInit && onlyShowToday.value) showTheTodayTodo(true);
};

const formatData = (data) => {
  const parentData = [],
    childrenData = [];
  for (let i = 0; i < data.length; i++) {
    const { parentKey, deadline, isRoot } = data[i];
    if (parentKey) {
      childrenData.push(data[i]);
    } else {
      // deadline逻辑：如果为父待办，截止时间为最近截止的子待办截止时间；否则为自己的截止时间
      parentData.push({
        ...data[i],
        children: [],
        deadline: isRoot ? null : deadline,
      });
    }
  }
  for (let i = 0; i < childrenData.length; i++) {
    const { parentKey, deadline } = childrenData[i];
    for (let j = 0; j < parentData.length; j++) {
      if (parentData[j].key === parentKey) {
        parentData[j].children.push(childrenData[i]);
        const parentDeadline = parentData[j].deadline ? dayjs(parentData[j].deadline).valueOf() : Number.MAX_VALUE;
        const newDeadLine = !parentDeadline && !deadline ? "" : Math.min(parentDeadline, dayjs(deadline).valueOf());
        parentData[j].deadline = deadline ? (newDeadLine ? dayjs(newDeadLine).format("YYYY-MM-DD HH:mm:ss") : "") : parentData[j].deadline;
      }
    }
  }
  return parentData.sort(api.sortFunc);
};

const addChild = async (row) => {
  currentParent.value = row;
  form.value.deadlineDate = row.deadline ? row.deadline.slice(0, 10) : "";
  form.value.deadlineTime = row.deadline ? row.deadline.slice(11, 16) : "";
  showDialog.value = true;
};

const onSubmit = async () => {
  const { content, desc, type, score, deadlineDate, deadlineTime } = form.value;
  const { cycleType, key } = currentParent.value;
  const createTime = Date.now();
  const deadline =
    deadlineDate && deadlineTime
      ? `${dayjs(deadlineDate).format("YYYY-MM-DD")} ${deadlineTime}:00`
      : '';

  const todoInfo = {
    content,
    createTime,
    deadline,
    status: 0,
    cycleType,
    score: score ? Number(score) : 0,
    type: type ? [type] : [TodoTypeMap.Undefined],
    desc,
    parentKey: key,
  };
  await api.addTodo(todoInfo);
  await api.updateTodo(key, { isRoot: true });
  ElMessage({
    message: "添加成功",
    type: "success",
  });
  updateView();
  showDialog.value = false;
};

const onTypeChange = (value) => {
  form.value.score = TodoTypeScore[value];
};

// const onRefreshCycleTodo = async () => {
//   const now = Date.now();
//   const data = await api.getTodoList();
//   for (let i = 0; i< data.length; i++) {
//     const { key, cycleType } = data[i];
//     const deadline = dayjs(data[i].deadline).valueOf();
//     if ([CycleMap.Everyday].includes(cycleType) && now > deadline) {
//       const todoInfo =  { status: TodoStatusMap.Undo, deadline: dayjs(now).add(1, 'day').format('YYYY-MM-DD 00:00:00') };
//       await api.updateTodo(key, todoInfo);
//     }
//   }
//   updateView();
//   ElMessage.success('刷新完成');
// }

const showTheTodayTodo = (value) => {
  onlyShowToday.value = value;
  if (value) {
    tableList.value = totalList.filter((item) => {
      const { deadline, status } = item;
      const todayEnding = dayjs().add(1, "day").format("YYYY-MM-DD 00:00:01");
      const isComplete = [
        TodoStatusMap.Done,
        TodoStatusMap.DoneButOverdue,
      ].includes(status);
      return (
        deadline &&
        dayjs(todayEnding).valueOf() > dayjs(deadline).valueOf() &&
        !isComplete
      );
    });
  } else {
    tableList.value = totalList;
  }
};

const formatter = (row) => {
  const { type, score } = row;
  const types = type.map((item) => TodoTypeLabel[item]).join(",");
  const scoreNew = score ?? type.reduce((a, b) => a + TodoTypeScore[b], 0);
  return `${types}${
    showPoint.value && !type.includes(TodoTypeMap.Undefined)
      ? `（+${scoreNew}）`
      : ""
  }`;
};

const getDeadlineExtraText = (row) => {
  const { deadline, status } = row;
  const diffDays = dayjs(deadline).diff(dayjs(), "day");
  let diffDaysText = diffDays;
  let color = "black";
  if (diffDays < 0) {
    diffDaysText = "逾期" + Math.abs(diffDays);
    color = "red";
  } else if (diffDays === 0) {
    diffDaysText = "<1";
    color = "red";
    if (dayjs(deadline).valueOf() < Date.now()) {
      diffDaysText = "逾期" + diffDaysText;
    }
  }
  const isComplete = [
    TodoStatusMap.Done,
    TodoStatusMap.DoneButOverdue,
  ].includes(status);
  return isComplete ? undefined : { text: diffDaysText, color };
};

const handleDelete = async (row) => {
  const { key } = row;
  await api.deleteTodo(key);
  ElMessage({
    message: "删除成功！",
    type: "success",
  });
  updateView();
};

const handleAdd = () => {
  router.push({
    path: "/todoAdd",
    query: {
      pageType: PageTypeMap.Add,
    },
  });
};

const handleEdit = (row, pageType) => {
  const { key } = row;
  router.push({
    path: "/todoEdit",
    query: {
      id: key,
      pageType,
    },
  });
};

const completeTodo = async (row) => {
  const { todoInfo, pointInfo } = formatCompletedTodo(row);
  await api.updateTodo(row.key, todoInfo);
  await api.addPoint(pointInfo);
  await updateView();
  ElMessage({
    message: "已更新",
    type: "success",
  });
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

.text-split {
  text-align: center;
  width: 50px;
}

.link-style {
  display: inline-block;
  cursor: pointer;
}
</style>
