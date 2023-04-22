import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'vue练习',
    entry: '//localhost:60001',
    container: '#container',
    activeRule: '/vue_practice',
  }
]);

start();

createApp(App).mount('#main-app')
