import { dayjs } from 'element-plus';
import { db } from '@sparking/common';
import api from '@/api';

export const DailyLogStoreName = 'dailyLog';

async function getDailyLogList() {
  let list = await db.getAll(DailyLogStoreName);
  const formatData = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    let formatItem = {};
    const { relationType, relationId, content, id, startTime, endTime } = item;
    formatItem = {
      id,
      start: startTime,
      end: endTime,
    }
    // title处理
    if (relationType === 1) {
      const activityInfo = await api.getActivityById(relationId);
      formatItem.title = activityInfo.name + `${content ? '-' + content : ''}`;
    } else if (relationType === 2) {
      const todoInfo = await api.getTodoById(relationId);
      formatItem.title = todoInfo.content + `${content ? '-' + content : ''}`;
    } else {
      formatItem.title = content;
    }

    formatData.push(formatItem);
  }
  return Promise.resolve(formatData);
}

async function addDailyLog(dailyLogInfo) {
  const dailyLog = JSON.parse(JSON.stringify(dailyLogInfo));
  const dailyLogId = await db.add(DailyLogStoreName, dailyLog);
  return Promise.resolve(dailyLogId);
}

export {
  getDailyLogList,
  addDailyLog
}