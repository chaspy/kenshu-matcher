import { config as loadEnv } from 'dotenv';
import path from 'path';

loadEnv({ path: path.resolve(process.cwd(), '../../.env') });

export const PORT = Number(process.env.PORT ?? '4000');
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
export const DATABASE_URL = process.env.DATABASE_URL ?? 'file:./dev.db';
