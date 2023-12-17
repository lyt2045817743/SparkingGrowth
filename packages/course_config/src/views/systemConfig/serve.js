import { db } from '../../utils/globalState';

const ConfigStoreName = 'config';

async function getConfigMap() {
  const list = await db.getAll(ConfigStoreName);
  const configMap = {};
  list.forEach((item) => configMap[item.key] = item.value);
  return Promise.resolve(configMap);
}

async function getConfigByKey(key) {
  const config = await db.get(ConfigStoreName, key);
  return config?.value;
}

// 修改配置信息
async function updateConfig(key, value) {
  await db.put(ConfigStoreName, { key, value });
}

export {
  getConfigMap,
  updateConfig,
  getConfigByKey
}