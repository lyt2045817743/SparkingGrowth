import { indexDBApi, DataSourceType } from '@sparking/common';
import * as todoIDB from './indexdb/todo';
import * as pointIDB from './indexdb/point';
import * as activityIDB from './indexdb/activity';
import * as courseIDB from './indexdb/course';
import * as bookIDB from './indexdb/book';

const allIndexDBApi = {
  ...indexDBApi,
  ...todoIDB,
  ...pointIDB,
  ...activityIDB,
  ...courseIDB,
  ...bookIDB,
}

export default window.dataSourceType  === DataSourceType.Remote ? {} : allIndexDBApi;