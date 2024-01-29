import { db } from '../../utils/globalState';

// 获取学习记录数据
async function getStudyLogListById(courseId) {
  const studyLog = await db.getAllFromIndex('studyLog', 'courseId_idx', courseId);
  return Promise.resolve(studyLog);
}

export {
  getStudyLogListById,
}