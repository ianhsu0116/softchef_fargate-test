#!/bin/bash
FROM node:16

# Create app directory
RUN mkdir /app
WORKDIR /app
RUN chmod -R +x /app

# install aws-cdk & AWS-CLI
# RUN apt-get update && \
#     apt-get upgrade && \
#     apt-get install git && \
#     curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && \
#     unzip awscliv2.zip && \
#     ./aws/install

COPY . .

RUN npm install 
RUN chmod -R +x docker.sh

CMD ["sh","docker.sh"]

