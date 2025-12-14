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
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { getSingerDetail } from '../api/music';

const SingerDetailScreen = ({ route, navigation }) => {
  const { singerId } = route.params;
  const [singer, setSinger] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hot'); // hot, album, mv, info
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    loadSingerDetail();
  }, [singerId]);

  const loadSingerDetail = async () => {
    try {
      setLoading(true);
      const response = await getSingerDetail(singerId);
      setSinger(response.data);
    } catch (error) {
      console.error('加载歌手详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = () => {
    setFollowed(!followed);
  };

  const renderMusicItem = ({ item }) => (
    <TouchableOpacity
      style={styles.musicItem}
      onPress={() => navigation.navigate('MusicDetail', { musicId: item.id })}
    >
      <View style={styles.musicLeft}>
        <Text style={styles.musicIndex}>{item.index}</Text>
        <View style={styles.musicInfo}>
          <Text style={styles.musicTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.musicMeta} numberOfLines={1}>
            {item.album_name}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Icon name="play-circle-outline" size={28} color="#667eea" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAlbumItem = ({ item }) => (
    <TouchableOpacity
      style={styles.albumItem}
      onPress={() => navigation.navigate('AlbumDetail', { albumId: item.id })}
    >
      <Image source={{ uri: item.cover }} style={styles.albumCover} />
      <Text style={styles.albumTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.albumMeta} numberOfLines={1}>
        {item.release_date}
      </Text>
    </TouchableOpacity>
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

  if (!singer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Icon name="person-outline" size={80} color="#999" />
          <Text style={styles.emptyText}>歌手不存在</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 头部背景 */}
        <View style={styles.header}>
          <Image
            source={{ uri: singer.pic }}
            style={styles.headerBg}
            blurRadius={20}
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(10,14,39,0.9)', '#0a0e27']}
            style={styles.headerOverlay}
          >
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="share-social-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.singerInfo}>
              <Image source={{ uri: singer.pic }} style={styles.singerAvatar} />
              <Text style={styles.singerName}>{singer.name}</Text>
              {singer.nichen && (
                <Text style={styles.singerAlias}>{singer.nichen}</Text>
              )}
              <View style={styles.singerStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{singer.music_count || 0}</Text>
                  <Text style={styles.statLabel}>单曲</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{singer.album_count || 0}</Text>
                  <Text style={styles.statLabel}>专辑</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{singer.fans_count || 0}</Text>
                  <Text style={styles.statLabel}>粉丝</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* 操作按钮 */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.followButton, followed && styles.followedButton]}
            onPress={handleFollow}
          >
            <Icon
              name={followed ? 'checkmark' : 'add'}
              size={20}
              color="#fff"
            />
            <Text style={styles.followButtonText}>
              {followed ? '已关注' : '关注'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionIconButton}>
            <Icon name="shuffle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 标签页 */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'hot' && styles.tabActive]}
            onPress={() => setActiveTab('hot')}
          >
            <Text style={[styles.tabText, activeTab === 'hot' && styles.tabTextActive]}>
              热门歌曲
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'album' && styles.tabActive]}
            onPress={() => setActiveTab('album')}
          >
            <Text style={[styles.tabText, activeTab === 'album' && styles.tabTextActive]}>
              专辑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'info' && styles.tabActive]}
            onPress={() => setActiveTab('info')}
          >
            <Text style={[styles.tabText, activeTab === 'info' && styles.tabTextActive]}>
              详情
            </Text>
          </TouchableOpacity>
        </View>

        {/* 内容区域 */}
        <View style={styles.content}>
          {activeTab === 'hot' && (
            <FlatList
              data={singer.hot_music || []}
              renderItem={renderMusicItem}
              keyExtractor={item => String(item.id)}
              scrollEnabled={false}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>暂无歌曲</Text>
                </View>
              }
            />
          )}

          {activeTab === 'album' && (
            <FlatList
              data={singer.albums || []}
              renderItem={renderAlbumItem}
              keyExtractor={item => String(item.id)}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.albumRow}
              ListEmptyComponent={
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>暂无专辑</Text>
                </View>
              }
            />
          )}

          {activeTab === 'info' && (
            <View style={styles.infoContent}>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>国籍</Text>
                <Text style={styles.infoValue}>{singer.nat || '未知'}</Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>出生地</Text>
                <Text style={styles.infoValue}>{singer.city || '未知'}</Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>生日</Text>
                <Text style={styles.infoValue}>{singer.sr || '未知'}</Text>
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.infoLabel}>星座</Text>
                <Text style={styles.infoValue}>{singer.xingzuo || '未知'}</Text>
              </View>
              {singer.content && (
                <View style={styles.descriptionSection}>
                  <Text style={styles.infoLabel}>简介</Text>
                  <Text style={styles.description}>{singer.content}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
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
    height: 350,
    position: 'relative',
  },
  headerBg: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    flex: 1,
    padding: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  singerInfo: {
    alignItems: 'center',
  },
  singerAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    marginBottom: 15,
  },
  singerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  singerAlias: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginBottom: 20,
  },
  singerStats: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#667eea',
    borderRadius: 25,
    paddingVertical: 12,
    marginRight: 10,
  },
  followedButton: {
    backgroundColor: '#1a1f3a',
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  actionIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1a1f3a',
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    padding: 20,
  },
  musicItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  musicLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  musicIndex: {
    fontSize: 16,
    color: '#999',
    width: 30,
  },
  musicInfo: {
    flex: 1,
  },
  musicTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  musicMeta: {
    fontSize: 12,
    color: '#999',
  },
  playButton: {
    padding: 5,
  },
  albumRow: {
    justifyContent: 'space-between',
  },
  albumItem: {
    width: '48%',
    marginBottom: 20,
  },
  albumCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 10,
    marginBottom: 8,
  },
  albumTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  albumMeta: {
    fontSize: 12,
    color: '#999',
  },
  infoContent: {
    paddingVertical: 10,
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
  },
  descriptionSection: {
    marginTop: 20,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 22,
    marginTop: 10,
  },
  emptyList: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyListText: {
    fontSize: 14,
    color: '#999',
  },
});

export default SingerDetailScreen;
