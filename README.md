# LGS — Luz Guía Superior

Aplicación educativa para preparar el ingreso y acompañar el estudio por carrera. El frontend está hecho con React y Vite; la API usa Express y MongoDB.

## Requisitos

- Node.js y npm.
- MongoDB disponible para usar registro, inicio de sesión y sincronización de progreso.
- Una API key de Gemini para habilitar el tutor IA y generar ejercicios a partir de apuntes.

## Configuración

1. Copia `.env.example` a `.env.local` en la raíz.
2. Copia `lgs-backend/.env.example` a `lgs-backend/.env`.
3. En MongoDB Atlas, crea un clúster (o usa uno existente), un usuario de base de datos con permisos `readWrite` sobre la base `bdlgs` y permite la IP desde la que se ejecutará la API en **Network Access**.
4. En Atlas, selecciona **Connect → Drivers → Node.js** y copia la URI. En `lgs-backend/.env`, configura `MONGODB_URI` con esa URI, sustituyendo `<password>` por la contraseña del usuario y especificando `bdlgs` como base de datos. No publiques ni compartas ese archivo.
5. Reemplaza `JWT_SECRET` por un secreto aleatorio privado.
6. Crea una API key en Google AI Studio y guárdala como `GEMINI_API_KEY` en `lgs-backend/.env`. Opcionalmente configura `GEMINI_MODEL`; su valor predeterminado es `gemini-3.5-flash`. Nunca pongas la API key en variables `VITE_*`, en el frontend ni en el repositorio.

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
- El tutor llama a Gemini desde el backend; `/api/tutor` tiene límite de solicitudes y nunca expone la API key al navegador.
- «Mi material» extrae texto seleccionable de PDF de hasta 10 MB y 80 páginas en el navegador; al pedir ejercicios, envía solo el texto extraído al tutor. El archivo PDF original y el texto no se guardan ni se suben como archivo. Los PDF escaneados requieren OCR y no son compatibles.
- Los formatos de simulacro son referenciales; confirma los requisitos oficiales con cada universidad.
