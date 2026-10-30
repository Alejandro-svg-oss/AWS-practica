import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const value = process.env.VITE_API_URL ?? loadEnv(mode, process.cwd(), 'VITE_').VITE_API_URL;
    let url;
    try { url = new URL(value); } catch { throw new Error('Para compilar, configura VITE_API_URL con la dirección pública de la API.'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.hostname === 'localhost' || url.hostname === '[::1]' || /^127\./.test(url.hostname)) {
      throw new Error('VITE_API_URL debe ser una dirección pública HTTP o HTTPS, no localhost.');
    }
  }
  return {};
});
