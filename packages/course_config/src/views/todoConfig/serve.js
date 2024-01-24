import { dayjs } from 'element-plus';
import { TodoStatusMap } from './constant';
import { db } from '../../utils/globalState';

const TodoStoreName = 'todo';
const PointStoreName = 'point';

async function addTodo(todoInfo) {
  const todo = JSON.parse(JSON.stringify(todoInfo));
  const todoId = await db.add(TodoStoreName, todo);
  return Promise.resolve(todoId);
}

async function addPoint(pointInfo) {
  const point = JSON.parse(JSON.stringify(pointInfo));
  const pointId = await db.add(PointStoreName, point);
  return Promise.resolve(pointId);
}

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

async function deleteTodo(key) {
  await db.delete(TodoStoreName, key);
}

async function getTodoById(key) {
  const todo = db.get(TodoStoreName, key);
  return Promise.resolve(todo);
}

async function updateTodo(id, info) {
  const todo = await db.get(TodoStoreName, id);
  Object.keys(info).forEach((key) => {
    if (key === 'type') {
      info[key].forEach((item) => {
        if (!todo[key].includes(item)) {
          todo[key].push(item)
        }
      })
      for (let i = 0; i < todo[key].length; i++) {
        if (!info[key].includes(todo[key][i])) {
          todo[key].splice(i, 1);
          i--;
        }
      }
    } else {
      todo[key] = info[key];
    }
  })
  await db.put(TodoStoreName, todo);
}

export {
  addTodo,
  addPoint,
  deleteTodo,
  getTodoList,
  getTodoById,
  updateTodo,
  sortFunc
}