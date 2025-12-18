# Backend Technical Test

## 🚀 Getting Started

These instructions will help you run the backend project locally for development and testing purposes.

This backend is built with **NestJS** and uses **MongoDB** as the database.

---

## 📋 Prerequisites

To run this project, make sure you have one of the following setups:

- **Node.js** (>= 18 recommended)
- **MongoDB** (local or Docker)
- **Docker** (optional, recommended for database setup)

---

## ⚙️ Installation & Running the Project

### Local setup (Node.js)

Install dependencies:

```bash
yarn install
# or
npm install
```

## 🔐 Environment Variables

This project uses environment variables to configure the database and application settings.

Create a `.env` file in the root of the project with the following variables:

```env
MONGODB=mongodb://root:example@localhost:27017/?authSource=admin
PORT=3000
HERO_TOKEN=1111111111111111
JWT_SECRET=supersecretS
```

> ⚠️ **Important**: Do not commit the `.env` file to the repository. Use a `.env.example` instead.

---

Start the development server:

```bash
yarn start
# or
npm run start
```

The API will be available at:

```text
http://localhost:3000/api
```

---

### 🐳 Docker setup (recommended)

You can use Docker to run MongoDB and the API locally.

From the root of the project, run:

```bash
docker-compose up
```

This will start:

- MongoDB
- NestJS API

---

## 🦴 Folder Structure

```text
.
├── src
│   ├── auth                    # Authentication module (JWT, guards)
│   ├── characters              # Characters module
│   ├── reactions               # Reactions module
│   ├── common                  # Shared decorators, filters, pipes
│   ├── config                   # Environment configuration
│   └── main.ts                 # Application entry point
├── test                        # Unit and e2e tests
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Built With

- **[NestJS](https://nestjs.com/)**
  Progressive Node.js framework for building efficient and scalable server-side applications

- **[MongoDB](https://www.mongodb.com/)**
  NoSQL document-oriented database

- **[Mongoose](https://mongoosejs.com/)**
  MongoDB object modeling for Node.js

- **[JWT](https://jwt.io/)**
  JSON Web Tokens for authentication

- **[Docker](https://www.docker.com/)**
  Containerized development environment

---

## Consideraciones de construcción y arquitectura

### 1. Diagrama de solución

**Arquitectura general**

* **Backend**: NestJS
* **Persistencia**: MongoDB
* **Dominio principal**:

  * Usuarios
  * Personajes (Characters)
  * Reacciones (Likes / Dislikes)

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

* Un usuario solo puede reaccionar **una vez** a un mismo personaje (`unique index: userId + custom_id`).
---
### 2. Diagrama de flujo
[url de git hub]


## Puntos no implementados 

- **Documentación sobre el funcionamiento del reto:**  
  No fue incluida debido a limitaciones de conocimiento y tiempo en la elaboración de documentación técnica detallada al momento de realizar la prueba.

- **Pruebas unitarias:**  
  No se implementaron por falta de experiencia suficiente en la creación y configuración de pruebas unitarias automatizadas dentro del alcance del proyecto.

- **Pruebas automatizadas de integración:**  
  No se desarrollaron debido a limitaciones de conocimiento práctico en la implementación de pruebas de integración automatizadas.

- **Documentación y ejemplos de documentos en MongoDB:**  
  No se agregaron por falta de conocimiento en la documentación de esquemas y ejemplos de datos en MongoDB en el momento de la prueba.

## ✒️ Autor

- **Jose Ortiz**
