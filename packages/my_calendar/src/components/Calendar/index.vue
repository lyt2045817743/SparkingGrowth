<template>
  <div class="container">
    <div id="external-events" v-if="config.showDraggableBox">
      <strong class="external-events-title__main">可拖拽事件</strong>
      <div class="external-events-title">事件类型选择：</div>
      <el-select
        v-model="currentDraggableEventType"
        size="small"
        style="margin-top: 3px"
      >
        <el-option
          v-for="item in config.draggableTypeOptions"
          :key="item.value"
          :value="item.value"
          :label="item.label"
        />
      </el-select>
      <div class="external-events-title">事件列表：</div>
      <div
        v-for="item in draggableEvents"
        :key="item.key"
        class="fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event"
        :data-event-info="JSON.stringify(item)"
      >
        <el-tooltip v-if="item.content.length > 14" :content="item.content" :show-after="500">
          <div class="fc-event-main">{{ item.content }}</div>
        </el-tooltip>
        <div v-else class="fc-event-main">{{ item.content }}</div>
      </div>
    </div>
    <FullCalendar
      class="calendar-box"
      ref="calendarRef"
      :options="calendarOptions"
    >
      <template #eventContent="arg">
        <div
          v-if="config.calendarType === 'todo'"
          class="event-box"
          :class="[
            arg.event.classNames,
            dayjs(arg.event.end).valueOf() < dayjs().valueOf()
              ? arg.event.extendedProps.pastEventClassName
              : '',
          ]"
        >
          <el-tooltip
            v-if="arg.event.title.length > 12"
            :content="arg.event.title"
            :show-after="800"
          >
            <div :class="['event-title']">{{ arg.event.title }}</div>
          </el-tooltip>
          <div :class="['event-title']" v-else>{{ arg.event.title }}</div>
        </div>
        <div v-else>
          <div :class="isShortTime(arg.event.start, arg.event.end) ? 'flex' : ''">
            <div>{{ `${formatTime(arg.event.start)} ~ ${formatTime(arg.event.end)}` }}</div>
            <div :style="isShortTime(arg.event.start, arg.event.end) ? 'margin-left: 10px' : ''">{{ arg.event.title }}  {{ `  ${arg.event.extendedProps.score || ''}` }}</div>
          </div>
        </div>
      </template>
    </FullCalendar>
    <ContextMenu ref="contextMenuRef" :menuDataMap="config.menuDataMap" />
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, defineExpose, onMounted } from "vue";
import { dayjs } from "element-plus";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import zhCnLocale from "@fullcalendar/core/locales/zh-cn";
import ContextMenu from "../ContextMenu/index.vue";

const props = defineProps({
  config: Object,
});

const emits = defineEmits(["loadData", "loadDraggableData"]);

const currentDraggableEventType = ref(1);
const calendarRef = ref(null);
const contextMenuRef = ref(null);
const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "",
  },
  views: {
    week: {
      titleFormat: { year: "numeric", month: "2-digit" },
      nowIndicator: true,
    },
    month: {
      titleFormat: { year: "numeric", month: "2-digit" },
    },
  },
  initialView: props.config.initialView ? props.config.initialView[0] : "",
  initialEvents: [],
  // 拖拽粒度
  snapDuration: "00:15:00",
  // 时间网格的时间间隔
  slotDuration: "01:00:00",
  firstDay: 0,
  locale: zhCnLocale,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  weekends: true,
  displayEventTime: false,
  select: handleDateSelect,
  eventClick: handleEventClick,
  eventOrder: props.config.eventOrder ?? [],
  eventOrderStrict: true,
  // 默认滚动到的时间点
  scrollTime: props.config.scrollTime,
  buttonText: {
    month: "待办日历",
    week: "时间追踪日历",
  },
  // y轴上显示的时间文本格式
  slotLabelFormat: {
    hour: "2-digit",
    minute: "2-digit",
    meridiem: false,
    hour12: false, // 设置时间为24小时
  },
  allDaySlot: false,
  contentHeight: "700px",
  height: "100%",
  events: getEvents,
  eventDrop: props.config.eventDrop,
  drop: props.config.drop,
  select: props.config.select,
  // unselectAuto: props.config.unselectAuto,
});

const draggableEvents = ref([]);
onMounted(() => {
  if (props.config.showDraggableBox) {
    onLoadUnscheduledTodo();
    const containerEl = document.getElementById("external-events");
    new Draggable(containerEl, {
      itemSelector: ".fc-event",
      eventData: props.config.eventData,
    });
  }
});

function formatTime(target) {
  return dayjs(target).format('HH:mm');
}

function isShortTime(start, end) {
  return dayjs(start).add(30, 'minutes').valueOf() >= dayjs(end).valueOf();
}

function onLoadUnscheduledTodo() {
  emits("loadDraggableData", (data) => {
    draggableEvents.value = data;
  });
}

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
  emits("loadData", successCb);
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

defineExpose({
  onRefreshEvents,
  onLoadUnscheduledTodo,
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  font-size: 14px;

  #external-events {
    width: 150px;
    padding: 10px;
    border: 1px solid #ccc;
    background: #eee;
    margin-right: 10px;

    .external-events-title__main {
      width: 100%;
      display: inline-block;
      font-size: 16px;
      text-align: left;
    }

    .external-events-title {
      margin-top: 10px;
      text-align: left;
    }
  }

  #external-events .fc-event {
    cursor: move;
    margin: 3px 0;
    .fc-event-main {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding: 0 5px;
    }
  }

  .calendar-box {
    flex: 1;

    ::v-deep(.fc-h-event) {
      background-color: transparent;
      border: none;

      .fc-event-main {
        color: $--sg-theme-text-color;
      }
    }
  }

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


  .flex {
    display: flex;
    align-items: center;
  }

  .event-title {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    &::before {
      width: 5px;
      height: 5px;
      border-radius: 100%;
      content: "";
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
}
</style>
