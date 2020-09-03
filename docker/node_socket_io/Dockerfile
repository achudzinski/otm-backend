FROM node:12.16.1-alpine

WORKDIR /usr/app

COPY ./socket_io_server/package.json ./package.json

RUN apk update \
    && apk add net-tools \
    && apk add bash \
    # To handle 'not get uid/gid'
    && npm config set unsafe-perm true \
    && npm i -g @nestjs/cli \
    && npm install --quiet \
    && npm install node-dev -gs