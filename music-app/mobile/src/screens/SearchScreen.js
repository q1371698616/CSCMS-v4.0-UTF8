import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { searchMusic, clearSearchResults } from '../redux/slices/musicSlice';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { searchResults, loading } = useSelector(state => state.music);
  const [keyword, setKeyword] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [hotSearches] = useState([
    '流行音乐',
    '经典老歌',
    '华语金曲',
    '欧美热歌',
    '抖音神曲',
    '钢琴曲',
    '纯音乐',
    '励志歌曲',
  ]);

  useEffect(() => {
    loadSearchHistory();
    return () => {
      dispatch(clearSearchResults());
    };
  }, []);

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) {
        setSearchHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('加载搜索历史失败:', error);
    }
  };

  const saveSearchHistory = async (text) => {
    try {
      let history = [...searchHistory];
      // 移除重复项
      history = history.filter(item => item !== text);
      // 添加到开头
      history.unshift(text);
      // 只保留最近10条
      history = history.slice(0, 10);

      setSearchHistory(history);
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('保存搜索历史失败:', error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('searchHistory');
      setSearchHistory([]);
    } catch (error) {
      console.error('清除搜索历史失败:', error);
    }
  };

  const handleSearch = (text) => {
    if (!text.trim()) return;

    setKeyword(text);
    saveSearchHistory(text);
    dispatch(searchMusic({ keyword: text, page: 1 }));
  };

  const handleMusicPress = (music) => {
    navigation.navigate('MusicDetail', { musicId: music.id });
  };

  const renderMusicItem = ({ item }) => (
    <TouchableOpacity
      style={styles.musicItem}
      onPress={() => handleMusicPress(item)}
    >
      <Image source={{ uri: item.cover }} style={styles.musicCover} />
      <View style={styles.musicInfo}>
        <View style={styles.musicTitleRow}>
          <Text style={styles.musicTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.is_vip && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP</Text>
            </View>
          )}
        </View>
        <Text style={styles.musicArtist} numberOfLines={1}>
          {item.singer_name}
        </Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Icon name="play-circle" size={32} color="#667eea" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSearchHistory = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>搜索历史</Text>
        <TouchableOpacity onPress={clearHistory}>
          <Icon name="trash-outline" size={20} color="#999" />
        </TouchableOpacity>
      </View>
      <View style={styles.tagContainer}>
        {searchHistory.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.tag}
            onPress={() => handleSearch(item)}
          >
            <Text style={styles.tagText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderHotSearch = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>热门搜索</Text>
      </View>
      <View style={styles.tagContainer}>
        {hotSearches.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tag, styles.hotTag]}
            onPress={() => handleSearch(item)}
          >
            <Text style={styles.tagText}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 搜索栏 */}
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索音乐、歌手、专辑"
            placeholderTextColor="#999"
            value={keyword}
            onChangeText={setKeyword}
            onSubmitEditing={() => handleSearch(keyword)}
            returnKeyType="search"
            autoFocus
          />
          {keyword !== '' && (
            <TouchableOpacity onPress={() => setKeyword('')}>
              <Icon name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity onPress={() => handleSearch(keyword)}>
          <Text style={styles.searchButton}>搜索</Text>
        </TouchableOpacity>
      </View>

      {/* 搜索结果 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderMusicItem}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.resultList}
        />
      ) : keyword !== '' ? (
        <View style={styles.emptyContainer}>
          <Icon name="search-outline" size={80} color="#999" />
          <Text style={styles.emptyText}>未找到相关结果</Text>
        </View>
      ) : (
        <View style={styles.defaultContent}>
          {searchHistory.length > 0 && renderSearchHistory()}
          {renderHotSearch()}
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#1a1f3a',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0a0e27',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#fff',
    marginLeft: 8,
  },
  searchButton: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: 'bold',
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
  defaultContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#1a1f3a',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  hotTag: {
    backgroundColor: 'rgba(102, 126, 234, 0.2)',
  },
  tagText: {
    fontSize: 14,
    color: '#fff',
  },
  resultList: {
    padding: 16,
  },
  musicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  musicCover: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  musicInfo: {
    flex: 1,
    marginLeft: 12,
  },
  musicTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  musicTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
  },
  vipBadge: {
    backgroundColor: '#FFD700',
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 6,
  },
  vipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  musicArtist: {
    fontSize: 12,
    color: '#999',
  },
  playButton: {
    padding: 5,
  },
});

export default SearchScreen;
