# Prueba Técnica de Backend

## 🚀 Primeros pasos

Estas instrucciones te ayudarán a ejecutar el proyecto backend localmente para desarrollo y pruebas.

Este backend está construido con **NestJS** y utiliza **MongoDB** como base de datos.

---

## 📋 Prerrequisitos

Para ejecutar este proyecto, asegúrate de contar con alguno de los siguientes entornos:

* **[Node.js](https://nodejs.org/es/download)** ( >= 18)
* **[npm](https://nodejs.org/es/download)** (viene por defecto con node)
* **[yarn](https://yarnpkg.com/getting-started/install)** (opcional)
* **[visual studio](https://code.visualstudio.com/)** (opcional)

**front end (opcional)**.

* Clona y configura el front siguiendo las instrucciones de su repositorio:
  👉 **[frontend](https://github.com/Jortizuwu/front-end-blue)**
* Sigue los pasos indicados tanto en el `README` de este repositorio como en el del frontend.

---

## ⚙️ Instalación y ejecución del proyecto

### Configuración local (Node.js)

Instala las dependencias:

```bash
yarn install
# o
npm install
```

---

## 🔐 Variables de entorno

Este proyecto utiliza variables de entorno para configurar la base de datos y los ajustes de la aplicación.

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
MONGODB=mongodb://root:example@localhost:27017/?authSource=admin
PORT=3000
HERO_TOKEN=1111111111111111
JWT_SECRET=supersecretS
```

> ⚠️ **Importante:**
> No subas el archivo `.env` al repositorio. Usa un archivo `.env.example` en su lugar.

---

Inicia el servidor de desarrollo:

```bash
yarn start
# o
npm run start
```

La API estará disponible en:

```text
http://localhost:3000/api
```

---

### 🐳 Configuración con Docker (recomendado)

Puedes usar Docker para ejecutar MongoDB localmente.

Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up
```

Esto levantará:

* MongoDB 

---

## 🦴 Estructura de carpetas

```text
.
├── src
│   ├── auth                    # Módulo de autenticación (JWT, guards)
│   ├── characters              # Módulo de personajes
│   ├── reactions               # Módulo de reacciones
│   ├── common                  # Decoradores, filtros y pipes compartidos
│   ├── config                  # Configuración de entorno
│   └── main.ts                 # Punto de entrada de la aplicación
├── test                        # Pruebas unitarias y e2e
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Construido con

* **[NestJS](https://nestjs.com/)**
  Framework progresivo de Node.js para construir aplicaciones del lado del servidor eficientes y escalables.

* **[MongoDB](https://www.mongodb.com/)**
  Base de datos NoSQL orientada a documentos.

* **[Mongoose](https://mongoosejs.com/)**
  Modelado de objetos para MongoDB en Node.js.

* **[JWT](https://jwt.io/)**
  JSON Web Tokens para autenticación.

* **[Docker](https://www.docker.com/)**
  Entorno de desarrollo basado en contenedores.

---

## Consideraciones de construcción y arquitectura

### 1. Diagrama de solución

**Arquitectura general**

* **Backend**: NestJS
* **Persistencia**: MongoDB
* **Dominio principal**:

  * Usuarios
  * Personajes (*Characters*)
  * Reacciones (*Likes / Dislikes*)

**Relaciones clave**

* Un **User** puede tener múltiples **Reactions**.
* Un **Character** puede recibir múltiples **Reactions**.
* La relación entre `User` y `Character` se materializa a través de `Reaction`.

```text
┌──────────┐        ┌────────────┐        ┌────────────┐
│  User    │ 1 ────<│  Reaction  │>──── 1 │ Character  │
└──────────┘        └────────────┘        └────────────┘
```

**Restricciones importantes**

* Un usuario solo puede reaccionar **una vez** a un mismo personaje
  (`índice único: userId + custom_id`).

---

### 2. Diagrama de flujo

![Diagrama de solución](https://github.com/Jortizuwu/bank-end-blue/blob/main/image.png?raw=true)

---

## ❌ Puntos no implementados

* **Documentación sobre el funcionamiento del reto:**
  No fue incluida debido a limitaciones de conocimiento y tiempo en la elaboración de documentación técnica detallada al momento de realizar la prueba.

* **Pruebas unitarias:**
  No se implementaron por falta de experiencia suficiente en la creación y configuración de pruebas unitarias automatizadas dentro del alcance del proyecto.

* **Pruebas automatizadas de integración:**
  No se desarrollaron debido a limitaciones de conocimiento práctico en la implementación de pruebas de integración automatizadas.

* **Documentación y ejemplos de documentos en MongoDB:**
  No se agregaron por falta de experiencia en la documentación de esquemas y ejemplos de datos en MongoDB al momento de la prueba.

---

## ✒️ Autor

* **Jose Ortiz**
