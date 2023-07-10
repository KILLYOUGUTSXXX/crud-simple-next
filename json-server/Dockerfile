FROM node:18.3.0-alpine3.16

WORKDIR /usr/src/sio-crud/server

USER root

COPY ./ .

RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 180000

WORKDIR /usr/src/sio-crud/server/api

RUN npm install

CMD ["node", "server.js"]