import { StyleSheet, Text, View } from 'react-native';

export default function EditLogModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>登録編集モーダル</Text>
      <Text style={styles.description}>
        ここにタイトル入力、5項目の評価、感想欄、保存と削除の操作を実装していきます。
      </Text>

      <View style={styles.checklist}>
        <Text style={styles.checklistItem}>- 日付は選択日を初期値にする</Text>
        <Text style={styles.checklistItem}>- 感想は空でも保存可能にする</Text>
        <Text style={styles.checklistItem}>- 総合点は保存後に表示する</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    gap: 18,
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
  checklist: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderRadius: 18,
    borderWidth: 1,
    gap: 10,
    padding: 18,
  },
  checklistItem: {
    color: '#334155',
    fontSize: 15,
    lineHeight: 22,
  },
});
