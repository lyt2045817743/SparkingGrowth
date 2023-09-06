<template>
  <el-container>
    <el-header class="header">
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item :to="{ path: '/todo' }">待办列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{ pageType === 'edit' ? '编辑' : '新增' }}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="back-btn" type="info" round @click="onCancel">返回</el-button>
    </el-header>
    <el-main>
      <el-form :model="form" label-width="120px">
        <el-form-item v-if="pageType !== 'edit'" label="配置方式：" required>
          <el-radio-group v-model="form.configType">
            <el-radio :label="0">简单配置</el-radio>
            <el-radio :label="1">完整配置</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="待办内容：" required>
          <el-input v-model="form.content" style="width: 350px" placeholder="请输入" />
        </el-form-item>
        <div v-if="form.configType === 1">
          <el-form-item label="待办类型：">
            <el-cascader v-model="form.type" collapse-tags collapse-tags-tooltip :props="props" style="width: 250px" placeholder="请选择" :options="TypeCascadeOptions" />
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
          <el-form-item label="待办详情：">
            <el-input v-model="form.desc" placeholder="请输入" type="textarea" :rows="4" style="width: 700px" />
          </el-form-item>
        </div>
        <el-form-item>
          <el-button :disabled="!form.content" type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage, dayjs } from 'element-plus';
import { addTodo, getTodoById, updateTodo } from './serve.js';
import { TodoTypeMap, TypeCascadeOptions } from './constant';

const route = useRoute();
const router = useRouter();
const { pageType, id: newId } = route.query;
const id = Number(newId);

const form = ref({
  configType: 1,
  content: '',
  deadlineDate: '',
  deadlineTime: '',
  desc: '',
  type: []
})

const props = {
  multiple: true,
  emitPath: false
};

onMounted(() => {
  if (pageType === 'edit') {
    init();
  } else {
    form.value.configType = 0
  }
})

const init = async () => {
  const { content, createTime, deadline, desc, type, status } = await getTodoById(id);
  const deadlineDate = deadline.slice(0, 10)
  const deadlineTime = deadline.slice(11, 16)
  form.value = Object.assign(form.value, { content, createTime, desc, type, status, deadlineDate, deadlineTime })
}

const onSubmit = async () => {
  const { content, desc, type, deadlineDate, deadlineTime } = form.value;
  const createTime = Date.now()
  const deadline = deadlineDate && deadlineTime ? `${dayjs(deadlineDate).format('YYYY-MM-DD')} ${deadlineTime}:00` : '';
  const todoInfo = {
    content,
    createTime,
    deadline: deadline || dayjs(createTime).add(1, 'day').format('YYYY-MM-DD 00:00:00'),
    status: 0,
    type: type.includes(TodoTypeMap.Undefined) ? [TodoTypeMap.Undefined] : type,
    desc
  };
  let message = '添加成功';
  if (pageType === 'edit') {
    delete todoInfo.createTime;
    delete todoInfo.status;
    await updateTodo(id, todoInfo);
    message = '修改成功';
  } else {
    await addTodo(todoInfo);
  }
  ElMessage({
    message,
    type: 'success',
  });
  router.push('/todo');
}

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
</style>
