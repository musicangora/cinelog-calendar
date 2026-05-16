# DESIGNDOC

## 概要

`cinelog-calendar` は、映画の鑑賞記録を日付単位で残し、あとからカレンダーとランキングで振り返れるモバイルアプリです。  
MVPでは `Expo + React Native + TypeScript` を前提とし、日本語UI・ローカル保存・単一端末利用で成立する構成に絞ります。

このドキュメントは、実装前に設計を固定しておくべき箇所を洗い出し、MVPの詳細設計としてまとめたものです。

## 今回設計しておくべき箇所

MVPの実装に入る前に、少なくとも以下は先に固定しておく必要があります。

- 画面構成とナビゲーション
- カレンダー起点の操作フロー
- 登録編集画面のUI構成と挙動
- データモデルと不変条件
- SQLiteスキーマと保存責務
- 総合点計算ルール
- ランキング表示ルール
- バリデーションと未保存状態の扱い
- 状態管理とデータ取得の責務分離
- MVP時点のテスト対象

## 前提とスコープ

- UIは日本語のみ対応
- ログイン機能なし
- データ保存はローカルのみ
- 1日に複数件の記録が可能
- 評価項目は固定5項目
- MVPでは検索、共有、統計、画像添付、クラウド同期は対象外

## 画面設計

### 1. タブ構成

MVPでは下部タブを2つ持つ構成にする。

- `カレンダー`
- `ランキング`

初期表示は `カレンダー` タブとする。

### 2. ルーティング方針

`expo-router` を採用し、タブとモーダルルートを使って構成する。

想定ルート構成:

```text
app/
  (tabs)/
    calendar.tsx
    ranking.tsx
  log/
    [id].tsx
  modal/
    edit-log.tsx
```

ルーティング責務は以下の通り。

- `calendar.tsx`
  - 月表示カレンダー
  - 選択日付の記録一覧
  - 新規登録導線
- `ranking.tsx`
  - 総合点順の一覧表示
- `log/[id].tsx`
  - 記録詳細表示
  - 編集導線
- `modal/edit-log.tsx`
  - 新規登録・編集共通画面

### 3. 登録編集画面の表示方式

登録編集は `モーダルルートベースのハイブリッド設計` にする。

- iOS
  - `formSheet` を優先
  - 親画面の文脈を保ちつつ入力できる体験を目指す
- Android
  - 入力のしやすさを優先し、全画面寄りの `modal` または `fullScreenModal` を許容

純粋な小型ボトムシートだけで完結する形にはしない。  
理由は、タイトル入力、5項目評価、感想入力、保存、削除、未保存確認まで含むため、フォームとして一定の広さが必要だからです。

## 画面ごとの詳細設計

### 1. カレンダー画面

責務:

- 月表示カレンダーを見せる
- 日付ごとの記録有無を視覚化する
- 選択日の記録一覧を見せる
- 新規登録へ進める

主要UI:

- ヘッダー
  - 画面タイトル `カレンダー`
- 月表示カレンダー
  - 選択中の日付を強調表示
  - 記録がある日にはマーカーまたは件数表示
- 日別記録一覧
  - タイトル
  - 総合点
  - 必要最小限の補助情報
- 追加ボタン
  - 選択日を引き継いで登録画面を開く

状態:

- `currentMonth`
- `selectedDate`
- `selectedDateLogs`

操作フロー:

1. カレンダー表示
2. 日付をタップ
3. その日の記録一覧を更新
4. 追加ボタンまたは空状態導線から登録画面を開く

空状態:

- その日に記録がない場合は、空メッセージと登録導線を表示する

### 2. 登録編集画面

責務:

- 新規記録の作成
- 既存記録の編集
- 必須入力のチェック
- 保存または削除

モード:

- 新規登録モード
- 編集モード

入力項目:

- `watchedOn`
- `title`
- `story`
- `character`
- `visual`
- `music`
- `rewatch`
- `note`

入力ルール:

- `watchedOn` は初期表示時に選択日をセットする
- `watchedOn` は画面内で変更可能にする
- `title` は必須
- `note` は任意
- 各評価は `0.0` から `5.0` までの `0.5` 刻み

画面構成:

- ヘッダー
  - 新規時: `記録を追加`
  - 編集時: `記録を編集`
  - 閉じる操作
- 本文
  - 日付入力
  - タイトル入力
  - 評価5項目
  - 感想入力
- フッター
  - 保存ボタン
  - 編集時のみ削除ボタン

総合点表示:

- 入力中には表示しない
- 保存時にのみ同じ計算ロジックで `totalScore` を確定する
- 保存後、日別一覧・詳細画面・ランキング画面で確認できるようにする

評価入力UI:

- 第一候補は星型UIとする
- 星タップまたは同等の操作で `0.5` 刻みを入力できる設計を目指す
- ただし実装コストが高くMVPの進行を妨げる場合は、星型に限定せず `0.5` 刻みを正しく入力できる代替UIを許容する
- 重要なのは見た目よりも、`0.5` 刻みの入力が直感的で、誤入力しにくいこと

保存後の遷移:

- 保存後はカレンダーへ戻る
- ただし単純に月画面へ戻すのではなく、保存対象日の一覧が見える状態に戻す

未保存変更:

- 変更がある状態で閉じる、戻る、別画面へ遷移する場合は確認ダイアログを出す

削除:

- 編集モードでのみ表示
- 削除前に確認ダイアログを出す
- 削除後は対象日の一覧へ戻す

### 3. 記録詳細画面

責務:

- 保存済み記録を読みやすく表示する
- 編集へ進める

表示項目:

- タイトル
- 観た日付
- 5項目の評価
- 総合点
- 感想
  - 空でも保存可能

主要操作:

- 編集ボタン

MVPでは詳細画面から直接複雑な派生機能へはつなげない。

### 4. ランキング画面

責務:

- 総合点の高い順に記録を並べる
- 同点時の順序も安定させる
- 各記録の詳細へ遷移できるようにする

表示項目:

- 順位
- タイトル
- 総合点
- 観た日付

並び順:

1. `totalScore DESC`
2. `watchedOn DESC`
3. `createdAt DESC`

空状態:

- 記録がまだない場合は、ランキング未生成の説明を表示する

## データ設計

### 1. ドメインモデル

```ts
type RatingKey = "story" | "character" | "visual" | "music" | "rewatch";

type Ratings = {
  story: number;
  character: number;
  visual: number;
  music: number;
  rewatch: number;
};

type MovieLog = {
  id: string;
  watchedOn: string; // YYYY-MM-DD
  title: string;
  ratings: Ratings;
  totalScore: number; // 0-100
  note: string;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
};
```

### 2. 不変条件

- `watchedOn` は `YYYY-MM-DD`
- `title` は空文字不可
- `ratings` は5項目すべて保持する
- 各評価値は `0.0` から `5.0` の範囲内
- 各評価値は `0.5` 刻み
- `totalScore` は `ratings` から必ず再計算可能
- `createdAt` は作成時のみ設定
- `updatedAt` は更新時に必ず更新

### 3. 表示ラベル定義

内部キーと表示ラベルは分離し、アプリ内では定数として管理する。

```ts
const RATING_LABELS: Record<RatingKey, string> = {
  story: "ストーリー",
  character: "キャラクター",
  visual: "ビジュアル",
  music: "楽曲",
  rewatch: "リピートしたいか",
};
```

## ストレージ設計

### 1. 保存方式

ローカル保存には `expo-sqlite` を使う。  
MVPでは単一テーブルで始め、評価項目が固定であることを活かして列構造をシンプルに保つ。

ORMは `drizzle-orm` を採用する。  
Web開発で馴染みのある `Prisma` は今回は採用しない。理由は、Expo / React Native のローカルSQLite前提では `expo-sqlite` と `Drizzle` の方が構成が軽く、MVPとの相性が良いため。

### 2. テーブル設計

想定テーブル名: `movie_logs`

`note` は感想未入力でも保存可能だが、MVPでは `NULL` と空文字を区別しない。  
そのため `TEXT NOT NULL DEFAULT ''` として扱い、アプリ側でも常に文字列として処理する。

```sql
CREATE TABLE movie_logs (
  id TEXT PRIMARY KEY NOT NULL,
  watched_on TEXT NOT NULL,
  title TEXT NOT NULL,
  story REAL NOT NULL,
  character REAL NOT NULL,
  visual REAL NOT NULL,
  music REAL NOT NULL,
  rewatch REAL NOT NULL,
  total_score INTEGER NOT NULL,
  note TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

### 3. インデックス

MVPでは以下を作る。

- `watched_on` 用インデックス
- `total_score` 用インデックス

想定:

```sql
CREATE INDEX idx_movie_logs_watched_on ON movie_logs(watched_on);
CREATE INDEX idx_movie_logs_total_score ON movie_logs(total_score DESC);
```

### 4. Repository責務

UI層から直接SQLiteを触らず、Repositoryを経由する。

想定インターフェース:

```ts
type CreateMovieLogInput = {
  watchedOn: string;
  title: string;
  ratings: Ratings;
  note: string;
};

type UpdateMovieLogInput = CreateMovieLogInput & {
  id: string;
};

interface MovieLogRepository {
  listByDate(date: string): Promise<MovieLog[]>;
  listByMonth(month: string): Promise<MovieLog[]>;
  listRanked(): Promise<MovieLog[]>;
  getById(id: string): Promise<MovieLog | null>;
  create(input: CreateMovieLogInput): Promise<MovieLog>;
  update(input: UpdateMovieLogInput): Promise<MovieLog>;
  delete(id: string): Promise<void>;
}
```

Repository内で担当すること:

- DB初期化
- SQL発行
- レコードとドメインモデルの相互変換
- 保存時の `totalScore` 計算適用
- `createdAt` / `updatedAt` 管理

## 計算ロジック設計

### 1. 総合点

各項目のスコアに `4` を掛けて合計する。

```ts
totalScore =
  story * 4 +
  character * 4 +
  visual * 4 +
  music * 4 +
  rewatch * 4;
```

### 2. 丸め方

0.5刻み入力なので、小数誤差を避けるために保存前に正規化する。

方針:

- 入力値は `0.5` 単位でのみ受け入れる
- `totalScore` は整数として保存する

例:

- 全項目 `5.0` → `100`
- 全項目 `2.5` → `50`
- `5.0, 4.5, 4.0, 3.5, 3.0` → `80`

## バリデーション設計

### 1. 登録編集画面

- タイトル未入力では保存不可
- 評価値が範囲外なら保存不可
- 評価値が `0.5` 刻みでなければ保存不可
- 日付形式が不正なら保存不可
- 感想未入力ではエラーにしない

### 2. エラー表示方針

- 入力エラーは項目近くに短い日本語文言で表示
- 永続化エラーはトーストまたはアラートで表示
- 不正データは画面遷移前に弾く

## 状態管理設計

MVPでは過剰なグローバル状態管理は入れない。

方針:

- 画面ローカル状態は React state で管理
- データ取得と更新は Repository 経由
- 画面復帰時や保存後に必要な再取得を行う

必要になれば後からデータフェッチライブラリ導入を検討するが、MVPでは必須にしない。

## ライブラリ選定

### 採用ライブラリ

- `expo-router`
  - タブ構成とモーダルルート設計に合うため
- `expo-sqlite`
  - ローカル保存の基盤として使うため
- `drizzle-orm`
  - SQLiteとの相性、型安全、将来の拡張性のバランスが良いため
- `drizzle-kit`
  - スキーマ管理とマイグレーション補助のため
- `react-hook-form`
  - 登録編集フォームの入力管理をシンプルにするため
- `zod`
  - 入力バリデーションと型推論をまとめるため
- `@hookform/resolvers`
  - `react-hook-form` と `zod` を接続するため
- `react-native-calendars`
  - 月表示カレンダーと日付マーカーをMVPで早く成立させるため
- `react-native-safe-area-context`
  - 端末ごとの安全領域対応のため
- `@expo/vector-icons`
  - タブや補助UIのアイコン表示のため
- `react-native-gesture-handler`
  - モーダルやタッチ操作の安定化のため
- `react-native-svg`
  - 星型評価UIを実装する場合の描画手段として使えるため

### 見送るライブラリ

- `Prisma`
  - Webでは強力だが、今回は `expo-sqlite` と `Drizzle` の方が軽量で自然なため
- `react-native-paper`
  - Material寄りの見た目に寄りやすく、MVP段階でUIの自由度を狭めやすいため
- `Tamagui`
  - 強力だが、今回のMVPでは導入コストが相対的に高いため
- `NativeWind`
  - 今回はまずReact Native標準寄りの実装でシンプルに進めるため

### 状態管理ライブラリ方針

MVP開始時点では専用のグローバル状態管理ライブラリを入れない。  
画面ローカル state と Repository 呼び出しで十分に構成できるため。

将来的に画面横断状態が増えて更新管理が煩雑になった場合のみ、`zustand` などの導入を検討する。

## コンポーネント設計

MVPで先に分離しておくと良い単位:

- `CalendarView`
- `DailyLogList`
- `MovieLogForm`
- `RatingInput`
- `ScorePreview`
- `EmptyState`

責務分離の目安:

- 画面はデータ取得と遷移判断を持つ
- フォームは入力状態とバリデーションを持つ
- 評価入力は再利用可能な独立UIにする

## テスト設計

### 1. ロジックテスト

- 総合点計算
- 入力値正規化
- バリデーション
- SQLiteレコードと `MovieLog` の変換

### 2. Repositoryテスト

- 新規保存
- 更新
- 削除
- 日付別取得
- ランキング取得

### 3. 画面動作確認

- カレンダーから新規登録に進める
- 同日に複数件登録できる
- 保存後に日別一覧へ反映される
- 編集後にランキングへ反映される
- 未保存状態で閉じると確認が出る

## 将来拡張を見越した設計メモ

- 評価項目カスタマイズを見越し、表示ラベル定義は1か所にまとめる
- クラウド同期を見越し、Repositoryインターフェースで保存処理を隠蔽する
- 統計や検索を見越し、`watchedOn` と `totalScore` を明示列で持つ

## 実装開始時の優先順

1. Expoアプリの土台作成
2. ルーティングとタブ構成
3. SQLite初期化とRepository実装
4. カレンダー画面と日別一覧
5. 登録編集画面と評価入力
6. 詳細画面
7. ランキング画面
8. バリデーションとエラー表示
9. テスト追加
