#!/bin/bash
FROM bitnami/node:16

USER root

WORKDIR /app
RUN chmod -R +x /app
# COPY app.js /app

RUN apt update && \
    apt install git && \
    npm install -g aws-cdk esbuild && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip"  && \
    unzip ./awscliv2.zip  && \
    ./aws/install

# https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip
# https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip
# Bundle app source
COPY . .


# EXPOSE 80

CMD ["sh","docker.sh"]
# cd /app
# node app.js
