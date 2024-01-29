import { indexDBApi, DataSourceType } from '@sparking/common';
import * as courseIDB from './indexdb/course';
import * as studyLogIDB from './indexdb/studyLog';

const allIndexDBApi = {
  ...indexDBApi,
  ...courseIDB,
  ...studyLogIDB,
}

export default window.dataSourceType  === DataSourceType.Remote ? {} : allIndexDBApi;