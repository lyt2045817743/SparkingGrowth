import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import App from './App.vue'
import router from './router';
import { registerMicroApps, start } from 'qiankun';
import { microConfigs } from './constant/micro';
import { initDatabase } from './database';
// import initGlobalState from './utils/initGlobalState';

initDatabase();

registerMicroApps(microConfigs);

start();

createApp(App).use(router).use(ElementPlus).mount('#main-app');

// initGlobalState();

