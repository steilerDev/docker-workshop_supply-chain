# Dockerfile
FROM docker/dhi-node:20-alpine3.22-dev AS build-stage

WORKDIR /app

ADD package-lock.json package.json ./
RUN npm ci --only=production

FROM docker/dhi-node:20-alpine3.22 AS runtime-stage

WORKDIR /app

ADD package-lock.json package.json ./
COPY --from=build-stage /app/node_modules ./
ADD src/server.js ./
EXPOSE 3000
CMD ["node", "server.js"]