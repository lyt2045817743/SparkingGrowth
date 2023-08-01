## 此项目是基于qiankun框架开发的微前端应用。

### 系统及功能介绍
> 目前包括两个系统。1.今天学什么？2. 课程配置后台

> 今天学什么系统：
1. 根据当前已配置课程，随机生成今天要学习的章节。并对学习情况进行预览。
2. 默认以https://zh.javascript.info（现代 JavaScript 教程）为默认课程，后续可以通过课程配置后台进行配置其他课程。

> 课程配置后台目前功能暂未开放。开发中

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