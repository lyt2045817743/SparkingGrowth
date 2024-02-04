## 项目简介
### 系统及功能介绍
> 【婷的空间】目前包括两个系统。1. 专属日历 2. 内容配置后台 3. 今天学什么？

#### 专属日历：
1. 待办日历
2. 时间追踪日历

#### 内容配置后台：
1. 学习资源管理
2. 待办管理
3. 活动管理
4. 书籍管理
5. 系统配置

#### 今天学什么：
1. 根据当前已配置学习资源，随机生成今天要学习的章节。并对学习情况进行预览。
2. 默认以https://zh.javascript.info（现代 JavaScript 教程）为默认学习资源，后续可以通过内容配置后台进行配置其他学习资源。

#### 技术栈介绍
1. 微前端应用：基于qiankun框架开发
2. 离线应用：数据存储到用户浏览器中

#### 使用说明
由于是存储在本地的浏览器，需要注意：
- 不同浏览器（或无痕模式）不会共享应用数据
- 后续上线导出/导出数据功能，在未对数据导出前，切记不要清除Cookie和应用数据
- 导入的数据会完全覆盖该浏览器之前的所有数据，因此如果介意数据流失，切记不要在未导入全部数据前使用新浏览器/设备


## 启动步骤
### 1. 下载项目、安装依赖/启动主应用和所有子系统
```bash
# 1. clone the project
git clone https://github.com/lyt2045817743/SparkingGrowth.git

# 2. 安装依赖并启动（第一次启动）
yarn startAll --install

# 仅启动
yarn startAll
```

### 2. 启动完成后，使用浏览器打开：http://127.0.0.1:5173/
