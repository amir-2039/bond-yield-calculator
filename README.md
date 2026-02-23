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

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm format:check` | Check formatting |
| `pnpm test` | Run tests (unit + e2e) |
| `pnpm ci` | Lint, format check, build shared, test, build (for CI) |

## Environment Variables

| Variable | Where | Description |
|----------|-------|-------------|
| `VITE_API_URL` | Frontend (build) | API base URL (default: same origin) |
| `PORT` | Backend | Server port (default: 3000) |
| `CORS_ORIGIN` | Backend | Allowed origin for CORS (default: `*`) |
| `NODE_ENV` | Backend | `development` or `production` |

## Project Structure

- `packages/shared` — DTOs, enums, validation (used by frontend and backend)
- `packages/backend` — NestJS API
- `packages/frontend` — React + Vite app

## Deployment

### Backend (ECS Fargate)

```bash
docker build -f packages/backend/Dockerfile -t bond-yield-api .
# Push to ECR, deploy to ECS
```

### Frontend (S3 + CloudFront)

```bash
VITE_API_URL=https://api.yourdomain.com pnpm build:frontend
aws s3 sync packages/frontend/dist s3://your-bucket --delete
```
