# 音乐平台移动应用

一个功能完整的音乐社交平台移动应用,支持Android和iOS平台。

## 项目概述

本项目基于CSCMS v4.0后台系统,提供完整的音乐社交平台解决方案。

### 核心功能

#### 1. 用户系统
- 注册与登录(邮箱、手机号、第三方登录)
- 个人主页(简介、作品、动态、收藏、粉丝)
- 会员体系(普通用户、付费会员)
- VIP特权(高音质、独家内容、免广告)

#### 2. 音乐功能
- 音乐播放器(在线播放、离线缓存)
- 歌手主页
- 专辑管理
- 歌词显示
- 播放列表
- 音乐搜索
- 智能推荐

#### 3. 社交互动
- 消息系统(系统通知、官方公告、私信)
- 评论点赞
- 动态分享
- 关注粉丝
- 讨论群组

#### 4. 直播功能
- 音频直播
- 弹幕互动
- 打赏功能
- 直播回放

#### 5. 其他功能
- 音乐课程
- 版权交易
- 积分系统
- 签到功能
- 个性化皮肤

## 技术栈

### 移动端
- React Native (跨平台开发)
- Redux (状态管理)
- React Navigation (路由导航)
- Axios (HTTP请求)
- React Native Track Player (音乐播放)
- Socket.io (实时通讯)

### 后端
- PHP 7.x+
- CodeIgniter 3.x
- MySQL 5.7+
- Redis (缓存)

## 项目结构

```
music-app/
├── mobile/                # 移动端应用
│   ├── android/          # Android原生代码
│   ├── ios/              # iOS原生代码
│   ├── src/              # React Native源代码
│   │   ├── api/         # API接口
│   │   ├── components/  # 公共组件
│   │   ├── screens/     # 页面组件
│   │   ├── navigation/  # 导航配置
│   │   ├── redux/       # Redux状态管理
│   │   ├── utils/       # 工具函数
│   │   └── assets/      # 静态资源
│   └── package.json
├── backend/              # 后端API扩展
│   ├── api/             # RESTful API
│   └── models/          # 数据模型
├── database/             # 数据库文件
│   ├── migrations/      # 数据库迁移
│   └── seeds/           # 测试数据
└── docs/                 # 文档
    ├── api.md           # API文档
    └── deployment.md    # 部署文档
```

## 快速开始

### 环境要求

- Node.js 14+
- npm 6+ 或 yarn
- React Native CLI
- Xcode (iOS开发)
- Android Studio (Android开发)
- PHP 7.2+
- MySQL 5.7+
- Redis

### 安装步骤

1. 克隆项目
```bash
git clone [repository-url]
cd music-app
```

2. 安装移动端依赖
```bash
cd mobile
npm install
# 或
yarn install
```

3. iOS依赖安装
```bash
cd ios
pod install
cd ..
```

4. 配置后端
```bash
# 导入数据库
mysql -u root -p < database/music_app.sql

# 配置数据库连接
# 编辑 cscms/config/database.php
```

5. 运行应用
```bash
# Android
npm run android

# iOS
npm run ios
```

## 数据库设计

详见 `database/schema.sql`

主要数据表:
- user - 用户表
- singer - 歌手表
- music - 音乐表
- album - 专辑表
- playlist - 播放列表表
- message - 消息表
- live - 直播表
- course - 课程表
- transaction - 交易表

## API接口

详见 `docs/API.md`

### 基础接口
- POST /api/user/register - 用户注册
- POST /api/user/login - 用户登录
- GET /api/user/profile - 获取用户信息
- PUT /api/user/profile - 更新用户信息

### 音乐接口
- GET /api/music/list - 获取音乐列表
- GET /api/music/detail/:id - 获取音乐详情
- POST /api/music/play - 播放音乐
- GET /api/singer/list - 获取歌手列表
- GET /api/album/list - 获取专辑列表

### 社交接口
- GET /api/message/list - 获取消息列表
- POST /api/message/send - 发送消息
- POST /api/comment/create - 发表评论
- POST /api/follow/user - 关注用户

## 开发指南

### 代码规范
- 使用ESLint进行代码检查
- 遵循Airbnb JavaScript风格指南
- 组件使用函数式组件和Hooks
- 使用TypeScript类型检查

### Git工作流
- main - 主分支
- develop - 开发分支
- feature/* - 功能分支
- hotfix/* - 修复分支

## 部署

详见 `docs/deployment.md`

## 许可证

MIT License

## 联系方式

如有问题请提交Issue或联系开发团队。
