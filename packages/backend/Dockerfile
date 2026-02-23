# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.14.2 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/backend/package.json packages/backend/

RUN pnpm install --frozen-lockfile
COPY packages/shared packages/shared/
COPY packages/backend packages/backend/

RUN pnpm build:shared && pnpm build:backend

# Production stage
FROM node:20-alpine
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.14.2 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/shared/package.json packages/shared/
COPY packages/backend/package.json packages/backend/

RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/packages/shared/dist packages/shared/dist/
COPY --from=builder /app/packages/backend/dist packages/backend/dist/

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "packages/backend/dist/main.js"]
