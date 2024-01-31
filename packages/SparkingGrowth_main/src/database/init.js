import { openDB } from 'idb';
import { DatabaseConfig } from './.';
import { setGlobalState } from '../utils';

let db, curTransaction, getDb;
export async function initDatabase() {
  const { name, version, basicStores } = DatabaseConfig;
  getDb = async () => {
    db = await openDB(name, version, {
      upgrade(curDB, oldVersion, newVersion, transaction, event) {
        db = curDB;
        curTransaction = transaction;
        initStudyLogStore();
        initBasicStore(basicStores);
      },
    })
    setGlobalState('db', db);
    return db;
  }
  getDb();
}

function initStudyLogStore() {
  let studyLogStore;
  if (!db.objectStoreNames.contains('studyLog')) {
    studyLogStore = db.createObjectStore('studyLog', { keyPath: 'id' });
    studyLogStore.createIndex('date_idx', 'date');
    studyLogStore.createIndex('courseId_idx', 'courseId');
  }
}

function initBasicStore(stores) {
  stores.forEach((item) => {
    const { name, keyPath, autoIncrement = true, initData } = item;
    let store;
    if (!db.objectStoreNames.contains(name)) {
      store = db.createObjectStore(name, { keyPath, autoIncrement });
      if (initData instanceof Array) {
        initData.forEach((item) => {
          store.add(item);
        })
      }
    }
  })
}

export {
  db,
  getDb
}