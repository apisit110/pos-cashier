# syntax=docker/dockerfile:1
# build from repo root (token is needed for @apisit110/pos-ui on GitHub Packages, passed as a secret — never baked into a layer):
#   docker build -f apps/cashier-app/Dockerfile -t pos-cashier-web \
#     --secret id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN \
#     --build-arg NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1 \
#     --build-arg NEXT_PUBLIC_APP_MODE=online .

ARG NODE_VERSION=22.22.2
ARG ALPINE_VERSION=3.22
ARG APP=pos-cashier-web

# ---------- stage 1: prune monorepo to only what this app needs ----------
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS pruner
ARG APP
WORKDIR /repo
RUN npm install -g turbo@2.9.6
COPY . .
RUN turbo prune ${APP} --docker

# ---------- stage 2: install + next build (standalone output) ----------
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
ARG APP
RUN apk add --no-cache libc6-compat \
 && corepack enable
WORKDIR /repo

COPY --from=pruner /repo/out/json/ .
COPY --from=pruner /repo/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY .npmrc ./
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    --mount=type=secret,id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN \
    pnpm install --frozen-lockfile

COPY --from=pruner /repo/out/full/ .

# NEXT_PUBLIC_* are inlined into the client bundle at build time
ARG NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1
ARG NEXT_PUBLIC_APP_MODE=online
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL} \
    NEXT_PUBLIC_APP_MODE=${NEXT_PUBLIC_APP_MODE} \
    NEXT_TELEMETRY_DISABLED=1
RUN pnpm turbo build --filter=${APP}

# ---------- stage 3: runtime — bare alpine + node binary only (no npm/yarn/corepack) ----------
FROM alpine:${ALPINE_VERSION} AS runner
RUN apk add --no-cache libstdc++ tini \
 && addgroup -S -g 1000 node \
 && adduser -S -u 1000 -G node node
COPY --from=builder /usr/local/bin/node /usr/local/bin/node

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3008 \
    HOSTNAME=0.0.0.0

WORKDIR /app
# standalone keeps the monorepo layout: server.js lives at apps/cashier-app/
COPY --from=builder --chown=node:node /repo/apps/cashier-app/.next/standalone ./
COPY --from=builder --chown=node:node /repo/apps/cashier-app/.next/static ./apps/cashier-app/.next/static
COPY --from=builder --chown=node:node /repo/apps/cashier-app/public ./apps/cashier-app/public

USER node
EXPOSE 3008
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "apps/cashier-app/server.js"]
