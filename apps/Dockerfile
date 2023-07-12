FROM node:18.3.0-alpine3.16

WORKDIR /usr/src/sio-crud/app

USER root

COPY ./ .

RUN chmod 770 ./commands.sh

RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 180000

RUN npm install

CMD ./commands.sh