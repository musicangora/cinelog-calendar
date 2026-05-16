# cinelog-calendar

映画の鑑賞記録をカレンダー形式で残していくためのモバイルアプリです。  
`Expo + React Native + TypeScript` を前提に、日本語UI・ローカル保存・MVPから段階的に育てる方針で進めます。

## MVPでできること

- カレンダーから日付を選んで記録をつける
- 1日に複数件の映画記録を登録する
- 5つの固定評価項目を `0.5` 刻みで採点する
- 総合点を `100` 点満点で自動計算する
- ランキングタブで高得点順に映画タイトルを見る

## 評価項目

評価項目はMVPでは固定です。内部キーは英語、表示は日本語で扱います。

- `story`: ストーリー
- `character`: キャラクター
- `visual`: ビジュアル
- `music`: 楽曲
- `rewatch`: リピートしたいか

各項目の評価は `0.0` から `5.0` まで、`0.5` 刻みで入力します。

## データモデル概要

1件の映画記録は、主に以下の情報を保持します。

- `id`
- `watchedOn`
- `title`
- `ratings`
- `totalScore`
- `note`
- `createdAt`
- `updatedAt`

総合点は保存時に自動計算します。計算式は `各項目のスコア × 4 の合計` です。  
評価項目が5つなので、満点は `100` 点になります。

```ts
type MovieLog = {
  id: string;
  watchedOn: string; // YYYY-MM-DD
  title: string;
  ratings: {
    story: number;
    character: number;
    visual: number;
    music: number;
    rewatch: number;
  };
  totalScore: number;
  note: string;
  createdAt: string;
  updatedAt: string;
};
```

## 想定画面

- `カレンダー` タブ
  - 月表示カレンダーから日付を選択
  - 選択した日の記録一覧を確認
- `登録編集` 画面
  - モーダルルートベースのハイブリッド設計
  - タイトル、評価、感想を入力して保存
- `ランキング` タブ
  - 総合点の高い順にタイトルを表示

## 技術方針

- UI は `Expo + React Native + TypeScript`
- 画面遷移は `expo-router`
- ローカル保存は `expo-sqlite`
- 将来的なクラウドSQLite移行を見越して、UIから直接DBを触らず保存層を分離する

## 実装計画

- 実装の進め方とPR分解は [IMPLEMENTATION_PLAN.md](/Users/miiya/Develop/cinelog-calendar/IMPLEMENTATION_PLAN.md) を参照

## 今後の拡張候補

- 検索
- 統計
- 評価項目カスタマイズ
- クラウド同期

## セットアップ

Expoプロジェクト本体はこれから作成予定です。  
依存関係の導入手順や起動コマンドは、実装開始時にこのREADMEへ追記します。
