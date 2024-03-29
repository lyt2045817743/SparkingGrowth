const List = () => import('../views/courseConfig/list.vue');
const Edit = () => import('../views/courseConfig/edit.vue');

const ActivityList = () => import('../views/activityConfig/list.vue');

const TodoList = () => import('../views/todoConfig/list.vue');
const TodoEdit = () => import('../views/todoConfig/edit.vue');

const BookList = () => import('../views/bookConfig/list.vue');
const BookEdit = () => import('../views/bookConfig/edit.vue');

const SystemEdit = () => import('../views/systemConfig/edit.vue');

export const routes = [
  {
    path: '/',
    meta: {
      hidden: true
    },
    redirect: '/todo',
  },
  {
    path: '/todo',
    meta: {
      title: '待办管理'
    },
    component: TodoList,
  },
  {
    path: '/activity',
    meta: {
      title: '活动管理',
    },
    component: ActivityList,
  },
  {
    path: '/activityCate',
    meta: {
      title: '活动分类',
      hidden: true
    },
    component: ActivityList,
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
    path: '/book',
    meta: {
      title: '书籍管理'
    },
    component: BookList,
  },
  {
    path: '/bookAdd',
    meta: {
      title: '添加书籍',
      hidden: true
    },
    component: BookEdit,
  },
  {
    path: '/bookEdit',
    meta: {
      title: '修改书籍',
      hidden: true
    },
    component: BookEdit,
  },
  {
    path: '/systemEdit',
    meta: {
      title: '系统配置',
    },
    component: SystemEdit,
  }
];
