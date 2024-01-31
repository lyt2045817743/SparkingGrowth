<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div style="display: flex; align-items: center;">
          <el-breadcrumb class="breadcrumb">
            <el-breadcrumb-item :to="{path: '/activity'}">活动管理</el-breadcrumb-item>
            <el-breadcrumb-item v-if="+route.query.level > 0">分类管理</el-breadcrumb-item>
            <el-breadcrumb-item v-if="+route.query.level > 1">内容管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div style="display: flex; align-items: center;">
          <el-button class="add-btn" type="primary" round @click="handleAdd">新增{{ route.query.level ? LevelName[+route.query.level] : '一级活动' }}</el-button>
          <el-button v-if="route.query.level" class="back-btn" type="info" round @click="router.go(-1);">返回</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <el-table :data="tableList">
          <el-table-column type="index" label="序号" min-width="60" />
          <el-table-column prop="name" label="一级活动名称" min-width="200" />
          <el-table-column prop="score" label="意义分值（分）" min-width="150" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" :formatter="formatter" />
          <el-table-column prop="type" label="来源" min-width="150">
            <template #default="scope">
              {{ scope.row.type ?? '自定义' }}
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作" min-width="220px">
            <template #default="scope">
                <el-button
                  size="small"
                  v-if="+scope.row.level < 3"
                  @click="addChild(scope.row)"
                  >管理{{ LevelName[scope.row.level] }}</el-button
                >
                <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <!-- <el-popconfirm title="是否确认删除？" @confirm="handleDelete(scope.row)">
                  <template #reference>
                    <el-button :disabled="scope.row.type === 'system'" size="small" type="danger">删除</el-button>
                  </template>
                </el-popconfirm> -->
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
        <el-rate
          v-model="form.score"
          allow-half
          show-text
          show-score
          text-color="#ff9900"
          score-template="{value}分"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
        />
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
import { useRouter, useRoute } from 'vue-router';
import { dayjs, ElMessage } from 'element-plus';
import api from '@/api';

const formLabelWidth = '140px';
const router = useRouter();
const route = useRoute();
const dialogFormVisible = ref(false);
const form = ref({
  score: undefined,
  name: '',
  level: undefined,
});
const tableList = ref([]);
const LevelName = {
  1: '分类',
  2: '内容'
}

onMounted(() => {
  getData();
})

const getData = async () => {
  const data = await api.getActivityList();
  let filterFn = (item) => item.level === 1;
  const { level, resourceType, id } = route.query;
  console.log(id, level, resourceType);
  if (+level === 1 && resourceType) {
    filterFn = (item) => item.resourceType === resourceType && item.level === 2;
  } else if (+level === 2 && ['book', 'course'].includes(resourceType)) {
    console.log('hh');
  } else if (+level > 0) {
    filterFn = (item) => item.parentId === +id;
  }
  tableList.value = data.filter(filterFn);

  getParent(data);
}

const parent = ref({});
const getParent = (data) => {
  const { level, resourceType, id: parentId } = route.query;
  if (!parentId && +level === 1) {
    parent.value = data.find((item) => item.level === 1 && item.resourceType === resourceType);
  }
}

const formatter = (row) => {
  return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss');
};

const onEdit = async () => {
  const { name, score, id } = form.value;
  const activityInfo = {
    createTime: Date.now(),
    name,
    score,
  }
  if (id === undefined) {
    const { level, resourceType, id: parentId } = route.query;
    activityInfo.level = level ? +level + 1 : 1;
    activityInfo.resourceType = resourceType;
    activityInfo.parentId = parentId ? +parentId : (parent.value ? parent.value.id : undefined);
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

const addChild = (row) => {
  const { id, level, resourceType } = row;
  if (row.level !== 2 || !['book', 'course'].includes(row.resourceType)) {
    const query = { id, level, resourceType };
    router.push({
      path: '/activityCate',
      query
    });
  } else if (row.resourceType === 'book') {
    router.push(`/book?id=${row.id}`);
  } else if (row.resourceType === 'course') {
    router.push(`/list?id=${row.id}`);
  }
}

const handleEdit = async (row) => {
  const { name, score, id } = row;
  form.value.name = name;
  form.value.score = score;
  form.value.id = id;
  dialogFormVisible.value = true;
}

// const handleDelete = async (row) => {
//   const { id } = row;
//   await api.deleteActivity(id);
//   ElMessage.success('删除成功！');
//   getData();
// };
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
