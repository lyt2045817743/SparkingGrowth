<template>
  <div class="container">
    <Calendar
      v-if="currentViewType === CalendarViewType.Month"
      ref="todoCalendarRef"
      :viewType="configs.monthView.viewType"
      :menuDataMap="configs.monthView.menuDataMap"
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

<script setup>
import { ref } from 'vue';
import Calendar from '../../components/Calendar/index.vue';
import { CalendarViewType } from '../../components/Calendar/constant';
import { TargetClassNameMap } from '../../components/ContextMenu/config'; 
import { dayjs } from 'element-plus';
import { TodoStatusMap, indexDBApi, formatCompletedTodo } from '@sparking/common';

const { getChildTodoList, updateTodo, deleteTodo, addPoint } = indexDBApi ?? {};

const todoCalendarRef = ref(null);
const currentViewType = ref(CalendarViewType.Month);
const configs = {
  monthView: {
    viewType: [CalendarViewType.Month],
    menuDataMap: {
      [TargetClassNameMap.Event]: [
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
          onClick: async (targetEle) => {
            const { publicId: key, extendedProps } = targetEle.fcSeg.eventRange.def;
            const { pointInfo, todoInfo } = formatCompletedTodo({ key: +key, ...extendedProps });
            await updateTodo(+key, todoInfo);
            await addPoint(pointInfo);
            todoCalendarRef.value.onRefreshEvents();
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
      [TargetClassNameMap.DayContainer]: [
        {
          name: '新增',
          onClick: (targetEle) => {
            const deadlineDate = targetEle.parentNode.dataset.date;
            pushTodoDetail({ deadline: dayjs(`${deadlineDate} 00:00:00`).valueOf(), pageType: 1, configType: 1 })
          }
        }
      ]
    },
  },
  weekView: {
    viewType: [CalendarViewType.Week]
  }
}

const loadTodoData = async (successCb) => {
  const data = await getChildTodoList();
  // console.log(data);

  const calendarData = data.map((item) => {
    const { key, content, deadline, startTime, status, type, score, cycleType } = item;
    return {
      id: key,
      title: content,
      start: startTime || deadline,
      end: startTime ? deadline : dayjs(deadline).add(0.5, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      status,
      deadline,
      type,
      score,
      cycleType,
      className: status === TodoStatusMap.Done || status === TodoStatusMap.DoneButOverdue ? 'line-through' : '',
      pastEventClassName: status === TodoStatusMap.Undo || status === TodoStatusMap.Overdue ? 'red-text' : ''
    }
  })

  successCb(calendarData);
}

const pushTodoDetail = (info) => {
  window.open(`/course_config/todoEdit?id=${info.id}&pageType=${info.pageType}&deadline=${info.deadline}&configType=${info.configType}`);
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
