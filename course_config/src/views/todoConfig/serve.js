import { db } from '../../utils/globalState';

async function addTodo(todoInfo) {
  const todo = JSON.parse(JSON.stringify(todoInfo));
  const todoId = await db.add('todo', todo);
  return Promise.resolve(todoId);
}

export {
  addTodo
}