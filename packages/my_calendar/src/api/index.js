import { indexDBApi, DataSourceType } from '@sparking/common';
import * as todoIDB from './indexdb/todo';
import * as dailyLogIDB from './indexdb/dailyLog';
import * as activityIDB from './indexdb/activity';

const allIndexDBApi = {
  ...indexDBApi,
  ...todoIDB,
  ...dailyLogIDB,
  ...activityIDB,
}

export default window.dataSourceType  === DataSourceType.Remote ? {} : allIndexDBApi;