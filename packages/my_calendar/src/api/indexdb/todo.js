import { dayjs } from 'element-plus';
import { TodoStatusMap, db } from '@sparking/common';

export const TodoStoreName = 'todo';

async function getUnscheduledTodoList() {
  let list = await db.getAll(TodoStoreName);
  list = list.filter((item) => !item.deadline && (item.parentKey || !item.isRoot) && ![TodoStatusMap.Done, TodoStatusMap.DoneButOverdue].includes(item.status));
  return Promise.resolve(list);
}

async function getChildTodoList() {
  let list = await db.getAll(TodoStoreName);
  list = list.filter((item) => item.deadline && (item.parentKey || !item.isRoot));
  return Promise.resolve(list);
}

async function getSameDateTodoList(date = new Date()) {
  let list = await getChildTodoList();
  list = list.filter((item) => item.deadline && dayjs(date).isSame(item.deadline, 'day'));
  return Promise.resolve(list);
}

async function getTodoById(key) {
  const todo = db.get(TodoStoreName, key);
  return Promise.resolve(todo);
}

export {
  getUnscheduledTodoList,
  getChildTodoList,
  getSameDateTodoList,
  getTodoById
}