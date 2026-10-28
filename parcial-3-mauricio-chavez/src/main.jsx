import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');
async function request(path, options) { const r = await fetch(`${API}${path}`, options); const data = await r.json(); if (!r.ok) throw new Error(data.error || 'Error al conectar con el servidor.'); return data; }
function App() {
  const [clientes, setClientes] = useState([]); const [cotizaciones, setCotizaciones] = useState([]);
  const [cliente, setCliente] = useState({ nombre: '', correo: '', telefono: '' });
  const [cotizacion, setCotizacion] = useState({ cliente_id: '', concepto: '', monto: '', estado: 'Pendiente' });
  const [mensaje, setMensaje] = useState(''); const [error, setError] = useState(''); const [busy, setBusy] = useState(false);
  async function cargar() { const [c, q] = await Promise.all([request('/api/clientes'), request('/api/cotizaciones')]); setClientes(c); setCotizaciones(q); }
  useEffect(() => { cargar().catch(() => setError('No se pudo conectar con la API. Comprueba que esté disponible.')); }, []);
  async function guardar(e, tipo) {
    e.preventDefault(); setError(''); setMensaje(''); setBusy(true);
    try {
      await request(`/api/${tipo}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tipo === 'clientes' ? cliente : cotizacion) });
      if (tipo === 'clientes') setCliente({ nombre: '', correo: '', telefono: '' });
      else setCotizacion({ cliente_id: '', concepto: '', monto: '', estado: 'Pendiente' });
      setMensaje(tipo === 'clientes' ? 'Cliente registrado correctamente.' : 'Cotización registrada correctamente.');
      try { await cargar(); } catch { setError('Se guardó el registro, pero no se pudo actualizar la lista. Recarga la página.'); }
    } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  const change = (setter) => e => setter(old => ({ ...old, [e.target.name]: e.target.value }));
  return <main><header><p className="eyebrow">GESTIÓN COMERCIAL</p><h1>Clientes y cotizaciones</h1><p>Registra tus clientes y organiza sus servicios digitales en un solo lugar.</p></header>
    {error && <div className="alert error" role="alert">{error}</div>}{mensaje && <div className="alert success" role="status">{mensaje}</div>}
    <section className="card"><div className="section-title"><div><span>01</span><h2>Clientes</h2><p>Agrega y consulta tus clientes registrados.</p></div><strong>{clientes.length} registrados</strong></div>
      <form onSubmit={e => guardar(e, 'clientes')} className="form clients"><label>Nombre<input name="nombre" value={cliente.nombre} onChange={change(setCliente)} maxLength="100" required placeholder="Nombre del cliente"/></label><label>Correo electrónico<input type="email" name="correo" value={cliente.correo} onChange={change(setCliente)} maxLength="100" required placeholder="correo@ejemplo.com"/></label><label>Teléfono<input name="telefono" value={cliente.telefono} onChange={change(setCliente)} maxLength="20" placeholder="Opcional"/></label><button disabled={busy}>Agregar cliente</button></form>
      <div className="table-wrap"><table><thead><tr><th>Nombre</th><th>Correo</th><th>Teléfono</th></tr></thead><tbody>{clientes.map(c => <tr key={c.id}><td>{c.nombre}</td><td>{c.correo}</td><td>{c.telefono || '—'}</td></tr>)}{!clientes.length && <tr><td colSpan="3" className="empty">Aún no hay clientes registrados.</td></tr>}</tbody></table></div></section>
    <section className="card"><div className="section-title"><div><span>02</span><h2>Cotizaciones</h2><p>Registra los servicios y consulta su estado.</p></div><strong>{cotizaciones.length} cotizaciones</strong></div>
      <form onSubmit={e => guardar(e, 'cotizaciones')} className="form quotes"><label>Cliente<select name="cliente_id" value={cotizacion.cliente_id} onChange={change(setCotizacion)} required><option value="">Selecciona un cliente</option>{clientes.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></label><label>Servicio digital<input name="concepto" value={cotizacion.concepto} onChange={change(setCotizacion)} maxLength="150" required placeholder="Ej. Sitio web corporativo"/></label><label>Monto (USD)<input type="number" name="monto" min="0" max="99999999.99" step="0.01" value={cotizacion.monto} onChange={change(setCotizacion)} required placeholder="0.00"/></label><label>Estado<select name="estado" value={cotizacion.estado} onChange={change(setCotizacion)}><option>Pendiente</option><option>Aprobada</option><option>Rechazada</option></select></label><button disabled={busy || !clientes.length}>Crear cotización</button></form>
      <div className="table-wrap"><table><thead><tr><th>Cliente</th><th>Servicio</th><th>Monto</th><th>Estado</th></tr></thead><tbody>{cotizaciones.map(q => <tr key={q.id}><td>{q.cliente}</td><td>{q.concepto}</td><td>{Number(q.monto).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td><td><span className={`badge ${q.estado.toLowerCase()}`}>{q.estado}</span></td></tr>)}{!cotizaciones.length && <tr><td colSpan="4" className="empty">Aún no hay cotizaciones registradas.</td></tr>}</tbody></table></div></section></main>;
}
createRoot(document.getElementById('root')).render(<App/>);
