# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["node", "--max-old-space-size=2048", "./node_modules/vite/bin/vite.js", "dev"]

