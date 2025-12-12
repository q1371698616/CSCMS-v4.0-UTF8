import React, { useEffect } from 'react';
import { StatusBar, LogBox } from 'react-native';
import { Provider } from 'react-redux';
import FlashMessage from 'react-native-flash-message';
import TrackPlayer from 'react-native-track-player';
import store from './src/redux/store';
import AppNavigator from './src/navigation/AppNavigator';

// 忽略特定警告
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const App = () => {
  useEffect(() => {
    setupPlayer();
  }, []);

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
          TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
          TrackPlayer.CAPABILITY_SEEK_TO,
        ],
        compactCapabilities: [
          TrackPlayer.CAPABILITY_PLAY,
          TrackPlayer.CAPABILITY_PAUSE,
          TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        ],
      });
    } catch (error) {
      console.log('播放器初始化失败:', error);
    }
  };

  return (
    <Provider store={store}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0a0e27"
        translucent
      />
      <AppNavigator />
      <FlashMessage position="top" />
    </Provider>
  );
};

export default App;
