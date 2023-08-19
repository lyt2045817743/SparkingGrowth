const List = () => import('../views/courseConfig/list.vue');
const Edit = () => import('../views/courseConfig/edit.vue');

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
    component: Edit,
  },
  {
    path: '/edit',
    meta: {
      title: '修改课程',
      hidden: true
    },
    component: Edit,
  },
];
