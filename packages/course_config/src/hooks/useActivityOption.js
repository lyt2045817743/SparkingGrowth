import { onMounted, ref } from 'vue';
import { getActivityOptions } from "@sparking/common";

export default function useActivityOption () {
  const typeCascadeOptions = ref([]);
  const todoTypeLabel = ref({});

  const getCateData = async () => {
    const { options, labelMap } = await getActivityOptions();
    typeCascadeOptions.value = options;
    todoTypeLabel.value = labelMap;
    // console.log(options, labelMap);
  }

  onMounted(() => {
    getCateData();
  })

  return {
    typeCascadeOptions,
    todoTypeLabel,
  }
}