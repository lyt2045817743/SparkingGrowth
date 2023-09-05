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
      title: '学习资源列表'
    },
    component: List,
  },
  {
    path: '/add',
    meta: {
      title: '添加学习资源'
    },
    component: Edit,
  },
  {
    path: '/edit',
    meta: {
      title: '修改学习资源',
      hidden: true
    },
    component: Edit,
  },
];
