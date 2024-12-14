const envHost = window.location.hostname

export const microConfigs = [
  {
    name: '专属日历',
    entry: `//${envHost}:63001`,
    container: '#container',
    activeRule: '/my_calendar',
  },
  {
    name: '内容配置后台',
    entry: `//${envHost}:60001`,
    container: '#container',
    activeRule: '/course_config',
  },
  {
    name: '今天学什么？',
    entry: `//${envHost}:62001`,
    container: '#container',
    activeRule: '/what_to_study_today',
  },
]