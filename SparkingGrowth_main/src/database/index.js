  import { initDatabase, db } from "./init";

  // indexDB数据库信息配置
  const DatabaseConfig = {
    name: 'learning_assistance',
    version: 4
  };

  export {
    db,
    DatabaseConfig,
    initDatabase
  }