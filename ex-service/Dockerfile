#!/bin/bash
FROM node:12.4-alpine

# Create app directory

RUN mkdir /app
WORKDIR /app
RUN chmod -R +x /app

# install aws-cdk & AWS-CLI
RUN npm install aws-cdk && \
    apk update && \
    apk upgrade && \
    apk add curl && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && ./aws/install && \
    apk add git

COPY . .

# switch into the file we clone(pretend now)
RUN cd gitRepo

# RUN npm install
COPY package.json package.json
RUN npm install && mv node_modules /node_modules


# Bundle app source
# COPY . .
RUN cd ..
COPY package.json package.json
RUN npm install 


RUN chmod -R +x docker.sh

CMD ["./docker.sh"]

