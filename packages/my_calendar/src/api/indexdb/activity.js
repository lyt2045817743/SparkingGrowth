import { db } from '@sparking/common';

export const ActivityStoreName = 'activity';

async function getActivityById(key) {
  const activity = db.get(ActivityStoreName, key);
  return Promise.resolve(activity);
}

export {
  getActivityById,
}