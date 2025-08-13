# Etapa 1 — Build
FROM node:20-alpine AS builder

# Define o diretório de trabalho
WORKDIR /app

# Copia apenas os arquivos essenciais para instalar as dependências
COPY package*.json ./

# Instala as dependências (evita instalar devDependencies depois)
RUN npm ci

# Copia o restante do código do projeto
COPY . .

# Build do Next.js
RUN npm run build

# Etapa 2 — Runtime
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Instala apenas as dependências necessárias para produção
COPY package*.json ./
RUN npm ci --omit=dev

# Copia os arquivos gerados pelo build e código necessário
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/package*.json ./

# Porta padrão do Next.js
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
