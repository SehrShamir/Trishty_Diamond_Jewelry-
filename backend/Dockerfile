# ── Stage 1: Build ────────────────────────────────────────────────
# Full deps needed to compile TypeScript and build the admin UI
FROM node:20-alpine AS builder

WORKDIR /app
RUN corepack enable

# Install deps (cache layer)
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm install

# Copy source and build
COPY . .
RUN npx medusa build

# ── Stage 2: Production ───────────────────────────────────────────
# Only keep what's needed to RUN the server
FROM node:20-alpine AS production

WORKDIR /app
RUN corepack enable

# Install ONLY production dependencies (drops dev deps: TypeScript, vite, jest etc.)
COPY package.json pnpm-lock.yaml* .npmrc* ./
RUN pnpm install --prod

# Copy the compiled server output from build stage
COPY --from=builder /app/.medusa /app/.medusa

# Copy seed script (needed for auto-seed on first run)
COPY src/scripts/ /app/src/scripts/

# Copy medusa-config.ts (needed for db:migrate)
COPY medusa-config.ts /app/medusa-config.ts

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 9000
ENTRYPOINT ["/entrypoint.sh"]