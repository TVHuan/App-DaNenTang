import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  ClipboardList,
  User,
} from 'lucide-react-native';

import { BottomTabParamList } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { SubjectsScreen } from '../screens/SubjectsScreen';
import { ScheduleScreen } from '../screens/ScheduleScreen';
import { AssignmentsScreen } from '../screens/AssignmentsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#18181B', // Zinc 900
        tabBarInactiveTintColor: '#A1A1AA', // Zinc 400
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Tổng quan',
          tabBarIcon: ({ color, size, focused }) => (
            <LayoutDashboard
              size={focused ? 22 : 20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tab.Screen
        name="SubjectsTab"
        component={SubjectsScreen}
        options={{
          tabBarLabel: 'Môn học',
          tabBarIcon: ({ color, size, focused }) => (
            <BookOpen
              size={focused ? 22 : 20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ScheduleTab"
        component={ScheduleScreen}
        options={{
          tabBarLabel: 'Thời khóa biểu',
          tabBarIcon: ({ color, size, focused }) => (
            <Calendar
              size={focused ? 22 : 20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tab.Screen
        name="AssignmentsTab"
        component={AssignmentsScreen}
        options={{
          tabBarLabel: 'Bài tập',
          tabBarIcon: ({ color, size, focused }) => (
            <ClipboardList
              size={focused ? 22 : 20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, size, focused }) => (
            <User
              size={focused ? 22 : 20}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E4E4E7', // Zinc 200
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
});
