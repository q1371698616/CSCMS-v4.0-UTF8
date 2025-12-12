# API接口文档

## 基础信息

- 基础URL: `http://your-domain.com`
- 返回格式: JSON
- 字符编码: UTF-8

## 通用返回格式

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

- code: 0表示成功，其他值表示错误
- message: 返回信息
- data: 返回数据

## 认证

大部分接口需要在请求头中携带Token:

```
Authorization: Bearer {token}
```

## 用户相关接口

### 用户注册

```
POST /api/user/register
```

参数:
- username (string, required): 用户名
- password (string, required): 密码
- email (string, optional): 邮箱
- phone (string, optional): 手机号
- code (string, optional): 验证码

返回:
```json
{
  "code": 0,
  "message": "注册成功",
  "data": {
    "user_id": 1,
    "username": "test",
    "token": "xxxxx"
  }
}
```

### 用户登录

```
POST /api/user/login
```

参数:
- username (string, required): 用户名/邮箱/手机号
- password (string, required): 密码

返回:
```json
{
  "code": 0,
  "message": "登录成功",
  "data": {
    "user_id": 1,
    "username": "test",
    "nickname": "测试用户",
    "avatar": "http://xxx.png",
    "vip": 1,
    "token": "xxxxx"
  }
}
```

### 获取用户信息

```
GET /api/user/profile
GET /api/user/profile/:user_id
```

返回:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "name": "test",
    "nickname": "测试用户",
    "avatar": "http://xxx.png",
    "vip": 1,
    "stats": {
      "coin": 100,
      "popularity": 1000,
      "fans": 50,
      "follow": 30
    }
  }
}
```

### 更新用户信息

```
PUT /api/user/profile
```

参数:
- nickname (string): 昵称
- avatar (string): 头像URL
- sex (int): 性别 0:保密 1:男 2:女
- city (string): 城市
- signature (string): 签名

### 用户签到

```
POST /api/user/checkin
```

返回:
```json
{
  "code": 0,
  "message": "签到成功",
  "data": {
    "days": 7,
    "coin_reward": 50,
    "exp_reward": 20
  }
}
```

### 关注用户

```
POST /api/user/follow
```

参数:
- follow_user_id (int, required): 被关注用户ID

## 音乐相关接口

### 获取音乐列表

```
GET /api/music/list
```

参数:
- page (int): 页码，默认1
- limit (int): 每页数量，默认20
- category_id (int): 分类ID
- type (string): 类型 all|recommend|hot|new

返回:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [...],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

### 获取音乐详情

```
GET /api/music/detail/:id
```

返回:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "id": 1,
    "title": "歌曲名",
    "singer_name": "歌手名",
    "cover": "http://xxx.png",
    "music_url": "http://xxx.mp3",
    "lrc_url": "http://xxx.lrc",
    "duration": 240,
    "is_vip": 0,
    "play_count": 1000,
    "like_count": 100
  }
}
```

### 搜索音乐

```
GET /api/music/search
```

参数:
- keyword (string, required): 搜索关键词
- page (int): 页码
- limit (int): 每页数量

### 播放音乐

```
POST /api/music/play
```

参数:
- music_id (int, required): 音乐ID
- play_progress (int): 播放进度（秒）
- device (string): 设备类型

### 收藏音乐

```
POST /api/music/collect
```

参数:
- music_id (int, required): 音乐ID

### 点赞音乐

```
POST /api/music/like
```

参数:
- music_id (int, required): 音乐ID

### 获取播放历史

```
GET /api/music/history
```

参数:
- page (int): 页码
- limit (int): 每页数量

### 获取推荐音乐

```
GET /api/music/recommend
```

参数:
- limit (int): 数量，默认10

## 消息相关接口

### 获取消息列表

```
GET /api/message/list
```

参数:
- type (string): 消息类型 system|official|user|comment|like|follow
- page (int): 页码
- limit (int): 每页数量

### 获取未读消息数

```
GET /api/message/unread_count
```

返回:
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "total": 10,
    "system": 2,
    "official": 1,
    "user": 5,
    "comment": 1,
    "like": 1,
    "follow": 0
  }
}
```

### 标记消息为已读

```
POST /api/message/read
```

参数:
- message_id (int): 消息ID（单条）
- type (string): 消息类型（批量）

### 发送私信

```
POST /api/message/send
```

参数:
- to_user_id (int, required): 接收者ID
- content (string, required): 消息内容

### 获取对话列表

```
GET /api/message/conversations
```

参数:
- page (int): 页码
- limit (int): 每页数量

### 获取对话详情

```
GET /api/message/conversation/:user_id
```

参数:
- page (int): 页码
- limit (int): 每页数量

## 错误码

- 0: 成功
- 400: 参数错误
- 401: 未授权
- 403: 没有权限
- 404: 资源不存在
- 500: 服务器错误
