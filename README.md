## 项目简介
1. 是基于qiankun框架开发的微前端应用
2. 离线应用，数据存储到用户浏览器中。
由于是存储在本地的浏览器，需要注意：
- 不同浏览器（或无痕模式）不会共享应用数据
- 后续上线导出/导出数据功能，在未对数据导出前，切记不要清除Cookie和应用数据
- 导入的数据会完全覆盖该浏览器之前的所有数据，因此如果介意数据流失，切记不要在未导入全部数据前使用新浏览器/设备

### 系统及功能介绍
> 目前包括两个系统。1.今天学什么？2. 课程配置后台

> 今天学什么系统：
1. 根据当前已配置课程，随机生成今天要学习的章节。并对学习情况进行预览。
2. 默认以https://zh.javascript.info（现代 JavaScript 教程）为默认课程，后续可以通过课程配置后台进行配置其他课程。

> 课程配置后台目前功能暂未开放。开发中

### TODO:
[x] 使用本地indexDB存储数据
[x] 配置课程的后台系统
[ ] 数据导出和导入、定期备份
[ ] 学习数据统计系统
[ ] 对在线的学习笔记进行收录

## 启动步骤
```bash
# 1. clone the project
git clone https://github.com/lyt2045817743/SparkingGrowth.git

# 2. enter the project directory
cd SparkingGrowth

# 3. install dependency
yarn install

# 4. 分别启动子应用
cd what_to_study_today
yarn serve

cd course_config
yarn serve

# 5. 启动主应用
cd sparkingGrowth_main
yarn serve
```