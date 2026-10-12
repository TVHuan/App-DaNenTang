import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { DrawerNavigator } from './DrawerNavigator';
import { StudentDetailScreen } from '../screens/StudentDetailScreen';
import { EditStudentScreen } from '../screens/EditStudentScreen';
import { AddStudentScreen } from '../screens/AddStudentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="DrawerRoot"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: '#F8FAFC' },
      }}
    >
      <Stack.Screen name="DrawerRoot" component={DrawerNavigator} />
      <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
      <Stack.Screen name="EditStudent" component={EditStudentScreen} />
      <Stack.Screen name="AddStudent" component={AddStudentScreen} />
    </Stack.Navigator>
  );
};
