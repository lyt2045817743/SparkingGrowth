import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router';
import { registerMicroApps, start } from 'qiankun';
import { microConfigs } from './constant/micro';
import { initDatabase, db } from './database';

registerMicroApps(microConfigs);

start();

createApp(App).use(router).mount('#main-app');

initDatabase();
