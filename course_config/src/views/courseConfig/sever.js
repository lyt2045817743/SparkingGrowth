import { db } from '../../utils/globalState';

async function getCourseList() {
  const list = await db.getAll('course');
  return Promise.resolve(list);
}

async function addCourse(courseInfo) {
  const course = JSON.parse(JSON.stringify(courseInfo));
  const courseId = await db.add('course', course);
  return Promise.resolve(courseId);
}

async function updateConfig(key, value) {
  await db.put('config', { key, value });
}

export {
  getCourseList,
  addCourse,
  updateConfig
}