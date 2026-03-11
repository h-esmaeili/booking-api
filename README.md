# booking-api

A lightweight SaaS backend for managing service businesses, appointments, and real-time bookings. Built with Node.js, TypeScript, and Prisma.

## Tech stack

- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express 5
- **Database:** PostgreSQL with [Prisma](https://www.prisma.io/) (driver adapter `@prisma/adapter-pg`)
- **Validation:** Zod
- **Auth:** JWT, bcrypt

## Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or pnpm

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/h-esmaeili/booking-api.git
cd booking-api
npm install
```

### 2. Environment

Copy the example env file and set your values:

```bash
cp .env.example .env
```

Edit `.env` and set at least:

- **DATABASE_URL** – PostgreSQL connection string (e.g. `postgresql://user:password@localhost:5432/booking_db`)
- **JWT_SECRET** – A strong secret for signing JWTs (use a long random string in production)

Optional: `NODE_ENV`, `PORT`, `JWT_EXPIRES_IN` (defaults: `development`, `8080`, `7d`).

### 3. Database

Generate the Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Run

**Development** (watch mode):

```bash
npm run dev
```

**Production** (build then run):

```bash
npm run build
npm start
```

The API listens on the port from `PORT` (default `8080`).

## Scripts

| Script              | Description                    |
|---------------------|--------------------------------|
| `npm run dev`       | Start dev server with nodemon  |
| `npm run build`     | Compile TypeScript to `dist/`  |
| `npm start`        | Run production server          |
| `npm test`         | Run unit tests                 |
| `npm run test:watch` | Run tests in watch mode      |
| `npm run test:coverage` | Run tests with coverage   |
| `npm run prisma:generate` | Generate Prisma client   |
| `npm run prisma:migrate` | Run DB migrations        |

## API

Base path: **`/api`**

### Auth (`/api/auth`)

#### POST `/api/auth/register`

Create a new user.

**Request body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Validation:** `name` required; `email` valid email; `password` 6–128 characters. Email is trimmed and lowercased.

**Success (201):**

```json
{
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "createdAt": "2025-03-07T..."
  }
}
```

**Errors:** `409` if email already exists; `400` if validation fails.

---

#### POST `/api/auth/login`

Authenticate and get a JWT.

**Request body:**

```json
{
  "email": "jane@example.com",
  "password": "securePassword123"
}
```

**Success (200):**

```json
{
  "user": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "isActive": true
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Use the `token` in the `Authorization` header for protected routes (e.g. `Bearer <token>`).

**Errors:** `401` for invalid credentials or disabled account; `400` if validation fails.

## Project structure

```
src/
├── config/
│   └── env.ts           # Env validation (Zod)
├── lib/
│   ├── errors.ts        # Custom errors (e.g. InvalidCredentials, UserExists)
│   └── prisma.ts        # Prisma client (PG adapter)
├── middlewares/
│   ├── errorHandler.ts  # Global error handler
│   └── validate.ts      # Zod body validation middleware
├── modules/
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.repository.ts
│       ├── auth.routes.ts
│       ├── auth.schema.ts
│       └── auth.service.ts
├── prisma/
│   └── schema.prisma
├── app.ts
└── server.ts
```

Prisma client is generated into **`generated/prisma`** at the project root.

## Testing

```bash
npm test
```

Tests use Jest and mocks for the database and external deps. Auth service and repository are covered by unit tests.

## License

ISC
