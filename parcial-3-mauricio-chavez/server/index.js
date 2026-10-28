import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import { clienteValido, cotizacionValida } from './validation.js';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || false }));
app.use(express.json({ limit: '16kb' }));
const db = mysql.createPool({ host: process.env.DB_HOST, port: Number(process.env.DB_PORT || 3306), user: process.env.DB_USER, password: process.env.DB_PASSWORD, database: process.env.DB_NAME || 'proyecto_db', connectionLimit: 5, decimalNumbers: true });
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/clientes', async (_req, res, next) => { try { const [rows] = await db.query('SELECT id, nombre, correo, telefono, fecha_creacion FROM clientes ORDER BY id DESC'); res.json(rows); } catch (e) { next(e); } });
app.post('/api/clientes', async (req, res, next) => {
  if (!clienteValido(req.body)) return res.status(400).json({ error: 'Revisa el nombre, correo y teléfono.' });
  try { const { nombre, correo, telefono } = req.body; const [r] = await db.execute('INSERT INTO clientes (nombre, correo, telefono) VALUES (?, ?, ?)', [nombre.trim(), correo.trim(), telefono?.trim() || null]); res.status(201).json({ id: r.insertId }); } catch (e) { next(e); }
});
app.get('/api/cotizaciones', async (_req, res, next) => { try { const [rows] = await db.query('SELECT q.id, q.cliente_id, c.nombre AS cliente, q.concepto, q.monto, q.estado, q.fecha_creacion FROM cotizaciones q JOIN clientes c ON c.id = q.cliente_id ORDER BY q.id DESC'); res.json(rows); } catch (e) { next(e); } });
app.post('/api/cotizaciones', async (req, res, next) => {
  if (!cotizacionValida(req.body)) return res.status(400).json({ error: 'Revisa el cliente, servicio, monto y estado.' });
  try { const { cliente_id, concepto, monto, estado } = req.body; const [r] = await db.execute('INSERT INTO cotizaciones (cliente_id, concepto, monto, estado) VALUES (?, ?, ?, ?)', [Number(cliente_id), concepto.trim(), monto, estado]); res.status(201).json({ id: r.insertId }); } catch (e) { if (e.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).json({ error: 'El cliente no existe.' }); next(e); }
});
app.use((err, _req, res, _next) => { console.error(err.message); res.status(err.status === 400 ? 400 : 500).json({ error: err.status === 400 ? 'Solicitud inválida.' : 'No se pudo completar la operación.' }); });
app.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log(`API escuchando en el puerto ${process.env.PORT || 3000}`));
