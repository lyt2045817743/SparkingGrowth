<template>
  <el-table :data="tableList">
    <el-table-column prop="id" label="课程ID" />
    <el-table-column prop="name" label="课程名称" />
    <el-table-column prop="type" label="课程类型">
      <template #default="scope">
        {{ CourseTitleMap[scope.row.type] }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
// import HelloWorld from '../../components/HelloWorld.vue';
import { onMounted, ref } from 'vue';
import { getCourseList } from './sever';
import { CourseTitleMap } from '../../common';

const tableList = ref([]);

onMounted(() => {
  getData();
})

async function getData() {
  tableList.value = await getCourseList();
}

</script>

<style lang="scss" scoped></style>
