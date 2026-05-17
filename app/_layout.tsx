import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { initializeDatabase } from '@/src/database';

export default function RootLayout() {
  useEffect(() => {
    void initializeDatabase();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="log/[id]" options={{ title: '記録詳細' }} />
        <Stack.Screen
          name="modal/edit-log"
          options={{ presentation: 'modal', title: '記録を追加' }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
