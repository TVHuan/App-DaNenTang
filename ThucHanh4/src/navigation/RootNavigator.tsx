import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { BottomTabNavigator } from './BottomTabNavigator';
import { SubjectDetailScreen } from '../screens/SubjectDetailScreen';
import { ScheduleDetailScreen } from '../screens/ScheduleDetailScreen';
import { AssignmentDetailScreen } from '../screens/AssignmentDetailScreen';
import { AcademicResultDetailScreen } from '../screens/AcademicResultDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="MainTabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#FAFAFA' },
      }}
    >
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen name="SubjectDetail" component={SubjectDetailScreen} />
      <Stack.Screen name="ScheduleDetail" component={ScheduleDetailScreen} />
      <Stack.Screen name="AssignmentDetail" component={AssignmentDetailScreen} />
      <Stack.Screen
        name="AcademicResultDetail"
        component={AcademicResultDetailScreen}
      />
    </Stack.Navigator>
  );
};
