import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { removeFromPlaylist, clearPlaylist } from '../redux/slices/playerSlice';
import TrackPlayer from 'react-native-track-player';

const PlaylistModal = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const { playlist, currentTrack } = useSelector(state => state.player);
  const [playMode, setPlayMode] = useState('order'); // order, shuffle, repeat

  const handleRemove = (index) => {
    dispatch(removeFromPlaylist(index));
  };

  const handleClear = () => {
    dispatch(clearPlaylist());
    onClose();
  };

  const handlePlayModeChange = () => {
    const modes = ['order', 'shuffle', 'repeat'];
    const currentIndex = modes.indexOf(playMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setPlayMode(nextMode);
  };

  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'shuffle':
        return 'shuffle';
      case 'repeat':
        return 'repeat';
      default:
        return 'list';
    }
  };

  const getPlayModeText = () => {
    switch (playMode) {
      case 'shuffle':
        return '随机播放';
      case 'repeat':
        return '列表循环';
      default:
        return '顺序播放';
    }
  };

  const renderItem = ({ item, index }) => {
    const isPlaying = currentTrack && currentTrack.id === item.id;

    return (
      <View style={[styles.item, isPlaying && styles.itemActive]}>
        <View style={styles.itemLeft}>
          {isPlaying && (
            <Icon name="play" size={16} color="#667eea" style={styles.playingIcon} />
          )}
          <View style={styles.itemInfo}>
            <Text
              style={[styles.itemTitle, isPlaying && styles.itemTitleActive]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={styles.itemArtist} numberOfLines={1}>
              {item.singer_name}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => handleRemove(index)}>
          <Icon name="close-circle-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* 头部 */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={styles.playModeButton}
                onPress={handlePlayModeChange}
              >
                <Icon name={getPlayModeIcon()} size={20} color="#fff" />
                <Text style={styles.playModeText}>{getPlayModeText()}</Text>
              </TouchableOpacity>
              <Text style={styles.count}>({playlist.length})</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                <Icon name="trash-outline" size={20} color="#999" />
                <Text style={styles.clearText}>清空</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 播放列表 */}
          {playlist.length > 0 ? (
            <FlatList
              data={playlist}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              style={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="musical-notes-outline" size={60} color="#999" />
              <Text style={styles.emptyText}>播放列表为空</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    height: '60%',
    backgroundColor: '#1a1f3a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#0a0e27',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playModeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playModeText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  count: {
    fontSize: 14,
    color: '#999',
    marginLeft: 5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  clearText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 5,
  },
  list: {
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#0a0e27',
  },
  itemActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  playingIcon: {
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  itemTitleActive: {
    color: '#667eea',
  },
  itemArtist: {
    fontSize: 12,
    color: '#999',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginTop: 15,
  },
});

export default PlaylistModal;
