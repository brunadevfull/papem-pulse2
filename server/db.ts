import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

// Configuração para PostgreSQL local
const connectionConfig = {
  host: 'localhost',
  port: 5432,
  database: 'papem_clima_organizacional',
  user: 'postgres',
  password: 'postgres123',
};

// Pool de conexões
export const pool = new Pool(connectionConfig);

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