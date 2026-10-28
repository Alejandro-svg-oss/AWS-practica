import test from 'node:test';
import assert from 'node:assert/strict';
import { clienteValido, cotizacionValida } from './validation.js';
test('valida los datos de clientes', () => {
  assert.equal(clienteValido(null), false);
  assert.equal(clienteValido([]), false);
  assert.equal(clienteValido({ nombre: 'Ana', correo: 'ana@example.com', telefono: '' }), true);
  assert.equal(clienteValido({ nombre: ' ', correo: 'ana@example.com' }), false);
  assert.equal(clienteValido({ nombre: 'Ana', correo: 'invalido' }), false);
});
test('valida cotizaciones y precisión del monto', () => {
  assert.equal(cotizacionValida(null), false);
  const base = { cliente_id: '1', concepto: 'Sitio web', monto: '1500.00', estado: 'Pendiente' };
  assert.equal(cotizacionValida(base), true);
  for (const cambio of [{ cliente_id: '0' }, { monto: '-1' }, { monto: '1.001' }, { monto: '' }, { estado: 'Otro' }]) assert.equal(cotizacionValida({ ...base, ...cambio }), false);
});
