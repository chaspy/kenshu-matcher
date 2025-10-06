# Kenshu Matcher

B2B 向けに、従業員のキャリア目標に合った研修をおすすめする AI 支援型のプロトタイプです。人事向けダッシュボードと従業員向けキャリアプランナーを提供します。

## 技術構成

- フロントエンド: Vite + React + TypeScript
- バックエンド: Express + TypeScript + (ローカル実装の) Mastra 互換モジュール
- データベース: Prisma + SQLite
- Lint: TSLint (any 禁止・型定義必須)

## セットアップ

```bash
pnpm i
pnpm dev
```

- `.env` をルートに作成してください (`cp .env.example .env`)。
- `pnpm i` は全ワークスペースの依存関係を導入します。
- `pnpm dev` はサーバー起動前に `prisma db push` を実行し、SQLite スキーマと Prisma クライアントを同期したうえでバックエンド (http://localhost:4000) とフロントエンド (http://localhost:5173) を同時起動します。
  - Prisma コマンドが権限エラーで停止した場合は `PRISMA_GENERATE_SKIP_AUTOINSTALL=true pnpm --filter kenshu-matcher-backend prisma:generate` を一度実行してください。

追加でスキーマを変更した場合は次のコマンドを使います。

```bash
pnpm --filter kenshu-matcher-backend prisma:generate
pnpm --filter kenshu-matcher-backend prisma:migrate -- "dev --name <migration>"
```

## テストデータ

バックエンド起動時に YouTube 検索リンクを含む研修データとスキルが自動投入されます。

## Lint

```bash
pnpm lint
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
