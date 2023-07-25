const Home = () => import('../components/HelloWorld.vue');

export const routes = [
  {
    path: '/',
    meta: {
      hidden: true
    },
    component: Home,
  },
];
