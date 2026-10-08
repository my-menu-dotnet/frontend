# Development Stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

# Builder Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# Production Stage

FROM node:20-alpine AS production

WORKDIR /app

# Copy the built artifacts from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install only production dependencies
# `tailwindcss` is a devDep in package.json (build-time only), but @heroui/theme
# imports it at runtime for the Tailwind v4 theme system, so it must be present
# in node_modules at runtime.
RUN npm ci --legacy-peer-deps --omit=dev
RUN npm install --legacy-peer-deps tailwindcss@^3.4.17 --no-save

# Set the environment variables (if needed)
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npx", "srvx", "--prod", "--static", "/app/dist/client", "/app/dist/server/server.js"]
