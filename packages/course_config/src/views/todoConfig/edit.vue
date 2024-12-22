<template>
  <el-container>
    <el-header class="header">
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/todo' }"
          >待办列表</el-breadcrumb-item
        >
        <el-breadcrumb-item>{{ PageTypeLabel[pageType] }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="back-btn" type="info" round @click="onCancel"
        >返回</el-button
      >
    </el-header>
    <el-main>
      <el-form
        :model="form"
        :disabled="pageType === PageTypeMap.View"
        label-width="130px"
      >
        <el-form-item
          v-if="pageType === PageTypeMap.Add"
          label="配置方式："
          required
        >
          <el-radio-group v-model="form.configType">
            <el-radio label="0">简单配置</el-radio>
            <el-radio label="1">完整配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="待办内容：" required>
          <el-input
            v-model="form.content"
            style="width: 350px"
            placeholder="请输入"
          />
          <div v-if="parentInfo.content" style="margin-left: 15px">
            （父待办内容：{{ parentInfo.content }}）
          </div>
        </el-form-item>
        <el-form-item label="关联活动/资源：">
          <el-cascader
            v-model="form.type"
            collapse-tags
            collapse-tags-tooltip
            :show-all-levels="false"
            :props="props"
            filterable
            style="width: 250px"
            placeholder="请选择"
            :options="typeCascadeOptions"
          />
          <el-button style="margin-left: 10px;" type="primary" link @click="openCateManager">编辑活动</el-button>
        </el-form-item>
        <div v-if="form.configType === '1'">
          <el-form-item
            v-if="form.desc || pageType !== PageTypeMap.View"
            label="待办详情："
          >
            <el-input
              v-if="pageType !== PageTypeMap.View"
              v-model="form.desc"
              placeholder="请输入"
              type="textarea"
              :rows="4"
              style="width: 700px"
            />
            <div class="desc-view" v-else>{{ form.desc }}</div>
          </el-form-item>
          <el-form-item label="截止时间：">
            <el-date-picker
              v-model="form.deadlineDate"
              type="date"
              placeholder="截止日期"
              style="width: 300px"
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
          <el-form-item label="是否循环：">
            <el-select v-model="form.cycleType" placeholder="请选择">
              <el-option
                v-for="item in CycleOptions"
                :key="item.value"
                :label="item.label"
                :value="+item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="!form.parentKey" label="关联子待办：">
            <div v-if="pageType === PageTypeMap.View">
              <el-table
                :data="
                  todoList.filter((item) =>
                    form.childrenTodo?.includes(item.key)
                  )
                "
              >
                <el-table-column
                  prop="content"
                  label="待办内容"
                  min-width="350"
                >
                  <template #default="scope">
                    <div
                      class="link-style"
                      @click="handleEdit(scope.row, PageTypeMap.Edit)"
                    >
                      <div>{{ scope.row.content }}</div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="desc" label="待办详情" width="400">
                  <template #default="scope">
                    {{ scope.row.desc || "--" }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-select
              v-else
              v-model="form.childrenTodo"
              collapse-tags
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in todoList"
                :key="item.key"
                :label="item.content"
                :value="+item.key"
              />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button
            v-if="pageType !== PageTypeMap.View"
            :disabled="!form.content"
            type="primary"
            @click="onSubmit"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, dayjs } from "element-plus";
import api from "@/api";
import useActivityOption from "@/hooks/useActivityOption";
import {
  PageTypeLabel,
  PageTypeMap,
  TodoTypeMap,
  CycleOptions,
} from "@sparking/common";

const { typeCascadeOptions } = useActivityOption();
const route = useRoute();
const router = useRouter();
const { pageType: newPageType, id: newId, configType, deadline } = route.query;
const id = Number(newId);
const pageType = Number(newPageType);
const deadlineDate = deadline
  ? dayjs(+deadline).format("YYYY-MM-DD 00:00:00")
  : "";
const deadlineTime = deadline ? "23:30" : "";

const todoList = ref([]);
const form = ref({
  configType: configType ?? "1",
  content: "",
  deadlineDate,
  deadlineTime,
  desc: "",
  type: "",
  cycleType: 0,
  childrenTodo: [],
});

const props = {
  emitPath: false,
  checkStrictly: true,
  value: 'id',
  label: 'name'
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

onMounted(() => {
  if (pageType !== PageTypeMap.Add) {
    init();
  } else if (configType !== "1") {
    form.value.configType = "0";
  }
  getTodoData();
});

const init = async () => {
  const {
    content,
    createTime,
    deadline,
    desc,
    type,
    status,
    cycleType,
    parentKey,
    key,
    isRoot,
  } = await api.getTodoById(id);
  const deadlineDate = deadline ? deadline.slice(0, 10) : "";
  const deadlineTime = deadline ? deadline.slice(11, 16) : "";
  form.value = Object.assign(form.value, {
    content,
    createTime,
    desc,
    type: type[0],
    status,
    deadlineDate,
    deadlineTime,
    parentKey,
    cycleType: cycleType ?? 0,
    key,
    isRoot,
  });
};

const parentInfo = ref("");
const getTodoData = async () => {
  const data = await api.getTodoList();
  const todoListTemp = [];
  const childTodoList = [];
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (
      (!item.parentKey && !item.isRoot && item.key !== form.value.key) ||
      (form.value.key && item.parentKey === form.value.key)
    ) {
      todoListTemp.push(item);
    }
    if (form.value.key && item.parentKey === form.value.key) {
      childTodoList.push(item.key);
    }
    if (item.key === form.value.parentKey) {
      parentInfo.value = item;
    }
  }
  todoList.value = todoListTemp;
  form.value.childrenTodo = childTodoList;
};

const openCateManager = async () => {
  window.open('/course_config/activity');
}

const updateChildTodo = async (parentTodo, parentKey) => {
  const { childrenTodo } = form.value;
  for (let i = 0; i < childrenTodo.length; i++) {
    const { key, deadline = 0 } = todoList.value.find(
      (item) => item.key === childrenTodo[i]
    );
    const newDeadLine = dayjs(
      Math.max(
        dayjs(parentTodo.deadline ?? 0).valueOf(),
        dayjs(deadline).valueOf()
      )
    ).format("YYYY-MM-DD HH:mm:ss");
    await api.updateTodo(key, {
      parentKey,
      deadline: parentTodo.deadline && deadline ? newDeadLine : "",
    });
  }
  for (let j = 0; j < todoList.value.length; j++) {
    if (!childrenTodo.find((item) => item === todoList.value[j].key)) {
      await api.updateTodo(todoList.value[j].key, { parentKey: null });
    }
  }
};

const onSubmit = async () => {
  const {
    content,
    desc,
    type,
    deadlineDate,
    deadlineTime,
    cycleType,
    childrenTodo,
    key: parentKey,
  } = form.value;
  const createTime = Date.now();
  const deadline =
    deadlineDate && deadlineTime
      ? `${dayjs(deadlineDate).format("YYYY-MM-DD")} ${deadlineTime}:00`
      : "";
  const todoInfo = {
    content,
    createTime,
    deadline,
    status: 0,
    cycleType,
    type: type ? [type] : [TodoTypeMap.Undefined],
    desc,
    isRoot: Boolean(childrenTodo.length),
  };
  let message = "添加成功";
  if (pageType === PageTypeMap.Edit) {
    delete todoInfo.createTime;
    delete todoInfo.status;
    await api.updateTodo(id, todoInfo);
    await updateChildTodo(todoInfo, parentKey);
    message = "修改成功";
  } else {
    const newKey = await api.addTodo(todoInfo);
    await updateChildTodo(todoInfo, newKey);
  }
  ElMessage({
    message,
    type: "success",
  });
  router.push("/todo");
};

const onCancel = () => {
  router.go(-1);
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
.text-split {
  text-align: center;
  width: 50px;
}

.desc-view {
  border: 1px solid #dcdfe6;
  padding: 0 8px;
  white-space: pre-line;
}
.link-style {
  display: inline-block;
  cursor: pointer;
}
.el-select {
  width: 300px;
}
</style>
