const Home = () => import('../pages/home/index.vue');

export const routes = [
  {
    path: '/',
    name: 'qiankun-main',
    meta: {
      hidden: true
    },
    component: Home,
  },
  {
    path: '/:w+',
    name: '',
    component: Home,
  },
];
