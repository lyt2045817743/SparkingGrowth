<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div style="display: flex; align-items: center;">
          <el-breadcrumb class="breadcrumb">
            <el-breadcrumb-item>活动管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div style="display: flex; align-items: center;">
          <el-button class="add-btn" type="primary" round @click="handleAdd">新增一级活动</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <el-table :data="tableList">
          <el-table-column type="index" label="序号" min-width="60" />
          <el-table-column prop="name" label="活动名称" min-width="200" />
          <el-table-column prop="score" label="意义分值" min-width="150" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" :formatter="formatter" />
          <el-table-column align="right" label="操作" min-width="220px">
            <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-popconfirm title="是否确认删除？" @confirm="handleDelete(scope.row)">
                  <template #reference>
                    <el-button size="small" type="danger">删除</el-button>
                  </template>
                </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
  <el-dialog v-model="dialogFormVisible" title="新建活动">
    <el-form :model="form">
      <el-form-item label="活动名称：" :label-width="formLabelWidth" required>
        <el-input v-model="form.name" style="width: 300px" />
      </el-form-item>
      <el-form-item label="意义分值：" :label-width="formLabelWidth" required>
        <el-input v-model="form.score" type="number" style="width: 100px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onEdit">
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { dayjs, ElMessage } from 'element-plus';
import api from '@/api';

const formLabelWidth = '140px';

const dialogFormVisible = ref(false);
const form = ref({
  score: undefined,
  name: '',
});
const tableList = ref([]);

onMounted(() => {
  getData();
})

const getData = async () => {
  tableList.value = await api.getActivityList();
}

const formatter = (row) => {
  return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss');
};

const onEdit = async () => {
  const { name, score, id } = form.value;
  const activityInfo = {
    createTime: Date.now(),
    name,
    score
  }
  if (id === undefined) {
    await api.addActivity(activityInfo);
    ElMessage.success('添加成功！');
  } else {
    await api.updateActivity(id, { name, score });
    ElMessage.success('修改成功！');
  }
  getData();
  dialogFormVisible.value = false;
}

const handleAdd = () => {
  form.value.name = '';
  form.value.score = undefined;
  delete form.value.id;
  dialogFormVisible.value = true;
}

const handleEdit = async (row) => {
  const { name, score, id } = row;
  form.value.name = name;
  form.value.score = score;
  form.value.id = id;
  dialogFormVisible.value = true;
}

const handleDelete = async (row) => {
  const { id } = row;
  await api.deleteActivity(id);
  ElMessage.success('删除成功！');
  getData();
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
