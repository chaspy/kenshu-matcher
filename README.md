# Kenshu Matcher

B2B 向けに、従業員のキャリア目標に合った研修をおすすめする AI 支援型のプロトタイプです。人事向けダッシュボードと従業員向けキャリアプランナーを提供します。

## 技術構成

- フロントエンド: Vite + React + TypeScript
- バックエンド: Express + TypeScript + (ローカル実装の) Mastra 互換モジュール
- データベース: Prisma + SQLite
- Lint: TSLint (any 禁止・型定義必須)

## セットアップ

```bash
npm install
npm run build
```

`.env` をルートに作成してください (`.env.example` をコピー)。

- `DATABASE_URL` には `file:./dev.db` を指定するとリポジトリ直下に SQLite ファイルが生成されます。
- `OPENAI_API_KEY`、`GEMINI_API_KEY` に API キーを設定すると、AI 推薦要約に各モデルを利用します。未設定の場合はヒューリスティックに基づく要約を返します。

Prisma クライアントの生成とマイグレーションを実行します。

```bash
npm run prisma:generate --workspace apps/backend
npm run prisma:migrate --workspace apps/backend -- "dev --name init"
```

開発サーバーは以下で同時起動します。

```bash
npm run dev
```

- フロントエンド: http://localhost:5173
- バックエンド API: http://localhost:4000

## テストデータ

バックエンド起動時に YouTube 検索リンクを含む研修データとスキルが自動投入されます。

## Lint

```bash
npm run lint
```

## 主なフォルダ構成

```
apps/
  frontend/   # React + Vite フロントエンド
  backend/    # Express + Prisma バックエンド
packages/
  mastra-*    # AI 連携のための Mastra 互換ローカル実装
prisma/       # Prisma スキーマ
```
