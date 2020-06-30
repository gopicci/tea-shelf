FROM node:14.4.0-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install --production

COPY . .