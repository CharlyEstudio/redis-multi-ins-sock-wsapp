FROM node:13
WORKDIR /usr/app
COPY package.json /usr/app/package.json
COPY package-lock.json /usr/app/package-lock.json
RUN npm ci
COPY . /usr/app
RUN npm run build
