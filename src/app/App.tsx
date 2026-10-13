import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { DialogHost } from '@/components/dialogs';

import { BottomTabs } from './navigation/BottomTabs';

export function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <BottomTabs />
      </NavigationContainer>
      <DialogHost />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
