export function clienteValido(data = {}) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const { nombre, correo, telefono } = data;
  return typeof nombre === 'string' && nombre.trim().length > 0 && nombre.trim().length <= 100 && typeof correo === 'string' && correo.trim().length <= 100 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) && (telefono == null || (typeof telefono === 'string' && telefono.trim().length <= 20));
}
export function cotizacionValida(data = {}) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return false;
  const { cliente_id, concepto, monto, estado } = data;
  const amount = Number(monto);
  return Number.isSafeInteger(Number(cliente_id)) && Number(cliente_id) > 0 && typeof concepto === 'string' && concepto.trim().length > 0 && concepto.trim().length <= 150 && monto !== '' && monto != null && Number.isFinite(amount) && amount >= 0 && amount <= 99999999.99 && /^\d+(\.\d{1,2})?$/.test(String(monto)) && ['Pendiente', 'Aprobada', 'Rechazada'].includes(estado);
}
