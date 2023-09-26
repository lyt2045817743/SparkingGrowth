  import { initDatabase, db, getDb } from "./init";

  // indexDB数据库信息配置
  const DatabaseConfig = {
    name: 'learning_assistance',
    version: 6,
    basicStores: [
      {
        name: 'todo',
        keyPath: 'key'
      },
      {
        name: 'point',
        keyPath: 'id'
      },
      {
        name: 'activity',
        keyPath: 'id'
      },
      {
        name: 'book',
        keyPath: 'id'
      }
    ]
  };

  export {
    db,
    getDb,
    DatabaseConfig,
    initDatabase
  }