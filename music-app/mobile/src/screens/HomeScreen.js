import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  FlatList,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecommendMusic } from '../redux/slices/musicSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { recommendList } = useSelector(state => state.music);

  useEffect(() => {
    dispatch(fetchRecommendMusic(10));
  }, [dispatch]);

  const banners = [
    { id: 1, image: 'https://via.placeholder.com/350x150/667eea/ffffff?text=Banner+1' },
    { id: 2, image: 'https://via.placeholder.com/350x150/764ba2/ffffff?text=Banner+2' },
  ];

  const renderMusicItem = ({ item }) => (
    <TouchableOpacity
      style={styles.musicItem}
      onPress={() => navigation.navigate('MusicDetail', { musicId: item.id })}
    >
      <Image source={{ uri: item.cover }} style={styles.musicCover} />
      <Text style={styles.musicTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.musicArtist} numberOfLines={1}>
        {item.singer_name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>音乐</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Icon name="search" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* 轮播图 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerContainer}
        >
          {banners.map(banner => (
            <Image
              key={banner.id}
              source={{ uri: banner.image }}
              style={styles.banner}
            />
          ))}
        </ScrollView>

        {/* 快捷入口 */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['#fa709a', '#fee140']}
              style={styles.quickActionIcon}
            >
              <Icon name="heart" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickActionText}>每日推荐</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['#30cfd0', '#330867']}
              style={styles.quickActionIcon}
            >
              <Icon name="musical-notes" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickActionText}>歌单</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['#a8edea', '#fed6e3']}
              style={styles.quickActionIcon}
            >
              <Icon name="radio" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickActionText}>电台</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickAction}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.quickActionIcon}
            >
              <Icon name="trophy" size={24} color="#fff" />
            </LinearGradient>
            <Text style={styles.quickActionText}>排行榜</Text>
          </TouchableOpacity>
        </View>

        {/* 推荐音乐 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>推荐音乐</Text>
            <TouchableOpacity>
              <Text style={styles.sectionMore}>更多 ></Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recommendList}
            renderItem={renderMusicItem}
            keyExtractor={item => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* 热门歌手 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>热门歌手</Text>
            <TouchableOpacity>
              <Text style={styles.sectionMore}>更多 ></Text>
            </TouchableOpacity>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  banner: {
    width: 350,
    height: 150,
    borderRadius: 10,
    marginRight: 10,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  quickAction: {
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#fff',
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  sectionMore: {
    fontSize: 14,
    color: '#999',
  },
  musicItem: {
    width: 120,
    marginLeft: 16,
  },
  musicCover: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  musicTitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 4,
  },
  musicArtist: {
    fontSize: 12,
    color: '#999',
  },
});

export default HomeScreen;
