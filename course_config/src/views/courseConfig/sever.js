import { db } from '../../utils/globalState';

async function getCourseList() {
  const list = await db.getAll('course');
  return Promise.resolve(list);
}

async function getCourseById(id) {
  const course = db.get('course', id);
  return Promise.resolve(course);
}

async function addCourse(courseInfo) {
  const course = JSON.parse(JSON.stringify(courseInfo));
  const courseId = await db.add('course', course);
  return Promise.resolve(courseId);
}

async function updateCourse(id, info) {
  const course = await db.get('course', id);
  Object.keys(info).forEach((key) => {
    course[key] = info[key];
  })
  await db.put('course', course);
}

async function deleteCourse(key) {
  await db.delete('course', key);
}

async function updateConfig(key, value) {
  await db.put('config', { key, value });
}

export {
  getCourseList,
  addCourse,
  updateConfig,
  deleteCourse,
  getCourseById,
  updateCourse
}