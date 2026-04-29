# 1. Base stage
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# 2. Builder stage
FROM base AS builder
# Install build tools for native modules like bcrypt
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy configuration files
COPY package.json pnpm-lock.yaml .npmrc ./

# Install all dependencies
# Explicitly allow scripts to ensure bcrypt and prisma engines are built correctly in pnpm 10
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --config.allow-scripts=true

# Copy source and prisma schema
COPY . .

# Generate Prisma client
# Use a dummy DB_URL since 'prisma generate' requires it for the config but doesn't need a live connection
RUN DB_URL="postgresql://user:pass@db:5432/db" pnpm prisma generate

# Build TypeScript
RUN pnpm run build

# Remove development dependencies
RUN pnpm prune --prod --config.allow-scripts=true

# 3. Runtime stage: Final slim image
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy only the necessary parts from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/package.json ./

EXPOSE 8000
USER node

CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/index.js"]