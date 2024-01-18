<template>
  <div class="container">
    <Calendar
      v-if="currentViewType === CalendarViewType.Month"
      :viewType="configs.monthView.viewType"
      :menuData="configs.monthView.menuData"
      @loadData="loadTodoData"
      @onClick="pushTodoDetail"
      @onDateSelect="onTodoDateSelect"
      @onEventDrop="onTodoEventDrop"
    />
    <Calendar v-else :viewType="configs.weekView.viewType" />
    <el-select style="position: absolute;top: 10px;width: 200px; right: 0" v-model="currentViewType">
      <el-option label="待办日历" :value="CalendarViewType.Month" />
      <el-option label="时间追踪日历" :value="CalendarViewType.Week" />
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Calendar from '../../components/Calendar/index.vue';
import { CalendarViewType } from '../../components/Calendar/constant';
import { getTodoList, updateTodo, deleteTodo } from './serve';
import { TodoStatusMap } from './constant';
import { dayjs } from 'element-plus';

const currentViewType = ref(CalendarViewType.Month);
const configs = {
  monthView: {
    viewType: [CalendarViewType.Month],
    menuData: [
      {
        name: '查看详情',
        onClick: (targetEle) => {
          const id = targetEle.fcSeg.eventRange.def.publicId;
          pushTodoDetail({ id, pageType: 3 });
        }
      },
      {
        name: '编辑',
        onClick: (targetEle) => {
          const id = targetEle.fcSeg.eventRange.def.publicId;
          pushTodoDetail({ id, pageType: 2 });
        }
      },
      {
        name: '完成',
        type: 'success',
        disabled: (targetEle) => {
          if (!targetEle) { return false; }
          const { status } = targetEle.fcSeg.eventRange.def.extendedProps;
          if (status === TodoStatusMap.Done || status === TodoStatusMap.DoneButOverdue) {
            return true;
          }
          return false;
        },
        onClick: (targetEle) => {
          const id = targetEle.fcSeg.eventRange.def.publicId;
          console.log(targetEle.fcSeg.eventRange, id);
          console.log('完成');
        }
      },
      {
        name: '删除',
        type: 'danger',
        onClick: (targetEle) => {
          const id = targetEle.fcSeg.eventRange.def.publicId;
          deleteTodo(+id);
        }
      }
    ],
  },
  weekView: {
    viewType: [CalendarViewType.Week]
  }
}

const loadTodoData = async (successCb) => {
  const data = await getTodoList();
  // console.log(data);

  const calendarData = data.map((item) => {
    const { key, content, deadline, startTime, status } = item;
    return {
      id: key,
      title: content,
      start: startTime || deadline,
      end: startTime ? deadline : dayjs(deadline).add(0.5, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      status,
      className: status === TodoStatusMap.Done || status === TodoStatusMap.DoneButOverdue ? 'line-through' : '',
      pastEventClassName: status === TodoStatusMap.Undo || status === TodoStatusMap.Overdue ? 'red-text' : ''
    }
  })

  successCb(calendarData);
}

const pushTodoDetail = (info) => {
  window.open(`/course_config/todoEdit?id=${info.id}&pageType=${info.pageType}`);
}

const onTodoDateSelect = (info) => {
  const { startTime } = info;
  const deadline = dayjs(startTime).valueOf();
  window.open(`/course_config/todoEdit?&deadline=${deadline}&configType=1&pageType=1`);
}

const onTodoEventDrop = (info) => {
  const { id, end } = info.event;
  const deadline = dayjs(end).format('YYYY-MM-DD HH:mm:ss');
  updateTodo(+id, { deadline });
}
</script>

<style lang="scss" scoped>
.container {
  margin: 20px auto;
  height: calc(100vh - 100px);
  // overflow: hidden;
  width: calc(100% - 20px);
  position: relative;
}
</style>
