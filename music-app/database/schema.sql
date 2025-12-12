-- 音乐平台数据库扩展
-- 基于CSCMS v4.0，添加音乐平台特有功能

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET NAMES utf8mb4;

-- ============================================
-- 音乐相关表
-- ============================================

-- 音乐表
CREATE TABLE IF NOT EXISTS `cs_music` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL DEFAULT '' COMMENT '歌曲名称',
  `singer_id` int(10) unsigned DEFAULT '0' COMMENT '歌手ID',
  `album_id` int(10) unsigned DEFAULT '0' COMMENT '专辑ID',
  `category_id` int(10) unsigned DEFAULT '0' COMMENT '分类ID',
  `cover` varchar(255) DEFAULT '' COMMENT '封面图',
  `music_url` varchar(500) DEFAULT '' COMMENT '音乐文件URL',
  `lrc_url` varchar(500) DEFAULT '' COMMENT '歌词文件URL',
  `duration` int(10) unsigned DEFAULT '0' COMMENT '时长(秒)',
  `file_size` int(10) unsigned DEFAULT '0' COMMENT '文件大小(字节)',
  `quality` enum('standard','high','lossless') DEFAULT 'standard' COMMENT '音质',
  `language` varchar(20) DEFAULT '' COMMENT '语言',
  `release_date` date DEFAULT NULL COMMENT '发行日期',
  `is_vip` tinyint(1) DEFAULT '0' COMMENT '是否VIP专享',
  `is_recommend` tinyint(1) DEFAULT '0' COMMENT '是否推荐',
  `is_hot` tinyint(1) DEFAULT '0' COMMENT '是否热门',
  `is_new` tinyint(1) DEFAULT '0' COMMENT '是否最新',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态 0:下架 1:上架',
  `play_count` int(10) unsigned DEFAULT '0' COMMENT '播放次数',
  `like_count` int(10) unsigned DEFAULT '0' COMMENT '点赞数',
  `collect_count` int(10) unsigned DEFAULT '0' COMMENT '收藏数',
  `comment_count` int(10) unsigned DEFAULT '0' COMMENT '评论数',
  `share_count` int(10) unsigned DEFAULT '0' COMMENT '分享数',
  `download_count` int(10) unsigned DEFAULT '0' COMMENT '下载次数',
  `tags` varchar(255) DEFAULT '' COMMENT '标签',
  `description` text COMMENT '描述',
  `copyright` varchar(100) DEFAULT '' COMMENT '版权信息',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) unsigned DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_singer` (`singer_id`),
  KEY `idx_album` (`album_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_play_count` (`play_count`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='音乐表';

-- 专辑表
CREATE TABLE IF NOT EXISTS `cs_album` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(200) NOT NULL DEFAULT '' COMMENT '专辑名称',
  `singer_id` int(10) unsigned DEFAULT '0' COMMENT '歌手ID',
  `cover` varchar(255) DEFAULT '' COMMENT '封面图',
  `description` text COMMENT '专辑描述',
  `release_date` date DEFAULT NULL COMMENT '发行日期',
  `company` varchar(100) DEFAULT '' COMMENT '发行公司',
  `language` varchar(20) DEFAULT '' COMMENT '语言',
  `is_recommend` tinyint(1) DEFAULT '0' COMMENT '是否推荐',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  `music_count` int(10) unsigned DEFAULT '0' COMMENT '歌曲数量',
  `play_count` int(10) unsigned DEFAULT '0' COMMENT '播放次数',
  `collect_count` int(10) unsigned DEFAULT '0' COMMENT '收藏数',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) unsigned DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_singer` (`singer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='专辑表';

-- 音乐分类表
CREATE TABLE IF NOT EXISTS `cs_music_category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '分类名称',
  `pid` int(10) unsigned DEFAULT '0' COMMENT '父级ID',
  `icon` varchar(255) DEFAULT '' COMMENT '图标',
  `sort` int(10) unsigned DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='音乐分类表';

-- ============================================
-- 用户交互表
-- ============================================

-- 用户播放历史表
CREATE TABLE IF NOT EXISTS `cs_user_play_history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `music_id` int(10) unsigned NOT NULL COMMENT '音乐ID',
  `play_time` int(10) unsigned DEFAULT '0' COMMENT '播放时长(秒)',
  `play_progress` int(10) unsigned DEFAULT '0' COMMENT '播放进度(秒)',
  `device` varchar(50) DEFAULT '' COMMENT '设备类型',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_music` (`music_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户播放历史表';

-- 用户收藏表
CREATE TABLE IF NOT EXISTS `cs_user_collection` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `type` enum('music','album','singer','playlist') NOT NULL COMMENT '收藏类型',
  `target_id` int(10) unsigned NOT NULL COMMENT '目标ID',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_type_target` (`user_id`,`type`,`target_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_target` (`type`,`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收藏表';

-- 用户播放列表表
CREATE TABLE IF NOT EXISTS `cs_playlist` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `name` varchar(100) NOT NULL DEFAULT '' COMMENT '歌单名称',
  `cover` varchar(255) DEFAULT '' COMMENT '封面图',
  `description` text COMMENT '描述',
  `is_public` tinyint(1) DEFAULT '1' COMMENT '是否公开',
  `music_count` int(10) unsigned DEFAULT '0' COMMENT '歌曲数量',
  `play_count` int(10) unsigned DEFAULT '0' COMMENT '播放次数',
  `collect_count` int(10) unsigned DEFAULT '0' COMMENT '收藏数',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) unsigned DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='播放列表表';

-- 播放列表音乐关联表
CREATE TABLE IF NOT EXISTS `cs_playlist_music` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `playlist_id` int(10) unsigned NOT NULL COMMENT '播放列表ID',
  `music_id` int(10) unsigned NOT NULL COMMENT '音乐ID',
  `sort` int(10) unsigned DEFAULT '0' COMMENT '排序',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_playlist` (`playlist_id`),
  KEY `idx_music` (`music_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='播放列表音乐关联表';

-- ============================================
-- 消息系统表
-- ============================================

-- 消息表
CREATE TABLE IF NOT EXISTS `cs_message` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `from_user_id` int(10) unsigned DEFAULT '0' COMMENT '发送者ID，0表示系统消息',
  `to_user_id` int(10) unsigned NOT NULL COMMENT '接收者ID',
  `type` enum('system','official','user','comment','like','follow') NOT NULL COMMENT '消息类型',
  `title` varchar(200) DEFAULT '' COMMENT '消息标题',
  `content` text COMMENT '消息内容',
  `link` varchar(500) DEFAULT '' COMMENT '相关链接',
  `is_read` tinyint(1) DEFAULT '0' COMMENT '是否已读',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_to_user` (`to_user_id`,`is_read`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息表';

-- 用户关注表
CREATE TABLE IF NOT EXISTS `cs_user_follow` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `follow_user_id` int(10) unsigned NOT NULL COMMENT '被关注用户ID',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_follow` (`user_id`,`follow_user_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_follow_user` (`follow_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户关注表';

-- ============================================
-- 评论系统表
-- ============================================

-- 评论表
CREATE TABLE IF NOT EXISTS `cs_comment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `type` enum('music','album','singer','live','course') NOT NULL COMMENT '评论类型',
  `target_id` int(10) unsigned NOT NULL COMMENT '目标ID',
  `pid` int(10) unsigned DEFAULT '0' COMMENT '父评论ID',
  `content` text NOT NULL COMMENT '评论内容',
  `like_count` int(10) unsigned DEFAULT '0' COMMENT '点赞数',
  `reply_count` int(10) unsigned DEFAULT '0' COMMENT '回复数',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态 0:隐藏 1:显示',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_target` (`type`,`target_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_pid` (`pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 点赞表
CREATE TABLE IF NOT EXISTS `cs_like` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `type` enum('music','comment','album','singer','live') NOT NULL COMMENT '点赞类型',
  `target_id` int(10) unsigned NOT NULL COMMENT '目标ID',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_type_target` (`user_id`,`type`,`target_id`),
  KEY `idx_target` (`type`,`target_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- ============================================
-- 直播系统表
-- ============================================

-- 直播间表
CREATE TABLE IF NOT EXISTS `cs_live` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL COMMENT '主播用户ID',
  `title` varchar(200) NOT NULL DEFAULT '' COMMENT '直播标题',
  `cover` varchar(255) DEFAULT '' COMMENT '封面图',
  `description` text COMMENT '描述',
  `live_url` varchar(500) DEFAULT '' COMMENT '直播流地址',
  `status` enum('pending','living','ended') DEFAULT 'pending' COMMENT '状态',
  `viewer_count` int(10) unsigned DEFAULT '0' COMMENT '观看人数',
  `like_count` int(10) unsigned DEFAULT '0' COMMENT '点赞数',
  `gift_amount` decimal(10,2) DEFAULT '0.00' COMMENT '礼物总金额',
  `start_time` int(10) unsigned DEFAULT '0' COMMENT '开始时间',
  `end_time` int(10) unsigned DEFAULT '0' COMMENT '结束时间',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='直播间表';

-- 直播礼物表
CREATE TABLE IF NOT EXISTS `cs_live_gift` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '礼物名称',
  `icon` varchar(255) DEFAULT '' COMMENT '礼物图标',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `sort` int(10) unsigned DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='直播礼物表';

-- 直播打赏记录表
CREATE TABLE IF NOT EXISTS `cs_live_gift_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `live_id` int(10) unsigned NOT NULL COMMENT '直播间ID',
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `gift_id` int(10) unsigned NOT NULL COMMENT '礼物ID',
  `count` int(10) unsigned DEFAULT '1' COMMENT '数量',
  `amount` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '总金额',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_live` (`live_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='直播打赏记录表';

-- ============================================
-- 课程系统表
-- ============================================

-- 课程表
CREATE TABLE IF NOT EXISTS `cs_course` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `teacher_id` int(10) unsigned NOT NULL COMMENT '教师用户ID',
  `title` varchar(200) NOT NULL DEFAULT '' COMMENT '课程标题',
  `cover` varchar(255) DEFAULT '' COMMENT '封面图',
  `description` text COMMENT '课程描述',
  `category_id` int(10) unsigned DEFAULT '0' COMMENT '分类ID',
  `level` enum('beginner','intermediate','advanced') DEFAULT 'beginner' COMMENT '难度级别',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '价格',
  `group_price` decimal(10,2) DEFAULT '0.00' COMMENT '拼团价格',
  `group_min` int(10) unsigned DEFAULT '2' COMMENT '拼团最小人数',
  `lesson_count` int(10) unsigned DEFAULT '0' COMMENT '课时数',
  `duration` int(10) unsigned DEFAULT '0' COMMENT '总时长(分钟)',
  `student_count` int(10) unsigned DEFAULT '0' COMMENT '学员数',
  `is_recommend` tinyint(1) DEFAULT '0' COMMENT '是否推荐',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) unsigned DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_teacher` (`teacher_id`),
  KEY `idx_category` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程表';

-- 课程章节表
CREATE TABLE IF NOT EXISTS `cs_course_lesson` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int(10) unsigned NOT NULL COMMENT '课程ID',
  `title` varchar(200) NOT NULL DEFAULT '' COMMENT '章节标题',
  `type` enum('video','audio','text') DEFAULT 'video' COMMENT '类型',
  `content_url` varchar(500) DEFAULT '' COMMENT '内容URL',
  `duration` int(10) unsigned DEFAULT '0' COMMENT '时长(分钟)',
  `is_free` tinyint(1) DEFAULT '0' COMMENT '是否免费试听',
  `sort` int(10) unsigned DEFAULT '0' COMMENT '排序',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='课程章节表';

-- 用户课程表
CREATE TABLE IF NOT EXISTS `cs_user_course` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `course_id` int(10) unsigned NOT NULL COMMENT '课程ID',
  `progress` int(10) unsigned DEFAULT '0' COMMENT '学习进度(%)',
  `last_lesson_id` int(10) unsigned DEFAULT '0' COMMENT '最后学习章节ID',
  `buy_type` enum('normal','group') DEFAULT 'normal' COMMENT '购买类型',
  `buy_price` decimal(10,2) DEFAULT '0.00' COMMENT '购买价格',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) unsigned DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_course` (`user_id`,`course_id`),
  KEY `idx_course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户课程表';

-- 拼团活动表
CREATE TABLE IF NOT EXISTS `cs_group_buy` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int(10) unsigned NOT NULL COMMENT '课程ID',
  `leader_user_id` int(10) unsigned NOT NULL COMMENT '团长用户ID',
  `status` enum('pending','success','failed') DEFAULT 'pending' COMMENT '状态',
  `current_count` int(10) unsigned DEFAULT '1' COMMENT '当前人数',
  `target_count` int(10) unsigned NOT NULL COMMENT '目标人数',
  `expire_time` int(10) unsigned DEFAULT '0' COMMENT '过期时间',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_course` (`course_id`),
  KEY `idx_status` (`status`,`expire_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='拼团活动表';

-- 拼团成员表
CREATE TABLE IF NOT EXISTS `cs_group_buy_member` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `group_id` int(10) unsigned NOT NULL COMMENT '拼团ID',
  `user_id` int(10) unsigned NOT NULL COMMENT '用户ID',
  `is_leader` tinyint(1) DEFAULT '0' COMMENT '是否团长',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_group` (`group_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='拼团成员表';

-- ============================================
-- 版权交易表
-- ============================================

-- 版权交易表
CREATE TABLE IF NOT EXISTS `cs_copyright_transaction` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `music_id` int(10) unsigned NOT NULL COMMENT '音乐ID',
  `seller_id` int(10) unsigned NOT NULL COMMENT '卖方用户ID',
  `buyer_id` int(10) unsigned DEFAULT '0' COMMENT '买方用户ID',
  `type` enum('license','buyout') NOT NULL COMMENT '交易类型：授权/买断',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `duration` int(10) unsigned DEFAULT '0' COMMENT '授权期限(天)，0表示永久',
  `usage_scope` text COMMENT '使用范围',
  `status` enum('pending','processing','completed','cancelled') DEFAULT 'pending' COMMENT '状态',
  `contract_url` varchar(500) DEFAULT '' COMMENT '合同文件URL',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) unsigned DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_music` (`music_id`),
  KEY `idx_seller` (`seller_id`),
  KEY `idx_buyer` (`buyer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='版权交易表';

-- ============================================
-- 设备交易表
-- ============================================

-- 设备交易表
CREATE TABLE IF NOT EXISTS `cs_equipment_transaction` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `seller_id` int(10) unsigned NOT NULL COMMENT '卖方用户ID',
  `buyer_id` int(10) unsigned DEFAULT '0' COMMENT '买方用户ID',
  `title` varchar(200) NOT NULL DEFAULT '' COMMENT '设备名称',
  `category` varchar(50) DEFAULT '' COMMENT '设备类别',
  `brand` varchar(50) DEFAULT '' COMMENT '品牌',
  `model` varchar(50) DEFAULT '' COMMENT '型号',
  `condition` enum('new','like_new','good','fair') DEFAULT 'good' COMMENT '成色',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `images` text COMMENT '图片URLs，JSON格式',
  `description` text COMMENT '描述',
  `status` enum('selling','sold','cancelled') DEFAULT 'selling' COMMENT '状态',
  `create_time` int(10) unsigned DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) unsigned DEFAULT '0' COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_seller` (`seller_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备交易表';

-- ============================================
-- 广告系统表
-- ============================================

-- 广告位表
CREATE TABLE IF NOT EXISTS `cs_ad_position` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '' COMMENT '广告位名称',
  `code` varchar(50) NOT NULL DEFAULT '' COMMENT '广告位代码',
  `width` int(10) unsigned DEFAULT '0' COMMENT '宽度',
  `height` int(10) unsigned DEFAULT '0' COMMENT '高度',
  `description` varchar(200) DEFAULT '' COMMENT '描述',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='广告位表';

-- 广告表
CREATE TABLE IF NOT EXISTS `cs_ad` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `position_id` int(10) unsigned NOT NULL COMMENT '广告位ID',
  `title` varchar(200) NOT NULL DEFAULT '' COMMENT '广告标题',
  `image` varchar(255) DEFAULT '' COMMENT '广告图片',
  `link` varchar(500) DEFAULT '' COMMENT '链接地址',
  `start_time` int(10) unsigned DEFAULT '0' COMMENT '开始时间',
  `end_time` int(10) unsigned DEFAULT '0' COMMENT '结束时间',
  `click_count` int(10) unsigned DEFAULT '0' COMMENT '点击次数',
  `sort` int(10) unsigned DEFAULT '0' COMMENT '排序',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `idx_position` (`position_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='广告表';

-- ============================================
-- 初始化数据
-- ============================================

-- 插入音乐分类
INSERT INTO `cs_music_category` (`name`, `pid`, `sort`, `status`) VALUES
('华语', 0, 1, 1),
('欧美', 0, 2, 1),
('日韩', 0, 3, 1),
('轻音乐', 0, 4, 1),
('电音', 0, 5, 1),
('古典', 0, 6, 1),
('爵士', 0, 7, 1),
('摇滚', 0, 8, 1),
('民谣', 0, 9, 1),
('说唱', 0, 10, 1);

-- 插入广告位
INSERT INTO `cs_ad_position` (`name`, `code`, `width`, `height`, `description`) VALUES
('首页顶部横幅', 'home_top_banner', 750, 300, '首页顶部广告位'),
('播放器广告', 'player_ad', 750, 100, '播放器页面广告'),
('个人中心广告', 'profile_ad', 750, 200, '个人中心广告位'),
('发现页广告', 'discover_ad', 750, 300, '发现页广告位');

-- 插入直播礼物
INSERT INTO `cs_live_gift` (`name`, `icon`, `price`, `sort`, `status`) VALUES
('鲜花', '/assets/gift/flower.png', 1.00, 1, 1),
('棒棒糖', '/assets/gift/lollipop.png', 5.00, 2, 1),
('爱心', '/assets/gift/heart.png', 10.00, 3, 1),
('火箭', '/assets/gift/rocket.png', 50.00, 4, 1),
('跑车', '/assets/gift/car.png', 100.00, 5, 1),
('城堡', '/assets/gift/castle.png', 500.00, 6, 1);
