# Dockerfile
FROM docker/dhi-node:20-alpine3.22-dev

WORKDIR /app

ADD package-lock.json package.json ./
RUN npm ci --only=production

ADD src/server.js ./
EXPOSE 3000
CMD ["node", "server.js"]