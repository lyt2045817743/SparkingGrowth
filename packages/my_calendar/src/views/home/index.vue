<template>
  <div class="container">
    <Calendar v-if="currentViewType === CalendarViewType.Month" :viewType="configs.monthView.viewType" @loadData="loadTodoData" @onClick="pushTodoDetail" />
    <Calendar v-else="currentViewType === CalendarViewType.Week" :viewType="configs.weekView.viewType" />
    <el-select style="position: absolute;top: 10px;width: 200px; right: 0" v-model="currentViewType">
      <el-option label="待办日历" :value="CalendarViewType.Month" />
      <el-option label="时间追踪日历" :value="CalendarViewType.Week" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Calendar from '@/components/Calendar/index.vue';
import { CalendarViewType } from '../../components/Calendar/constant';
import { getTodoList } from './serve';
import { dayjs } from 'element-plus';

const currentViewType = ref(CalendarViewType.Month);
const configs = {
    monthView: {
      viewType: [CalendarViewType.Month]
    },
    weekView: {
      viewType: [CalendarViewType.Week]
    }
  }

  const loadTodoData = async (successCb) => {
    const data = await getTodoList();
    // console.log(data);

    const calendarData = data.map((item) => {
      const { key, content, deadline, startTime } = item;
      return {
        id: key,
        title: content,
        start: startTime || deadline,
        end: startTime ? deadline : dayjs(deadline).add(0.5, 'hour').format('YYYY-MM-DD HH:mm:ss')
      }
    })

    successCb(calendarData);
  }

  const pushTodoDetail = (info) => {
    window.open(`/course_config/todoEdit?id=${info.id}&pageType=2`)
  }
</script>

<style lang="scss" scoped>
.container {
  margin: 20px auto;
  height: calc(100vh - 100px);
  // overflow: hidden;
  width: 1040px;
  position: relative;
}
</style>
