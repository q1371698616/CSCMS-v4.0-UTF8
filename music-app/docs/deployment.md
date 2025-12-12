# 部署文档

## 环境要求

### 后端环境
- PHP 7.2+
- MySQL 5.7+
- Redis 5.0+ (可选，用于缓存)
- Nginx/Apache
- Composer

### 移动端开发环境
- Node.js 14+
- npm 6+ 或 yarn
- React Native CLI
- Android Studio (Android开发)
- Xcode (iOS开发，仅Mac)

## 后端部署

### 1. 配置环境

```bash
# 安装PHP扩展
sudo apt-get install php7.4-mysql php7.4-mbstring php7.4-xml php7.4-curl php7.4-zip php7.4-gd

# 安装MySQL
sudo apt-get install mysql-server

# 安装Redis
sudo apt-get install redis-server
```

### 2. 部署代码

```bash
# 克隆项目
cd /var/www
git clone [repository-url] music-platform

# 设置权限
chmod -R 755 /var/www/music-platform
chown -R www-data:www-data /var/www/music-platform/cache
chown -R www-data:www-data /var/www/music-platform/attachment
```

### 3. 配置数据库

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE music_platform DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 导入数据表结构
mysql -u root -p music_platform < music-app/database/schema.sql

# 导入CSCMS基础表
mysql -u root -p music_platform < packs/install/cscms_table.sql

# 导入初始数据
mysql -u root -p music_platform < packs/install/cscms_data.sql
```

### 4. 配置文件

编辑 `cscms/config/database.php`:

```php
$db['default'] = array(
    'dsn'   => '',
    'hostname' => 'localhost',
    'username' => 'root',
    'password' => 'your_password',
    'database' => 'music_platform',
    'dbdriver' => 'mysqli',
    'dbprefix' => 'cs_',
    'pconnect' => FALSE,
    'db_debug' => (ENVIRONMENT !== 'production'),
    'cache_on' => FALSE,
    'cachedir' => '',
    'char_set' => 'utf8mb4',
    'dbcollat' => 'utf8mb4_general_ci',
    'swap_pre' => '',
    'encrypt' => FALSE,
    'compress' => FALSE,
    'stricton' => FALSE,
    'failover' => array(),
    'save_queries' => TRUE
);
```

### 5. 配置Nginx

创建 `/etc/nginx/sites-available/music-platform`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/music-platform;
    index index.php index.html;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.ht {
        deny all;
    }

    # 上传大小限制
    client_max_body_size 100M;
}
```

启用站点:
```bash
sudo ln -s /etc/nginx/sites-available/music-platform /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. 配置API路由

将API接口文件复制到正确位置:

```bash
cp music-app/backend/api/*.php cscms/app/controllers/api/
```

## 移动端部署

### 1. 安装依赖

```bash
cd music-app/mobile
npm install

# iOS特定
cd ios && pod install && cd ..
```

### 2. 配置API地址

编辑 `src/api/config.js`:

```javascript
export const API_BASE_URL = 'http://your-domain.com';
```

### 3. Android打包

```bash
# 生成签名密钥
keytool -genkeypair -v -keystore music-app-release.keystore -alias music-app -keyalg RSA -keysize 2048 -validity 10000

# 配置签名
# 编辑 android/app/build.gradle

# 打包
cd android
./gradlew assembleRelease

# APK文件位于: android/app/build/outputs/apk/release/app-release.apk
```

### 4. iOS打包

```bash
# 使用Xcode打开项目
open ios/MusicApp.xcworkspace

# 在Xcode中:
# 1. 选择 Product -> Archive
# 2. 选择 Distribute App
# 3. 选择发布方式(App Store/Ad Hoc/Enterprise)
```

## 性能优化

### 1. 启用PHP OPcache

编辑 `/etc/php/7.4/fpm/php.ini`:

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.interned_strings_buffer=8
opcache.max_accelerated_files=4000
opcache.revalidate_freq=60
opcache.fast_shutdown=1
```

### 2. 配置Redis缓存

编辑 `cscms/config/redis.php`:

```php
$config['socket_type'] = 'tcp';
$config['socket'] = '/var/run/redis.sock';
$config['host'] = '127.0.0.1';
$config['password'] = NULL;
$config['port'] = 6379;
$config['timeout'] = 0;
```

### 3. 数据库优化

```sql
-- 添加索引
ALTER TABLE cs_music ADD INDEX idx_singer_album (singer_id, album_id);
ALTER TABLE cs_user_play_history ADD INDEX idx_user_time (user_id, create_time);

-- 优化查询
OPTIMIZE TABLE cs_music;
OPTIMIZE TABLE cs_user;
```

## 监控和日志

### 1. 启用应用日志

编辑 `index.php`:

```php
define('ERROR_MSG', 'production');
```

### 2. 配置错误日志

```bash
# 创建日志目录
mkdir -p /var/log/music-platform
chown www-data:www-data /var/log/music-platform

# 配置PHP错误日志
log_errors = On
error_log = /var/log/music-platform/php-error.log
```

### 3. 监控脚本

创建 `/usr/local/bin/monitor-music-app.sh`:

```bash
#!/bin/bash
# 检查服务状态
systemctl status nginx
systemctl status php7.4-fpm
systemctl status mysql
systemctl status redis-server
```

## 备份策略

### 1. 数据库备份

```bash
#!/bin/bash
# /usr/local/bin/backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/mysql"
DB_NAME="music_platform"

mkdir -p $BACKUP_DIR

mysqldump -u root -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/music_platform_$DATE.sql.gz

# 保留最近7天的备份
find $BACKUP_DIR -name "music_platform_*.sql.gz" -mtime +7 -delete
```

添加到crontab:
```bash
0 2 * * * /usr/local/bin/backup-db.sh
```

### 2. 文件备份

```bash
#!/bin/bash
# /usr/local/bin/backup-files.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backup/files"
SOURCE_DIR="/var/www/music-platform/attachment"

mkdir -p $BACKUP_DIR

tar -czf $BACKUP_DIR/attachment_$DATE.tar.gz $SOURCE_DIR

# 保留最近30天的备份
find $BACKUP_DIR -name "attachment_*.tar.gz" -mtime +30 -delete
```

## 故障排查

### 常见问题

1. API返回500错误
   - 检查PHP错误日志
   - 检查数据库连接
   - 检查文件权限

2. 移动端无法连接API
   - 检查API地址配置
   - 检查网络连接
   - 检查防火墙设置

3. 音乐播放失败
   - 检查音乐文件路径
   - 检查文件访问权限
   - 检查CORS配置

## 安全建议

1. 使用HTTPS
2. 定期更新依赖
3. 限制API访问频率
4. 定期备份数据
5. 使用强密码
6. 启用防火墙
7. 定期安全审计
