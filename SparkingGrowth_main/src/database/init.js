import { openDB } from 'idb';
import { DatabaseConfig } from './.';
import DefaultCourseInfo from './defaultCourseData';

let db, curTransaction;
export async function initDatabase() {
  const { name, version } = DatabaseConfig;
  db = await openDB(name, version, {
    upgrade(curDB, oldVersion, newVersion, transaction, event) {
      db = curDB;
      curTransaction = transaction;
      initCourseStore();
      initStudyLogStore();
    },
  })
}

function initCourseStore() {
  let courseStore;
  if (!db.objectStoreNames.contains('course')) {
    courseStore = db.createObjectStore('course', { keyPath: 'id', autoIncrement: true });
    console.log(courseStore, 'courseStore');
    courseStore.add(DefaultCourseInfo);
  }
}

function initStudyLogStore() {
  let studyLogStore;
  if (!db.objectStoreNames.contains('studyLog')) {
    studyLogStore = db.createObjectStore('studyLog', { keyPath: 'id' });
  }  else {
    studyLogStore = curTransaction.objectStore('studyLog');
  }
  console.log(studyLogStore, 'studyLogStore');
  studyLogStore.createIndex('date_idx', 'date');
  studyLogStore.createIndex('courseId_idx', 'courseId');
}

export {
  db
}