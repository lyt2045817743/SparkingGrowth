import dayjs from 'dayjs';
import { PointEventTypeMap, db } from '@sparking/common';
import { TodoStoreName } from './todo';
import { ActivityStoreName } from './activity'

export const PointStoreName = 'point';

async function getPointList() {
  const list = await db.getAll(PointStoreName);
  let total = 0;
  const data = [];
  for (let i = 0; i < list.length; i++) {
    const { eventType, eventId, score, createTime } = list[i];
    if (eventType === PointEventTypeMap.Todo ) {
      const todo = await db.get(TodoStoreName, eventId);
      list[i].eventName = todo?.content ?? '原数据已删除';
      list[i].createTime = createTime ?? todo?.finishTime;
    } else if (eventType === PointEventTypeMap.Exchange) {
      const activity = await db.get(ActivityStoreName, eventId);
      list[i].eventName = activity.name;
    } else if (eventType === PointEventTypeMap.ExtraPoint) {
      const date = dayjs(createTime).format('M月D日');
      list[i].eventName = date + '积分补偿';
    }
    total += score;
    data.push(list[i]);
  }
  return Promise.resolve({ data, total });
}

export {
  getPointList,
}