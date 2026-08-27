# anke-to v3 UI

## 開発者ガイド

### 環境構築

Node.js v24.15.0 以上の v24 系が必要です。Corepack を有効化すると、`package.json` で固定された pnpm を利用できます。

```
corepack enable
pnpm install
```

で依存パッケージをインストールします。

```
# 開発サーバーを起動
pnpm dev
# ビルド
pnpm build
# ビルドしたものを起動
pnpm start
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
- Nuxt v4 (Vue v3)
- Pinia
- Prettier
- ESLint
- Stylelint
- Vitest
