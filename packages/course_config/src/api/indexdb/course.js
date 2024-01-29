import { db } from '../../utils/globalState';

export const CourseStoreName = 'course';

async function getCourseById(id) {
  const course = db.get(CourseStoreName, id);
  return Promise.resolve(course);
}

async function addCourse(courseInfo) {
  const course = JSON.parse(JSON.stringify(courseInfo));
  const courseId = await db.add(CourseStoreName, course);
  return Promise.resolve(courseId);
}

async function updateCourse(id, info) {
  const course = await db.get(CourseStoreName, id);
  Object.keys(info).forEach((key) => {
    course[key] = info[key];
  })
  await db.put(CourseStoreName, course);
}

async function deleteCourse(key) {
  await db.delete(CourseStoreName, key);
}

export {
  addCourse,
  deleteCourse,
  getCourseById,
  updateCourse
}