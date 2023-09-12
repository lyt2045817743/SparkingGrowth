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
        <el-form-item label="书籍名称：" required>
          <el-input v-model="form.name" style="width: 350px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="作者：">
          <el-input v-model="form.author" style="width: 350px" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="类型：">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option v-for="item in BooksTypeOptions" :key="item.value" :label="item.label" :value="+item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="书籍状态：">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option v-for="item in BooksStatusOptions" :key="item.value" :label="item.label" :value="+item.value" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.status === BooksStatusMap.Abandon" label="弃读原因：">
          <el-input v-model="form.abandonReason" placeholder="请输入" type="textarea" :rows="2" style="width: 700px" />
        </el-form-item>
        <el-form-item label="百分比计算：">
          <el-radio-group v-model="form.percentType">
            <el-radio :label="1">按页数</el-radio>
            <el-radio :label="2">按章节数</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="form.percentType === 1 ? '页数：' : '章节数：'">
          <el-input v-model="form.totalCount" style="width: 100px" type="number" />
        </el-form-item>
        <el-form-item>
          <el-button :disabled="!form.name" type="primary" @click="onSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { addBook, getBookById, updateBook } from './serve.js';
import { BooksTypeOptions, BooksStatusOptions, BooksStatusMap } from './constant';

const route = useRoute();
const router = useRouter();
const { pageType, id: newId } = route.query;
const id = Number(newId);

const form = ref({
  name: '',
  author: '',
  type: '',
  percentType: 1,
  status: 1,
  totalCount: 0,
  abandonReason: ''
})

onMounted(() => {
  if (pageType === 'edit') {
    init();
  }
})

const init = async () => {
  const { name, author, type, percentType, status, abandonReason, totalCount } = await getBookById(id);
  form.value = Object.assign(form.value, { name, author, type, percentType, status, abandonReason, totalCount })
}

const onSubmit = async () => {
  const { name, author, type, percentType, status, abandonReason, totalCount } = form.value;
  const createTime = Date.now()
  const bookInfo = {
    name,
    author,
    status,
    type,
    percentType,
    totalCount: totalCount ? Number(totalCount) : 0
  };
  let message = '';
  if (pageType === 'edit') {
    if (abandonReason) {
      bookInfo.abandonReason = abandonReason;
    }
    await updateBook(id, bookInfo);
    message = '修改成功';
  } else {
    bookInfo.createTime = createTime;
    bookInfo.progressCount = 0;
    await addBook(bookInfo);
    message = '添加成功';
  }
  ElMessage({
    message,
    type: 'success',
  });
  router.push('/book');
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
