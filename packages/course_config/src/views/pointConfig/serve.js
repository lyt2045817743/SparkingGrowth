import dayjs from 'dayjs';
import { db } from '../../utils/globalState';
import { PointEventTypeMap } from '../../constant';

const PointStoreName = 'point';
const TodoStoreName = 'todo';
const ActivityStoreName = 'activity';

async function addActivity(activityInfo) {
  const activity = JSON.parse(JSON.stringify(activityInfo));
  const activityId = await db.add(ActivityStoreName, activity);
  return Promise.resolve(activityId);
}

async function getActivityList() {
  const list = await db.getAll(ActivityStoreName);
  return Promise.resolve(list);
}

async function updateActivity(id, info) {
  const activity = await db.get(ActivityStoreName, id);
  Object.keys(info).forEach((key) => {
    activity[key] = info[key];
  })
  await db.put(ActivityStoreName, activity);
}

async function deleteActivity(key) {
  await db.delete(ActivityStoreName, key);
}

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
  getActivityList,
  updateActivity,
  deleteActivity,
  addActivity
}