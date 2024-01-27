import { db } from '../../utils/globalState';

export const TodoStoreName = 'todo';

async function getUnscheduledTodoList() {
  let list = await db.getAll(TodoStoreName);
  list = list.filter((item) => !item.deadline && (item.parentKey || !item.isRoot));
  return Promise.resolve(list);
}

async function getChildTodoList() {
  let list = await db.getAll(TodoStoreName);
  list = list.filter((item) => item.deadline && (item.parentKey || !item.isRoot));
  return Promise.resolve(list);
}

export {
  getUnscheduledTodoList,
  getChildTodoList
}