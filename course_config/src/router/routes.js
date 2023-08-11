// const Home = () => import('../components/HelloWorld.vue');
const List = () => import('../views/courseConfig/list.vue');
const Add = () => import('../views/courseConfig/add.vue');
// import { projectName } from '../utils';

export const routes = [
  {
    path: '/',
    meta: {
      hidden: true
    },
    redirect: '/list',
  },
  {
    path: '/list',
    meta: {
      title: '课程列表'
    },
    component: List,
  },
  {
    path: '/add',
    meta: {
      title: '添加课程'
    },
    component: Add,
  },
];
