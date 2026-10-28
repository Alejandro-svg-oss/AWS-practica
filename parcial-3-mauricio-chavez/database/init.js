import 'dotenv/config';
import { readFile } from 'node:fs/promises';
import mysql from 'mysql2/promise';

// The RDS instance is provisioned with proyecto_db as its initial database.
// Connect to that database and apply only the CREATE TABLE statements.
const { DB_HOST, DB_USER, DB_PASSWORD } = process.env;
if (!DB_HOST || !DB_USER || !DB_PASSWORD) {
  console.error('Faltan DB_HOST, DB_USER o DB_PASSWORD.');
  process.exitCode = 1;
} else {
  let connection;
  try {
    connection = await mysql.createConnection({ host: DB_HOST, port: Number(process.env.DB_PORT || 3306), user: DB_USER, password: DB_PASSWORD, database: process.env.DB_NAME || 'proyecto_db' });
    const source = await readFile(new URL('./schema.sql', import.meta.url), 'utf8');
    const statements = source.split(';').map(s => s.trim()).filter(s => /^CREATE TABLE IF NOT EXISTS\s/i.test(s));
    if (statements.length !== 2) throw new Error('El esquema no contiene las dos tablas esperadas.');
    for (const statement of statements) await connection.query(statement);
    console.log('Esquema inicializado correctamente.');
  } catch (error) {
    console.error('No se pudo inicializar el esquema:', error.code || error.message);
    process.exitCode = 1;
  } finally {
    if (connection) await connection.end();
  }
}
