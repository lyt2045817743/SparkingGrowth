export const routes = [
  {
    path: '/',
    meta: {
      hidden: true
    },
    redirect: '/home',
  },
  {
    path: '/home',
    meta: {
      title: '我的日历'
    },
    component: () => import('@/views/home/index.vue'),
  },
];
