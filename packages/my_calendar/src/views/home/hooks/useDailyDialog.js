import { ref, reactive, onMounted, nextTick } from 'vue';
import { dayjs } from 'element-plus';
import { getActivityOptions, TodoStatusMap } from '@sparking/common';
import api from '@/api';

export default function useDailyDialog () {

  const formLabelWidth = '100px';
  const cascadeProps = {
    emitPath: false,
    checkStrictly: true,
    value: 'id',
    label: 'name'
  };
  const scoreConfig = [
    {
      label: '总分',
      field: 'totalScore',
      readonly: true
    },
    {
      label: '意义分',
      field: 'meanScore'
    },
    {
      label: '效率分',
      field: 'efficiencyScore'
    },
    {
      label: '心情分',
      field: 'moodScore'
    },
  ]
  
  const form = reactive({
    content: '',
    date: '',
    startTime: '',
    endTime: '',
    relationType: 2,
    desc: '',
  })
  
  onMounted(() => {
    getActivityData();
    getTodoData();
  })
  
  const todoOptions = ref([]);
  const getTodoData = async () => {
    todoOptions.value = await api.getSameDateTodoList();
  }
  
  const typeCascadeOptions = ref([]);
  const getActivityData = async () => {
    const { options } = await getActivityOptions();
    typeCascadeOptions.value = options.slice(1);
  }
  
  const onSubmit = async (successCb) => {
    // console.log(form);
    const { content, relationType, relationId, startTime, endTime, date, desc, meanScore, moodScore, efficiencyScore } = form;
    const dailyLog = {
      content,
      relationType,
      relationId,
      startTime: `${date} ${startTime}:00`,
      endTime: `${date} ${endTime}:00`,
      desc,
      meanScore,
      moodScore,
      efficiencyScore
    };
    await api.addDailyLog(dailyLog);
    // 待办自动完成
    if (relationType === 2) {
      await api.updateTodo(relationId, { status: TodoStatusMap.Done })
    }
    successCb();
  }

  const openCateManager = () => {
    window.open('/course_config/activity');
  }

  const initForm = (info) => {
    form.date = dayjs(info.startStr).format('YYYY-MM-DD');
    form.startTime = dayjs(info.startStr).format('HH:mm');
    form.endTime = dayjs(info.endStr).format('HH:mm');
  }

  const onChangeTotalScore = () => {
    nextTick(() => {
      form.totalScore = +((form.meanScore + form.moodScore + form.efficiencyScore) / 3).toFixed(1);
    })
  }

  return {
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
  }
}