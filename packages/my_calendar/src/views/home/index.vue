<template>
  <div class="container">
    <FullCalendar :options="calendarOptions" />
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
const calendarOptions = ref({
  plugins: [
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin // needed for dateClick
  ],
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek'
  },
  views: {
    week: {
      titleFormat: { year: 'numeric', month: '2-digit' },
      nowIndicator: true
    },
    month: {
      titleFormat: { year: 'numeric', month: '2-digit' }
    }
  },
  initialView: 'dayGridMonth',
  initialEvents: [],
  // 拖拽粒度
  snapDuration: '00:15:00',
  // 时间网格的时间间隔
  slotDuration: '01:00:00',
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
    month:    '待办日历',
    week:     '时间追踪日历'
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
  eventsSet: handleEvents
})

const currentEvents = ref([]);

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
}
</style>
