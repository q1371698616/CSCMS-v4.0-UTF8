import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import TrackPlayer, {
  useProgress,
  usePlaybackState,
  State,
} from 'react-native-track-player';
import {
  setIsPlaying,
  setCurrentTime,
  playNext,
  playPrevious,
} from '../redux/slices/playerSlice';

const { width } = Dimensions.get('window');

const MusicPlayer = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector(state => state.player);
  const progress = useProgress();
  const playbackState = usePlaybackState();

  useEffect(() => {
    if (currentTrack) {
      setupPlayer();
    }
  }, [currentTrack]);

  useEffect(() => {
    dispatch(setCurrentTime(progress.position));
  }, [progress.position]);

  const setupPlayer = async () => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: currentTrack.id,
        url: currentTrack.music_url,
        title: currentTrack.title,
        artist: currentTrack.singer_name,
        artwork: currentTrack.cover,
      });
      await TrackPlayer.play();
      dispatch(setIsPlaying(true));
    } catch (error) {
      console.error('播放器设置失败:', error);
    }
  };

  const togglePlayback = async () => {
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      await TrackPlayer.pause();
      dispatch(setIsPlaying(false));
    } else {
      await TrackPlayer.play();
      dispatch(setIsPlaying(true));
    }
  };

  const handlePrevious = async () => {
    dispatch(playPrevious());
  };

  const handleNext = async () => {
    dispatch(playNext());
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate('Player')}
      activeOpacity={0.9}
    >
      <LinearGradient
        colors={['rgba(102, 126, 234, 0.8)', 'rgba(118, 75, 162, 0.8)']}
        style={styles.gradient}
      >
        <Image
          source={{ uri: currentTrack.cover }}
          style={styles.cover}
          resizeMode="cover"
        />

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentTrack.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentTrack.singer_name}
          </Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePrevious} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="play-skip-back" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayback} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon
              name={isPlaying ? 'pause-circle' : 'play-circle'}
              size={40}
              color="#fff"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNext} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="play-skip-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.playlistButton}>
          <Icon name="list" size={24} color="#fff" />
        </TouchableOpacity>

        {/* 进度条 */}
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(progress.position / progress.duration) * 100}%` },
            ]}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: 60,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  cover: {
    width: 45,
    height: 45,
    borderRadius: 5,
  },
  info: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  artist: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  playlistButton: {
    padding: 5,
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
  },
});

export default MusicPlayer;
