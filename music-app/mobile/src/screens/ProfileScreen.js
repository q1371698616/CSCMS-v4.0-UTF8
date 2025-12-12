import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile } from '../redux/slices/userSlice';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { currentUser, isLoggedIn } = useSelector(state => state.user);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loginPrompt}>
          <Icon name="person-circle-outline" size={80} color="#999" />
          <Text style={styles.loginPromptText}>请先登录</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginButtonText}>去登录</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const menuItems = [
    [
      { icon: 'musical-notes', title: '歌曲', count: 0 },
      { icon: 'videocam', title: '视频', count: 0 },
      { icon: 'chatbubbles', title: '说说', count: 0 },
      { icon: 'trophy', title: '专辑', count: 0 },
    ],
  ];

  const featureItems = [
    { icon: 'wallet', title: '我的钱包', color: '#667eea' },
    { icon: 'ribbon', title: '任务中心', color: '#f093fb' },
    { icon: 'gift', title: '邀请好友', color: '#4facfe' },
    { icon: 'receipt', title: '我的订单', color: '#43e97b' },
    { icon: 'heart', title: '收藏喜欢', color: '#fa709a' },
    { icon: 'download', title: '我的下载', color: '#30cfd0' },
    { icon: 'headset', title: '最近听过', color: '#a8edea' },
    { icon: 'chatbox', title: '我的评论', color: '#fed6e3' },
    { icon: 'car', title: '驾驶中心', color: '#667eea' },
    { icon: 'help-circle', title: '帮助与反馈', color: '#764ba2' },
    { icon: 'settings', title: '关于我们', color: '#f093fb' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* 个人信息卡片 */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.profileCard}
        >
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: currentUser?.logo || 'https://via.placeholder.com/80' }}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.username}>{currentUser?.nichen || currentUser?.name}</Text>
              <Text style={styles.signature}>
                {currentUser?.qianm || '介绍一下自己已吧~'}
              </Text>
            </View>
          </View>

          {/* 统计数据 */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser?.stats?.coin || 0}</Text>
              <Text style={styles.statLabel}>金币</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser?.stats?.popularity || 0}</Text>
              <Text style={styles.statLabel}>人气</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser?.stats?.fans || 0}</Text>
              <Text style={styles.statLabel}>粉丝</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser?.stats?.visits || 0}</Text>
              <Text style={styles.statLabel}>访客</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser?.stats?.follow || 0}</Text>
              <Text style={styles.statLabel}>关注</Text>
            </View>
          </View>

          {/* VIP会员 */}
          <TouchableOpacity style={styles.vipCard}>
            <View style={styles.vipContent}>
              <Icon name="crown" size={20} color="#FFD700" />
              <Text style={styles.vipText}>开通会员尊享VIP特权</Text>
            </View>
            <TouchableOpacity style={styles.vipButton}>
              <Text style={styles.vipButtonText}>立即开通</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </LinearGradient>

        {/* 常用功能 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>常用功能</Text>
          <View style={styles.menuGrid}>
            {menuItems[0].map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem}>
                <Icon name={item.icon} size={28} color="#667eea" />
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuCount}>{item.count}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 功能列表 */}
        <View style={styles.featureList}>
          {featureItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.featureItem}>
              <View style={styles.featureLeft}>
                <View style={[styles.featureIcon, { backgroundColor: item.color }]}>
                  <Icon name={item.icon} size={20} color="#fff" />
                </View>
                <Text style={styles.featureTitle}>{item.title}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          ))}
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
  profileCard: {
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  signature: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  vipCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
  },
  vipContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  vipButton: {
    backgroundColor: '#FFD700',
    borderRadius: 15,
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  vipButtonText: {
    color: '#667eea',
    fontWeight: 'bold',
    fontSize: 14,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    backgroundColor: '#1a1f3a',
    borderRadius: 10,
    padding: 15,
  },
  menuItem: {
    width: '22%',
    alignItems: 'center',
  },
  menuTitle: {
    fontSize: 12,
    color: '#fff',
    marginTop: 5,
  },
  menuCount: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  featureList: {
    backgroundColor: '#1a1f3a',
    marginHorizontal: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#0a0e27',
  },
  featureLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 14,
    color: '#fff',
  },
  loginPrompt: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginPromptText: {
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
  loginButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
