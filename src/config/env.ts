import dotenv from 'dotenv';
import { z } from 'zod';
import { process } from 'zod/v4/core';

// Load variables from the .env file
dotenv.config();

const envSchema = z.object({
  // Exec env
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // API port
  PORT: z.coerce.number().default(3333),

  // PostgreSQL
  DATABASE_URL: z.url(''),

  // Secret and expiration for the JWT
  JWT_SECRET: z.string().min(8, ''),
  JWT_EXPIRES_IN: z.string().default('1d'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Variáveis de ambiente inválidas:');
  console.error(JSON.stringify(_env.error.format(), null, 2));

  throw new Error('Variáveis de ambiente inválidas. Corrija o arquivo .env e reinicie o servidor.');
}

export const env = _env.data;
