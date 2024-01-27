import { indexDBApi, DataSourceType } from '@sparking/common';
import * as todoApi from './indexdb/todo';
import * as pointApi from './indexdb/point';
import * as activity from './indexdb/activity'

const allIndexDBApi = {
  ...indexDBApi,
  ...todoApi,
  ...pointApi,
  ...activity,
}

export default window.dataSourceType  === DataSourceType.Remote ? {} : allIndexDBApi;