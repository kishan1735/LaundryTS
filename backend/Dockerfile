FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

COPY .env ./

COPY src ./src

RUN npm install && npm install typescript -g

RUN tsc

CMD ["node", "./dist/app.js"]