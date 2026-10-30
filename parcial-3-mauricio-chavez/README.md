# Proyecto parcial 3 — Mauricio Chavez

Aplicación React, API Node.js y MySQL para clientes y cotizaciones. El objetivo de despliegue es S3 + EC2 + RDS conforme al enunciado.

## Configuración local

El archivo `.env` contiene secretos y está excluido de Git. Usa `.env.example` como referencia; nunca incluyas secretos en el repositorio ni en el código del navegador. `VITE_API_URL` es público y se incorpora al frontend durante la compilación. Las claves AWS se usan solo para administración; no deben copiarse a EC2 ni al frontend.

1. Instala Node.js y ejecuta `npm install`.
2. Configura las variables de base de datos en `.env` y ejecuta `database/schema.sql` en MySQL.
3. Define `CORS_ORIGIN=http://localhost:5173` y `VITE_API_URL=http://localhost:3000`.
4. Ejecuta `npm start` para la API y `npm run dev` para el frontend en otra terminal.

Para compilar el frontend, configura `VITE_API_URL` con la URL pública de la API y ejecuta `npm run build`; el resultado queda en `dist/`. En EC2, configura las variables de la base de datos y `CORS_ORIGIN` con el origen exacto del sitio S3. El despliegue, la infraestructura y el informe requieren comprobar la cuenta y los permisos de AWS antes de ejecutarse.

## Actualizar el sitio después de reiniciar EC2

Al detener e iniciar la EC2, AWS puede asignarle una IP pública diferente. En ese caso, el sitio de S3 necesita volver a publicarse con la nueva dirección. El script de este proyecto obtiene la IP actual, comprueba que la API responde y publica el frontend actualizado. La compilación bloquea el uso accidental de `localhost` como API pública.

1. En AWS Academy, inicia el laboratorio. En la consola de AWS, región `us-east-1`, comprueba que la EC2 `MauricioChavez-PARCIAL-3-ec2` esté **Running** y que la RDS `mauriciochavez-parcial-3-rds` esté **Available**. Espera unos minutos si acaban de iniciar. El script no inicia estos recursos.
2. Necesitas Windows, Node.js con npm, AWS CLI y las dependencias del proyecto. Si acabas de descargar el repositorio, abre PowerShell y ejecuta:

   ```powershell
   git clone --branch parcial-3-mauricio-chavez https://github.com/Alejandro-svg-oss/AWS-practica.git
   cd AWS-practica\parcial-3-mauricio-chavez
   npm.cmd ci
   ```

   Si ya tienes la carpeta del proyecto y sus dependencias instaladas, abre PowerShell en esa carpeta y omite la clonación.
3. En AWS Academy, abre **Cloud Access → AWS CLI → Show** y coloca las credenciales temporales vigentes en el archivo `.env` de la carpeta del proyecto: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` y `AWS_REGION=us-east-1`. Si no tienes `.env`, copia `.env.example` como `.env` y completa esos valores. No subas ni compartas el archivo `.env` o las claves.
4. Desde la carpeta del proyecto, ejecuta:

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\publicar-frontend.ps1
   ```

   Si aparece `Frontend publicado con API http://...:3000`, abre el [sitio del proyecto](http://mauriciochavez-parcial-3-frontend.s3-website-us-east-1.amazonaws.com/) y pulsa **Ctrl + F5**. Comprueba que se carguen los clientes y cotizaciones. Si debes entregar el informe, actualiza también la IP de la API que aparece en él.

Si aparece `ExpiredToken`, renueva las tres credenciales temporales del `.env`. Si falla la comprobación de la API, verifica que EC2 y RDS estén activas y espera a que termine el arranque; el script no publicará el sitio si la API no responde. El script está ligado a la cuenta, instancia y bucket originales de este proyecto; si se reemplazan, hay que actualizar su configuración.

Las credenciales en `.env` son texto sin cifrar: limita el acceso al equipo, no las compartas y prefiere credenciales temporales de IAM/SSO. El entorno público exigido por el enunciado es solo para datos ficticios de prueba.

Con AWS CLI instalado, `powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\aws-local.ps1 sts get-caller-identity` usa las variables AWS del `.env` en ese proceso. La excepción a la política de scripts se limita a esa ejecución. La sesión temporal requiere también `AWS_SESSION_TOKEN`; al vencer hay que renovarla.
