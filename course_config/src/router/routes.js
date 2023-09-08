const List = () => import('../views/courseConfig/list.vue');
const Edit = () => import('../views/courseConfig/edit.vue');

const TodoList = () => import('../views/todoConfig/list.vue')
const TodoEdit = () => import('../views/todoConfig/edit.vue');

const PointList = () => import('../views/pointConfig/list.vue');
const exchangePointList = () => import('../views/pointConfig/exchange');

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
      title: '学习资源管理'
    },
    component: List,
  },
  {
    path: '/add',
    meta: {
      title: '添加学习资源',
      hidden: true
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
  {
    path: '/todo',
    meta: {
      title: '待办管理'
    },
    component: TodoList,
  },
  {
    path: '/todoAdd',
    meta: {
      title: '添加待办',
      hidden: true
    },
    component: TodoEdit,
  },
  {
    path: '/todoEdit',
    meta: {
      title: '编辑待办',
      hidden: true
    },
    component: TodoEdit,
  },
  {
    path: '/point',
    meta: {
      title: '积分记录与兑换'
    },
    component: PointList,
  },
  {
    path: '/exchangePoint',
    meta: {
      title: '兑换活动',
      hidden: true
    },
    component: exchangePointList,
  }
];
