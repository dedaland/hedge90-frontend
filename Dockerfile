FROM node:18.20.3-buster-slim as builder

RUN apt-get update && apt-get install -y python3 make g++ && \
    ln -s /usr/bin/python3 /usr/bin/python && \
    npm install -g node-gyp && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .


RUN yarn build

RUN yarn global add serve

CMD serve -s build -l tcp://0.0.0.0:3001;

