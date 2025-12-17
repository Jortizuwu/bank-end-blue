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

## 🧪 Testing

Run unit tests:

```bash
yarn test
# or
npm run test
```

Run e2e tests:

```bash
yarn test:e2e
# or
npm run test:e2e
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

## ✒️ Author

- **Jose Ortiz**
