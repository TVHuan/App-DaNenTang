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

import { ROUTES } from './routes';
import HomeStack from './HomeStack';
import CourseStack from './CourseStack';
import ScheduleStack from './ScheduleStack';
import AssignmentStack from './AssignmentStack';
import ProfileStack from './ProfileStack';
import { useAppData } from '../context/AppDataContext';
import colors from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { pendingAssignmentsCount } = useAppData();

  return (
    <Tab.Navigator
      initialRouteName={ROUTES.HOME_TAB}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tab.Screen
        name={ROUTES.HOME_TAB}
        component={HomeStack}
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
        name={ROUTES.COURSES_TAB}
        component={CourseStack}
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
        name={ROUTES.SCHEDULE_TAB}
        component={ScheduleStack}
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
        name={ROUTES.ASSIGNMENTS_TAB}
        component={AssignmentStack}
        options={{
          tabBarLabel: 'Bài tập',
          tabBarBadge:
            pendingAssignmentsCount > 0 ? pendingAssignmentsCount : undefined,
          tabBarBadgeStyle: styles.badge,
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
        name={ROUTES.PROFILE_TAB}
        component={ProfileStack}
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
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    height: Platform.OS === 'ios' ? 88 : 64,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    shadowColor: colors.shadow,
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
  badge: {
    backgroundColor: colors.danger,
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 14,
  },
});
