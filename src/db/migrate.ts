import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';

import { env } from '../config/env';

const runMigrations = async () => {
  console.log('🔄 Running migrations...');

  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    max: 1,
  });

  const db = drizzle({
    client: pool,
  });

  try {
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('✅ Migrations completed successfully.');
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

runMigrations();
