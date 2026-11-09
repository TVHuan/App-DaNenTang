import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppDataProvider, useAppData } from './src/context/AppDataContext';
import { SyncProvider } from './src/context/SyncContext';
import AppNavigator from './src/navigation/AppNavigator';

function AppContent() {
  const { reloadAll } = useAppData();
  return (
    <SyncProvider onSynced={reloadAll}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SyncProvider>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} />
      <AppDataProvider>
        <AppContent />
      </AppDataProvider>
    </SafeAreaProvider>
  );
}
