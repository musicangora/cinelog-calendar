import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function LogDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>記録詳細</Text>
      <Text style={styles.description}>
        この画面は保存済みの映画記録を表示するための空ルートです。
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>対象ID: {id}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    gap: 16,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  title: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '700',
  },
  description: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecfeff',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  badgeText: {
    color: '#155e75',
    fontSize: 14,
    fontWeight: '600',
  },
});
