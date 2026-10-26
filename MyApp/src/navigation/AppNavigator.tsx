import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList, MainTabParamList } from './types';
import { FeedScreen } from '../screens/FeedScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
import { WatchScreen } from '../screens/WatchScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { PostDetailScreen } from '../screens/PostDetailScreen';
import { CreatePostScreen } from '../screens/CreatePostScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1877F2',
        tabBarInactiveTintColor: '#65676B',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarLabel: 'Bảng tin',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconWrapper}>
              <Text style={[styles.tabIcon, { color }]}>{focused ? '🏠' : '🏚️'}</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarLabel: 'Bạn bè',
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Text style={styles.tabIcon}>👥</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Watch"
        component={WatchScreen}
        options={{
          tabBarLabel: 'Video',
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Text style={styles.tabIcon}>📺</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarLabel: 'Thông báo',
          tabBarBadge: 4,
          tabBarBadgeStyle: styles.badgeStyle,
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Text style={styles.tabIcon}>🔔</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarLabel: 'Menu',
          tabBarIcon: ({ color }) => (
            <View style={styles.iconWrapper}>
              <Text style={styles.tabIcon}>☰</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="PostDetail" component={PostDetailScreen} />
        <Stack.Screen
          name="CreatePost"
          component={CreatePostScreen}
          options={{ presentation: 'modal' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 58,
    paddingBottom: 6,
    paddingTop: 4,
    backgroundColor: '#FFFFFF',
    borderTopColor: '#CED0D4',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 20,
  },
  badgeStyle: {
    backgroundColor: '#E41E3F',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
