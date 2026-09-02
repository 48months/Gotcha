FROM node:19-alpine

WORKDIR /home/node/backend

RUN mkdir -p /apps/logs/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]