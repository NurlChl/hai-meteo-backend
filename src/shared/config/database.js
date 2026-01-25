import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import config from './index.js';

const pool = new Pool({
    connectionString: config.database.url,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const db = drizzle(pool);

export default db;
