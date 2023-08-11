const db = window.db;

// 获取当前的课程信息
async function getCurrentCourseInfo() {
  const transaction = db.transaction(['config', 'course']);
  const configStore = transaction.objectStore('config');
  const courseStore = transaction.objectStore('course');
  const { value: currentCourseId } = await configStore.get('currentCourseId');
  const currentCourseInfo = await courseStore.get(currentCourseId);
  await transaction.done;
  return Promise.resolve(currentCourseInfo);
}

// 更新课程目录
async function updateCourseTitleMapById(id, newKey, newValue) {
  const value = await db.get('course', id);
  value.titleMap[newKey] = newValue;
  await db.put('course', value);
}

// 获取学习记录数据
async function getStudyLogList() {
  const studyLog = await db.getAll('studyLog');
  return Promise.resolve(studyLog);
}

// 新增一条学习记录
async function addStudyLog(studyLogInfo) {
  await db.add('studyLog', studyLogInfo);
}

async function initStudyLog() {
  const transaction = db.transaction('studyLog', 'readwrite');
  const studyLogByDate = JSON.parse(localStorage.getItem('studyLog'));
  const studyLogById = [];
  let space = 1*60*60*1000*2;
  for (let date in studyLogByDate) {
    const courseList = studyLogByDate[date].courseList;
    for (let i = 0; i < courseList.length; i++) {
      const titleKey = courseList[i].title.split('：')[0];
      let dateTimeStamp = new Date(`${date} 14:00:00`).getTime();
      if (date === '2023-08-03') {
        dateTimeStamp += space;
        space += 1*60*60*1000*2;
      }
      studyLogById.push({ date, titleKey, courseId: 0, id: `${0}_${dateTimeStamp}` });
    }
  }
  const promiseArr = studyLogById.map((item) => {
    return transaction.store.add(item);
  })
  await Promise.all(promiseArr.concat([transaction.done]));
}

export {
  getCurrentCourseInfo,
  updateCourseTitleMapById,
  getStudyLogList,
  initStudyLog,
  addStudyLog
}