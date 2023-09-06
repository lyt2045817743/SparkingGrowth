import { db } from '../../utils/globalState';

const TodoStoreName = 'todo'

async function addTodo(todoInfo) {
  const todo = JSON.parse(JSON.stringify(todoInfo));
  const todoId = await db.add(TodoStoreName, todo);
  return Promise.resolve(todoId);
}

async function getTodoList() {
  const list = await db.getAll(TodoStoreName);
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
  deleteTodo,
  getTodoList,
  getTodoById,
  updateTodo
}