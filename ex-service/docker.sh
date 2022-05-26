cd /root
mkdir .aws
mv /app/config ~/.aws
mv /app/credentials ~/.aws

git clone https://github.com/ahnochen/project.git

cd project

# RUN npm install
npm install

cdk deploy --all -f







