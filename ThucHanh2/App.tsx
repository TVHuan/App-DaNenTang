import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { RootStackParamList } from './src/types/student';
import { StudentProvider } from './src/context/StudentContext';
import { StudentListScreen } from './src/screens/StudentListScreen';
import { StudentDetailScreen } from './src/screens/StudentDetailScreen';
import { AddStudentScreen } from './src/screens/AddStudentScreen';
import { EditStudentScreen } from './src/screens/EditStudentScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <StudentProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="StudentList"
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: '#F8FAFC' },
            }}
          >
            <Stack.Screen name="StudentList" component={StudentListScreen} />
            <Stack.Screen name="StudentDetail" component={StudentDetailScreen} />
            <Stack.Screen name="AddStudent" component={AddStudentScreen} />
            <Stack.Screen name="EditStudent" component={EditStudentScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </StudentProvider>
    </SafeAreaProvider>
  );
}

export default App;
