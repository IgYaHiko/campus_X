# CampusX Backend 🚀

The TypeScript backend for **CampusX**, a campus problem-reporting and resolution platform designed to help students report campus issues and track their resolution.

This repository contains the server-side application, REST API, request validation, middleware, and backend logic for CampusX.

## ✨ Features

- **REST API:** Backend endpoints built with Express.js.
- **TypeScript:** Type-safe development for maintainable backend code.
- **Health Check:** Endpoint to verify server availability.
- **Middleware:** CORS configuration and JSON and URL-encoded request parsing.
- **Environment Configuration:** Manage server configuration using environment variables.
- **Request Validation:** Zod for validating incoming API data.
- **Campus Issue Management:** Backend functionality for reporting and tracking campus problems as the project develops.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| TypeScript | Type-safe backend development |
| Express.js | HTTP server and REST API |
| Zod | Runtime schema validation |
| CORS | Cross-origin request handling |
| dotenv | Environment variable management |
| ts-node-dev | Development server with automatic restarts |

## 📁 Project Structure

```text
campus-x-server/
├── src/
│   ├── app.ts          # Express app configuration
│   └── index.ts        # Server entry point
├── .env                # Environment variables (not committed)
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

*The structure may evolve as additional routes, controllers, services, schemas, and database modules are introduced.*

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- Git

### 1. Clone the repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd campus-x-server
```

Replace `<YOUR_REPOSITORY_URL>` with the actual Git repository URL.

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=5000
```

Add any additional environment variables required by your application as the project develops.

**Security:** Never commit `.env` files containing secrets, credentials, or API keys.

### 4. Start the development server

```bash
npm run dev
```

The server should start at:

```text
http://localhost:5000
```

## 🩺 API Endpoints

### Health Check

Check whether the backend server is running.

**Endpoint:** `GET /health`

**URL:**

```text
http://localhost:5000/health
```

**Success Response:** `200 OK`

```json
{
  "status": "ok",
  "message": "CampusX API is running",
  "timestamp": "2026-10-12T00:00:00.000Z"
}
```

The timestamp is generated dynamically when the endpoint is called.

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the project, if configured |
| `npm start` | Starts the production server, if configured |

Check `package.json` for the scripts currently available in this repository.

## 🔐 Environment Variables

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port on which the server listens | `5000` |

Keep sensitive configuration in environment variables rather than hardcoding it in source files.

## 🧩 Development Guidelines

- Use TypeScript for backend source files.
- Keep routes, controllers, services, and validation schemas organized as the application grows.
- Validate incoming request data using Zod.
- Use appropriate HTTP status codes and consistent JSON responses.
- Keep secrets and local configuration out of version control.
- Handle errors centrally as the API expands.
- Write clear, reusable, and maintainable code.

## 🗺️ Roadmap

- [ ] Establish the Express and TypeScript backend.
- [ ] Add request validation with Zod.
- [ ] Implement student authentication and authorization.
- [ ] Integrate a database.
- [ ] Develop campus problem-reporting endpoints.
- [ ] Add report status tracking and resolution workflows.
- [ ] Introduce centralized error handling.
- [ ] Add automated API tests.
- [ ] Prepare production deployment.

## 🤝 Contributing

1. Create a feature branch.
2. Implement your changes.
3. Test the affected endpoints.
4. Commit your changes with a descriptive message.
5. Open a pull request for review.

## 📄 License

A license has not yet been specified. Add a `LICENSE` file when the project's licensing terms have been decided.

---

**CampusX Backend** · Built with TypeScript and Express.js.
