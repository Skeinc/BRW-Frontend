FROM node:24-alpine AS deps
WORKDIR /app
ENV HUSKY=0
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund --fetch-retries=5 --fetch-retry-mintimeout=2000 --fetch-retry-maxtimeout=60000

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json vite.config.ts components.json ./
COPY public ./public
COPY src ./src
RUN npm run build

FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080
COPY --from=build /app/.output ./.output
USER node
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
