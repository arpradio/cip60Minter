// src/lib/db.ts
import { Pool, PoolClient, PoolConfig } from 'pg';

type DatabaseConfig = {
  user: string;
  password: string;
  host: string;
  port: number;
  database: string;
};

const createDatabaseConfig = (): DatabaseConfig => {
  const password = process.env.DB_PASSWORD;
  
  if (!password) {
    throw new Error('DB_PASSWORD environment variable is required');
  }
  
  return {
    user: 'postgres',
    password, 
    host: 'localhost',
    port: 5432,
    database: 'cip60'
  };
};

// Singleton pool instance
export const pool = new Pool(createDatabaseConfig());

export const executeQuery = async <T = any>(
  queryText: string, 
  params: unknown[] = []
): Promise<T[]> => {
  const client: PoolClient = await pool.connect();
  
  try {
    const result = await client.query(queryText, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
};

export const executeTransaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client: PoolClient = await pool.connect();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};