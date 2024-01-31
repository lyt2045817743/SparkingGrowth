import { db } from '@sparking/common';

export const ActivityStoreName = 'activity';

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

async function getActivityCateList(resourceType) {
  const data = await getActivityList();
  return data.filter((item) => item.level === 2 && item.resourceType === resourceType);
}

export {
  getActivityList,
  updateActivity,
  deleteActivity,
  addActivity,
  getActivityCateList
}