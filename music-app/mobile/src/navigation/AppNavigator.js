import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

// Screens
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import DiscoverScreen from '../screens/DiscoverScreen';
import MessageScreen from '../screens/MessageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MusicPlayer from '../components/MusicPlayer';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 底部导航栏
const TabNavigator = () => {
  const { unreadCount } = useSelector(state => state.message);

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Discover':
                iconName = focused ? 'compass' : 'compass-outline';
                break;
              case 'Music':
                iconName = 'musical-notes';
                break;
              case 'Message':
                iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                break;
              case 'Profile':
                iconName = focused ? 'person' : 'person-outline';
                break;
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#667eea',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: '#0a0e27',
            borderTopColor: '#1a1f3a',
            height: 60,
            paddingBottom: 8,
          },
          headerShown: false,
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{ tabBarLabel: '首页' }}
        />
        <Tab.Screen
          name="Discover"
          component={DiscoverScreen}
          options={{ tabBarLabel: '广场' }}
        />
        <Tab.Screen
          name="Music"
          component={HomeScreen}
          options={{
            tabBarLabel: '消息',
            tabBarIcon: ({ color, size }) => (
              <Icon name="musical-notes" size={size + 10} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Message"
          component={MessageScreen}
          options={{
            tabBarLabel: '消息',
            tabBarBadge: unreadCount.total > 0 ? unreadCount.total : null,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ tabBarLabel: '我的' }}
        />
      </Tab.Navigator>
      <MusicPlayer />
    </>
  );
};

// 主导航
const AppNavigator = () => {
  const { isLoggedIn } = useSelector(state => state.user);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLoggedIn ? (
          <Stack.Screen name="Main" component={TabNavigator} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
