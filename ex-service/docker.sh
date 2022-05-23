#!/bin/bash
# git clone https://github.com/ahnochen/project.git

cd project

# RUN npm install
npm install && mv node_modules /node_modules

cdk deploy 
