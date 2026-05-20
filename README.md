# Tea Time

Tea Time is a QR-based ordering system for cafes and tea shops. It is structured as a monorepo with a React client and an Express + Prisma backend.

## Overview

- `client/` contains the Vite + React frontend.
- `server/` contains the Node.js, TypeScript, Express, Prisma, and Socket.IO backend.
- The root workspace uses npm workspaces to run both apps together during local development.
- The backend exposes Swagger docs at `/api-docs` and the OpenAPI JSON at `/api-docs.json`.

## Tech Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand, React Router, Framer Motion
- Backend: Node.js, Express, TypeScript, Prisma ORM, Socket.IO
- Database: PostgreSQL via Prisma
- API Docs: Swagger UI
- Deployment: Vercel for the client, and a Node-capable host for the backend API if persistent sockets are required

## Project Structure

```text
.
├── client/
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   └── vercel.json
├── server/
│   ├── src/
│   ├── prisma/
│   ├── api/
│   └── package.json
├── package.json
└── README.md
```

## Features

- QR table-based ordering
- Category and product browsing
- Product detail and customization options
- Cart and order submission
- Order tracking
- Waiter call requests
- Admin/kitchen status updates through real-time events
- Swagger API documentation for backend endpoints

## Prerequisites

- Node.js 18+ recommended
- npm 9+
- PostgreSQL database

## Environment Variables

### Server

Create a `.env` file inside `server/` with at least:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DIRECT_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
FRONTEND_URL=https://teja-teatime-new-client.vercel.app
NODE_ENV=development
PORT=5001
```

### Client

If the client needs a custom backend URL, add a Vite environment variable in `client/.env`:

```env
VITE_API_BASE_URL=https://your-backend-domain.example.com
```

## Local Development

Install dependencies from the repository root:

```bash
npm install
```

Run both apps together:

```bash
npm run dev
```

Run them separately if needed:

```bash
npm run dev:client
npm run dev:server
```

## Build

Build the client:

```bash
npm run build:client
```

Build the server:

```bash
npm run build:server
```

The server build runs Prisma generation first:

```bash
cd server
npm run build
```

## Database Commands

From the `server/` folder:

```bash
npm run db:generate
npm run db:migrate
npm run db:push
npm run db:seed
npm run db:studio
```

## API Documentation

When the backend is running, open:

- Swagger UI: `/api-docs`
- OpenAPI JSON: `/api-docs.json`
- Health check: `/health`

Example local URL:

```text
http://localhost:5001/api-docs
```

## Deployment Notes

### Client on Vercel

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`

### Server deployment

The backend currently uses Express and Socket.IO. That means:

- It works best on a host that supports a long-running Node process.
- If you deploy the REST API on Vercel, the app must be handled as a serverless function.
- Socket.IO is not a great fit for Vercel serverless functions.

Recommended runtime settings for a Node host:

- Root directory: `server`
- Build command: `npm run build`
- Start command: `npm run start`

## Important Implementation Notes

- `prisma` and `@prisma/client` are pinned to the same version in `server/package.json`.
- The server build script is `prisma generate && tsc` to keep generated Prisma types in sync.
- CORS allows the deployed client domain at `https://teja-teatime-new-client.vercel.app`.

## Swagger and API Entrypoint

The backend exposes a reusable Express app and a Vercel handler wrapper. This keeps the app runnable locally while also supporting deployment environments that expect a request handler.

## License

No license has been defined yet.
