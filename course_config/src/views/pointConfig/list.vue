<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div style="display: flex; align-items: center;">
          <h5>积分记录</h5>
          <h5>（当前积分：{{ totalPoint }}）</h5>
        </div>
        <div style="display: flex; align-items: center;">
          <el-button class="add-btn" type="primary" round @click="handleExchange">兑换活动</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <el-table :data="tableList">
          <el-table-column type="index" label="序号" min-width="60" />
          <el-table-column prop="eventName" label="记录内容" min-width="150" />
          <el-table-column prop="score" label="分值" min-width="80">
            <template #default="scope">
              {{  `${scope.row.score > 0 ? '+' : ''}${scope.row.score}` }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="完成时间" min-width="180" :formatter="formatter" />
          <el-table-column prop="type" label="积分类型" min-width="100">
            <template #default="scope">
              {{ PointEventTypeLabel[scope.row.eventType] }}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { dayjs } from 'element-plus';
import { useRouter } from 'vue-router';
import { getPointList } from './serve';
import { PointEventTypeLabel } from '../../constant';

const router = useRouter();

const totalPoint = ref(0);
const tableList = ref([]);

onMounted(() => {
  getData();
})

const getData = async () => {
  const { data, total } = await getPointList();
  tableList.value = data;
  console.log(data, totalPoint);
  totalPoint.value = total;
}

const formatter = (row) => {
  return dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss');
}

const handleExchange = () => {
  router.push({
    path: '/todoAdd',
    query: {
      pageType: 'add'
    }
  })
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
</style>
