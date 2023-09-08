import { db } from '../../utils/globalState';
import { PointEventTypeMap } from '../../constant';

const PointStoreName = 'point';
const TodoStoreName = 'todo';

async function getPointList() {
  const list = await db.getAll(PointStoreName);
  let total = 0;
  const data = [];
  for (let i = 0; i < list.length; i++) {
    const { eventType, eventId, score } = list[i];
    if (eventType === PointEventTypeMap.Todo ) {
      const todo = await db.get(TodoStoreName, eventId);
      list[i].eventName = todo.content;
      list[i].createTime = todo.finishTime;
    }
    total += score;
    data.push(list[i]);
  }
  return Promise.resolve({ data, total });
}

export {
  getPointList
}