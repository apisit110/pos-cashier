# syntax=docker/dockerfile:1
# build from repo root: docker build -f apps/cashier-api-gateway/Dockerfile -t pos-cashier-api-gateway .

ARG NODE_VERSION=22.22.2
ARG ALPINE_VERSION=3.22
ARG APP=pos-cashier-api-gateway

# ---------- stage 1: prune monorepo to only what this app needs ----------
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS pruner
ARG APP
WORKDIR /repo
RUN npm install -g turbo@2.9.6
COPY . .
RUN turbo prune ${APP} --docker

# ---------- stage 2: install, build, extract production deps ----------
FROM node:${NODE_VERSION}-alpine${ALPINE_VERSION} AS builder
ARG APP
RUN corepack enable
WORKDIR /repo

COPY --from=pruner /repo/out/json/ .
COPY --from=pruner /repo/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

COPY --from=pruner /repo/out/full/ .
RUN pnpm turbo build --filter=${APP}

# self-contained copy of the app with prod-only node_modules (workspace packages included with their dist)
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store \
    pnpm --filter=${APP} deploy --prod --legacy /prod

# ---------- stage 3: runtime — bare alpine + node binary only (no npm/yarn/corepack) ----------
FROM alpine:${ALPINE_VERSION} AS runner
RUN apk add --no-cache libstdc++ tini \
 && addgroup -S -g 1000 node \
 && adduser -S -u 1000 -G node node
COPY --from=builder /usr/local/bin/node /usr/local/bin/node

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app
COPY --from=builder --chown=node:node /prod/package.json ./
COPY --from=builder --chown=node:node /prod/node_modules ./node_modules
COPY --from=builder --chown=node:node /prod/dist ./dist

USER node
EXPOSE 3000
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/main.js"]
