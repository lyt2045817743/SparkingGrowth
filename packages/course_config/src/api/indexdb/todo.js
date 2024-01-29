import { dayjs } from 'element-plus';
import { TodoStatusMap, db } from '@sparking/common';

export const TodoStoreName = 'todo';

// 根据截止时间由近到远排列，未安排的待办排在最后
const sortFunc = (a, b) => {
  if (a.deadline && b.deadline) {
    return dayjs(a.deadline).valueOf() - dayjs(b.deadline).valueOf()
  } else if (!a.deadline && b.deadline) {
    return 1;
  } else if (!b.deadline && a.deadline) {
    return -1;
  }
  return 0;
};

async function getTodoList() {
  let list = await db.getAll(TodoStoreName);
  list = list?.filter((item) => [TodoStatusMap.Undo, TodoStatusMap.Overdue].includes(item.status)).sort(sortFunc) ?? [];
  return Promise.resolve(list);
}

async function getTodoById(key) {
  const todo = db.get(TodoStoreName, key);
  return Promise.resolve(todo);
}

export {
  getTodoList,
  getTodoById,
  sortFunc,
}