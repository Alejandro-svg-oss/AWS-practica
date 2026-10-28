# Proyecto parcial 3 — Mauricio Chavez

Aplicación React, API Node.js y MySQL para clientes y cotizaciones. El objetivo de despliegue es S3 + EC2 + RDS conforme al enunciado.

## Configuración local

El archivo `.env` contiene secretos y está excluido de Git. Usa `.env.example` como referencia; nunca incluyas secretos en el repositorio ni en el código del navegador. `VITE_API_URL` es público y se incorpora al frontend durante la compilación. Las claves AWS se usan solo para administración; no deben copiarse a EC2 ni al frontend.

1. Instala Node.js y ejecuta `npm install`.
2. Configura las variables de base de datos en `.env` y ejecuta `database/schema.sql` en MySQL.
3. Define `CORS_ORIGIN=http://localhost:5173` y `VITE_API_URL=http://localhost:3000`.
4. Ejecuta `npm start` para la API y `npm run dev` para el frontend en otra terminal.

Para compilar el frontend, configura `VITE_API_URL` con la URL pública de la API y ejecuta `npm run build`; el resultado queda en `dist/`. En EC2, configura las variables de la base de datos y `CORS_ORIGIN` con el origen exacto del sitio S3. El despliegue, la infraestructura y el informe requieren comprobar la cuenta y los permisos de AWS antes de ejecutarse.

Las credenciales en `.env` son texto sin cifrar: limita el acceso al equipo, no las compartas y prefiere credenciales temporales de IAM/SSO. El entorno público exigido por el enunciado es solo para datos ficticios de prueba.

Con AWS CLI instalado, `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\aws-local.ps1 sts get-caller-identity` usa las variables AWS del `.env` en ese proceso. La excepción a la política de scripts se limita a esa ejecución. La sesión temporal requiere también `AWS_SESSION_TOKEN`; al vencer hay que renovarla.
