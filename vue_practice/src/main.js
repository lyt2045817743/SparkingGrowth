import { createApp } from 'vue';
// import router from './router/index';
import App from './App.vue';

let instance;

async function render(props = {}) {
  const { container } = props;
  instance = createApp(App);
  instance.mount(container ? container.querySelector('#app') : '#app');
}

// 单独调试子应用时挂载
if (!window.__POWERED_BY_QIANKUN__) {
  // console.log('window.__POWERED_BY_QIANKUN__: ', window.__POWERED_BY_QIANKUN__);
  render();
}

export async function bootstrap() {
  console.log('vue app bootStrap');
}
// 主应用挂载
export async function mount(props) {
  console.log('mount');
  instance = await render(props);
}

export async function unmount() {
  instance?.unmount('#app');
}
