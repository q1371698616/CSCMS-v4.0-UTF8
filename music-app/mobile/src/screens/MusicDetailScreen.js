import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { getMusicDetail, likeMusic, collectMusic } from '../api/music';
import { setCurrentTrack, setPlaylist, setIsPlaying } from '../redux/slices/playerSlice';
import TrackPlayer from 'react-native-track-player';

const MusicDetailScreen = ({ route, navigation }) => {
  const { musicId } = route.params;
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);

  const [music, setMusic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [collected, setCollected] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState('detail'); // detail, comment

  useEffect(() => {
    loadMusicDetail();
  }, [musicId]);

  const loadMusicDetail = async () => {
    try {
      setLoading(true);
      const response = await getMusicDetail(musicId);
      setMusic(response.data);
      // 这里可以加载评论数据
      loadComments();
    } catch (error) {
      console.error('加载音乐详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = () => {
    // 模拟评论数据
    setComments([
      {
        id: 1,
        user: { name: '用户1', avatar: 'https://via.placeholder.com/40' },
        content: '非常好听的歌曲！',
        time: '2小时前',
        likes: 10,
      },
      {
        id: 2,
        user: { name: '用户2', avatar: 'https://via.placeholder.com/40' },
        content: '循环播放中，太棒了',
        time: '5小时前',
        likes: 5,
      },
    ]);
  };

  const handlePlay = async () => {
    try {
      await TrackPlayer.reset();
      await TrackPlayer.add({
        id: music.id,
        url: music.music_url,
        title: music.title,
        artist: music.singer_name,
        artwork: music.cover,
      });
      await TrackPlayer.play();

      dispatch(setCurrentTrack(music));
      dispatch(setPlaylist([music]));
      dispatch(setIsPlaying(true));

      navigation.navigate('Player');
    } catch (error) {
      console.error('播放失败:', error);
    }
  };

  const handleLike = async () => {
    try {
      await likeMusic(musicId);
      setLiked(!liked);
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  const handleCollect = async () => {
    try {
      await collectMusic(musicId);
      setCollected(!collected);
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    // 发送评论逻辑
    setCommentText('');
  };

  const renderCommentItem = ({ item }) => (
    <View style={styles.commentItem}>
      <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <Text style={styles.commentUser}>{item.user.name}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <View style={styles.commentFooter}>
          <Text style={styles.commentTime}>{item.time}</Text>
          <TouchableOpacity style={styles.commentLike}>
            <Icon name="heart-outline" size={16} color="#999" />
            <Text style={styles.commentLikeText}>{item.likes}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      </SafeAreaView>
    );
  }

  if (!music) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="musical-notes-outline" size={80} color="#999" />
          <Text style={styles.emptyText}>音乐不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 头部 */}
        <View style={styles.header}>
          <LinearGradient
            colors={['rgba(102, 126, 234, 0.8)', 'rgba(118, 75, 162, 0.8)', '#0a0e27']}
            style={styles.headerGradient}
          >
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="share-social-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.musicInfo}>
              <Image source={{ uri: music.cover }} style={styles.cover} />
              <View style={styles.infoRight}>
                <View style={styles.titleRow}>
                  <Text style={styles.title} numberOfLines={2}>
                    {music.title}
                  </Text>
                  {music.is_vip && (
                    <View style={styles.vipBadge}>
                      <Text style={styles.vipText}>VIP</Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity>
                  <Text style={styles.artist}>{music.singer_name}</Text>
                </TouchableOpacity>
                <View style={styles.stats}>
                  <View style={styles.statItem}>
                    <Icon name="play" size={14} color="#fff" />
                    <Text style={styles.statText}>{music.play_count || 0}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Icon name="heart" size={14} color="#fff" />
                    <Text style={styles.statText}>{music.like_count || 0}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Icon name="chatbubble" size={14} color="#fff" />
                    <Text style={styles.statText}>{music.comment_count || 0}</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
            <LinearGradient colors={['#667eea', '#764ba2']} style={styles.playButtonGradient}>
              <Icon name="play" size={24} color="#fff" />
              <Text style={styles.playButtonText}>播放</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Icon
              name={liked ? 'heart' : 'heart-outline'}
              size={24}
              color={liked ? '#FF6B6B' : '#fff'}
            />
            <Text style={styles.actionButtonText}>
              {liked ? '已赞' : '点赞'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleCollect}>
            <Icon
              name={collected ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={collected ? '#FFD700' : '#fff'}
            />
            <Text style={styles.actionButtonText}>
              {collected ? '已收藏' : '收藏'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="download-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>下载</Text>
          </TouchableOpacity>
        </View>

        {/* 标签页 */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'detail' && styles.tabActive]}
            onPress={() => setActiveTab('detail')}
          >
            <Text style={[styles.tabText, activeTab === 'detail' && styles.tabTextActive]}>
              详情
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'comment' && styles.tabActive]}
            onPress={() => setActiveTab('comment')}
          >
            <Text style={[styles.tabText, activeTab === 'comment' && styles.tabTextActive]}>
              评论 ({comments.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 内容区域 */}
        {activeTab === 'detail' ? (
          <View style={styles.detailContent}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>专辑</Text>
              <TouchableOpacity>
                <Text style={styles.detailValue}>{music.album_name || '未知专辑'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>时长</Text>
              <Text style={styles.detailValue}>
                {Math.floor(music.duration / 60)}:{String(music.duration % 60).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>音质</Text>
              <Text style={styles.detailValue}>{music.quality || '标准'}</Text>
            </View>
            {music.description && (
              <View style={styles.descriptionContainer}>
                <Text style={styles.detailLabel}>简介</Text>
                <Text style={styles.description}>{music.description}</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.commentContent}>
            <FlatList
              data={comments}
              renderItem={renderCommentItem}
              keyExtractor={item => String(item.id)}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyComments}>
                  <Text style={styles.emptyCommentsText}>暂无评论，快来抢沙发吧~</Text>
                </View>
              }
            />
          </View>
        )}
      </ScrollView>

      {/* 评论输入框 */}
      {activeTab === 'comment' && currentUser && (
        <View style={styles.commentInput}>
          <TextInput
            style={styles.input}
            placeholder="说点什么..."
            placeholderTextColor="#999"
            value={commentText}
            onChangeText={setCommentText}
          />
          <TouchableOpacity style={styles.sendButton} onPress={handleComment}>
            <Icon name="send" size={20} color="#667eea" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e27',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 20,
  },
  headerGradient: {
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  musicInfo: {
    flexDirection: 'row',
  },
  cover: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
  infoRight: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  title: {
    flex: 1,
    fontSize: 18,
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
  stats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  playButton: {
    flex: 2,
    marginRight: 10,
  },
  playButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 25,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#1a1f3a',
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    color: '#999',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  detailContent: {
    padding: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  detailLabel: {
    fontSize: 14,
    color: '#999',
  },
  detailValue: {
    fontSize: 14,
    color: '#fff',
  },
  descriptionContainer: {
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
    marginTop: 10,
  },
  commentContent: {
    padding: 20,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  commentContent: {
    flex: 1,
    marginLeft: 12,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 6,
  },
  commentText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 8,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  commentTime: {
    fontSize: 12,
    color: '#999',
  },
  commentLike: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentLikeText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  emptyComments: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyCommentsText: {
    fontSize: 14,
    color: '#999',
  },
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1a1f3a',
    borderTopWidth: 1,
    borderTopColor: '#0a0e27',
  },
  input: {
    flex: 1,
    backgroundColor: '#0a0e27',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    color: '#fff',
  },
  sendButton: {
    marginLeft: 10,
    padding: 8,
  },
});

export default MusicDetailScreen;
