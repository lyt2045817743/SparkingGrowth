import { onMounted, ref } from 'vue';
import { TypeCascadeOptions as baseOptions, getMapByOptions, TodoTypeLabel } from "@sparking/common";
import api from "@/api";

export default function useActivityOption () {
  const typeCascadeOptions = ref([]);
  const todoTypeLabel = ref({});

  const getCateData = async () => {
    const activityData = await api.getActivityList();
    const bookData = await api.getBookList();
    const courseData = await api.getCourseList();
    const parentData = activityData.filter((item) => item.level === 1);
    bookData.forEach((item) => item.id = `B${item.id}`);
    courseData.forEach((item) => item.id = `C${item.id}`);
    const data = activityData.concat(bookData, courseData);
    // console.log(data);
    for (let i = 0; i < data.length; i++) {
      if (data[i].level === 1) continue;
      const parentItem = data.find((item) => item.id === data[i].parentId || item.id === data[i].type) ?? {};
      if (parentItem.children) {
        parentItem.children.push(data[i]);
      } else {
        parentItem.children = [data[i]];
      }
    }
    typeCascadeOptions.value = baseOptions.concat(parentData);

    const option = { labelKey: 'name', valueKey: 'id' };
    const cateTitleMap = getMapByOptions(activityData, option);
    const bookTittleMap = getMapByOptions(bookData, option);
    const courseTittleMap = getMapByOptions(courseData, option);
    todoTypeLabel.value = Object.assign(cateTitleMap, TodoTypeLabel, bookTittleMap, courseTittleMap);
    // console.log(todoTypeLabel.value);
  }

  onMounted(() => {
    getCateData();
  })

  return {
    typeCascadeOptions,
    todoTypeLabel,
  }
}