const db = window.db;

async function getCourseList() {
  const list = db.getAll('course');
  return Promise.resolve(list);
}

export {
  getCourseList
}