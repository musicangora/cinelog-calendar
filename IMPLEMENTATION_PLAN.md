# IMPLEMENTATION PLAN

## MVP実装計画: Storybook込みの並列開発向けPR分解

### Summary

- UI並列開発の土台として `Web Storybook` を早期導入する
- Web版は `共有` `ドキュメント` `テスト` に強く、小さいPRを高速レビューする運用と相性がよい
- 進め方は `契約PR → 基盤PR → UI部品PR → 画面接続PR` に分け、UI担当が保存層待ちにならない状態を先に作る
- 各PRには `一言の受け入れ条件` を必ず付ける

### PR Breakdown

#### フェーズ0: 共有土台を最小で固定する

1. PR-00 `Expo/TypeScript/expo-router` のプロジェクト初期化  
   受け入れ条件: `アプリが起動し、Routerベースの空アプリが手元で表示できる`

2. PR-01 ルート骨格追加: `カレンダー` `ランキング` タブ、`詳細`、`登録編集モーダル` の空画面だけ作る  
   受け入れ条件: `4つの画面に遷移でき、画面構成がコード上で固定されている`

3. PR-02 ドメイン定義追加: `RatingKey` `Ratings` `MovieLog` `CreateMovieLogInput` `UpdateMovieLogInput`、日本語ラベル定数、総合点計算関数、入力正規化関数  
   受け入れ条件: `以後の実装が参照する型と計算ルールが1か所に揃っている`

4. PR-03 保存層インターフェース追加: `MovieLogRepository` の型、SQLite実装の雛形、DB初期化エントリだけ追加  
   受け入れ条件: `UIがDB詳細を知らずにRepository契約だけ参照できる`

5. PR-04 Web Storybook導入: Storybook起動、RNコンポーネント表示、stories配置規約を追加  
   受け入れ条件: `アプリ本体を起動しなくてもStorybook上でRN UI部品を確認できる`

6. PR-05 Storybook運用ルール追加: 対象コンポーネント基準、story命名、状態バリエーション、PRテンプレ追記  
   受け入れ条件: `UI PRで何をStorybook化するかがチーム内で迷わない`

#### フェーズ1: 依存の少ない基盤を並列で進める

7. PR-10 SQLiteスキーマ作成: `movie_logs` テーブル、インデックス、初期化処理  
   受け入れ条件: `初回起動時に必要テーブルとインデックスが自動作成される`

8. PR-11 Repository read系: `getById` `listByDate` `listByMonth` `listRanked` 実装  
   受け入れ条件: `保存済みデータを必要な単位で読み出せる`

9. PR-12 Repository write系: `create` `update` `delete`、`totalScore` 自動算出、`createdAt/updatedAt` 管理  
   受け入れ条件: `保存・更新・削除時に不変条件を崩さずデータ変更できる`

10. PR-13 画面共通UI部品: `EmptyState` `RatingLabel` など、画面依存の薄い部品をStorybookつきで追加  
    受け入れ条件: `複数画面で再利用する表示部品がStorybook上で独立確認できる`

11. PR-14 画面遷移契約: ルート引数、`selectedDate` の受け渡し方、保存後の戻り先仕様を固定する  
    受け入れ条件: `画面間の受け渡しルールが固定され、後続PRが同じ契約で作業できる`

#### フェーズ2: UI部品を先に並列実装し、その後に画面接続する

12. PR-20 カレンダー画面の月表示骨格と `selectedDate` 状態  
    受け入れ条件: `日付を選ぶと選択状態が画面上で変わる`

13. PR-21 日付別一覧 `DailyLogList` をStorybookつきで実装  
    受け入れ条件: `0件・1件・複数件の一覧状態をStorybookで確認できる`

14. PR-22 記録詳細表示部品をStorybookつきで実装  
    受け入れ条件: `保存済み1件の表示状態をStorybookで確認できる`

15. PR-23 `MovieLogForm` の入力骨格をStorybookつきで実装  
    受け入れ条件: `必要項目を入力でき、感想が空でも保存可能である`

16. PR-24 `RatingInput` をStorybookつきで実装  
    受け入れ条件: `5項目すべてで0.5刻み入力だけができる`

17. PR-25 カレンダー画面と `DailyLogList` の接続  
    受け入れ条件: `選択日の記録一覧が実データで表示される`

18. PR-26 詳細画面とRepository read系の接続  
    受け入れ条件: `一覧やランキングから開いた詳細に保存済みデータが表示される`

19. PR-27 新規作成フロー接続  
    受け入れ条件: `カレンダー起点で新規記録を作成し、その日の一覧に反映される`

20. PR-28 編集フロー接続  
    受け入れ条件: `既存記録を編集すると詳細と一覧に変更が反映される`

21. PR-29 削除フロー接続  
    受け入れ条件: `確認後に記録を削除でき、一覧から消える`

22. PR-30 未保存変更ガード  
    受け入れ条件: `未保存変更がある状態では確認なしに画面を閉じられない`

#### フェーズ3: 次の小リリースとしてランキングを追加する

23. PR-31 ランキング画面骨格と空状態  
    受け入れ条件: `記録0件でもランキング画面が破綻せず説明を表示できる`

24. PR-32 ランキング行コンポーネントをStorybookつきで実装  
    受け入れ条件: `順位・タイトル・総合点・日付の表示状態をStorybookで確認できる`

25. PR-33 `listRanked` 接続、並び順確認  
    受け入れ条件: `ランキングが仕様どおりの順序で表示される`

26. PR-34 ランキングから詳細遷移  
    受け入れ条件: `ランキングの各行から詳細画面へ遷移できる`

27. PR-35 編集・削除後のランキング再取得と反映確認  
    受け入れ条件: `編集や削除の結果がランキングに即時反映される`

### Storybook運用方針

- Storybook対象は `再利用部品` `フォーム部品` `一覧行` `空状態` を優先する
- `画面そのもの` より先に `画面を構成する部品` をstory化する
- 各UI PRは原則 `実装 + stories` をセットにする
- storyは最低でも `default` `empty` `loading不要なら省略` `long text` `edge case` のうち必要なものを持つ
- PRレビューではアプリ起動確認より先にStorybookで見た目と状態差分を見る

### Issueラベル運用

- 着手状況のラベルは以下を使う
- `status:todo`
- `status:doing`
- `status:review`
- `status:blocked`
- `status:done`

- フェーズ識別のラベルは以下を使う
- `phase:0`
- `phase:1`
- `phase:2`
- `phase:3`

- 運用ルール
- `status:*` は1issueにつき1つだけ付ける
- `phase:*` は1issueにつき1つだけ付ける
- issue作成直後は `status:todo` を付ける
- 実装を始めたら `status:doing` に切り替える
- PRを作ってレビュー待ちに入ったら `status:review` に切り替える
- 依存や障害で進められない場合は `status:blocked` に切り替える
- マージ完了またはタスク完了時に `status:done` に切り替える
- `status:blocked` を外したら、元の進行状態に応じて `status:doing` か `status:review` に戻す

### Team Flow

- レーンA: 基盤担当。初期化、型、Repository、DB
- レーンB: Storybook/UI部品担当。共通UI、一覧、詳細表示部品
- レーンC: フォーム担当。`MovieLogForm` `RatingInput` 未保存変更
- レーンD: 画面接続担当。カレンダー、詳細接続、ランキング接続、結合確認

- 3人の場合:
  - BとDをまとめ、`UI部品 + 画面接続` を兼務する

- 5人の場合:
  - Eを追加し、`Storybook整備/ビジュアル確認/テスト補強` を専任にする

### Test Plan

- ロジックテスト:
  - 総合点計算が仕様通りであること
  - `0.5` 刻み以外を弾くこと
  - `0.0〜5.0` の範囲外を弾くこと

- Repositoryテスト:
  - 新規保存で `totalScore` が自動算出されること
  - 更新で `updatedAt` が変わること
  - 削除後に取得できないこと
  - `listByDate` `listByMonth` `listRanked` が期待順で返ること

- UI確認:
  - Storybook上で各部品の主要状態を確認できること
  - アプリ接続後もStorybookで定義した見た目と大きく乖離しないこと
  - カレンダーから登録、詳細、編集、削除、ランキング反映まで通ること

### Assumptions

- 初期は `Web Storybookのみ` を導入し、Native Storybookは必要になった時点で追加する
- Storybookは「UI並列開発とレビュー高速化」のために使い、保存層や画面遷移の代替にはしない
- UIは日本語のみ、保存はローカルのみ、評価項目は固定5項目のまま進める
- 検索、統計、共有、設定、同期はこの計画から除外する
