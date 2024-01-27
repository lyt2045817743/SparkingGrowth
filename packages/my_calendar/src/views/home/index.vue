<template>
  <div class="container">
    <Calendar v-if="currentViewType === CalendarViewType.Month" ref="todoCalendarRef" :config="configs.monthView"
      @loadData="loadTodoData" @loadDraggableData="loadUnscheduledTodo" />
    <Calendar v-else :config="configs.weekView" />
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
import { TodoStatusMap, formatCompletedTodo, getFullUrl } from '@sparking/common';
import api from '@/api';

const todoCalendarRef = ref(null);
const currentViewType = ref(CalendarViewType.Month);

const judgeIsFinish = (targetEle) => {
  if (!targetEle) { return false; }
  const { status, deadline } = getEventData(targetEle);
  if (status === TodoStatusMap.Done || status === TodoStatusMap.DoneButOverdue || !deadline) {
    return true;
  }
  return false;
}

const onTodoEventDrop = (info) => {
  const { id, end } = info.event;
  const deadline = dayjs(end).format('YYYY-MM-DD HH:mm:ss');
  api.updateTodo(+id, { deadline });
}
const configs = {
  monthView: {
    initialView: [CalendarViewType.Month],
    showDraggableBox: true,
    menuDataMap: {
      [TargetClassNameMap.Event]: [
        {
          name: '查看详情',
          onClick: (targetEle) => {
            const { key } = getEventData(targetEle);
            pushTodoDetail({ id: key, pageType: 3 });
          }
        },
        {
          name: '编辑',
          onClick: (targetEle) => {
            const { key } = getEventData(targetEle);
            pushTodoDetail({ id: key, pageType: 2 });
          }
        },
        {
          name: '调整为待安排',
          disabled: judgeIsFinish,
          onClick: async (targetEle) => {
            const { key } = getEventData(targetEle);
            await api.updateTodo(+key, { deadline: "" });
            todoCalendarRef.value.onRefreshEvents();
            todoCalendarRef.value.onLoadUnscheduledTodo();
          }
        },
        {
          name: '完成',
          type: 'success',
          disabled: judgeIsFinish,
          onClick: async (targetEle) => {
            const { key, ...extendedProps } = getEventData(targetEle);
            const { pointInfo, todoInfo } = formatCompletedTodo({ key: +key, ...extendedProps });
            await api.updateTodo(+key, todoInfo);
            await api.addPoint(pointInfo);
            todoCalendarRef.value.onRefreshEvents();
          }
        },
        {
          name: '删除',
          type: 'danger',
          onClick: async (targetEle) => {
            const { key } = getEventData(targetEle);
            await api.deleteTodo(+key);
            todoCalendarRef.value.onRefreshEvents();
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
    eventOrder: [(a, b) => { return a.extendedProps.status - b.extendedProps.status }],
    eventData: function (eventEl) {
      return formatCalendarTodoData(getEventData(eventEl));
    },
    draggableTypeOptions: [
      {
        label: '待安排待办',
        value: 1
      }
    ],
    eventDrop: onTodoEventDrop,
    drop: async function (info) {
      const key = +getEventData(info.draggedEl)?.key;
      await api.updateTodo(key, { deadline: `${info.dateStr} 23:30:00` });
      todoCalendarRef.value.onRefreshEvents();
      info.draggedEl.parentNode.removeChild(info.draggedEl);
    }
  },
  weekView: {
    initialView: [CalendarViewType.Week]
  }
}

const getEventData = (el) => {
  if (el.fcSeg) {
    const data = el.fcSeg.eventRange.def;
    return {
      key: data.publicId,
      ...data.extendedProps,
    }
  }
  let data = {};
  try {
    data = JSON.parse(el.dataset.eventInfo ?? el.parentNode.dataset.eventInfo);
  } catch (error) {
    console.error(error);
  }
  return data;
}

const formatCalendarTodoData = (item) => {
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
}

const loadTodoData = async (successCb) => {
  const data = await api.getChildTodoList();
  // console.log(data);

  const calendarData = data.map((item) => {
    return formatCalendarTodoData(item);
  })

  successCb(calendarData);
}

const loadUnscheduledTodo = async (successCb) => {
  const data = await api.getUnscheduledTodoList();
  successCb(data)
}

const pushTodoDetail = (query) => {
  const fullUrl = getFullUrl('/course_config/todoEdit', { query });
  window.open(fullUrl);
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
