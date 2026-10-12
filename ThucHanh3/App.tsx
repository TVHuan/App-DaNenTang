import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { StudentProvider } from './src/context/StudentContext';
import { RootNavigator } from './src/navigation/RootNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <StudentProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </StudentProvider>
    </SafeAreaProvider>
  );
}

export default App;
