# Bond Yield Calculator

React + NestJS + TypeScript monorepo for bond yield calculations.

## Setup

```bash
pnpm install
```

## Build

Build shared package first (backend and frontend depend on it):

```bash
pnpm build:shared
pnpm build
```

## Run

```bash
# Backend (port 3000)
pnpm dev:backend

# Frontend (port 5173)
pnpm dev:frontend
```

## Project Structure

- `packages/shared` — DTOs, enums, validation (used by frontend and backend)
- `packages/backend` — NestJS API
- `packages/frontend` — React + Vite app
