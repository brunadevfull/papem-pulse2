import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Pool de conexões usando DATABASE_URL do Replit
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Instância do Drizzle ORM
export const db = drizzle({ client: pool, schema });

// Função para testar conexão
export async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexão com PostgreSQL estabelecida com sucesso!');
    
    const result = await client.query('SELECT NOW()');
    console.log('🕒 Data/hora do servidor:', result.rows[0].now);
    
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    return false;
  }
}

// Função para fechar conexões gracefully
export async function closeConnection() {
  await pool.end();
  console.log('🔌 Conexões com PostgreSQL fechadas');
}