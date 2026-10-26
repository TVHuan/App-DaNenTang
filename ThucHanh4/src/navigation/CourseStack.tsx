import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ROUTES } from './routes';
import CourseListScreen from '../screens/courses/CourseListScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import colors from '../theme/colors';

const Stack = createNativeStackNavigator();

export default function CourseStack() {
  return (
    <Stack.Navigator
      initialRouteName={ROUTES.COURSE_LIST}
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name={ROUTES.COURSE_LIST}
        component={CourseListScreen}
        options={{ title: 'Danh sách môn học' }}
      />
      <Stack.Screen
        name={ROUTES.COURSE_DETAIL}
        component={CourseDetailScreen}
        options={{ title: 'Chi tiết môn học' }}
      />
    </Stack.Navigator>
  );
}
