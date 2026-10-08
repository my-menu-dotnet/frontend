# Development Stage
FROM node:22-alpine AS development

WORKDIR /app

ENV BUILD_TARGET=node

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Builder Stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build:node

# Production Stage

FROM node:22-alpine AS production

WORKDIR /app

# Copy the built artifacts from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only production dependencies
RUN npm ci --legacy-peer-deps --omit=dev

# Set the environment variables (if needed)
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npx", "srvx", "--prod", "--static", "/app/dist/client", "/app/dist/server/server.js"]
