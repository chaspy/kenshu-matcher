# Repository Guidelines

## Project Structure & Module Organization
This monorepo relies on pnpm workspaces; install dependencies only from the root. Key paths:
- `apps/frontend` – Vite + React client, entry at `src/main.tsx`, shared UI styles in `src/styles.css`.
- `apps/backend` – Express + Prisma API, bootstrapped from `src/server.ts`; seeds run via `services/catalogService`.
- `packages/mastra-*` – Local Mastra-compatible abstractions consumed by the backend.
- `prisma/schema.prisma` – Data model; migrations and client generation read from this schema.
- `.env` (copy from `.env.example`) – Stores `DATABASE_URL`, `OPENAI_API_KEY`, `GEMINI_API_KEY` used across apps.

## Build, Test, and Development Commands
- `pnpm i` – Installs all workspace dependencies.
- `pnpm dev` – Runs Prisma schema sync (via `prisma db push`), regenerates the Prisma client, and starts backend (http://localhost:4000) and frontend (http://localhost:5173) watchers concurrently. If your shell blocks nested package installs, rerun `PRISMA_GENERATE_SKIP_AUTOINSTALL=true pnpm --filter kenshu-matcher-backend prisma:generate`.
- `pnpm build` – Compiles shared packages, backend, and frontend in sequence; run before shipping artifacts.
- `pnpm lint` – Executes TSLint across frontend and backend.
- `pnpm --filter kenshu-matcher-backend prisma:generate` – Regenerates the Prisma client after schema edits.
- `pnpm --filter kenshu-matcher-backend prisma:migrate -- "dev --name <migration>"` – Creates and applies a new development migration.

## Coding Style & Naming Conventions
- TypeScript is strict (`noImplicitAny`, `noUnused*`); keep typings explicit, leveraging the enforced `typedef` rule.
- Follow 2-space indentation and single quotes, matching existing sources.
- React components and classes use PascalCase; hooks, functions, and vars use camelCase; environment constants remain SCREAMING_SNAKE_CASE.
- Avoid `console.log`/`console.error` unless guarded; TSLint fails the build otherwise.

## Testing Guidelines
Automated tests are not yet committed. When adding coverage, align with maintainers on tooling (Vitest for frontend, Jest/Supertest for backend are preferred). Place specs under `apps/<app>/src/__tests__/` named `<feature>.spec.ts` and expose them through new workspace `test` scripts.

## Commit & Pull Request Guidelines
- Use conventional-style subjects (`feat:`, `fix:`, `chore:`) as in `feat: scaffold mastra-powered training matcher`.
- Write commits that stay focused; include Prisma schema and generated client updates together so migrations track correctly.
- Pull requests should state the problem, the solution, and testing evidence; attach screenshots/GIFs for UI changes and note required `.env` additions.
- Link GitHub issues when available and request at least one reviewer familiar with the touched workspace.

## Environment & Security Notes
Never commit `.env` or SQLite files. Keep API keys in deployment secrets and review Prisma migrations before merge. The `predev` script copies `.env.example` to `.env` when absent, so update secrets after the first run.
