# anke-to v3 UI

## 開発者ガイド

### 環境構築

Node.js v20 / npm v10 以上が必要です。

```
npm install
```

で依存パッケージをインストールします。

```
# 開発サーバーを起動
npm run dev
# ビルド
npm run build
# ビルドしたものを起動
npm run start
```

### VSCodeの設定

`.vscode/settings.template.json` を `.vscode/settings.json` にコピーしてください。

また推奨の拡張機能をインストールすることをオススメします。

### コミットメッセージ

以下のように書いてください。

```
[<種類>]: <変更内容>

<変更内容の詳細>
```

種類は以下のいずれかです。

- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `format`: コードの意味に影響を与えない変更 (空白、フォーマット、セミコロンの欠落など)
- `refactor`: バグを修正したり機能を追加したりするが、バグ修正や機能追加ではないコードの変更
- `perf`: パフォーマンスを向上させるコードの変更
- `test`: 欠けているテストや既存のテストの修正
- `chore`: ビルドプロセスの変更、または文書生成などの補助ツールやライブラリの変更
- `wip`: 作業中のコミット

### ブランチ運用

- `main` -> メインのブランチ
  - 自動でステージング環境にデプロイされる (ようにしたい)
- `feat/some-feature` -> 機能開発用のブランチ (`some-feature`のところは適宜書き換え)
  - `main` から切って、開発が終わったら `main` にマージする

## 技術スタック

- TypeScript
- Nuxt.js v3 (Vue.js v3)
- Pinia
- Prettier
- ESLint
- Stylelint
- Vitest
