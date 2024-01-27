import { indexDBApi, DataSourceType } from '@sparking/common';
import * as todoIDB from './indexdb/todo';

const allIndexDBApi = {
  ...indexDBApi,
  ...todoIDB,
}

export default window.dataSourceType  === DataSourceType.Remote ? {} : allIndexDBApi;