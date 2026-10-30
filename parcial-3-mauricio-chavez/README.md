# Proyecto parcial 3 — Mauricio Chavez

Aplicación React, API Node.js y MySQL para clientes y cotizaciones. El objetivo de despliegue es S3 + EC2 + RDS conforme al enunciado.

## Configuración local

El archivo `.env` contiene secretos y está excluido de Git. Usa `.env.example` como referencia; nunca incluyas secretos en el repositorio ni en el código del navegador. `VITE_API_URL` es público y se incorpora al frontend durante la compilación. Las claves AWS se usan solo para administración; no deben copiarse a EC2 ni al frontend.

1. Instala Node.js y ejecuta `npm install`.
2. Configura las variables de base de datos en `.env` y ejecuta `database/schema.sql` en MySQL.
3. Define `CORS_ORIGIN=http://localhost:5173` y `VITE_API_URL=http://localhost:3000`.
4. Ejecuta `npm start` para la API y `npm run dev` para el frontend en otra terminal.

Para compilar el frontend, configura `VITE_API_URL` con la URL pública de la API y ejecuta `npm run build`; el resultado queda en `dist/`. En EC2, configura las variables de la base de datos y `CORS_ORIGIN` con el origen exacto del sitio S3. El despliegue, la infraestructura y el informe requieren comprobar la cuenta y los permisos de AWS antes de ejecutarse.

## Entrar a EC2 y revisar o iniciar la API por SSH

El backend está instalado en EC2, en `/opt/mauriciochavez-parcial-3`. Al conectarte por SSH se abre inicialmente la carpeta personal de `ubuntu`, por lo que el proyecto no aparecerá allí. El frontend está publicado en S3.

1. Inicia el laboratorio de AWS Academy. En la consola de EC2, región `us-east-1`, selecciona `MauricioChavez-PARCIAL-3-ec2` y confirma que esté **Running**. Copia su **Public IPv4 address** actual. Mientras conserve asociada su Elastic IP, la dirección permanece estable al detener e iniciar la instancia. Comprueba también en RDS que `mauriciochavez-parcial-3-rds` esté **Available**.
2. En PowerShell de tu computadora, conecta con la clave privada del proyecto. Sustituye `RUTA_A_LA_CLAVE.pem` por la ruta real de tu archivo y `IP_PUBLICA_EC2` por la IP consultada en el paso anterior:

   ```powershell
   ssh -i "RUTA_A_LA_CLAVE.pem" ubuntu@IP_PUBLICA_EC2
   ```

   La clave `.pem` se mantiene en tu computadora y no está incluida en GitHub. Si SSH no conecta, revisa la IP, el estado de EC2 y que el puerto 22 esté permitido en su grupo de seguridad.
3. Ya dentro de EC2, localiza el proyecto y revisa el servicio:

   ```bash
   cd /opt/mauriciochavez-parcial-3
   ls
   sudo systemctl status mauriciochavez-parcial-3 --no-pager
   ```

   El servicio ejecuta la API automáticamente; no es necesario correr `npm start` en una terminal. Si el servicio no está activo, puedes iniciarlo y volver a comprobar su estado:

   ```bash
   sudo systemctl start mauriciochavez-parcial-3
   sudo systemctl status mauriciochavez-parcial-3 --no-pager
   ```
4. Comprueba la API desde EC2 y, si hay un error, revisa los últimos registros:

   ```bash
   curl http://localhost:3000/api/clientes
   sudo journalctl -u mauriciochavez-parcial-3 -n 50 --no-pager
   ```

   `localhost` aquí se refiere a la propia EC2 porque el comando se ejecuta dentro de ella. Si la base RDS no está disponible, el servicio puede fallar al iniciar y reintentará. Si cambió la IP pública, sigue también la sección siguiente para actualizar el frontend en S3.

## IP fija y actualización del sitio

La EC2 tiene asociada la Elastic IP `52.71.137.82` (`MauricioChavez-PARCIAL-3-eip`), que debe mantenerse estable al detener e iniciar la misma instancia. Si se libera o desvincula la dirección, se reemplaza la instancia o se asigna otra IP, el sitio de S3 necesitará volver a publicarse. El script de este proyecto obtiene la IP actual, comprueba que la API responde y publica el frontend actualizado. La compilación bloquea el uso accidental de `localhost` como API pública.

La Elastic IP cuesta aproximadamente USD 0.005 por hora, incluso con la instancia detenida, mientras siga reservada. Al liberarla deja de estar garantizada la misma IP. La IP fija no impide que AWS Academy detenga EC2 ni enciende RDS automáticamente.

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
