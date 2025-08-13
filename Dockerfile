# Etapa 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./

# Ignora conflitos de peer deps
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Etapa 2 — Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package*.json ./

EXPOSE 3000
CMD ["npm", "start"]
