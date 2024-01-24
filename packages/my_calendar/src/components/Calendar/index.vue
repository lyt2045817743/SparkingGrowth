<template>
  <div class="container">
    <FullCalendar ref="calendarRef" :options="calendarOptions">
      <template #eventContent="arg">
        <div
          class="event-box"
          :class="[
            arg.event.classNames,
            dayjs(arg.event.end).valueOf() < dayjs().valueOf() ? arg.event.extendedProps.pastEventClassName : '' 
          ]"
        >
          <el-tooltip v-if="arg.event.title.length > 14" :content="arg.event.title" :show-after="500">
            <div :class="['event-title']"> {{ arg.event.title }} </div>
          </el-tooltip>
          <div :class="['event-title']" v-else> {{ arg.event.title }} </div>
        </div>
      </template>
    </FullCalendar>
    <ContextMenu ref="contextMenuRef" :menuDataMap="menuDataMap" />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose } from 'vue';
import { dayjs } from 'element-plus';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import ContextMenu from '../ContextMenu/index.vue';

const props = defineProps({
  customButtons: Object,
  viewType: Array,
  menuDataMap: Object,
  eventOrder: Array,
});

const emits = defineEmits(['loadData', 'onClick', 'onDateSelect', 'onEventDrop'])

const calendarRef = ref(null);
const contextMenuRef = ref(null);
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: '',
  },
  views: {
    week: {
      titleFormat: { year: 'numeric', month: '2-digit' },
      nowIndicator: true
    },
    month: {
      titleFormat: { year: 'numeric', month: '2-digit' }
    },
  },
  initialView: props.viewType ? props.viewType[0] : '',
  initialEvents: [],
  // 拖拽粒度
  snapDuration: '00:15:00',
  // 时间网格的时间间隔
  slotDuration: '01:00:00',
  businessHours: [
    {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '09:00',
      endTime: '11:30'
    },
    {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '14:00',
      endTime: '17:30'
    },
    {
      daysOfWeek: [1, 2, 3, 4, 5],
      startTime: '19:00',
      endTime: '20:00'
    }
  ],
  locale: zhCnLocale,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  displayEventTime: false,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventOrder: props.eventOrder ?? [],
  eventOrderStrict: true,
  // 默认滚动到的时间点
  scrollTime: dayjs().format('HH:mm'),
  buttonText: {
    month: '待办日历',
    week: '时间追踪日历'
  },
  // y轴上显示的时间文本格式
  slotLabelFormat: {
    hour: '2-digit',
    minute: '2-digit',
    meridiem: false,
    hour12: false // 设置时间为24小时
  },
  allDaySlot: false,
  contentHeight: '700px',
  height: '100%',
  events: getEvents,
  eventDrop: eventDrop,
})

function handleDateSelect(selectInfo) {
  let calendarApi = selectInfo.view.calendar;
  calendarApi.unselect();
  if (contextMenuRef.value.showMenu) {
    contextMenuRef.value.hideMenu();
    return;
  }
}

function getEvents(_info, successCb) {
  // TODO: 添加根据时间范围查询数据的逻辑
  emits('loadData', successCb);
}

function handleEventClick() {
  if (contextMenuRef.value.showMenu) {
    contextMenuRef.value.hideMenu();
    return;
  }
}

// 刷新日历数据
function onRefreshEvents() {
  calendarRef.value.calendar.refetchEvents();
}

function eventDrop(info) {
  emits('onEventDrop', info);
}

defineExpose({
  onRefreshEvents
})
</script>

<style lang="scss" scoped>
.container {

  .event-box {
    width: 100%;
  }
  .line-through {
    text-decoration: line-through;
  }

  .red-text {
    color: red;
    .event-title {
      &::before {
        background: red;
      }
    }
  }
  .event-title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    &::before {
      width: 5px;
      height: 5px;
      border-radius: 100%;
      content: '';
      display: inline-block;
      background: black;
      margin-right: 5px;
      margin-bottom: 2.5px;
      margin-left: 5px;
    }
  }

  ::v-deep(.fc) {
    .fc-button-primary {
      background-color: $--sg-theme-color;

      &.fc-button-active {
        background-color: $--sg-theme-color__active;
      }
    }

        
    .fc-toolbar {
      justify-content: flex-start;
    }

    .fc-toolbar-title {
      margin-left: 0.75em;
      font-size: 25px;
    }

    .fc-timegrid-slot {
      height: 48px;
    }

    .fc-toolbar.fc-header-toolbar {
      margin-bottom: 1em;
    }

    .fc-daygrid-event-harness {
      font-size: 15px;
    }

    .fc-more-link {
      font-size: 12px;
    }
  }
}</style>
