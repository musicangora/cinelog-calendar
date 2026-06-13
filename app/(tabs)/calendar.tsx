import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function CalendarScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Cinelog Calendar</Text>
      <Text style={styles.title}>カレンダー画面</Text>
      <Text style={styles.description}>
        ここから日付選択、日別一覧、新規登録導線を実装していきます。
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>この先ここに載るもの</Text>
        <Text style={styles.cardBody}>月表示カレンダー、選択した日の記録一覧、新規登録ボタン</Text>
      </View>

      <Link href="/modal/edit-log" asChild>
        <Pressable style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>登録編集モーダルを開く</Text>
        </Pressable>
      </Link>

      <Link href="/log/sample-log" asChild>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>詳細画面の空ルートを見る</Text>
        </Pressable>
      </Link>
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
  eyebrow: {
    color: '#0f766e',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
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
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#cbd5e1',
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
    padding: 20,
  },
  cardTitle: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    color: '#475569',
    fontSize: 15,
    lineHeight: 22,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  primaryButtonText: {
    color: '#f8fafc',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: '#94a3b8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  secondaryButtonText: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '600',
  },
});
