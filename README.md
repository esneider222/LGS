# LGS — Luz Guía Superior

Aplicación educativa para preparar el ingreso y acompañar el estudio por carrera. El frontend está hecho con React y Vite; la API usa Express y MongoDB.

## Requisitos

- Node.js y npm.
- MongoDB disponible para usar registro, inicio de sesión y sincronización de progreso.
- Un endpoint de tutor compatible con la interfaz de chat para habilitar el tutor IA. Ese servicio no está incluido en este repositorio.

## Configuración

1. Copia `.env.example` a `.env.local` en la raíz.
2. Copia `lgs-backend/.env.example` a `lgs-backend/.env`.
3. En MongoDB Atlas, crea un clúster (o usa uno existente), un usuario de base de datos con permisos `readWrite` sobre la base `bdlgs` y permite la IP desde la que se ejecutará la API en **Network Access**.
4. En Atlas, selecciona **Connect → Drivers → Node.js** y copia la URI. En `lgs-backend/.env`, configura `MONGODB_URI` con esa URI, sustituyendo `<password>` por la contraseña del usuario y especificando `bdlgs` como base de datos. No publiques ni compartas ese archivo.
5. Reemplaza `JWT_SECRET` por un secreto aleatorio privado.
6. Configura `VITE_TUTOR_URL` con la URL del servicio de tutor. Sin ella, el resto de la aplicación funciona, pero el chat IA queda deshabilitado.

`VITE_API_URL` puede apuntar a la URL de la API; si se omite, el frontend usa `http://localhost:4000`. La API permite por defecto los orígenes locales de Vite (`5173` y `4173`); para otro dominio, ajusta la lista `allowedOrigins` en `lgs-backend/src/index.js`.

## Desarrollo

En una terminal, instala dependencias e inicia el frontend:

```sh
npm install
npm run dev
```

En otra terminal, instala dependencias e inicia la API:

```sh
cd lgs-backend
npm install
npm run db:check
npm run dev
```

La API escucha por defecto en `http://localhost:4000`; su comprobación de estado está en `/api/health`.
`npm run db:check` comprueba la conexión y enumera las colecciones sin imprimir la URI ni escribir datos. La API crea las colecciones e índices de sus modelos al conectarse por primera vez.

## Comprobaciones

Desde la raíz:

```sh
npm run lint
npm run build
```

## Alcance actual

- El progreso de estudio se guarda localmente y, con sesión iniciada, se sincroniza con la API.
- La pantalla «Mi material» solo registra localmente nombres y tamaños de PDF; no carga ni analiza los archivos.
- El chat depende del endpoint externo configurado en `VITE_TUTOR_URL`.
- Los formatos de simulacro son referenciales; confirma los requisitos oficiales con cada universidad.
