import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUnreadCount, fetchMessageList } from '../redux/slices/messageSlice';
import Icon from 'react-native-vector-icons/Ionicons';

const MessageScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { unreadCount } = useSelector(state => state.message);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchUnreadCount());
  }, [dispatch]);

  const messageTypes = [
    {
      id: 'system',
      title: '系统通知',
      icon: 'notifications',
      color: '#FF6B6B',
      time: '11:34',
      message: '您已更新最新版本',
      badge: unreadCount.system,
    },
    {
      id: 'official',
      title: '官方公告',
      icon: 'megaphone',
      color: '#4ECB71',
      time: '11:34',
      message: '您的实名认证已通过，请尽快登陆...',
      badge: unreadCount.official,
    },
    {
      id: 'user',
      title: 'DJ-叶仔',
      icon: 'person-circle',
      color: '#667eea',
      time: '昨天',
      message: '你好，这首曲子我非常喜欢，可以下...',
      badge: 0,
    },
    {
      id: 'user2',
      title: 'DJ-泽健辉',
      icon: 'person-circle',
      color: '#764ba2',
      time: '10-01',
      message: '你好，这首曲子我非常喜欢，可以下...',
      badge: 0,
    },
  ];

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity
      style={styles.messageItem}
      onPress={() => {
        if (item.id === 'system' || item.id === 'official') {
          navigation.navigate('MessageList', { type: item.id, title: item.title });
        } else {
          navigation.navigate('Chat', { userId: item.id, userName: item.title });
        }
      }}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Icon name={item.icon} size={28} color="#fff" />
      </View>

      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={styles.messageTitle}>{item.title}</Text>
          <Text style={styles.messageTime}>{item.time}</Text>
        </View>
        <Text style={styles.messageText} numberOfLines={1}>
          {item.message}
        </Text>
      </View>

      {item.badge > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>消息</Text>
        <TouchableOpacity>
          <Icon name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messageTypes}
        renderItem={renderMessageItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
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
    backgroundColor: '#0a0e27',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  list: {
    padding: 0,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0a0e27',
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f3a',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
  },
  messageText: {
    fontSize: 14,
    color: '#999',
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MessageScreen;
