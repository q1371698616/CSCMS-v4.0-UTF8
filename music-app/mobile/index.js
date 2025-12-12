/**
 * 音乐平台App入口文件
 */

import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);

// 注册播放器服务
TrackPlayer.registerPlaybackService(() => require('./src/services/playbackService'));
