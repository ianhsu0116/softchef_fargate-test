#!/bin/bash
FROM node:16

USER root

RUN mkdir /app
WORKDIR /app
RUN chmod -R +x /app

RUN apt update && \
    apt install git && \
    npm install -g aws-cdk && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"  && \
    unzip ./awscliv2.zip  && \
    ./aws/install


# Bundle app source
COPY . .


CMD ["./docker.sh"]
