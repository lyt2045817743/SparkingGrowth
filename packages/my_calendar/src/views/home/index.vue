<template>
  <div class="container">
    <Calendar v-if="currentViewType === CalendarViewType.Month" ref="todoCalendarRef" :config="configs.monthView"
      @loadData="loadTodoData" @loadDraggableData="loadUnscheduledTodo" />
    <Calendar v-else ref="dailyCalendarRef" :config="configs.weekView" @loadData="loadDailyData" />
    <el-select style="position: absolute;top: 10px;width: 200px; right: 0" v-model="currentViewType">
      <el-option label="待办日历" :value="CalendarViewType.Month" />
      <el-option label="事件记录日历" :value="CalendarViewType.Week" />
    </el-select>
    <el-dialog v-model="dailyDialogVisible" title="添加一条记录">
      <el-form :model="form" :label-width="formLabelWidth">
        <el-form-item label="时间范围：" required>
          <el-date-picker v-model="form.date" type="date" placeholder="日期" style="width: 200px" />
          <el-time-select v-model="form.startTime" start="00:00" step="00:15" end="23:45" placeholder="开始时间"
            style="width: 150px;margin-left: 10px" />
          <span class="text-split">-</span>
          <el-time-select v-model="form.endTime" start="00:00" step="00:15" end="23:45" placeholder="结束时间"
            style="width: 150px" />
        </el-form-item>
        <el-form-item label="关联类型：" required>
          <el-radio-group v-model="form.relationType">
            <el-radio :label="2">关联待办</el-radio>
            <el-radio :label="1">关联活动</el-radio>
            <el-radio :label="3">都不关联</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.relationType === 1" label="选择活动：" required>
          <el-cascader v-model="form.relationId" collapse-tags collapse-tags-tooltip :show-all-levels="false"
            :props="cascadeProps" filterable style="width: 250px" placeholder="请选择" :options="typeCascadeOptions" />
          <el-button style="margin-left: 10px;" type="primary" link @click="openCateManager">编辑活动</el-button>
        </el-form-item>
        <el-form-item v-if="form.relationType === 2" label="选择待办" required>
          <el-select v-model="form.relationId" style="width: 250px" placeholder="请选择" filterable
            no-data-text="仅支持选择当天未完成的待办">
            <el-option v-for="item in todoOptions" :key="item.key" :label="item.content" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="记录描述：" :required="form.relationType === 3">
          <el-input
            v-model="form.content"
            style="width: 350px"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="评分：" required>
          <div>
            <div v-for="item in scoreConfig" :key="item.field" class="score-item-box">
              <span>{{ item.label }}：</span>
              <el-rate v-model="form[item.field]" @change="onChangeTotalScore" allow-half show-text show-score :disabled="item.readonly"
                text-color="#ff9900" score-template="{value}分" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
            </div>
          </div>
          <el-input
            v-model="form.desc"
            placeholder="请输入评分留言"
            type="textarea"
            :rows="4"
            style="width: 700px"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSubmitOuter">
            提交
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Calendar from '../../components/Calendar/index.vue';
import { CalendarViewType } from '../../components/Calendar/constant';
import { TargetClassNameMap } from '../../components/ContextMenu/config';
import { dayjs, ElMessage } from 'element-plus';
import { TodoStatusMap, formatCompletedTodo, getFullUrl } from '@sparking/common';
import api from '@/api';
import useDailyDialog from './hooks/useDailyDialog';

const {
  formLabelWidth,
  typeCascadeOptions,
  todoOptions,
  form,
  scoreConfig,
  cascadeProps,
  onSubmit,
  openCateManager,
  initForm,
  onChangeTotalScore
} = useDailyDialog();

const todoCalendarRef = ref(null);
const dailyCalendarRef = ref(null);
const currentViewType = ref(CalendarViewType.Month);

const dailyDialogVisible = ref(false);
const onDailyCalendarSelect = (info) => {
  dailyDialogVisible.value = true;
  initForm(info);
}

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
    calendarType: 'todo',
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
            const { todoInfo } = formatCompletedTodo({ key: +key, ...extendedProps });
            await api.updateTodo(+key, todoInfo);
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
      // todoCalendarRef.value.onRefreshEvents();
      info.draggedEl.parentNode.removeChild(info.draggedEl);
    }
  },
  weekView: {
    initialView: [CalendarViewType.Week],
    calendarType: 'daily',
    select: onDailyCalendarSelect,
    unselectAuto: false,
    scrollTime: '08:00',
    // selectAllow: (selectInfo) => {
    //   if (dayjs(selectInfo.end).valueOf() > dayjs().add(10, 'minute').valueOf()) {
    //     ElMessage.warning('时间追踪日历只能记录之前发生的事件');
    //     return false;
    //   }
    //   return true;
    // }
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

const loadDailyData = async (successCb) => {
  const data = await api.getDailyLogList();
  successCb(data);
}

const loadUnscheduledTodo = async (successCb) => {
  const data = await api.getUnscheduledTodoList();
  successCb(data)
}

const pushTodoDetail = (query) => {
  const fullUrl = getFullUrl('/course_config/todoEdit', { query });
  window.open(fullUrl);
}

const onCancel = () => {
  dailyDialogVisible.value = false;
  dailyCalendarRef.value.onRefreshEvents();
}

const onSubmitOuter = () => {
  dailyDialogVisible.value = false;
  onSubmit(() => {
    ElMessage.success('添加成功');
    dailyCalendarRef.value.onRefreshEvents();
  });
}
</script>

<style lang="scss" scoped>
.container {
  margin: 20px auto;
  height: calc(100vh - 100px);
  // overflow: hidden;
  width: calc(100% - 20px);
  position: relative;

  .text-split {
    text-align: center;
    width: 20px;
  }

  .score-item-box {
    display: flex;
    align-items: center;
  }
}
</style>
