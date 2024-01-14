<template>
  <div class="container">
    <FullCalendar ref="calendarRef" :options="calendarOptions" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { dayjs } from 'element-plus';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import zhCnLocale from '@fullcalendar/core/locales/zh-cn';
import { CalendarViewType } from './constant';

const calendarRef = ref(null);
const currentEvents = ref([]);
const calendarOptions = ref({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin // needed for dateClick
  ],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: `${CalendarViewType.Month},${CalendarViewType.Week}`,
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
  initialView: CalendarViewType.Month,
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
  select: handleDateSelect,
  eventClick: handleEventClick,
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
  eventsSet: handleEvents,
  events: getEvents,
})

function handleDateSelect(selectInfo) {
  let title = prompt('Please enter a new title for your event')
  let calendarApi = selectInfo.view.calendar

  calendarApi.unselect() // clear date selection

  if (title) {
    calendarApi.addEvent({
      id: 3,
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay
    })
  }
}
function getEvents(info, successCb) {
  console.log(info);

  setTimeout(() => {
    successCb([
      {
        id: 1,
        title: '初始化待办数据',
        start: '2024-01-14 15:00:00',
        end: '2024-01-14 16:00:00',
        type: CalendarViewType.Month
      },
      {
        id: 2,
        title: '时间追踪数据',
        start: '2024-01-14 15:00:00',
        end: '2024-01-14 16:00:00',
        type: CalendarViewType.Week
      },
    ]);
  }, 100)
}
function handleEventClick(clickInfo) {
  if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    clickInfo.event.remove()
  }
}
function handleEvents(events) {
  currentEvents.value = events
}
</script>

<style lang="scss" scoped>
.container {
  margin: 20px auto;
  height: calc(100vh - 100px);
  overflow: hidden;
  width: 1040px;

  ::v-deep(.fc) {
    .fc-button-primary {
      background-color: $--sg-theme-color;

      &.fc-button-active {
        background-color: $--sg-theme-color__active;
      }
    }

    .fc-timegrid-slot {
      height: 48px;
    }

    .fc-toolbar.fc-header-toolbar {
      margin-bottom: 1em;
    }
  }
}</style>
