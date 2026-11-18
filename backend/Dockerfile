# syntax=docker/dockerfile:1
FROM node:26.13.1-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start"]
