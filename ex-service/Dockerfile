#!/bin/bash
FROM node:16

USER root

RUN mkdir /app
WORKDIR /app
RUN chmod -R +x /app

RUN apt update && \
    apt install git && \
    npm install -g aws-cdk


# Bundle app source
COPY . .


CMD ["./docker.sh"]
