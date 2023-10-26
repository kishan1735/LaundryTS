FROM node:18

WORKDIR /app

COPY package*.json ./

COPY tsconfig.json ./

COPY redis.conf ./

COPY src ./src

COPY .env ./

RUN npm install && npm install typescript -g

RUN tsc

CMD ["node","dist/app.js"]