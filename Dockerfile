FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./
COPY apps/frontend/package*.json apps/frontend/

COPY apps/frontend apps/frontend

WORKDIR /app/apps/frontend
RUN npm install && npm run build

FROM node:20-alpine AS backend-builder

WORKDIR /app

COPY package*.json ./
COPY apps/backend/package*.json apps/backend/
COPY apps/backend apps/backend

WORKDIR /app/apps/backend
RUN npm install --omit=dev

FROM node:20-alpine

WORKDIR /app

COPY --from=backend-builder /app/apps/backend ./

COPY --from=frontend-builder /app/apps/frontend/dist ./public

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
