# LGS — Luz Guía Superior

**LGS (Luz Guía Superior)** es una aplicación educativa diseñada para preparar el ingreso a la educación superior y acompañar el estudio por carrera. El sistema cuenta con una arquitectura desacoplada: el frontend está desarrollado con **React** y **Vite**, mientras que la API backend está construida con **Express** y **MongoDB**.

**Demo en producción**
- Frontend: [https://lgs-zajv.netlify.app](https://lgs-zajv.netlify.app)
- Backend (API): desplegado en Render

---

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
  - [1. Preparación de archivos de entorno](#1-preparación-de-archivos-de-entorno)
  - [2. Configuración de MongoDB Atlas](#2-configuración-de-mongodb-atlas)
  - [3. Configuración de la API de Gemini y Seguridad](#3-configuración-de-la-api-de-gemini-y-seguridad)
  - [4. Configuración de correo (recuperación de contraseña)](#4-configuración-de-correo-recuperación-de-contraseña)
  - [5. Conexión Frontend y CORS](#5-conexión-frontend-y-cors)
- [Entorno de Desarrollo](#entorno-de-desarrollo)
- [Verificación y Compilación](#verificación-y-compilación)
- [Despliegue](#despliegue)
  - [Frontend (Netlify)](#frontend-netlify)
  - [Backend (Render)](#backend-render)
- [Alcance Actual y Consideraciones Técnicas](#alcance-actual-y-consideraciones-técnicas)

---

## Requisitos Previos

Para ejecutar este proyecto en un entorno local:

- **Node.js y npm:** Necesarios para la gestión de paquetes y ejecución tanto del cliente como del servidor.
- **MongoDB:** Instancia disponible (como MongoDB Atlas) para habilitar el registro de usuarios, inicio de sesión y sincronización del progreso.
- **API Key de Gemini:** Credencial de Google AI Studio indispensable para habilitar el tutor de Inteligencia Artificial y la generación de ejercicios a partir de apuntes.
- **(Opcional) Cuenta de Resend:** Para el envío de correos de recuperación de contraseña.

---

## Instalación y Configuración

Sigue estos pasos en orden para configurar correctamente ambos entornos antes de iniciar la aplicación.

### 1. Preparación de archivos de entorno

Copia las plantillas de variables de entorno incluidas en el repositorio:

```sh
