import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { projectName } from '../utils'

const router = createRouter({
  history: createWebHistory(`/${projectName}`),
  routes
});

export default router;
