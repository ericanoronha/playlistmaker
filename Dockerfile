# Etapa de build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar arquivos de dependências da raiz e workspaces
COPY package*.json ./
COPY apps/frontend/package*.json apps/frontend/
COPY apps/backend/package*.json apps/backend/

# Copiar o restante do código
COPY apps/frontend apps/frontend
COPY apps/backend apps/backend

# Instalar dependências e buildar o frontend
WORKDIR /app/apps/frontend
RUN npm install && npm run build

# Instalar dependências de produção do backend
WORKDIR /app/apps/backend
RUN npm install --omit=dev

# Etapa final
FROM node:20-alpine

WORKDIR /app

# Copiar backend completo
COPY --from=builder /app/apps/backend ./

# Copiar frontend já buildado para a pasta pública do backend
COPY --from=builder /app/apps/frontend/dist ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]
