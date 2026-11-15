# LGS — Luz Guía Superior

**LGS (Luz Guía Superior)** es una aplicación educativa diseñada para preparar el ingreso a la educación superior y acompañar el estudio por carrera. El sistema cuenta con una arquitectura desacoplada: el frontend está desarrollado con **React** y **Vite**, mientras que la API backend está construida con **Express** y **MongoDB**.

---

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
  - [1. Preparación de archivos de entorno](#1-preparación-de-archivos-de-entorno)
  - [2. Configuración de MongoDB Atlas](#2-configuración-de-mongodb-atlas)
  - [3. Configuración de la API de Gemini y Seguridad](#3-configuración-de-la-api-de-gemini-y-seguridad)
  - [4. Conexión Frontend y CORS](#4-conexión-frontend-y-cors)
- [Entorno de Desarrollo](#entorno-de-desarrollo)
- [Verificación y Compilación](#verificación-y-compilación)
- [Alcance Actual y Consideraciones Técnicas](#alcance-actual-y-consideraciones-técnicas)

---

## Requisitos Previos

Para ejecutar este proyecto en un entorno local, asegúrate de contar con:

- **Node.js y npm:** Necesarios para la gestión de paquetes y ejecución tanto del cliente como del servidor.
- **MongoDB:** Instancia disponible (como MongoDB Atlas) para habilitar el registro de usuarios, inicio de sesión y sincronización del progreso.
- **API Key de Gemini:** Credencial de Google AI Studio indispensable para habilitar el tutor de Inteligencia Artificial y la generación de ejercicios a partir de apuntes.

---

## Instalación y Configuración

Sigue estos pasos en orden para configurar correctamente ambos entornos antes de iniciar la aplicación.

### 1. Preparación de archivos de entorno

Copia las plantillas de variables de entorno incluidas en el repositorio:

```sh
# En la raíz del proyecto (Frontend)
cp .env.example .env.local

# En el directorio del servidor (Backend)
cp lgs-backend/.env.example lgs-backend/.env
```

### 2. Configuración de MongoDB Atlas

1. Accede a **MongoDB Atlas** y crea un clúster nuevo (o utiliza uno existente).
2. Crea un usuario de base de datos con permisos de lectura y escritura (`readWrite`) asignados específicamente sobre la base de datos `bdlgs`.
3. En la sección **Network Access**, autoriza la dirección IP desde la cual se ejecutará la API.
4. Selecciona **Connect → Drivers → Node.js** y copia la cadena de conexión (URI).
5. En el archivo `lgs-backend/.env`, asigna esa URI a la variable `MONGODB_URI`, reemplazando `<password>` por la contraseña real del usuario creado y especificando `bdlgs` como base de datos.

> **Advertencia de seguridad:** Nunca publiques ni compartas tu archivo `.env` con credenciales reales.

### 3. Configuración de la API de Gemini y Seguridad

1. En `lgs-backend/.env`, reemplaza el valor de `JWT_SECRET` por una cadena secreta aleatoria y privada.
2. Genera una API key en **Google AI Studio** y guárdala en la variable `GEMINI_API_KEY` dentro de `lgs-backend/.env`.
3. *(Opcional)* Define la variable `GEMINI_MODEL` si deseas especificar un modelo en particular; si se omite, el sistema utiliza `gemini-3.5-flash` de forma predeterminada.

> **Importante:** Por seguridad, nunca coloques la API key de Gemini en variables con prefijo `VITE_*`, dentro del código del frontend ni en el repositorio.

### 4. Conexión Frontend y CORS

- **URL de la API:** En el archivo `.env.local` de la raíz, puedes configurar `VITE_API_URL` apuntando a la dirección donde corre el backend. Si esta variable se omite, el frontend utilizará `http://localhost:4000` por defecto.
- **Orígenes permitidos (CORS):** La API permite por defecto las peticiones provenientes de los puertos locales de Vite (`5173` y `4173`). Si necesitas conectar el frontend desde otro dominio o puerto, ajusta la lista `allowedOrigins` en `lgs-backend/src/index.js`.

---

## Entorno de Desarrollo

Para levantar el proyecto completo en modo desarrollo, abre **dos terminales** independientes y ejecuta los siguientes comandos:

**Terminal 1 — Iniciar el Frontend (desde la raíz):**
```sh
npm install
npm run dev
```

**Terminal 2 — Verificar base de datos e iniciar la API:**
```sh
cd lgs-backend
npm install
npm run db:check
npm run dev
```

### Notas sobre el servidor y la base de datos
- **Puerto y estado:** La API escucha por defecto en `http://localhost:4000` y cuenta con un endpoint de comprobación de estado en `/api/health`.
- **Diagnóstico de conexión:** El comando `npm run db:check` verifica la conexión con MongoDB y enumera las colecciones existentes sin imprimir la URI en consola ni escribir datos.
- **Inicialización automática:** La API crea automáticamente las colecciones e índices definidos en sus modelos al conectarse a la base de datos por primera vez.

---

## Verificación y Compilación

Para ejecutar el análisis de código y generar la compilación de producción del frontend, ejecuta desde la raíz del proyecto:

```sh
npm run lint
npm run build
```

---

## Alcance Actual y Consideraciones Técnicas

- **Persistencia y sincronización:** El progreso de estudio se guarda de forma local en el navegador y, cuando el usuario tiene una sesión iniciada, se sincroniza con la API.
- **Seguridad del Tutor IA:** Todas las peticiones a Gemini se realizan desde el backend. El endpoint `/api/tutor` cuenta con límite de solicitudes (*rate limiting*) y nunca expone la API key al navegador.
- **Procesamiento en «Mi material»:**
  - La herramienta extrae texto seleccionable de archivos PDF de hasta **10 MB** y **80 páginas** directamente en el navegador.
  - Al solicitar ejercicios, únicamente se envía el texto extraído al tutor; **el archivo PDF original y el texto no se guardan ni se suben como archivo** al servidor.
  - Los documentos PDF escaneados requieren reconocimiento óptico de caracteres (OCR) y **no son compatibles**.
- **Validez de simulacros:** Los formatos de simulacro incluidos en la plataforma son estrictamente referenciales. Cada estudiante debe confirmar los requisitos y temarios oficiales directamente con su universidad.
