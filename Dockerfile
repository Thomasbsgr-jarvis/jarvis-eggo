FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./

RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
  npm ci

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules

COPY . .

ARG NEXT_PUBLIC_LOGIN_ROUTE=/auth
ARG NEXT_PUBLIC_HOME_ROUTE=/
ENV NEXT_PUBLIC_LOGIN_ROUTE=$NEXT_PUBLIC_LOGIN_ROUTE
ENV NEXT_PUBLIC_HOME_ROUTE=$NEXT_PUBLIC_HOME_ROUTE

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup -S nextjs && adduser -S nextjs -G nextjs

COPY --from=builder /app/.next/standalone ./

COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder /app/public ./public

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
