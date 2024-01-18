import { indexDBApi, DataSourceType } from '@sparking/common';

export default window.dataSourceType  === DataSourceType.Local ? indexDBApi : {};