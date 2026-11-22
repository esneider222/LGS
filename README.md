# LGS — Luz Guía Superior

**LGS (Luz Guía Superior)** es una aplicación educativa pensada para acompañar a estudiantes que se preparan para el ingreso a la educación superior.  
El sistema permite estudiar por carrera, practicar con simulacros, organizar el material propio y contar con un tutor de inteligencia artificial que ayuda a explicar conceptos, generar ejercicios y orientar el estudio.

La arquitectura está desacoplada:

- **Frontend:** React + Vite
- **Backend (API):** Express + MongoDB
- **Tutor IA:** Google Gemini (llamadas realizadas únicamente desde el servidor)

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
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Notas Finales](#notas-finales)

---

## Requisitos Previos

Antes de empezar, asegúrate de tener lo siguiente:

| Requisito | Descripción | Enlace útil |
|-----------|-------------|-------------|
| **Node.js + npm** | Versión LTS recomendada (18 o superior) | [nodejs.org](https://nodejs.org) |
| **Cuenta de MongoDB Atlas** | Base de datos en la nube (plan gratuito disponible) | [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) |
| **API Key de Google AI Studio** | Necesaria para el tutor de inteligencia artificial | [aistudio.google.com](https://aistudio.google.com) |
| **Cuenta de Resend** *(opcional)* | Para enviar correos de recuperación de contraseña | [resend.com](https://resend.com) |
| **Cuenta de Netlify** *(para desplegar frontend)* | Hosting estático gratuito | [netlify.com](https://www.netlify.com) |
| **Cuenta de Render** *(para desplegar backend)* | Hosting de servicios Node.js | [render.com](https://render.com) |

---

## Instalación y Configuración

Sigue estos pasos en orden. Es importante no saltarse ninguno, especialmente la configuración de las variables de entorno.

### 1. Preparación de archivos de entorno

El proyecto utiliza archivos `.env` para guardar credenciales y configuraciones sensibles.  
Nunca subas estos archivos al repositorio.
