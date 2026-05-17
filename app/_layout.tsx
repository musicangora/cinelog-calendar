import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="log/[id]" options={{ title: '記録詳細' }} />
        <Stack.Screen
          name="modal/edit-log"
          options={{
            presentation: Platform.OS === 'ios' ? 'formSheet' : 'modal',
            title: '記録を追加',
          }}
        />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
