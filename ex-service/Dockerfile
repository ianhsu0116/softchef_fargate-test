#!/bin/bash
FROM node:12.4-alpine


# Create app directory

RUN mkdir /app
WORKDIR /app
RUN chmod -R +x /app

RUN npm install aws-cdk

RUN apk update && \
    apk upgrade && \
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && ./aws/install && \
    apk add git

# RUN git clone https://github.com/ahnochen/project.git

# RUN cd project

# RUN npm install
# RUN npm install && mv node_modules /node_modules

# Bundle app source
COPY . .

# EXPOSE 80

EXPOSE 80

# Run application

CMD ["./docker.sh"]