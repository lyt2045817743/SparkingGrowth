<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div style="display: flex; align-items: center;">
          <el-breadcrumb class="breadcrumb">
            <el-breadcrumb-item :to="{ path: '/point' }">积分记录</el-breadcrumb-item>
            <el-breadcrumb-item>兑换活动</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- <span style="color: #606266; font-size: 14px;">（可用积分：{{ point }}）</span> -->
        </div>
        <div style="display: flex; align-items: center;">
          <el-button class="add-btn" type="primary" round @click="handleAdd">新增活动</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <el-table :data="tableList">
          <el-table-column type="index" label="序号" min-width="60" />
          <el-table-column prop="name" label="活动名称" min-width="200" />
          <el-table-column prop="costScore" label="所需积分" min-width="150" />
          <el-table-column prop="createTime" label="创建时间" min-width="180" :formatter="formatter" />
          <el-table-column prop="count" label="已兑换次数" min-width="180" />
          <el-table-column align="right" label="操作" min-width="220px">
            <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                <el-popconfirm title="是否确认删除？" @confirm="handleDelete(scope.row)">
                  <template #reference>
                    <el-button size="small" type="danger">删除</el-button>
                  </template>
                </el-popconfirm>
                <el-popconfirm :title="`确认花费${scope.row.costScore}积分兑换？`" @confirm="onExchange(scope.row)">
                  <template #reference>
                    <el-button size="small" type="warning" plain>兑换</el-button>
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
      <el-form-item label="所需积分：" :label-width="formLabelWidth" required>
        <el-input v-model="form.costScore" type="number" style="width: 100px" />
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
import { addActivity, getActivityList, updateActivity, deleteActivity } from './serve';
import { addPoint } from '../todoConfig/serve';
import { PointEventTypeMap } from '../../constant'


const formLabelWidth = '140px';

const dialogFormVisible = ref(false);
const form = ref({
  costScore: undefined,
  name: '',
});
const tableList = ref([]);

onMounted(() => {
  getData();
})

const getData = async () => {
  tableList.value = await getActivityList();
}

const formatter = (row) => {
  return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss');
};

const onExchange = async (row) => {
  const { costScore, id, count } = row;
  const pointInfo = {
    eventId: id,
    eventType: PointEventTypeMap.Exchange,
    score: 0 - costScore,
    createTime: Date.now()
  };
  await addPoint(pointInfo);
  await updateActivity(id, { count: count + 1 });
  ElMessage.success('兑换成功！');
  getData();
}

const onEdit = async () => {
  const { name, costScore, id } = form.value;
  const activityInfo = {
    createTime: Date.now(),
    name,
    count: 0,
    costScore
  }
  if (id === undefined) {
    await addActivity(activityInfo);
    ElMessage.success('添加成功！');
  } else {
    await updateActivity(id, { name, costScore });
    ElMessage.success('修改成功！');
  }
  getData();
  dialogFormVisible.value = false;
}

const handleAdd = () => {
  form.value.name = '';
  form.value.costScore = undefined;
  delete form.value.id;
  dialogFormVisible.value = true;
}

const handleEdit = async (row) => {
  const { name, costScore, id } = row;
  form.value.name = name;
  form.value.costScore = costScore;
  form.value.id = id;
  dialogFormVisible.value = true;
}

const handleDelete = async (row) => {
  const { id } = row;
  await deleteActivity(id);
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
