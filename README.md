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
