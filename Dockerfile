FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY src ./src
COPY test ./test

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
