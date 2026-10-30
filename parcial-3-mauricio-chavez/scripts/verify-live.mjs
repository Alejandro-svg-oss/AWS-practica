// Create a fictional client and quotation for the project demonstration.
const api = process.env.VITE_API_URL;
if (!api) throw new Error('Define VITE_API_URL con la dirección actual de la API.');
const origin = 'http://mauriciochavez-parcial-3-frontend.s3-website-us-east-1.amazonaws.com';
async function request(path, data) {
  const response = await fetch(api + path, { method: data ? 'POST' : 'GET', headers: { Origin: origin, ...(data ? { 'Content-Type': 'application/json' } : {}) }, body: data ? JSON.stringify(data) : undefined });
  if (response.headers.get('access-control-allow-origin') !== origin) throw new Error('CORS incorrecto');
  const body = await response.json();
  if (!response.ok) throw new Error(`${path}: HTTP ${response.status}: ${body.error || 'error'}`);
  console.log(`${data ? 'POST' : 'GET'} ${path}: HTTP ${response.status}`);
  return body;
}
const client = await request('/api/clientes', { nombre: 'Cliente de prueba', correo: 'prueba@example.com', telefono: '2222-1234' });
await request('/api/cotizaciones', { cliente_id: client.id, concepto: 'Desarrollo de sitio web', monto: '1500.00', estado: 'Pendiente' });
const clients = await request('/api/clientes');
const quotes = await request('/api/cotizaciones');
if (!clients.some(c => c.id === client.id) || !quotes.some(q => q.cliente_id === client.id)) throw new Error('Los registros no aparecen en las consultas.');
console.log('Cliente y cotización de prueba verificados.');
