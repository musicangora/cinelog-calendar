import { StyleSheet, Text, View } from 'react-native';

export default function RankingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ランキング画面</Text>
      <Text style={styles.description}>
        ここに総合点順の一覧を載せていきます。いまは空状態と画面責務だけを固定しています。
      </Text>

      <View style={styles.emptyState}>
        <Text style={styles.emptyStateTitle}>まだランキングはありません</Text>
        <Text style={styles.emptyStateBody}>
          映画の記録が追加されると、ここにタイトルと総合点が並びます。
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 18,
  },
  title: {
    color: '#0f172a',
    fontSize: 32,
    fontWeight: '700',
  },
  description: {
    color: '#334155',
    fontSize: 16,
    lineHeight: 24,
  },
  emptyState: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    padding: 20,
  },
  emptyStateTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  emptyStateBody: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
});
