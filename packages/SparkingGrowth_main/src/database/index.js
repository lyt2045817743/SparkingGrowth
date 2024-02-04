  import { initDatabase, db, getDb } from "./init";
  import { course, config, activity } from './defaultStoreData';

  // indexDB数据库信息配置
  const DatabaseConfig = {
    name: 'learning_assistance',
    version: 7,
    basicStores: [
      {
        name: 'course',
        keyPath: 'id',
        initData: course
      },
      {
        name: 'todo',
        keyPath: 'key'
      },
      {
        name: 'activity',
        keyPath: 'id',
        initData: activity
      },
      {
        name: 'book',
        keyPath: 'id'
      },
      {
        name: 'dailyLog',
        keyPath: 'id'
      },
      {
        name: 'config',
        keyPath: 'key',
        autoIncrement: false,
        initData: config
      }
    ]
  };

  export {
    db,
    getDb,
    DatabaseConfig,
    initDatabase
  }