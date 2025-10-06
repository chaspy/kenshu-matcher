import { copyFileSync, existsSync, readFileSync, mkdirSync, symlinkSync, rmSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '..');
const backendDir = join(repoRoot, 'apps', 'backend');
const backendPrismaDir = join(backendDir, 'prisma');
const backendSchemaPath = join(backendPrismaDir, 'schema.prisma');
const envPath = join(repoRoot, '.env');
const examplePath = join(repoRoot, '.env.example');
const rootSchemaPath = join(repoRoot, 'prisma', 'schema.prisma');
const backendGeneratedDir = join(backendDir, 'node_modules', '.prisma', 'client');
const rootGeneratedDir = join(repoRoot, 'node_modules', '.prisma', 'client');

const loadEnv = () => {
  if (!existsSync(envPath)) {
    return;
  }

  const lines = readFileSync(envPath, 'utf8').split('\n');
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) {
      continue;
    }

    const eq = line.indexOf('=');
    if (eq === -1) {
      continue;
    }

    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim().replace(/^\"|\"$/g, '');
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

try {
  if (!existsSync(envPath) && existsSync(examplePath)) {
    copyFileSync(examplePath, envPath);
    console.log('Created .env from .env.example for local development.');
  }

  loadEnv();

  process.env.PRISMA_GENERATE_SKIP_AUTOINSTALL = 'true';

  // Ensure a schema path exists inside the backend package so Prisma can resolve @prisma/client there
  if (!existsSync(backendPrismaDir)) {
    mkdirSync(backendPrismaDir, { recursive: true });
  }
  if (!existsSync(backendSchemaPath)) {
    try {
      symlinkSync(rootSchemaPath, backendSchemaPath);
    } catch {
      // Fallback to copying if symlink is not permitted
      copyFileSync(rootSchemaPath, backendSchemaPath);
    }
  }

  execSync('pnpm exec prisma db push --schema prisma/schema.prisma --skip-generate', {
    cwd: backendDir,
    stdio: 'inherit',
    env: process.env,
  });

  try {
    execSync('pnpm exec prisma generate --schema prisma/schema.prisma', {
      cwd: backendDir,
      stdio: 'inherit',
      env: process.env,
    });

    // Optional: mirror generated client to repo root only if present
    if (existsSync(backendGeneratedDir)) {
      mkdirSync(join(repoRoot, 'node_modules', '.prisma'), { recursive: true });
      try {
        if (existsSync(rootGeneratedDir)) {
          rmSync(rootGeneratedDir, { recursive: true, force: true });
        }
        symlinkSync(backendGeneratedDir, rootGeneratedDir);
      } catch {
        try {
          execSync(`cp -R "${backendGeneratedDir}" "${rootGeneratedDir}"`, { stdio: 'inherit' });
        } catch {
          // ignore if copy also fails; backend local path should still work
        }
      }
    }
  } catch (prismaError) {
    console.error(`
[predev] Prisma client generation failed. If your shell blocks nested package installs, rerun:
  PRISMA_GENERATE_SKIP_AUTOINSTALL=true pnpm --filter kenshu-matcher-backend prisma:generate
`);
    throw prismaError;
  }
} catch (error) {
  console.error('\n[predev] Failed to prepare the dev environment.');
  throw error;
}
