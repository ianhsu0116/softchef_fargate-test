#!/bin/bash
# cd /root
# mkdir .aws
# mv /app/config ~/.aws
# mv /app/credentials ~/.aws


# git clone https://github.com/ahnochen/project.git 
# cd project

# ===== needed ENV arguments ===== 
# GIT_REPO_URL
# REPO_FILE_NAME
# BRANCH

git clone $GIT_REPO_URL
cd $REPO_FILE_NAME

# ===== switch to branch if needed ===== 
git checkout $BRANCH 

# ===== RUN npm install ===== 
npm install


# ===== deploy the aws resourses ===== 
cdk deploy --all --require-approval never









