# Backend : API (Express + PostgreSQL) + tableau de bord d'administration compilé.

# 1. Compilation du tableau de bord (admin/ → dist/)
FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# 2. Image finale : dépendances de production, serveur, contenu initial et admin compilé
FROM node:24-alpine
ENV NODE_ENV=production \
    PORT=4000
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server ./server
COPY content ./content
COPY --from=build /app/dist ./dist
RUN mkdir -p uploads && chown -R node:node /app
USER node
EXPOSE 4000
# Au démarrage : création des tables et du premier compte si besoin (sans rien écraser), puis lancement.
CMD ["sh", "-c", "node server/init.js && node server/index.js"]
