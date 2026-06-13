import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0f766e',
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
        },
      }}>
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'カレンダー',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="ranking"
        options={{
          title: 'ランキング',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
