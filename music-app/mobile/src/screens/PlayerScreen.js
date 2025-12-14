import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Slider from '@react-native-community/slider';
import TrackPlayer, { useProgress } from 'react-native-track-player';
import {
  setIsPlaying,
  playNext,
  playPrevious,
  setRepeatMode,
  toggleShuffleMode,
} from '../redux/slices/playerSlice';

const { width, height } = Dimensions.get('window');

const PlayerScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, repeatMode, shuffleMode, playlist } = useSelector(
    state => state.player
  );
  const progress = useProgress();
  const [showLyrics, setShowLyrics] = useState(false);
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);

  // 旋转动画
  const [spinValue] = useState(new Animated.Value(0));

  useEffect(() => {
    let animation;
    if (isPlaying) {
      animation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        })
      );
      animation.start();
    } else {
      spinValue.stopAnimation();
    }
    return () => {
      if (animation) {
        animation.stop();
      }
    };
  }, [isPlaying]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const togglePlayback = async () => {
    const state = await TrackPlayer.getState();
    if (state === 'playing') {
      await TrackPlayer.pause();
      dispatch(setIsPlaying(false));
    } else {
      await TrackPlayer.play();
      dispatch(setIsPlaying(true));
    }
  };

  const handlePrevious = () => {
    dispatch(playPrevious());
  };

  const handleNext = () => {
    dispatch(playNext());
  };

  const handleSeek = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const toggleRepeat = () => {
    const modes = ['off', 'all', 'one'];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch(setRepeatMode(nextMode));
  };

  const toggleShuffle = () => {
    dispatch(toggleShuffleMode());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 'one':
        return 'repeat-one';
      case 'all':
        return 'repeat';
      default:
        return 'repeat-outline';
    }
  };

  if (!currentTrack) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="musical-notes-outline" size={80} color="#999" />
          <Text style={styles.emptyText}>暂无播放内容</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2', '#0a0e27']} style={styles.container}>
      <SafeAreaView style={styles.container}>
        {/* 头部 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-down" size={30} color="#fff" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {currentTrack.singer_name}
            </Text>
          </View>
          <TouchableOpacity>
            <Icon name="ellipsis-horizontal" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* 专辑封面 */}
          <View style={styles.coverContainer}>
            <View style={styles.coverWrapper}>
              <Animated.View style={[styles.coverInner, { transform: [{ rotate: spin }] }]}>
                <Image source={{ uri: currentTrack.cover }} style={styles.cover} />
              </Animated.View>
            </View>
            {/* 唱针 */}
            <View style={[styles.needle, isPlaying ? styles.needlePlaying : styles.needlePaused]} />
          </View>

          {/* 歌曲信息 */}
          <View style={styles.infoContainer}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{currentTrack.title}</Text>
                {currentTrack.is_vip && (
                  <View style={styles.vipBadge}>
                    <Text style={styles.vipText}>VIP</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={() => setLiked(!liked)}>
                <Icon
                  name={liked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={liked ? '#FF6B6B' : '#fff'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.artist}>{currentTrack.singer_name}</Text>
          </View>

          {/* 歌词/评论切换 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, !showLyrics && styles.tabActive]}
              onPress={() => setShowLyrics(false)}
            >
              <Text style={[styles.tabText, !showLyrics && styles.tabTextActive]}>歌词</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, showLyrics && styles.tabActive]}
              onPress={() => setShowLyrics(true)}
            >
              <Text style={[styles.tabText, showLyrics && styles.tabTextActive]}>评论</Text>
            </TouchableOpacity>
          </View>

          {/* 歌词显示区域 */}
          <View style={styles.lyricsContainer}>
            {!showLyrics ? (
              <ScrollView style={styles.lyrics}>
                <Text style={styles.lyricsText}>
                  这是一首好听的歌{'\n'}
                  暂无歌词{'\n'}
                  请尽情享受音乐吧{'\n'}
                </Text>
              </ScrollView>
            ) : (
              <View style={styles.comments}>
                <Text style={styles.emptyComment}>暂无评论</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* 播放控制区域 */}
        <View style={styles.controlsContainer}>
          {/* 进度条 */}
          <View style={styles.progressContainer}>
            <Slider
              style={styles.slider}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration || 1}
              minimumTrackTintColor="#fff"
              maximumTrackTintColor="rgba(255,255,255,0.3)"
              thumbTintColor="#fff"
              onSlidingComplete={handleSeek}
            />
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{formatTime(progress.position)}</Text>
              <Text style={styles.time}>{formatTime(progress.duration)}</Text>
            </View>
          </View>

          {/* 功能按钮 */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity onPress={() => setCollected(!collected)}>
              <Icon
                name={collected ? 'bookmark' : 'bookmark-outline'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="download-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="chatbubble-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="share-social-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* 播放控制 */}
          <View style={styles.playControls}>
            <TouchableOpacity onPress={toggleShuffle}>
              <Icon
                name={shuffleMode ? 'shuffle' : 'shuffle-outline'}
                size={24}
                color={shuffleMode ? '#667eea' : '#fff'}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePrevious}>
              <Icon name="play-skip-back" size={36} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={togglePlayback} style={styles.playButton}>
              <LinearGradient
                colors={['#fff', '#f0f0f0']}
                style={styles.playButtonGradient}
              >
                <Icon
                  name={isPlaying ? 'pause' : 'play'}
                  size={36}
                  color="#667eea"
                />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleNext}>
              <Icon name="play-skip-forward" size={36} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleRepeat}>
              <Icon
                name={getRepeatIcon()}
                size={24}
                color={repeatMode !== 'off' ? '#667eea' : '#fff'}
              />
            </TouchableOpacity>
          </View>

          {/* 播放列表按钮 */}
          <TouchableOpacity style={styles.playlistButton}>
            <Icon name="list" size={24} color="#fff" />
            <Text style={styles.playlistText}>{playlist.length}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerCenter: {
    flex: 1,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: 20,
  },
  coverContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    position: 'relative',
  },
  coverWrapper: {
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  coverInner: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.35,
    overflow: 'hidden',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  needle: {
    position: 'absolute',
    top: -20,
    right: width * 0.15,
    width: 100,
    height: 150,
    backgroundColor: '#333',
    borderRadius: 5,
    transformOrigin: 'top center',
  },
  needlePlaying: {
    transform: [{ rotate: '0deg' }],
  },
  needlePaused: {
    transform: [{ rotate: '-30deg' }],
  },
  infoContainer: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  vipBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  vipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  artist: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.6,
  },
  tabTextActive: {
    opacity: 1,
    fontWeight: 'bold',
  },
  lyricsContainer: {
    minHeight: 150,
    marginBottom: 20,
  },
  lyrics: {
    flex: 1,
  },
  lyricsText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 32,
    opacity: 0.8,
  },
  comments: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyComment: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.6,
  },
  controlsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  playControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playlistText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
});

export default PlayerScreen;
