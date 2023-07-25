import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const activeRule = 'course_config';
const router = createRouter({
  history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? `/${activeRule}` : '/'),
  routes
});

export default router;
