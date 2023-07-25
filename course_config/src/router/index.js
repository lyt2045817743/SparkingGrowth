import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';

const activeRule = 'course_config';
const router = createRouter({
  history: createWebHistory(`/${activeRule}/`),
  routes
});

export default router;
