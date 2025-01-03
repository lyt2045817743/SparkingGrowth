## 系统地址
http://xiaowusu.cn

## 项目简介
### 系统及功能介绍
> 【婷的空间】目前包括三个系统。1. 专属日历 2. 内容配置后台 3. 今天学什么

#### 专属日历：
1. 待办日历
2. 事件记录日历

#### 内容配置后台：
1. 学习资源管理
2. 待办管理
3. 活动管理
4. 书籍管理
5. 系统配置

#### 今天学什么：
1. 根据当前已配置学习资源，随机生成今天要学习的章节。并对学习情况进行预览。
2. 默认以[现代JavaScript教程](https://zh.javascript.info)为默认学习资源，可以通过内容配置后台进行配置其他学习资源。

#### 使用说明
当前系统只支持『离线』模式，使用时需要注意：
- 数据是存储到用户的浏览器中，不同设备、不同浏览器（或无痕模式）不会共享应用数据
- 后续上线『数据上传至云端功能』，在数据未上传至云端前，切记不要清除该网站的Cookie和应用数据


## 本地启动步骤
### 1. 下载项目、安装依赖/启动主应用和所有子系统
```bash
# 1. clone the project
git clone https://github.com/lyt2045817743/SparkingGrowth.git

# 2. 安装依赖并启动（第一次启动）
pnpm startAll --install

# 仅启动
pnpm startAll
```

### 2. 启动完成后，使用浏览器打开：http://127.0.0.1:5173/
