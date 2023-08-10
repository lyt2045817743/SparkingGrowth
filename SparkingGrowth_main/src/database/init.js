import { openDB } from 'idb';
import { DatabaseConfig } from './.';
import DefaultCourseInfo from './defaultCourseData';
import { setGlobalState } from '../utils'

let db, curTransaction;
export async function initDatabase() {
  const { name, version } = DatabaseConfig;
  db = await openDB(name, version, {
    upgrade(curDB, oldVersion, newVersion, transaction, event) {
      db = curDB;
      curTransaction = transaction;
      initCourseStore();
      initStudyLogStore();
      initConfigStore();
    },
  })
  setGlobalState('db', db);
}

function initCourseStore() {
  let courseStore;
  if (!db.objectStoreNames.contains('course')) {
    courseStore = db.createObjectStore('course', { keyPath: 'id', autoIncrement: true });
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
  studyLogStore.createIndex('date_idx', 'date');
  studyLogStore.createIndex('courseId_idx', 'courseId');
}

function initConfigStore() {
  let configStore;
  if (!db.objectStoreNames.contains('config')) {
    configStore = db.createObjectStore('config', { keyPath: 'key' });
    configStore.add({ key: 'currentCourseId', value: DefaultCourseInfo.id });
  }
}

export {
  db
}