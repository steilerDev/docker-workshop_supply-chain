# Dockerfile
FROM node:20-alpine

WORKDIR /app

ADD package-lock.json package.json ./
RUN npm ci --only=production

ADD src/server.js ./
EXPOSE 3000
CMD ["node", "server.js"]