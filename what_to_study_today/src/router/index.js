import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const activeRule = 'what_to_study_today';

const router = createRouter({
  history: createWebHistory(window.__POWERED_BY_QIANKUN__ ? `/${activeRule}` : '/'),
  routes
});

export default router;
