<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div style="display: flex; align-items: center;">
          <h5>书籍列表</h5>
        </div>
        <div style="display: flex; align-items: center;">
          <el-button round>类型管理</el-button>
          <el-button class="add-btn" type="primary" round @click="addHandle">新增书籍</el-button>
        </div>
      </el-header>
      <el-main class="main">
        <el-table :data="tableList" row-key="id">
          <el-table-column type="index" label="序号" min-width="60" />
          <el-table-column prop="name" label="书籍名称" min-width="150" />
          <el-table-column prop="author" label="作者" min-width="80" />
          <el-table-column prop="type" label="书籍类型" min-width="100">
            <template #default="scope">
              {{ BooksTypeLabel[scope.row.type] ?? '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="书籍状态" min-width="100">
            <template #default="scope">
              {{ BooksStatusLabel[scope.row.status] ?? '--' }}
            </template>
          </el-table-column>
          <el-table-column prop="percent" label="当前阅读进度" min-width="180">
            <template #default="scope">
              <el-progress :percentage="getPercent(scope.row)" :status="scope.row.progressCount >= scope.row.totalCount ? 'success': ''" />
            </template>
          </el-table-column>
          <el-table-column align="right" label="操作" width="200px">
            <template #default="scope">
              <el-button v-if="scope.row.status !== BooksStatusMap.Done" size="small" type="primary" plain @click="onVisibleChange(scope.row)">更新进度</el-button>
              <el-button size="small" @click="editHandle(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
  <el-dialog v-model="showDialog" :title="`修改${currentBookInfo.name}阅读进度：`">
    <el-form v-if="currentBookInfo.totalCount" :model="form">
      <el-form-item :label="`已读${currentBookInfo.percentType === 1 ? '页数' : '章节数'}：`" required>
        <el-input v-model="form.progressCount" type="number" style="width: 200px" />
        <span style="margin-left: 5px;">/ {{ currentBookInfo.totalCount }}</span>
      </el-form-item>
    </el-form>
    <div v-else>请先完善书籍页数/章节数</div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showDialog = false">取消</el-button>
        <el-button v-if="currentBookInfo.totalCount" type="primary" :disabled="!form.progressCount" @click="onProgressChange">
          确定
        </el-button>
        <el-button v-else type="primary" @click="editHandle(currentBookInfo)">去完善</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getBookList, updateBook } from './serve';
import { BooksTypeLabel, BooksStatusLabel, BooksStatusMap } from './constant';
import { ElMessage } from 'element-plus';

const router = useRouter();

const tableList = ref([]);
const currentBookInfo = ref({});
const showDialog = ref(false);
const form = ref({
  progressCount: ''
})

onMounted(() => {
  getData();
})

const getData = async () => {
  tableList.value = await getBookList();
}

const getPercent = (row) => {
  const { progressCount, totalCount } = row;
  return progressCount && totalCount ? Math.floor(progressCount / totalCount * 100) : 0;
}

const addHandle = () => {
  router.push({
    path: '/bookAdd',
    query: {
      pageType: 'add'
    }
  })
};

const editHandle = (row) => {
  router.push({
    path: '/bookEdit',
    query: {
      pageType: 'edit',
      id: row.id
    }
  })
}

const onVisibleChange = (row) => {
  currentBookInfo.value = row;
  showDialog.value = true;
  form.value.progressCount = row.progressCount;
}

const onProgressChange = async () => {
  const { progressCount: progress } = form.value;
  const { status, totalCount } = currentBookInfo.value;
  const progressCount = Number(progress);
  const isFinish = progressCount === totalCount;
  const isReading = progressCount > 0;
  const bookInfo = {
    progressCount,
    status: isFinish ? BooksStatusMap.Done : isReading ? BooksStatusMap.Reading : status
  }
  await updateBook(currentBookInfo.value.id, bookInfo);
  ElMessage.success('更新成功');
  showDialog.value = false;
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

.extra-point-dialog {
  padding-top: 0;
}

.common-layout {
  :deep(.el-table .cell) {
    white-space: pre-line;
  }
}
</style>
