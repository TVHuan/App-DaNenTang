import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppDataProvider } from './src/context/AppDataContext';
import { SyncProvider } from './src/context/SyncContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AppDataProvider>
        <SyncProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SyncProvider>
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
