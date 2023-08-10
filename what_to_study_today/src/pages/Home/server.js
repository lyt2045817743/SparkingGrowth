const db = window.db;

async function getCurrentCourseInfo() {
  const transaction = db.transaction(['config', 'course']);
  const configStore = transaction.objectStore('config');
  const courseStore = transaction.objectStore('course');
  const { value: currentCourseId } = await configStore.get('currentCourseId');
  const currentCourseInfo = await courseStore.get(currentCourseId);
  await transaction.done;
  return Promise.resolve(currentCourseInfo);
}

async function updateCourseTitleMapById(id, newKey, newValue) {
  const value = await db.get('course', id);
  value.titleMap[newKey] = newValue;
  await db.put('course', value);
}

export {
  getCurrentCourseInfo,
  updateCourseTitleMapById
}